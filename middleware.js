import { NextResponse } from 'next/server';

// Clave secreta para poder ver el sitio antes de lanzarlo.
// La defines en Vercel: Settings → Environment Variables → PREVIEW_ACCESS_CODE
const CODIGO_SECRETO = process.env.PREVIEW_ACCESS_CODE;

const PAGINA_PROXIMAMENTE = `<!DOCTYPE html>
<html lang="es-CL">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TuGuíaMaestra — Próximamente</title>
  <style>
    body {
      margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #EAE4D6; color: #241E19; font-family: Georgia, 'Times New Roman', serif;
      text-align: center; padding: 24px;
    }
    .box { max-width: 480px; }
    .logo { display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; font-size: 1.3rem; margin-bottom: 28px; }
    h1 { font-size: 1.8rem; margin-bottom: 14px; }
    p { opacity: 0.75; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="box">
    <div class="logo">
      <svg viewBox="0 0 30 30" width="26" height="26" fill="none">
        <path d="M4 24 L15 6 L26 24 Z" stroke="#241E19" stroke-width="2" fill="none"/>
        <path d="M10 24 L15 15 L20 24" stroke="#B08D3E" stroke-width="2"/>
      </svg>
      TuGuíaMaestra
    </div>
    <h1>Estamos construyendo algo bueno</h1>
    <p>Muy pronto vas a poder encontrar aquí a los mejores mueblistas y carpinteros de Santiago.</p>
  </div>
</body>
</html>`;

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // La API y los archivos internos de Next.js nunca se bloquean
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  const cookieAcceso = request.cookies.get('acceso_preview')?.value;
  const codigoEnUrl = searchParams.get('acceso');

  // Si viene con el código correcto en la URL, lo dejamos pasar y
  // le guardamos una cookie de 30 días para que no tenga que repetirlo
  if (CODIGO_SECRETO && codigoEnUrl === CODIGO_SECRETO) {
    const respuesta = NextResponse.redirect(new URL(pathname, request.url));
    respuesta.cookies.set('acceso_preview', CODIGO_SECRETO, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    });
    return respuesta;
  }

  // Si ya tiene la cookie válida, pasa normal
  if (CODIGO_SECRETO && cookieAcceso === CODIGO_SECRETO) {
    return NextResponse.next();
  }

  // Cualquier otro visitante ve la página "Próximamente"
  return new NextResponse(PAGINA_PROXIMAMENTE, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
