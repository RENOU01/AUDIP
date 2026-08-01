-- Ejecutar SOLO si te aparece el error "policy ... already exists".
-- Borra las políticas para poder volver a correr schema.sql desde cero.
drop policy if exists "Lectura pública de agrupaciones" on agrupaciones;
drop policy if exists "Admins escriben agrupaciones" on agrupaciones;
drop policy if exists "Admins actualizan agrupaciones" on agrupaciones;
drop policy if exists "Admins eliminan agrupaciones" on agrupaciones;

drop policy if exists "Lectura pública de investigadores" on investigadores;
drop policy if exists "Admins escriben investigadores" on investigadores;
drop policy if exists "Admins actualizan investigadores" on investigadores;
drop policy if exists "Admins eliminan investigadores" on investigadores;

drop policy if exists "Lectura pública de autoridades" on autoridades;
drop policy if exists "Admins escriben autoridades" on autoridades;
drop policy if exists "Admins actualizan autoridades" on autoridades;
drop policy if exists "Admins eliminan autoridades" on autoridades;

drop policy if exists "Cualquiera puede enviar el formulario de contacto" on contactos;
drop policy if exists "Solo admins leen los mensajes" on contactos;
drop policy if exists "Solo admins eliminan mensajes" on contactos;

drop policy if exists "Lectura pública de audip-media" on storage.objects;
drop policy if exists "Admins suben archivos a audip-media" on storage.objects;
drop policy if exists "Admins actualizan archivos de audip-media" on storage.objects;
drop policy if exists "Admins eliminan archivos de audip-media" on storage.objects;
