-- =============================================================================
-- AFA REMONTIVAL — Migración 0005: Bucket comedor público
-- =============================================================================
-- El menú del comedor es información pública (no requiere autenticación).
-- Se convierte el bucket "comedor" de privado a público para que el visor PDF
-- funcione sin token de sesión.
-- =============================================================================

-- Cambiar el bucket a público
UPDATE storage.buckets
SET public = true
WHERE id = 'comedor';

-- Eliminar la política de lectura solo para autenticados (ya no aplica)
DROP POLICY IF EXISTS "storage_comedor_auth_read" ON storage.objects;

-- Lectura pública del bucket comedor
CREATE POLICY "storage_comedor_public_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'comedor');

-- Escritura: solo admin/editor autenticados (sin cambios)
-- (storage_comedor_auth_write ya existe desde schema.sql)
