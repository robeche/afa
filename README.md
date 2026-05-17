# APYMA Remontival - Next.js + Supabase

Base inicial para la migracion desde Django hacia Next.js (App Router) con frontend estatico y backend gestionado en Supabase.

## Stack

- Next.js 16 + TypeScript + App Router
- Tailwind CSS 4
- Supabase (PostgreSQL, Auth, Storage, RLS)
- I18n por rutas: /es y /eu

## Estructura principal

- src/app/(public)/[lang] - rutas publicas bilingues
- src/app/(private)/socios - area privada con login Supabase
- src/components - layout y UI reutilizable
- src/lib/supabase - cliente Supabase y configuracion browser
- src/lib/i18n - diccionarios y configuracion de idiomas
- supabase/migrations - SQL inicial de tablas y politicas RLS

## Variables de entorno

1. Copiar .env.example a .env.local.
2. Completar:
	- NEXT_PUBLIC_SUPABASE_URL
	- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Comandos locales

```bash
npm install
npm run dev
```

App local en http://localhost:3000.

Comandos de calidad:

```bash
npm run lint
npm run build
```

## SQL inicial

El archivo supabase/migrations/0001_init.sql incluye:

- tablas de noticias, actividades, consejos, comedor, perfiles y contacto
- enum de roles: admin/editor/socio
- activacion de RLS
- politicas de lectura/escritura por rol

Puedes aplicarlo con Supabase CLI o pegandolo en el SQL Editor del proyecto.

## Deploy en GitHub Pages

Este repositorio ya incluye workflow de despliegue en [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml).

Pasos en GitHub:

1. Ir a Settings > Pages.
2. En Build and deployment seleccionar Source: GitHub Actions.
3. Ir a Settings > Secrets and variables > Actions y crear estos secretos de repositorio:
	- NEXT_PUBLIC_SUPABASE_URL
	- NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Hacer push a main para disparar el despliegue.

URL esperada en este repo: https://robeche.github.io/afa/

Notas:

- La configuracion de [next.config.ts](next.config.ts) ajusta automaticamente basePath/assetPrefix en CI para GitHub Pages.
- Si en el futuro usas dominio personalizado, se puede retirar ese prefijo de ruta.

## Estado de esta primera iteracion

- Layout visual alineado con la web actual: cabecera, menu con iconos, carrusel y bloques en home
- Rutas principales creadas y navegables
- Base de autenticacion en /socios con Supabase Auth
- Capa de datos preparada para conectar contenido real desde Supabase
