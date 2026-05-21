-- =============================================================================
-- AFA REMONTIVAL — Esquema completo de Supabase / PostgreSQL
-- =============================================================================
-- Este archivo refleja el estado REAL de la base de datos a 21/05/2026,
-- verificado mediante consultas directas a pg_policies e information_schema.
-- Proyecto: advopsnkuzwpjbwtyvba.supabase.co
--
-- Para recrear desde cero: ejecutar este archivo completo en SQL Editor.
-- Para corregir inconsistencias del estado actual: ejecutar 0002_cleanup.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONES
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()


-- ---------------------------------------------------------------------------
-- TIPOS PERSONALIZADOS
-- ---------------------------------------------------------------------------

-- Roles de usuario disponibles en el sistema:
--   admin  → acceso total (gestión de contenido y socios)
--   editor → puede crear y editar contenido, sin gestión de socios
--   socio  → usuario registrado sin permisos de escritura (valor por defecto)
CREATE TYPE public.rol_usuario AS ENUM ('admin', 'editor', 'socio');


-- ---------------------------------------------------------------------------
-- TABLAS
-- ---------------------------------------------------------------------------

-- Noticias publicadas en la web
CREATE TABLE IF NOT EXISTS public.noticias (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text        UNIQUE NOT NULL,           -- URL amigable, ej: "reunion-apyma-mayo"
  titulo_es        text        NOT NULL,
  titulo_eu        text        NOT NULL,
  resumen_es       text,
  resumen_eu       text,
  contenido_es     text,                                  -- HTML generado por el editor rich-text
  contenido_eu     text,
  imagen_url       text,                                  -- URL pública en Storage bucket "noticias"
  fecha_publicacion date        DEFAULT NOW()::date,
  publicada        boolean     DEFAULT false,             -- false = borrador
  created_at       timestamptz DEFAULT NOW()
);

-- Actividades y eventos del colegio
CREATE TABLE IF NOT EXISTS public.actividades (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text        UNIQUE NOT NULL,
  titulo_es        text        NOT NULL,
  titulo_eu        text        NOT NULL,
  descripcion_es   text,
  descripcion_eu   text,
  imagen_url       text,                                  -- URL pública en Storage bucket "actividades"
  fecha_inicio     date,
  fecha_fin        date,
  hora_inicio      text,                                  -- Hora en formato texto, ej: "09:00"
  ubicacion        text,
  tipo             text,                                  -- Categoría libre, ej: "excursion", "taller"
  publicada        boolean     DEFAULT false,
  orden            int         DEFAULT 0,                 -- Orden de visualización (ascendente)
  created_at       timestamptz DEFAULT NOW()
);

-- Consejos y entradas de blog para familias
CREATE TABLE IF NOT EXISTS public.consejos (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text        UNIQUE NOT NULL,
  titulo_es        text        NOT NULL,
  titulo_eu        text        NOT NULL,
  contenido_es     text,                                  -- HTML generado por el editor rich-text
  contenido_eu     text,
  imagen_url       text,                                  -- URL pública en Storage bucket "consejos"
  orden            int         DEFAULT 0,
  publicado        boolean     DEFAULT false,
  created_at       timestamptz DEFAULT NOW()
);

-- Menús y documentos del comedor escolar (PDFs)
CREATE TABLE IF NOT EXISTS public.documentos_comedor (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  mes              text        NOT NULL,                  -- Nombre del mes, ej: "Enero"
  anio             int         NOT NULL,
  pdf_es_url       text,                                  -- URL privada en Storage bucket "comedor"
  pdf_eu_url       text,
  publicado        boolean     DEFAULT false,
  created_at       timestamptz DEFAULT NOW()
);

-- Perfiles de socios enlazados con auth.users (1:1)
-- Se crea automáticamente al registrar un usuario (via trigger o manual)
CREATE TABLE IF NOT EXISTS public.socios_perfiles (
  id               uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre           text,
  apellidos        text,
  rol              public.rol_usuario NOT NULL DEFAULT 'socio',
  activo           boolean     NOT NULL DEFAULT true,
  created_at       timestamptz DEFAULT NOW()
);

-- Mensajes recibidos desde el formulario de contacto
CREATE TABLE IF NOT EXISTS public.contacto_mensajes (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           text        NOT NULL,
  email            text        NOT NULL,
  mensaje          text        NOT NULL,
  idioma           text        NOT NULL DEFAULT 'es',    -- 'es' | 'eu'
  created_at       timestamptz DEFAULT NOW()
);


-- ---------------------------------------------------------------------------
-- ACTIVAR ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------------
-- RLS bloqueará por defecto TODOS los accesos que no estén explícitamente
-- permitidos por una política. Las políticas se definen a continuación.

ALTER TABLE public.noticias           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actividades        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consejos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_comedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socios_perfiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacto_mensajes  ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- FUNCIONES AUXILIARES
-- ---------------------------------------------------------------------------

-- current_user_role()
-- Devuelve el rol del usuario autenticado consultando socios_perfiles.
-- Si el usuario no tiene perfil (o es anónimo), devuelve 'socio'.
--
-- ⚠️  SECURITY DEFINER es OBLIGATORIO:
--     Esta función consulta socios_perfiles, que tiene RLS habilitado.
--     Sin SECURITY DEFINER, al ejecutarse con permisos del usuario actual,
--     activaría las políticas RLS de socios_perfiles, que a su vez llaman
--     a current_user_role(), creando una RECURSIÓN INFINITA (error 54001).
--     Con SECURITY DEFINER se ejecuta como el propietario (postgres),
--     saltándose el RLS y cortando la recursión.
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.rol_usuario
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT rol FROM public.socios_perfiles WHERE id = auth.uid()),
    'socio'::public.rol_usuario
  );
$$;

-- is_admin()
-- Atajo booleano para comprobar si el usuario actual es admin.
-- También requiere SECURITY DEFINER por el mismo motivo que current_user_role().
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.socios_perfiles
    WHERE id = auth.uid() AND rol = 'admin'
  );
$$;


-- ---------------------------------------------------------------------------
-- POLÍTICAS RLS — ESTADO REAL VERIFICADO (21/05/2026)
-- ---------------------------------------------------------------------------
-- Fuente: SELECT tablename, policyname, cmd, roles, qual, with_check
--           FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
--
-- ⚠️  ISSUES CONOCIDOS (ver 0002_cleanup.sql para corregirlos):
--   - noticias/comedor: políticas SELECT para {public} con "OR auth.uid() IS NOT NULL"
--     → los usuarios autenticados ven borradores aunque no sean admin/editor
--   - noticias/comedor/consejos/contacto: políticas ALL/SELECT para {public} que
--     llaman a current_user_role() → evaluadas para anon; seguras tras el fix
--     SECURITY DEFINER, pero ineficientes y potencialmente confusas
--   - socios_perfiles: no hay política DELETE para admin
--   - contacto_read_admin_editor: roles={public}, debería ser {authenticated}
--
-- ✅ actividades tiene el patrón más limpio y es el modelo a seguir.


-- NOTICIAS
-- ⚠️  "OR auth.uid() IS NOT NULL" hace que autenticados vean borradores
CREATE POLICY "noticias_publicadas_select"
  ON public.noticias FOR SELECT -- roles: {public}
  USING (publicada = true OR auth.uid() IS NOT NULL);

-- ⚠️  ALL para {public} → current_user_role() se evalúa también para anon
CREATE POLICY "noticias_admin_editor_write"
  ON public.noticias FOR ALL -- roles: {public}
  USING      (public.current_user_role() IN ('admin', 'editor'))
  WITH CHECK (public.current_user_role() IN ('admin', 'editor'));


-- ACTIVIDADES — ✅ Patrón correcto (modelo a seguir para las demás tablas)
CREATE POLICY "select_publicadas"
  ON public.actividades FOR SELECT -- roles: {public}
  USING (publicada = true);

CREATE POLICY "select_admin_all"
  ON public.actividades FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "insert_admin"
  ON public.actividades FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "update_admin"
  ON public.actividades FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "delete_admin"
  ON public.actividades FOR DELETE TO authenticated
  USING (public.is_admin());


-- CONSEJOS — ✅ SELECT bien separado por rol (corregido en sesión actual)
--            ⚠️  consejos_admin_editor_write es ALL para {public} (igual que noticias)
CREATE POLICY "consejos_anon_select"
  ON public.consejos FOR SELECT TO anon
  USING (publicado = true);

CREATE POLICY "consejos_auth_select"
  ON public.consejos FOR SELECT TO authenticated
  USING (publicado = true OR public.is_admin());

-- ⚠️  ALL para {public} → current_user_role() se evalúa también para anon
CREATE POLICY "consejos_admin_editor_write"
  ON public.consejos FOR ALL -- roles: {public}
  USING      (public.current_user_role() IN ('admin', 'editor'))
  WITH CHECK (public.current_user_role() IN ('admin', 'editor'));

CREATE POLICY "consejos_insert"
  ON public.consejos FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "consejos_update"
  ON public.consejos FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "consejos_delete"
  ON public.consejos FOR DELETE TO authenticated
  USING (public.is_admin());


-- DOCUMENTOS COMEDOR
-- ⚠️  "OR auth.uid() IS NOT NULL" hace que autenticados vean borradores
CREATE POLICY "comedor_publicado_select"
  ON public.documentos_comedor FOR SELECT -- roles: {public}
  USING (publicado = true OR auth.uid() IS NOT NULL);

-- ⚠️  ALL para {public} → current_user_role() se evalúa también para anon
CREATE POLICY "comedor_admin_editor_write"
  ON public.documentos_comedor FOR ALL -- roles: {public}
  USING      (public.current_user_role() IN ('admin', 'editor'))
  WITH CHECK (public.current_user_role() IN ('admin', 'editor'));


-- SOCIOS PERFILES
-- ⚠️  Todas las políticas son {public} en lugar de {authenticated}
-- ⚠️  Falta política DELETE para admin
CREATE POLICY "perfil_select_own_or_admin"
  ON public.socios_perfiles FOR SELECT -- roles: {public}
  USING (id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "perfil_update_own_or_admin"
  ON public.socios_perfiles FOR UPDATE -- roles: {public}
  USING      (id = auth.uid() OR public.current_user_role() = 'admin')
  WITH CHECK (id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "perfil_insert_admin"
  ON public.socios_perfiles FOR INSERT -- roles: {public}
  WITH CHECK (public.current_user_role() = 'admin');


-- CONTACTO
-- ⚠️  contacto_read_admin_editor es {public} en lugar de {authenticated}
CREATE POLICY "contacto_insert_public"
  ON public.contacto_mensajes FOR INSERT -- roles: {public}
  WITH CHECK (true);

CREATE POLICY "contacto_read_admin_editor"
  ON public.contacto_mensajes FOR SELECT -- roles: {public} ← debería ser {authenticated}
  USING (public.current_user_role() IN ('admin', 'editor'));



-- ---------------------------------------------------------------------------
-- STORAGE BUCKETS
-- ---------------------------------------------------------------------------
-- Ejecutar en SQL Editor si no se usa la CLI de Supabase.
--
-- Buckets públicos (las URLs son accesibles sin autenticación):
--   noticias   → imágenes de noticias
--   actividades → imágenes de actividades
--   consejos   → imágenes de consejos/blog
--
-- Buckets privados (requieren token firmado para acceder):
--   comedor    → PDFs del menú del comedor (solo socios autenticados)
--   documentos → Documentos internos de la APYMA

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('noticias',    'noticias',    true),
  ('actividades', 'actividades', true),
  ('consejos',    'consejos',    true),
  ('comedor',     'comedor',     false),
  ('documentos',  'documentos',  false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para buckets públicos (lectura sin restricción, escritura solo admin/editor)
CREATE POLICY "storage_noticias_public_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'noticias');

CREATE POLICY "storage_noticias_auth_write"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'noticias' AND public.current_user_role() IN ('admin', 'editor'));

CREATE POLICY "storage_noticias_auth_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'noticias' AND public.current_user_role() IN ('admin', 'editor'));

-- (Repetir el mismo patrón para 'actividades' y 'consejos')
CREATE POLICY "storage_actividades_public_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'actividades');

CREATE POLICY "storage_actividades_auth_write"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'actividades' AND public.current_user_role() IN ('admin', 'editor'));

CREATE POLICY "storage_actividades_auth_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'actividades' AND public.current_user_role() IN ('admin', 'editor'));

CREATE POLICY "storage_consejos_public_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'consejos');

CREATE POLICY "storage_consejos_auth_write"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'consejos' AND public.current_user_role() IN ('admin', 'editor'));

CREATE POLICY "storage_consejos_auth_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'consejos' AND public.current_user_role() IN ('admin', 'editor'));

-- Bucket privado comedor: solo socios autenticados pueden leer
CREATE POLICY "storage_comedor_auth_read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'comedor');

CREATE POLICY "storage_comedor_auth_write"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'comedor' AND public.current_user_role() IN ('admin', 'editor'));


-- ---------------------------------------------------------------------------
-- TAREAS MANUALES POST-INSTALACIÓN
-- ---------------------------------------------------------------------------
-- Estas operaciones no pueden automatizarse en migraciones estándar.
-- Ejecutar manualmente en Supabase → SQL Editor:

-- 1. Dar rol admin a un usuario ya registrado:
--    UPDATE auth.users
--    SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
--    WHERE email = 'tu-email@ejemplo.com';
--
--    Y también crear su perfil en socios_perfiles si no existe:
--    INSERT INTO public.socios_perfiles (id, nombre, apellidos, rol)
--    SELECT id, '', '', 'admin' FROM auth.users WHERE email = 'tu-email@ejemplo.com'
--    ON CONFLICT (id) DO UPDATE SET rol = 'admin';

-- 2. Verificar configuración de Auth en Supabase Dashboard:
--    - Authentication → Providers → Email: habilitar "Confirm email" según necesidad
--    - Authentication → URL Configuration → Site URL: https://familiasremontival.com
--    - Authentication → URL Configuration → Redirect URLs: https://familiasremontival.com/**
