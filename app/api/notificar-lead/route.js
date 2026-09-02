import { enviarEmail } from '../../../lib/email';

export async function POST(request) {
  const { tallerEmail, tallerNombre, categoria, comuna, descripcion } = await request.json();

  if (!tallerEmail) {
    return Response.json({ omitido: true });
  }

  try {
    await enviarEmail({
      to: tallerEmail,
      subject: `Nueva solicitud de ${categoria} en ${comuna}`,
      html: `
        <h2>Hola ${tallerNombre},</h2>
        <p>Te llegó una nueva solicitud a través de TuGuíaMaestra:</p>
        <ul>
          <li><strong>Categoría:</strong> ${categoria}</li>
          <li><strong>Comuna:</strong> ${comuna}</li>
          <li><strong>Descripción:</strong> ${descripcion || 'Sin descripción'}</li>
        </ul>
        <p>Entra a tu <a href="https://tuguiamaestra.cl/panel">panel de taller</a> para ver el detalle y aceptar el contacto.</p>
      `,
    });
    return Response.json({ enviado: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
