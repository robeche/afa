-- =============================================================================
-- AFA REMONTIVAL — Migración 0006: Políticas de escritura en Storage (comedor)
-- =============================================================================
-- La migración 0005 hizo el bucket público para lectura anónima, pero las
-- políticas de INSERT/UPDATE/DELETE para admin/editor nunca se aplicaron
-- (estaban solo en schema.sql como referencia).
-- Esta migración las crea explícitamente.
-- =============================================================================

-- Escritura (INSERT) — solo admin o editor autenticados
DROP POLICY IF EXISTS "storage_comedor_auth_write" ON storage.objects;
CREATE POLICY "storage_comedor_auth_write"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'comedor'
    AND public.current_user_role() IN ('admin', 'editor')
  );

-- Actualización (UPDATE) — necesaria para upsert
DROP POLICY IF EXISTS "storage_comedor_auth_update" ON storage.objects;
CREATE POLICY "storage_comedor_auth_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'comedor'
    AND public.current_user_role() IN ('admin', 'editor')
  )
  WITH CHECK (
    bucket_id = 'comedor'
    AND public.current_user_role() IN ('admin', 'editor')
  );

-- Eliminación (DELETE) — para borrar PDFs al editar o eliminar entrada
DROP POLICY IF EXISTS "storage_comedor_auth_delete" ON storage.objects;
CREATE POLICY "storage_comedor_auth_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'comedor'
    AND public.current_user_role() IN ('admin', 'editor')
  );
