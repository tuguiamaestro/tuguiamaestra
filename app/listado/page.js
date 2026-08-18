'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ListadoPage() {
  const [categorias, setCategorias] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [catSeleccionada, setCatSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');

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

    // Trae los talleres activos junto con sus especialidades (join)
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
    const coincideBusqueda =
      !busqueda || t.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideComuna && coincideBusqueda;
  });

  return (
    <main className="wrap">
      <h1>Mueblistas y carpinteros</h1>
      <p>Talleres verificados y activos en tu zona.</p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
        />
        <select value={catSeleccionada} onChange={(e) => setCatSeleccionada(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <select value={comunaSeleccionada} onChange={(e) => setComunaSeleccionada(e.target.value)}>
          <option value="">Todas las comunas</option>
          {comunasDisponibles.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="status-error">No se pudo cargar el listado: {error}</p>
      )}

      {cargando && <p>Cargando talleres…</p>}

      {!cargando && !error && talleresFiltrados.length === 0 && (
        <p>No hay talleres que calcen con esos filtros todavía.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {talleresFiltrados.map((t) => (
          <div key={t.id} className="cat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>
                {t.nombre} {t.destacado && <span style={{ fontSize: '0.7rem', background: 'var(--brass)', padding: '2px 8px', borderRadius: 20, marginLeft: 8 }}>Destacado</span>}
              </h3>
              <p style={{ margin: '4px 0 0' }}>{t.comuna} · ★ {t.rating || 0} ({t.cantidad_resenas || 0} reseñas)</p>
              {t.descripcion && <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.75 }}>{t.descripcion}</p>}
            </div>
            <a href={`/solicitar?taller=${t.id}`}>
              <button type="button">Pedir presupuesto</button>
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
