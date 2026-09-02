import { enviarEmail } from '../../../lib/email';

export async function POST(request) {
  const { tallerNombre, comuna, rut } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return Response.json({ error: 'Falta la variable ADMIN_EMAIL en Vercel.' }, { status: 500 });
  }

  try {
    await enviarEmail({
      to: adminEmail,
      subject: `Nuevo taller pendiente: ${tallerNombre}`,
      html: `
        <h2>Nuevo taller registrado</h2>
        <p><strong>${tallerNombre}</strong> (${comuna}, RUT ${rut}) se acaba de registrar y está esperando tu aprobación.</p>
        <p>Entra al <a href="https://tuguiamaestra.cl/admin">panel admin</a> para revisarlo y aprobarlo o rechazarlo.</p>
      `,
    });
    return Response.json({ enviado: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
