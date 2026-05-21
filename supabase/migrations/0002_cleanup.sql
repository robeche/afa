-- =============================================================================
-- AFA REMONTIVAL — Migración 0002: Limpieza y normalización de políticas RLS
-- =============================================================================
-- Corrige los issues identificados en el estado real de la BD (21/05/2026).
-- Ejecutar en Supabase → SQL Editor después de 0001_init.sql.
--
-- Issues que corrige:
--   1. "OR auth.uid() IS NOT NULL" en noticias/comedor → autenticados veían borradores
--   2. Políticas ALL para {public} en noticias/comedor → innecesario para anon
--   3. Políticas de socios_perfiles con roles {public} en lugar de {authenticated}
--   4. Falta política DELETE para admin en socios_perfiles
--   5. contacto_read_admin_editor con roles {public} en lugar de {authenticated}
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 1. NOTICIAS — Separar SELECT por rol y eliminar "OR auth.uid() IS NOT NULL"
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "noticias_publicadas_select"   ON public.noticias;
DROP POLICY IF EXISTS "noticias_admin_editor_write"  ON public.noticias;

-- Anon: solo noticias publicadas (sin llamar a funciones de rol)
CREATE POLICY "noticias_anon_select"
  ON public.noticias FOR SELECT TO anon
  USING (publicada = true);

-- Autenticados: publicadas o admin/editor ve todas
CREATE POLICY "noticias_auth_select"
  ON public.noticias FOR SELECT TO authenticated
  USING (publicada = true OR public.current_user_role() IN ('admin', 'editor'));

-- Escritura: solo admin/editor autenticados
CREATE POLICY "noticias_admin_editor_write"
  ON public.noticias FOR ALL TO authenticated
  USING      (public.current_user_role() IN ('admin', 'editor'))
  WITH CHECK (public.current_user_role() IN ('admin', 'editor'));


-- ---------------------------------------------------------------------------
-- 2. DOCUMENTOS COMEDOR — Mismo patrón que noticias
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "comedor_publicado_select"    ON public.documentos_comedor;
DROP POLICY IF EXISTS "comedor_admin_editor_write"  ON public.documentos_comedor;

-- Anon: solo documentos publicados
CREATE POLICY "comedor_anon_select"
  ON public.documentos_comedor FOR SELECT TO anon
  USING (publicado = true);

-- Autenticados: publicados o admin/editor ve todos
CREATE POLICY "comedor_auth_select"
  ON public.documentos_comedor FOR SELECT TO authenticated
  USING (publicado = true OR public.current_user_role() IN ('admin', 'editor'));

-- Escritura: solo admin/editor autenticados
CREATE POLICY "comedor_admin_editor_write"
  ON public.documentos_comedor FOR ALL TO authenticated
  USING      (public.current_user_role() IN ('admin', 'editor'))
  WITH CHECK (public.current_user_role() IN ('admin', 'editor'));


-- ---------------------------------------------------------------------------
-- 3. CONSEJOS — Eliminar ALL para {public}, ya existe select separado
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "consejos_admin_editor_write" ON public.consejos;

-- La política ALL para {public} se sustituye por write explícita para authenticated
-- (consejos_anon_select y consejos_auth_select ya existen y son correctas)
CREATE POLICY "consejos_admin_editor_write"
  ON public.consejos FOR ALL TO authenticated
  USING      (public.current_user_role() IN ('admin', 'editor'))
  WITH CHECK (public.current_user_role() IN ('admin', 'editor'));


-- ---------------------------------------------------------------------------
-- 4. SOCIOS PERFILES — Restringir a {authenticated} y añadir DELETE
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "perfil_select_own_or_admin"  ON public.socios_perfiles;
DROP POLICY IF EXISTS "perfil_update_own_or_admin"  ON public.socios_perfiles;
DROP POLICY IF EXISTS "perfil_insert_admin"         ON public.socios_perfiles;

CREATE POLICY "perfil_select_own_or_admin"
  ON public.socios_perfiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "perfil_update_own_or_admin"
  ON public.socios_perfiles FOR UPDATE TO authenticated
  USING      (id = auth.uid() OR public.current_user_role() = 'admin')
  WITH CHECK (id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "perfil_insert_admin"
  ON public.socios_perfiles FOR INSERT TO authenticated
  WITH CHECK (public.current_user_role() = 'admin');

-- Nueva política DELETE (faltaba)
CREATE POLICY "perfil_delete_admin"
  ON public.socios_perfiles FOR DELETE TO authenticated
  USING (public.current_user_role() = 'admin');


-- ---------------------------------------------------------------------------
-- 5. CONTACTO — Restringir lectura a {authenticated}
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "contacto_read_admin_editor" ON public.contacto_mensajes;

CREATE POLICY "contacto_read_admin_editor"
  ON public.contacto_mensajes FOR SELECT TO authenticated
  USING (public.current_user_role() IN ('admin', 'editor'));
