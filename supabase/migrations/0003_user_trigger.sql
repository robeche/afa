-- =============================================================================
-- AFA REMONTIVAL — Migración 0003: Trigger para crear perfil al registrarse
-- =============================================================================
-- Al registrar un nuevo usuario en Supabase Auth, se crea automáticamente
-- su fila en socios_perfiles usando los metadatos del signup (nombre, apellidos).
--
-- Ejecutar en Supabase → SQL Editor.
-- =============================================================================

-- Función que el trigger llamará
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.socios_perfiles (id, nombre, apellidos, rol, activo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellidos', ''),
    'socio',
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger que se dispara después de insertar en auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
