-- =====================================================================
-- Limpieza de duplicados en AUDIP
-- =====================================================================
-- Ejecutar UNA VEZ en el SQL Editor de Supabase para borrar los grupos
-- y autoridades que quedaron repetidos por haber corrido schema.sql
-- más de una vez. Deja solo la copia más antigua de cada uno.

delete from agrupaciones a
using agrupaciones b
where a.nombre = b.nombre
  and a.created_at > b.created_at;

delete from autoridades a
using autoridades b
where a.nombre = b.nombre
  and a.cargo = b.cargo
  and a.created_at > b.created_at;

-- Evita que esto vuelva a pasar si el schema.sql se corre de nuevo:
alter table agrupaciones add constraint agrupaciones_nombre_key unique (nombre);
alter table autoridades add constraint autoridades_nombre_cargo_key unique (nombre, cargo);
