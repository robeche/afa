-- =============================================================================
-- AFA REMONTIVAL — Migración 0004: Políticas socios_perfiles via JWT
-- =============================================================================
-- Reemplaza las políticas de socios_perfiles que usaban current_user_role()
-- (causando recursión) por comprobación directa del JWT app_metadata.
-- Esto rompe el ciclo: current_user_role() → socios_perfiles RLS → current_user_role()
-- =============================================================================

DROP POLICY IF EXISTS "perfil_select_own_or_admin"  ON public.socios_perfiles;
DROP POLICY IF EXISTS "perfil_update_own_or_admin"  ON public.socios_perfiles;
DROP POLICY IF EXISTS "perfil_insert_admin"         ON public.socios_perfiles;
DROP POLICY IF EXISTS "perfil_delete_admin"         ON public.socios_perfiles;

-- SELECT: propio perfil o admin (comprobado por JWT, sin recursión)
CREATE POLICY "perfil_select_own_or_admin"
  ON public.socios_perfiles FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- UPDATE: propio perfil o admin
CREATE POLICY "perfil_update_own_or_admin"
  ON public.socios_perfiles FOR UPDATE TO authenticated
  USING (
    id = auth.uid()
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    id = auth.uid()
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- INSERT: el trigger handle_new_user() usa SECURITY DEFINER (bypasa RLS).
-- Esta política cubre inserts manuales desde el cliente admin.
CREATE POLICY "perfil_insert_admin"
  ON public.socios_perfiles FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- DELETE: solo admin
CREATE POLICY "perfil_delete_admin"
  ON public.socios_perfiles FOR DELETE TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
