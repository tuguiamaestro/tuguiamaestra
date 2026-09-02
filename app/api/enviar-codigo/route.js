export async function POST(request) {
  const { telefono } = await request.json();

  if (!telefono) {
    return Response.json({ error: 'Falta el número de teléfono.' }, { status: 400 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    return Response.json({ error: 'Faltan las variables de entorno de Twilio en Vercel.' }, { status: 500 });
  }

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const res = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: telefono, Channel: 'sms' }),
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json({ error: data.message || 'No se pudo enviar el código.' }, { status: 400 });
  }

  return Response.json({ status: data.status });
}
