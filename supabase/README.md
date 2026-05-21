# Base de datos — AFA Remontival (Supabase / PostgreSQL)

Proyecto Supabase: `advopsnkuzwpjbwtyvba.supabase.co`

## Archivos

| Archivo | Descripción |
|---------|-------------|
| [`migrations/0001_init.sql`](./migrations/0001_init.sql) | Schema inicial: tablas, tipos, RLS habilitado, función `current_user_role()`, políticas base |
| [`migrations/0002_cleanup.sql`](./migrations/0002_cleanup.sql) | Correcciones de políticas RLS (ejecutar después de `0001`) |
| [`schema.sql`](./schema.sql) | Estado real completo verificado el 21/05/2026 — para recrear desde cero |

> **Estado real**: verificado consultando `pg_policies` directamente en Supabase SQL Editor.  
> Las políticas de `actividades` fueron añadidas manualmente (fuera de `0001_init.sql`).  
> La función `is_admin()` también fue creada manualmente en Supabase y no está en las migraciones.

---

## Tablas

| Tabla | Descripción |
|-------|-------------|
| `noticias` | Noticias y artículos publicados en la web |
| `actividades` | Actividades y eventos del colegio |
| `consejos` | Entradas de blog con consejos para familias |
| `documentos_comedor` | Menús del comedor en PDF (privados) |
| `socios_perfiles` | Perfil de cada socio registrado (1:1 con `auth.users`) |
| `contacto_mensajes` | Mensajes recibidos desde el formulario de contacto |

Todas las tablas de contenido tienen:
- `id` UUID generado automáticamente
- `slug` para URLs amigables (en `noticias`, `actividades`, `consejos`)
- Campos bilingües `_es` y `_eu` para español y euskera
- `publicado/publicada` booleano (borrador = `false`)
- `created_at` timestamp automático

---

## Roles de usuario (`rol_usuario`)

```
admin   → Acceso total. Gestión de contenido y socios.
editor  → Puede crear y editar contenido. No gestiona socios.
socio   → Usuario registrado sin permisos de escritura (valor por defecto).
```

El rol se almacena en `socios_perfiles.rol`. Si un usuario autenticado no tiene fila en `socios_perfiles`, se le trata como `socio`.

### Dar rol admin a un usuario

```sql
-- 1. Crear/actualizar su perfil en socios_perfiles
INSERT INTO public.socios_perfiles (id, nombre, apellidos, rol)
SELECT id, '', '', 'admin' FROM auth.users WHERE email = 'email@ejemplo.com'
ON CONFLICT (id) DO UPDATE SET rol = 'admin';

-- 2. (Opcional) Marcar en app_metadata para que el front pueda leerlo sin consultar la BD
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
WHERE email = 'email@ejemplo.com';
```

---

## Funciones auxiliares

### `current_user_role() → rol_usuario`
Devuelve el rol del usuario autenticado. Si no tiene perfil o es anónimo, devuelve `'socio'`.

### `is_admin() → boolean`
Devuelve `true` si el usuario autenticado tiene rol `admin`.

> ⚠️ **Ambas funciones son `SECURITY DEFINER`** — imprescindible para evitar recursión infinita en RLS.
>
> **¿Por qué?** `current_user_role()` consulta `socios_perfiles`. Esa tabla tiene RLS habilitado, y sus políticas llaman a `current_user_role()`. Sin `SECURITY DEFINER`, se formaría un bucle infinito (error PostgreSQL `54001: stack depth limit exceeded`). Con `SECURITY DEFINER`, la función se ejecuta con permisos del propietario (`postgres`), saltándose el RLS de `socios_perfiles` y cortando la recursión.

---

## Row Level Security (RLS)

RLS está habilitado en todas las tablas. Las políticas permisivas se combinan con OR (si cualquiera las permite, se concede el acceso).

### Estado real de políticas (verificado 21/05/2026)

#### `actividades` — ✅ Patrón correcto (modelo a seguir)

| Política | Operación | Roles | Condición |
|----------|-----------|-------|-----------|
| `select_publicadas` | SELECT | todos | `publicada = true` |
| `select_admin_all` | SELECT | authenticated | `is_admin()` |
| `insert_admin` | INSERT | authenticated | `is_admin()` |
| `update_admin` | UPDATE | authenticated | `is_admin()` |
| `delete_admin` | DELETE | authenticated | `is_admin()` |

#### `consejos` — ✅ SELECT correcto, ⚠️ write policy para {public}

| Política | Operación | Roles | Condición |
|----------|-----------|-------|-----------|
| `consejos_anon_select` | SELECT | anon | `publicado = true` |
| `consejos_auth_select` | SELECT | authenticated | `publicado = true OR is_admin()` |
| `consejos_admin_editor_write` | ALL | **todos** ⚠️ | `current_user_role() IN ('admin','editor')` |
| `consejos_insert/update/delete` | INSERT/UPDATE/DELETE | authenticated | `is_admin()` |

#### `noticias` — ⚠️ Autenticados ven borradores, write policy para {public}

| Política | Operación | Roles | Condición |
|----------|-----------|-------|-----------|
| `noticias_publicadas_select` | SELECT | todos | `publicada = true OR auth.uid() IS NOT NULL` ⚠️ |
| `noticias_admin_editor_write` | ALL | **todos** ⚠️ | `current_user_role() IN ('admin','editor')` |

#### `documentos_comedor` — ⚠️ Mismo problema que noticias

| Política | Operación | Roles | Condición |
|----------|-----------|-------|-----------|
| `comedor_publicado_select` | SELECT | todos | `publicado = true OR auth.uid() IS NOT NULL` ⚠️ |
| `comedor_admin_editor_write` | ALL | **todos** ⚠️ | `current_user_role() IN ('admin','editor')` |

#### `socios_perfiles` — ⚠️ Políticas para {public}, falta DELETE

| Política | Operación | Roles | Condición |
|----------|-----------|-------|-----------|
| `perfil_select_own_or_admin` | SELECT | todos ⚠️ | `id = auth.uid() OR current_user_role() = 'admin'` |
| `perfil_update_own_or_admin` | UPDATE | todos ⚠️ | `id = auth.uid() OR current_user_role() = 'admin'` |
| `perfil_insert_admin` | INSERT | todos ⚠️ | `current_user_role() = 'admin'` |
| *(falta DELETE)* | — | — | — |

#### `contacto_mensajes`

| Política | Operación | Roles | Condición |
|----------|-----------|-------|-----------|
| `contacto_insert_public` | INSERT | todos | `true` (cualquiera puede enviar) |
| `contacto_read_admin_editor` | SELECT | todos ⚠️ | `current_user_role() IN ('admin','editor')` |

### Issues pendientes → ejecutar `0002_cleanup.sql`

1. **`noticias` y `documentos_comedor`**: `OR auth.uid() IS NOT NULL` hace que cualquier usuario autenticado (aunque sea `socio`) vea borradores.
2. **Políticas ALL para `{public}`** en noticias/comedor/consejos: al evaluar SELECT para anon, se llama a `current_user_role()`. Es seguro tras el fix `SECURITY DEFINER`, pero subóptimo.
3. **`socios_perfiles`**: políticas marcadas como `{public}` deberían ser `{authenticated}` + falta DELETE.
4. **`contacto_read_admin_editor`**: marcada `{public}`, debería ser `{authenticated}`.

---

## Storage Buckets

| Bucket | Público | Contenido |
|--------|---------|-----------|
| `noticias` | ✅ | Imágenes de noticias |
| `actividades` | ✅ | Imágenes de actividades |
| `consejos` | ✅ | Imágenes de consejos/blog |
| `comedor` | ❌ | PDFs del menú del comedor (acceso solo socios) |
| `documentos` | ❌ | Documentos internos de la APYMA |

**Acceso a buckets públicos:** cualquiera puede leer. Solo admin/editor puede subir/borrar.  
**Acceso a buckets privados:** solo usuarios autenticados pueden leer (URL firmada requerida).

---

## Variables de entorno necesarias

| Variable | Dónde usarla | Descripción |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + GitHub Secrets | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Frontend + GitHub Secrets | Clave anon/pública (safe to expose) |

Las claves se configuran en **GitHub → Settings → Secrets and variables → Actions**.

> La `service_role` key NO se usa en el frontend. Solo para scripts de administración.

---

## Configuración de Auth (Supabase Dashboard)

- **Authentication → Providers → Email**: habilitado
- **Site URL**: `https://familiasremontival.com`
- **Redirect URLs**: `https://familiasremontival.com/**`
