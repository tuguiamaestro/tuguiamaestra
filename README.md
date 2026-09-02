# TuGuíaMaestra — proyecto Next.js

Sitio real conectado a Supabase (base de datos + login), con diseño
propio (paleta madera/bronce), wizard de presupuesto multi-paso,
matching automático, verificación SMS (opcional), notificaciones por
email, documento de verificación de talleres, y panel admin.

## Estructura
- `app/page.js` — home con hero y categorías
- `app/listado/page.js` — listado de talleres con filtros
- `app/solicitar/page.js` — wizard de presupuesto (4 pasos)
- `app/registro/page.js` — login + registro de taller + documento
- `app/panel/page.js` — panel del taller (leads y solicitudes directas)
- `app/admin/page.js` — panel admin (aprobar/rechazar talleres)
- `app/api/*` — Route Handlers (Twilio SMS, Resend email)
- `app/components/SiteHeader.js` — header con menú mobile

## 1. Variables de entorno (Vercel → Settings → Environment Variables)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID` (opcional, pausado)
- `RESEND_API_KEY`, `ADMIN_EMAIL`

## 2. Subir a GitHub y Vercel
Sube todo el contenido de esta carpeta a tu repositorio de GitHub
(reemplazando lo que ya existía). Vercel vuelve a desplegar solo.

## 3. Dominio
`tuguiamaestra.cl` ya está conectado en Vercel. Cuando Resend confirme
el dominio como "Verified", edita `lib/email.js` y cambia el `from` de
`onboarding@resend.dev` a `TuGuíaMaestra <notificaciones@tuguiamaestra.cl>`
— eso elimina la restricción de "solo a tu propio correo".

## 4. Para convertirte en admin
En Supabase → SQL Editor:
```sql
update perfiles set rol = 'admin'
where id = (select id from auth.users where email = 'TU_CORREO_AQUI');
```

## 5. Notas
- El motor de matching compara comuna exacta + categoría (no zonas de cobertura amplias todavía).
- La verificación SMS es opcional mientras Twilio no esté en cuenta paga.
- Cada taller sube un documento de verificación (Storage bucket `documentos-talleres`, privado) que solo el admin puede ver.
