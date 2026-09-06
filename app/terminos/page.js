export const metadata = { title: 'Términos y Condiciones — TuGuíaMaestra' };

export default function TerminosPage() {
  return (
    <main className="wrap" style={{ maxWidth: 760 }}>
      <div className="eyebrow">Legal</div>
      <h1 style={{ marginTop: 10 }}>Términos y Condiciones</h1>
      <p style={{ opacity: 0.6, fontSize: '0.88rem' }}>Última actualización: septiembre de 2026</p>

      <div className="summary-box" style={{ marginTop: 8 }}>
        <p style={{ margin: 0, fontSize: '0.88rem' }}>
          Texto de referencia — debe ser revisado por un abogado antes de
          publicarse como definitivo.
        </p>
      </div>

      <div className="prose" style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 10 }}>1. Naturaleza del servicio</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          TuGuíaMaestra es una plataforma de intermediación entre personas que
          buscan muebles a medida y talleres o carpinteros independientes.
          TuGuíaMaestra no fabrica, instala ni supervisa los trabajos
          realizados por los talleres publicados. El contrato de prestación
          del servicio (precio, plazo, forma de pago) se celebra
          exclusivamente entre el cliente y el taller.
        </p>

        <h3 style={{ marginBottom: 10 }}>2. Verificación de talleres</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          Antes de publicarse, cada taller pasa por una revisión básica:
          confirmamos que el documento subido (RUT / Inicio de Actividades o
          cédula) corresponde a los datos declarados. Esta verificación{' '}
          <strong>no constituye una garantía</strong> sobre la calidad,
          plazos o resultado del trabajo realizado.
        </p>

        <h3 style={{ marginBottom: 10 }}>3. Responsabilidad</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          TuGuíaMaestra no garantiza la calidad, plazos ni resultado de los
          trabajos realizados por los talleres publicados en la plataforma.
          Cualquier disputa relativa a la ejecución del trabajo es
          exclusivamente entre el cliente y el taller. Recomendamos siempre
          pactar por escrito los detalles del trabajo antes de comenzar.
        </p>

        <h3 style={{ marginBottom: 10 }}>4. Cuentas de usuario</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          El usuario se compromete a entregar información veraz al registrarse
          y al solicitar presupuestos. TuGuíaMaestra puede suspender una
          cuenta que reciba reportes fundados de mal comportamiento
          (información falsa, solicitar pagos fuera de la plataforma de forma
          sospechosa, etc.).
        </p>

        <h3 style={{ marginBottom: 10 }}>5. Reseñas</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          Las reseñas deben corresponder a una experiencia real con el taller
          reseñado. Nos reservamos el derecho de eliminar reseñas falsas o que
          no correspondan a una solicitud real registrada en la plataforma.
        </p>

        <h3 style={{ marginBottom: 10 }}>6. Planes y precios</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          El registro de talleres es completamente gratuito durante la etapa
          de lanzamiento. Consulta el detalle en <a href="/planes">Planes</a>.
          Cualquier cambio futuro al modelo de precios se anunciará con
          anticipación a los talleres registrados.
        </p>

        <h3 style={{ marginBottom: 10 }}>7. Contacto</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.75, opacity: 0.82 }}>
          Para dudas, reclamos o solicitudes relacionadas con tus datos,
          escríbenos a <strong>contacto@tuguiamaestra.cl</strong>.
        </p>
      </div>
    </main>
  );
}
