'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function ListadoPage() {
  return (
    <Suspense fallback={<main className="wrap"><p>Cargando…</p></main>}>
      <ListadoContent />
    </Suspense>
  );
}

function ListadoContent() {
  const searchParams = useSearchParams();

  const [categorias, setCategorias] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [catSeleccionada, setCatSeleccionada] = useState(searchParams.get('categoria') || '');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState(searchParams.get('q') || '');

  const comunasDisponibles = ['Providencia', 'Ñuñoa', 'Las Condes', 'Maipú', 'San Miguel', 'Otra'];

  useEffect(() => {
    supabase.from('categorias').select('*').order('nombre').then(({ data }) => {
      if (data) setCategorias(data);
    });
    cargarTalleres();
  }, []);

  async function cargarTalleres() {
    setCargando(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('talleres')
      .select('*, talleres_categorias(categoria_id)')
      .eq('estado', 'activo')
      .order('destacado', { ascending: false })
      .order('rating', { ascending: false });

    if (err) {
      setError(err.message);
      setCargando(false);
      return;
    }

    setTalleres(data || []);
    setCargando(false);
  }

  const talleresFiltrados = talleres.filter((t) => {
    const especialidades = t.talleres_categorias?.map((tc) => tc.categoria_id) || [];
    const coincideCategoria = !catSeleccionada || especialidades.includes(catSeleccionada);
    const coincideComuna = !comunaSeleccionada || t.comuna === comunaSeleccionada;
    const coincideBusqueda = !busqueda || t.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideComuna && coincideBusqueda;
  });

  return (
    <main className="wrap">
      <div className="eyebrow">Directorio</div>
      <h1 style={{ marginTop: 10 }}>Mueblistas y carpinteros en Santiago</h1>

      <div className="search-box" style={{ maxWidth: 460, margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="listado-layout">
        <aside className="filters">
          <div className="filter-group">
            <span className="flabel">Especialidad</span>
            <label className="filter-opt">
              <input type="radio" name="cat" checked={catSeleccionada === ''} onChange={() => setCatSeleccionada('')} />
              Todas
            </label>
            {categorias.map((c) => (
              <label key={c.id} className="filter-opt">
                <input
                  type="radio"
                  name="cat"
                  checked={catSeleccionada === c.id}
                  onChange={() => setCatSeleccionada(c.id)}
                />
                {c.nombre}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <span className="flabel">Comuna</span>
            <label className="filter-opt">
              <input type="radio" name="comuna" checked={comunaSeleccionada === ''} onChange={() => setComunaSeleccionada('')} />
              Todas
            </label>
            {comunasDisponibles.map((c) => (
              <label key={c} className="filter-opt">
                <input
                  type="radio"
                  name="comuna"
                  checked={comunaSeleccionada === c}
                  onChange={() => setComunaSeleccionada(c)}
                />
                {c}
              </label>
            ))}
          </div>
        </aside>

        <div>
          <div className="results-count">
            {talleresFiltrados.length} TALLER{talleresFiltrados.length === 1 ? '' : 'ES'} ENCONTRADO{talleresFiltrados.length === 1 ? '' : 'S'}
          </div>

          {error && <p className="status-error">No se pudo cargar el listado: {error}</p>}
          {cargando && <p>Cargando talleres…</p>}
          {!cargando && !error && talleresFiltrados.length === 0 && (
            <p>No hay talleres que calcen con esos filtros todavía.</p>
          )}

          <div className="pro-grid">
            {talleresFiltrados.map((t) => (
              <a href={`/solicitar?taller=${t.id}`} className="pro-card" key={t.id}>
                <div className={`cover wood-tex ${t.tex || 'tex-1'}`}>
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
        </div>
      </div>
    </main>
  );
}
