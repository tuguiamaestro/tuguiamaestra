import { supabase } from '../lib/supabaseClient';
import CategoriaIcon from './components/CategoriaIcon';

export const revalidate = 0;

export default async function HomePage() {
  const { data: categorias, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre');

  const { data: talleresDestacados } = await supabase
    .from('talleres')
    .select('*')
    .eq('estado', 'activo')
    .order('destacado', { ascending: false })
    .order('rating', { ascending: false })
    .limit(3);

  const texturas = ['tex-1', 'tex-2', 'tex-3', 'tex-4', 'tex-5', 'tex-6'];

  // Fotos reales por categoría (conectadas por NOMBRE, no por id,
  // para evitar problemas si el id interno no coincide como se espera).
  const fotosCategoria = {
    'Cocinas': '/images/categoria-cocinas.jpg',
    'Closets': '/images/categoria-closets.jpg',
    'Baños / Vanitorios': '/images/categoria-banos.jpg',
    'Repisas': '/images/categoria-repisas.jpg',
    'Restauración': '/images/categoria-restauracion.jpg',
    'Carpintería general': '/images/categoria-general.jpg',
  };

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
                <div className={`grain ${!fotosCategoria[c.nombre] ? `wood-tex ${texturas[i % texturas.length]}` : ''}`}>
                  {fotosCategoria[c.nombre] && (
                    <img src={fotosCategoria[c.nombre]} alt={c.nombre} className="photo" />
                  )}
                </div>
                <div className="info">
                  <div className="name"><CategoriaIcon nombre={c.nombre} /> {c.nombre}</div>
                  <div className="count">
                    ${c.precio_min?.toLocaleString('es-CL')} – ${c.precio_max?.toLocaleString('es-CL')}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="wrap" style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
        <h2>Cómo funciona</h2>
        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: 8 }}>Tres pasos, sin vueltas.</p>
        <div className="steps-grid">
          <div className="step-item">
            <div className="step-number">1</div>
            <h3>Cuéntanos qué necesitas</h3>
            <p>Describe tu proyecto y tu comuna en el formulario, toma 2 minutos.</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h3>Responden los que calzan</h3>
            <p>Solo te contactan talleres verificados que trabajan tu categoría en tu zona.</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h3>Compara y elige</h3>
            <p>Revisa precios, reseñas y trabajos anteriores antes de decidir.</p>
          </div>
        </div>
      </section>

      {talleresDestacados?.length > 0 && (
        <section className="wrap" style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
          <h2>Talleres destacados</h2>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: 8 }}>
            Con mejor calificación este mes.
          </p>
          <div className="pro-grid">
            {talleresDestacados.map((t) => (
              <a href={`/solicitar?taller=${t.id}`} className="pro-card" key={t.id}>
                <div className="cover">
                  {t.destacado && <div className="badge">Destacado</div>}
                </div>
                <div className="body">
                  <h4>{t.nombre}</h4>
                  <div className="stars">★ {t.rating || 0} ({t.cantidad_resenas || 0} reseñas)</div>
                  <p className="specialty">{t.descripcion}</p>
                  <div className="meta">
                    <span>{t.comuna}</span>
                    <span>Pedir presupuesto →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="wrap" style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
        <div className="cta-section">
          <div>
            <h2 style={{ marginBottom: 8 }}>¿Necesitas un mueble a medida?</h2>
            <p style={{ opacity: 0.65, maxWidth: '42ch', margin: 0 }}>
              Cuéntanos qué necesitas en 2 minutos y te contactan los talleres
              que de verdad calzan con tu proyecto. Es gratis.
            </p>
          </div>
          <a href="/solicitar">
            <button type="button" style={{ padding: '16px 32px', fontSize: '1rem' }}>
              Pedir presupuesto →
            </button>
          </a>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 0, paddingBottom: 64 }}>
        <div className="cta-section" style={{ background: 'var(--ink)', color: 'var(--white)' }}>
          <div>
            <h2 style={{ marginBottom: 8, color: 'var(--white)' }}>¿Tienes un taller de muebles?</h2>
            <p style={{ opacity: 0.75, maxWidth: '42ch', margin: 0 }}>
              Súmate al directorio y recibe solicitudes de clientes reales en
              tu comuna. Gratis mientras estamos en lanzamiento.
            </p>
          </div>
          <a href="/registro">
            <button type="button" className="btn-brass" style={{ padding: '16px 32px', fontSize: '1rem' }}>
              Registrar mi taller →
            </button>
          </a>
        </div>
      </section>
    </main>
  );
}
