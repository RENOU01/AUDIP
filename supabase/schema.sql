-- =====================================================================
-- AUDIP — Esquema de base de datos para Supabase
-- =====================================================================
-- Cómo usar este archivo:
-- 1. Entrá a tu proyecto en https://app.supabase.com
-- 2. Andá a "SQL Editor" → "New query"
-- 3. Pegá TODO este archivo y hacé clic en "Run"
-- Ver README.md para el resto de los pasos (Auth, Storage, EmailJS, etc).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Tabla: agrupaciones (los "grupos" de investigación)
-- ---------------------------------------------------------------------
create table if not exists agrupaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  area text not null check (area in ('paranormal', 'ufologia', 'holistica')),
  fecha_fundacion date,
  cantidad_integrantes integer,
  departamento text not null,
  telefono text,
  email text,
  investigador_a_cargo text,
  logo_url text,
  imagen_institucional_url text,
  latitud double precision,
  longitud double precision,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: investigadores (integrantes de cada agrupación)
-- ---------------------------------------------------------------------
create table if not exists investigadores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  grupo_id uuid references agrupaciones(id) on delete set null,
  foto_url text,
  email text,
  telefono text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: autoridades (directivos de AUDIP)
-- ---------------------------------------------------------------------
create table if not exists autoridades (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  cargo text not null,
  foto_url text,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  unique (nombre, cargo)
);

-- ---------------------------------------------------------------------
-- Tabla: contactos (envíos del formulario de contacto del sitio)
-- ---------------------------------------------------------------------
create table if not exists contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  email text not null,
  departamento text not null,
  mensaje text,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- SEGURIDAD: Row Level Security (RLS)
-- =====================================================================
-- Con RLS activado, por defecto NADIE puede leer ni escribir nada salvo
-- que exista una política explícita que lo permita. Esto es lo que
-- protege la base de datos aunque la "anon key" sea pública.

alter table agrupaciones enable row level security;
alter table investigadores enable row level security;
alter table autoridades enable row level security;
alter table contactos enable row level security;

-- Lectura pública (el sitio institucional es público)
drop policy if exists "Lectura pública de agrupaciones" on agrupaciones;
create policy "Lectura pública de agrupaciones" on agrupaciones
  for select using (true);

drop policy if exists "Lectura pública de investigadores" on investigadores;
create policy "Lectura pública de investigadores" on investigadores
  for select using (true);

drop policy if exists "Lectura pública de autoridades" on autoridades;
create policy "Lectura pública de autoridades" on autoridades
  for select using (true);

-- Escritura solo para administradores autenticados (Supabase Auth)
drop policy if exists "Admins escriben agrupaciones" on agrupaciones;
create policy "Admins escriben agrupaciones" on agrupaciones
  for insert to authenticated with check (true);
drop policy if exists "Admins actualizan agrupaciones" on agrupaciones;
create policy "Admins actualizan agrupaciones" on agrupaciones
  for update to authenticated using (true) with check (true);
drop policy if exists "Admins eliminan agrupaciones" on agrupaciones;
create policy "Admins eliminan agrupaciones" on agrupaciones
  for delete to authenticated using (true);

drop policy if exists "Admins escriben investigadores" on investigadores;
create policy "Admins escriben investigadores" on investigadores
  for insert to authenticated with check (true);
drop policy if exists "Admins actualizan investigadores" on investigadores;
create policy "Admins actualizan investigadores" on investigadores
  for update to authenticated using (true) with check (true);
drop policy if exists "Admins eliminan investigadores" on investigadores;
create policy "Admins eliminan investigadores" on investigadores
  for delete to authenticated using (true);

drop policy if exists "Admins escriben autoridades" on autoridades;
create policy "Admins escriben autoridades" on autoridades
  for insert to authenticated with check (true);
drop policy if exists "Admins actualizan autoridades" on autoridades;
create policy "Admins actualizan autoridades" on autoridades
  for update to authenticated using (true) with check (true);
drop policy if exists "Admins eliminan autoridades" on autoridades;
create policy "Admins eliminan autoridades" on autoridades
  for delete to authenticated using (true);

-- Contactos: cualquier visitante puede ENVIAR el formulario (insert),
-- pero solo un administrador autenticado puede LEER o BORRAR los mensajes.
-- Esto evita que cualquiera con la anon key pueda leer los datos personales
-- de quienes escriben a AUDIP.
drop policy if exists "Cualquiera puede enviar el formulario de contacto" on contactos;
create policy "Cualquiera puede enviar el formulario de contacto" on contactos
  for insert to anon, authenticated with check (true);
drop policy if exists "Solo admins leen los mensajes" on contactos;
create policy "Solo admins leen los mensajes" on contactos
  for select to authenticated using (true);
drop policy if exists "Solo admins eliminan mensajes" on contactos;
create policy "Solo admins eliminan mensajes" on contactos
  for delete to authenticated using (true);

-- =====================================================================
-- STORAGE: bucket para logos, fotos e imágenes institucionales
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('audip-media', 'audip-media', true)
on conflict (id) do nothing;

drop policy if exists "Lectura pública de audip-media" on storage.objects;
create policy "Lectura pública de audip-media" on storage.objects
  for select using (bucket_id = 'audip-media');

drop policy if exists "Admins suben archivos a audip-media" on storage.objects;
create policy "Admins suben archivos a audip-media" on storage.objects
  for insert to authenticated with check (bucket_id = 'audip-media');

drop policy if exists "Admins actualizan archivos de audip-media" on storage.objects;
create policy "Admins actualizan archivos de audip-media" on storage.objects
  for update to authenticated using (bucket_id = 'audip-media');

drop policy if exists "Admins eliminan archivos de audip-media" on storage.objects;
create policy "Admins eliminan archivos de audip-media" on storage.objects
  for delete to authenticated using (bucket_id = 'audip-media');

-- =====================================================================
-- Datos iniciales de ejemplo (podés editarlos o borrarlos desde el panel)
-- =====================================================================
insert into agrupaciones (nombre, area, departamento) values
  ('Acrux Paranormal Research', 'paranormal', 'Montevideo'),
  ('GIPCA', 'paranormal', 'Canelones'),
  ('Atum Osiris Paranormal', 'paranormal', 'Rocha'),
  ('IPEM', 'paranormal', 'Montevideo'),
  ('Vigilantes del Contacto', 'ufologia', 'Maldonado'),
  ('Mundo de Runas', 'holistica', 'Montevideo')
on conflict (nombre) do nothing;

-- Calcula automáticamente latitud/longitud de los grupos de ejemplo
-- según el departamento (coincide con src/lib/departamentos.js)
update agrupaciones set latitud = -34.85, longitud = -56.15 where departamento = 'Montevideo' and latitud is null;
update agrupaciones set latitud = -34.538, longitud = -56.277 where departamento = 'Canelones' and latitud is null;
update agrupaciones set latitud = -34.1, longitud = -54.1 where departamento = 'Rocha' and latitud is null;
update agrupaciones set latitud = -34.6, longitud = -54.8 where departamento = 'Maldonado' and latitud is null;

-- Nómina de autoridades de AUDIP
insert into autoridades (nombre, cargo, orden) values
  ('Gustavo Farias', 'Presidente', 1),
  ('Richard Karlen', 'Presidente (Suplente)', 2),
  ('Daniel Nicoletti', 'Vicepresidente', 3),
  ('Martin Techera', 'Vicepresidente (Suplente)', 4),
  ('Fernando Ortiz', 'Secretario', 5),
  ('Patricia Fernandez', 'Secretario (Suplente)', 6),
  ('Bruno Rodriguez', 'Tesorero', 7),
  ('Rossana Fontenla', 'Tesorero (Suplente)', 8),
  ('Sebastian Gervas', 'Fiscal', 9),
  ('Alberto Fernandez', 'Fiscal (Suplente)', 10),
  ('Karina Pais', 'Fiscal', 11),
  ('Ana Bodeant', 'Fiscal (Suplente)', 12),
  ('Karina Cabrera', 'Fiscal', 13),
  ('Pablo Anchustegui', 'Fiscal (Suplente)', 14)
on conflict (nombre, cargo) do nothing;
