// Este archivo corre SOLO en el servidor (Route Handlers), nunca en el
// navegador — por eso es seguro usar aquí el RESEND_API_KEY.

export async function enviarEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('Falta la variable de entorno RESEND_API_KEY en Vercel.');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Cuando tu dominio esté verificado en Resend, cambia esto a
      // "TuGuíaMaestra <notificaciones@tuguiamaestra.cl>"
      from: 'TuGuíaMaestra <onboarding@resend.dev>',
      to,
      subject,
      html,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'No se pudo enviar el correo.');
  }

  return data;
}
