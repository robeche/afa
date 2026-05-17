-- Extensiones
create extension if not exists pgcrypto;

-- Tipos
create type public.rol_usuario as enum ('admin', 'editor', 'socio');

-- Tablas de contenido publico
create table if not exists public.noticias (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo_es text not null,
  titulo_eu text not null,
  resumen_es text,
  resumen_eu text,
  contenido_es text,
  contenido_eu text,
  imagen_url text,
  fecha_publicacion date default now()::date,
  publicada boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.actividades (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo_es text not null,
  titulo_eu text not null,
  descripcion_es text,
  descripcion_eu text,
  fecha_inicio date,
  fecha_fin date,
  ubicacion text,
  tipo text,
  publicada boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.consejos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo_es text not null,
  titulo_eu text not null,
  contenido_es text,
  contenido_eu text,
  imagen_url text,
  orden int default 0,
  publicado boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.documentos_comedor (
  id uuid primary key default gen_random_uuid(),
  mes text not null,
  anio int not null,
  pdf_es_url text,
  pdf_eu_url text,
  publicado boolean default false,
  created_at timestamptz default now()
);

-- Perfil de socios enlazado con auth.users
create table if not exists public.socios_perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  apellidos text,
  rol public.rol_usuario not null default 'socio',
  activo boolean not null default true,
  created_at timestamptz default now()
);

-- Tabla de contacto opcional para formularios sin backend propio
create table if not exists public.contacto_mensajes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  mensaje text not null,
  idioma text not null default 'es',
  created_at timestamptz default now()
);

-- Activar RLS
alter table public.noticias enable row level security;
alter table public.actividades enable row level security;
alter table public.consejos enable row level security;
alter table public.documentos_comedor enable row level security;
alter table public.socios_perfiles enable row level security;
alter table public.contacto_mensajes enable row level security;

-- Helpers de rol
create or replace function public.current_user_role()
returns public.rol_usuario
language sql
stable
as $$
  select coalesce((select rol from public.socios_perfiles where id = auth.uid()), 'socio'::public.rol_usuario);
$$;

-- Politicas de lectura publica para contenido publicado
create policy "noticias_publicadas_select"
on public.noticias
for select
using (publicada = true or auth.uid() is not null);

create policy "actividades_publicadas_select"
on public.actividades
for select
using (publicada = true or auth.uid() is not null);

create policy "consejos_publicados_select"
on public.consejos
for select
using (publicado = true or auth.uid() is not null);

create policy "comedor_publicado_select"
on public.documentos_comedor
for select
using (publicado = true or auth.uid() is not null);

-- Escritura restringida a admin/editor
create policy "noticias_admin_editor_write"
on public.noticias
for all
using (public.current_user_role() in ('admin', 'editor'))
with check (public.current_user_role() in ('admin', 'editor'));

create policy "actividades_admin_editor_write"
on public.actividades
for all
using (public.current_user_role() in ('admin', 'editor'))
with check (public.current_user_role() in ('admin', 'editor'));

create policy "consejos_admin_editor_write"
on public.consejos
for all
using (public.current_user_role() in ('admin', 'editor'))
with check (public.current_user_role() in ('admin', 'editor'));

create policy "comedor_admin_editor_write"
on public.documentos_comedor
for all
using (public.current_user_role() in ('admin', 'editor'))
with check (public.current_user_role() in ('admin', 'editor'));

-- Perfiles: cada socio puede leer su perfil; admin gestiona todos
create policy "perfil_select_own_or_admin"
on public.socios_perfiles
for select
using (id = auth.uid() or public.current_user_role() = 'admin');

create policy "perfil_update_own_or_admin"
on public.socios_perfiles
for update
using (id = auth.uid() or public.current_user_role() = 'admin')
with check (id = auth.uid() or public.current_user_role() = 'admin');

create policy "perfil_insert_admin"
on public.socios_perfiles
for insert
with check (public.current_user_role() = 'admin');

-- Contacto: insercion publica; lectura solo admin/editor
create policy "contacto_insert_public"
on public.contacto_mensajes
for insert
with check (true);

create policy "contacto_read_admin_editor"
on public.contacto_mensajes
for select
using (public.current_user_role() in ('admin', 'editor'));

-- Storage sugerido (ejecutar en SQL editor si no se usa CLI):
-- insert into storage.buckets (id, name, public) values ('noticias', 'noticias', true) on conflict (id) do nothing;
-- insert into storage.buckets (id, name, public) values ('actividades', 'actividades', true) on conflict (id) do nothing;
-- insert into storage.buckets (id, name, public) values ('consejos', 'consejos', true) on conflict (id) do nothing;
-- insert into storage.buckets (id, name, public) values ('comedor', 'comedor', false) on conflict (id) do nothing;
-- insert into storage.buckets (id, name, public) values ('documentos', 'documentos', false) on conflict (id) do nothing;
