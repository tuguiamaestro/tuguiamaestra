export default function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 60 }}>
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 40, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div className="logo" style={{ marginBottom: 10 }}>
            <img src="/images/logo-icon.png" alt="TuGuíaMaestra" width="22" height="22" style={{ objectFit: 'contain' }} />
            TuGuíaMaestra
          </div>
          <p style={{ fontSize: '0.82rem', opacity: 0.55, maxWidth: '30ch', margin: 0 }}>
            Directorio de mueblistas y carpinteros de confianza en Santiago.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.45, fontWeight: 700, marginBottom: 12 }}>Legal</div>
            <a href="/privacidad" style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: 8 }}>Política de Privacidad</a>
            <a href="/terminos" style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7 }}>Términos y Condiciones</a>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.45, fontWeight: 700, marginBottom: 12 }}>Talleres</div>
            <a href="/planes" style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: 8 }}>Planes</a>
            <a href="/registro" style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7 }}>Registrar mi taller</a>
          </div>
        </div>
      </div>
      <div className="wrap" style={{ borderTop: '1px solid var(--line)', paddingTop: 20, paddingBottom: 20, fontSize: '0.78rem', opacity: 0.5 }}>
        © {new Date().getFullYear()} TuGuíaMaestra — Santiago, Chile
      </div>
    </footer>
  );
}
