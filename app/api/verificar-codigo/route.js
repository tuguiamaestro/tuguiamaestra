export async function POST(request) {
  const { telefono, codigo } = await request.json();

  if (!telefono || !codigo) {
    return Response.json({ error: 'Falta el teléfono o el código.' }, { status: 400 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    return Response.json({ error: 'Faltan las variables de entorno de Twilio en Vercel.' }, { status: 500 });
  }

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const res = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: telefono, Code: codigo }),
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json({ error: data.message || 'No se pudo verificar el código.' }, { status: 400 });
  }

  return Response.json({ verificado: data.status === 'approved' });
}
