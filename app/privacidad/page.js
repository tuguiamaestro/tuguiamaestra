export const metadata = { title: 'Política de Privacidad — TuGuíaMaestra' };

export default function PrivacidadPage() {
  return (
    <main className="wrap" style={{ maxWidth: 760 }}>
      <div className="eyebrow">Legal</div>
      <h1 style={{ marginTop: 10 }}>Política de Privacidad</h1>
      <p style={{ opacity: 0.6, fontSize: '0.88rem' }}>Última actualización: septiembre de 2026</p>

      <div className="summary-box" style={{ marginTop: 8 }}>
        <p style={{ margin: 0, fontSize: '0.88rem' }}>
          Este es un texto de referencia para el lanzamiento del sitio. TuGuíaMaestra
          recomienda que sea revisado por un abogado antes de considerarse definitivo,
          especialmente porque la nueva Ley N.º 21.719 de Protección de Datos Personales
          de Chile entra en plena vigencia el 1 de diciembre de 2026 y trae obligaciones
          más exigentes que las de la ley anterior.
        </p>
      </div>

      <div className="prose" style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 10 }}>1. ¿Qué datos recolectamos?</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          Cuando un cliente pide presupuesto: nombre, teléfono, correo electrónico
          (opcional), comuna y detalles del proyecto. Cuando un taller se registra:
          nombre del taller, RUT o Inicio de Actividades, comuna, especialidades,
          fotos de trabajos, y el documento que sube para verificación (Inicio de
          Actividades del SII o cédula de identidad).
        </p>

        <h3 style={{ marginBottom: 10 }}>2. ¿Para qué usamos estos datos?</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          Para conectar a clientes con talleres que trabajan su categoría en su
          comuna, para que el taller pueda contactar al cliente, y para avisarle
          al administrador cuando hay un taller nuevo pendiente de aprobación o un
          lead nuevo. No usamos tus datos para publicidad de terceros ni los
          vendemos a nadie.
        </p>

        <h3 style={{ marginBottom: 10 }}>3. ¿Quién puede ver tus datos?</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          Los datos de contacto de un cliente solo se comparten con el o los
          talleres a los que se dirige su solicitud (directamente, o por
          coincidencia de categoría y comuna). El documento de verificación de
          un taller solo lo puede ver el administrador de la plataforma —
          nunca se muestra públicamente ni a otros clientes.
        </p>

        <h3 style={{ marginBottom: 10 }}>4. Seguridad</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          Tu cuenta está protegida con autenticación segura (Supabase Auth), y
          el acceso a los datos está restringido por reglas de seguridad a
          nivel de fila (Row Level Security) — por ejemplo, un taller solo
          puede ver sus propios leads, nunca los de otro taller.
        </p>

        <h3 style={{ marginBottom: 10 }}>5. Tus derechos</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          Puedes pedir acceso, corrección o eliminación de tus datos personales
          en cualquier momento escribiéndonos a través de la página de{' '}
          <a href="/terminos">Contacto</a>. Responderemos tu solicitud dentro
          de un plazo razonable.
        </p>

        <h3 style={{ marginBottom: 10 }}>6. Cambios a esta política</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          Esta política se actualizará antes de diciembre de 2026 para
          reflejar las obligaciones específicas de la Ley N.º 21.719 (como la
          designación de un encargado de datos y el registro de actividades
          de tratamiento) una vez que se publiquen los reglamentos definitivos.
        </p>
      </div>
    </main>
  );
}
