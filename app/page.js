import { supabase } from '../lib/supabaseClient';

export const revalidate = 0;

export default async function HomePage() {
  const { data: categorias, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre');

  const texturas = ['tex-1', 'tex-2', 'tex-3', 'tex-4', 'tex-5', 'tex-6'];

  return (
    <main>
      <section className="hero wrap">
        <div>
          <div className="eyebrow">Directorio de oficio, no de anuncios</div>
          <h1>Encuentra al maestro justo para tu mueble</h1>
          <p className="lead">
            Conectamos a personas que necesitan muebles a medida —cocinas, closets,
            baños— con talleres y carpinteros verificados de Santiago. Pides
            presupuesto una vez y responden los que de verdad calzan.
          </p>
          <form action="/listado" method="get" className="search-box">
            <input type="text" name="q" placeholder="¿Qué necesitas? Ej: cocina, closet, restauración…" />
            <button type="submit" className="btn-brass">Buscar</button>
          </form>
        </div>
        <div className="hero-visual">
          <div className="grain-card a">
            <img src="/images/hero-cocina.jpg" alt="Cocina a medida terminada" className="photo" />
          </div>
          <div className="grain-card b">
            <img src="/images/hero-closet.jpg" alt="Closet a medida" className="photo" style={{ position: 'absolute', inset: 0 }} />
            <div className="tag">ROBLE · 4.8 ★<br />Talleres verificados</div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
        <h2>Categorías</h2>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Elige por tipo de mueble.</p>

        {error && (
          <p className="status-error">
            No se pudo conectar a Supabase: {error.message}
          </p>
        )}

        {!error && categorias?.length > 0 && (
          <div className="swatch-grid">
            {categorias.map((c, i) => (
              <a key={c.id} href={`/listado?categoria=${c.id}`} className="swatch">
                <div className={`grain wood-tex ${texturas[i % texturas.length]}`}></div>
                <div className="info">
                  <div className="name">{c.icono} {c.nombre}</div>
                  <div className="count">
                    ${c.precio_min?.toLocaleString('es-CL')} – ${c.precio_max?.toLocaleString('es-CL')}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
