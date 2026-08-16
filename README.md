# TuGuíaMaestra — proyecto Next.js

Este es el punto de partida real del sitio: un proyecto Next.js conectado
a tu base de datos de Supabase. Hoy solo muestra las categorías (para
comprobar que la conexión funciona) — el resto de las pantallas del
prototipo (listado, wizard, panel taller, admin, etc.) se van agregando
después de aquí, una por una.

## 1. Súbelo a GitHub

1. Crea una cuenta en [github.com](https://github.com) si no tienes.
2. Crea un repositorio nuevo (puede ser privado), por ejemplo `tuguiamaestra`.
3. Sube esta carpeta completa a ese repositorio (GitHub te deja arrastrar
   los archivos directo desde la web si no quieres usar la terminal:
   botón "Add file" → "Upload files").

## 2. Conéctalo a Vercel

1. Entra a [vercel.com](https://vercel.com) y regístrate con tu cuenta de GitHub.
2. "Add New" → "Project" → elige el repositorio `tuguiamaestra`.
3. Antes de darle "Deploy", abre "Environment Variables" y agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` → lo encuentras en Supabase: tu proyecto →
     ícono de engranaje (Project Settings) → API → "Project URL"
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → en la misma página, "Project API keys" → `anon` `public`
4. Dale "Deploy". En 1-2 minutos tendrás una URL tipo `tuguiamaestra.vercel.app`.

## 3. Verifica que funcionó

Abre la URL que te dio Vercel. Deberías ver:

- El título "TuGuíaMaestra"
- Un mensaje verde: "✓ Conectado a Supabase — mostrando 6 categorías reales de tu base de datos"
- Las 6 categorías (Cocinas, Closets, Baños, etc.) con sus rangos de precio

Si en vez de eso ves un mensaje rojo de error, casi siempre es porque las
variables de entorno están mal copiadas — revisa que no tengan espacios
de más al principio o final.

## 4. Prueba el formulario de presupuesto

Desde la home, haz clic en "Pedir presupuesto" (o ve directo a `/solicitar`).
Llena el formulario y envíalo. Si funcionó:

- Verás la pantalla "✓ Solicitud enviada"
- En Supabase, ve a **Table Editor** → tabla `solicitudes` → deberías ver
  la fila nueva con los datos que escribiste

Esto confirma que el sitio ya puede **escribir** en tu base de datos real,
no solo leer.

## 5. Probar en tu computador (opcional, si quieres ver cambios antes de subirlos)

```bash
npm install
cp .env.local.example .env.local
# edita .env.local con tus valores reales de Supabase
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

## Próximos pasos

Una vez que esto funcione, seguimos agregando página por página del
prototipo original (listado con filtros, wizard de presupuesto, panel del
taller, panel admin, login), conectando cada una a las tablas que ya
existen en Supabase (`talleres`, `solicitudes`, `leads`, etc.)
