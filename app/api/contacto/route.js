import { enviarEmail } from '../../../lib/email';

export async function POST(request) {
  const { nombre, correo, motivo, mensaje } = await request.json();

  if (!nombre || !correo || !mensaje) {
    return Response.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
  }

  try {
    await enviarEmail({
      to: 'contacto@tuguiamaestra.cl',
      subject: `[Contacto] ${motivo || 'Consulta general'} — ${nombre}`,
      html: `
        <h2>Nuevo mensaje desde el formulario de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Motivo:</strong> ${motivo || 'Consulta general'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje.replace(/\n/g, '<br>')}</p>
      `,
    });
    return Response.json({ enviado: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
