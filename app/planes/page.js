export const metadata = { title: 'Planes — TuGuíaMaestra' };

export default function PlanesPage() {
  return (
    <main className="wrap" style={{ maxWidth: 800 }}>
      <div className="eyebrow">Para talleres</div>
      <h1 style={{ marginTop: 10 }}>Planes</h1>
      <p style={{ opacity: 0.65, maxWidth: '50ch' }}>
        Hoy estamos en etapa de lanzamiento, así que el modelo es simple:
        gratis para todos los talleres, sin letra chica.
      </p>

      <div className="pro-grid" style={{ marginTop: 32, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        <div className="cat-card" style={{ border: '2px solid var(--wood-dark)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Plan Gratis</h3>
            <span className="destacado-pill">Activo ahora</span>
          </div>
          <p style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 700, margin: '14px 0' }}>$0</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ fontSize: '0.88rem', opacity: 0.75, marginBottom: 10 }}>✓ Perfil público en el directorio</li>
            <li style={{ fontSize: '0.88rem', opacity: 0.75, marginBottom: 10 }}>✓ Leads sin límite mientras dure el lanzamiento</li>
            <li style={{ fontSize: '0.88rem', opacity: 0.75, marginBottom: 10 }}>✓ Panel para ver y gestionar tus solicitudes</li>
            <li style={{ fontSize: '0.88rem', opacity: 0.75 }}>✓ Notificación por correo de cada solicitud nueva</li>
          </ul>
        </div>

        <div className="cat-card" style={{ opacity: 0.7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Plan por Lead</h3>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, opacity: 0.6 }}>Próximamente</span>
          </div>
          <p style={{ fontSize: '1rem', opacity: 0.6, margin: '14px 0' }}>Aún no está activo</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ fontSize: '0.88rem', opacity: 0.6, marginBottom: 10 }}>Pagas solo por los contactos que decides aceptar</li>
            <li style={{ fontSize: '0.88rem', opacity: 0.6, marginBottom: 10 }}>Tú defines un tope semanal de gasto</li>
            <li style={{ fontSize: '0.88rem', opacity: 0.6, marginBottom: 10 }}>Se avisará con anticipación antes de activarlo</li>
            <li style={{ fontSize: '0.88rem', opacity: 0.6 }}>Los talleres que ya estén registrados no serán sorprendidos con cobros</li>
          </ul>
        </div>
      </div>

      <p style={{ marginTop: 32, fontSize: '0.85rem', opacity: 0.6 }}>
        ¿Preguntas sobre cómo va a funcionar el cobro cuando se active? Revisa
        nuestros <a href="/terminos">Términos y Condiciones</a> o escríbenos.
      </p>
    </main>
  );
}
