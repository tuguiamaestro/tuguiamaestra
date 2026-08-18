import { supabase } from '../lib/supabaseClient';

export const revalidate = 0; // siempre trae datos frescos (útil mientras pruebas)

export default async function HomePage() {
  const { data: categorias, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre');

  return (
    <main className="wrap">
      <h1>TuGuíaMaestra</h1>
      <p>Directorio de mueblistas y carpinteros de confianza en Santiago.</p>
      <p><a href="/listado">→ Ver talleres (listado con filtros reales)</a></p>
      <p><a href="/solicitar">→ Pedir presupuesto (formulario conectado a Supabase)</a></p>
      <p><a href="/registro">→ Registrar mi taller (login + registro real)</a></p>
      <p><a href="/admin">→ Panel admin (aprobar talleres)</a></p>

      <h2 style={{ marginTop: 40 }}>Categorías</h2>

      {error && (
        <p className="status-error">
          No se pudo conectar a Supabase: {error.message}. Revisa que las
          variables de entorno NEXT_PUBLIC_SUPABASE_URL y
          NEXT_PUBLIC_SUPABASE_ANON_KEY estén bien puestas.
        </p>
      )}

      {!error && categorias?.length > 0 && (
        <>
          <p className="status-ok">
            ✓ Conectado a Supabase — mostrando {categorias.length} categorías reales de tu base de datos.
          </p>
          <div className="cat-grid">
            {categorias.map((c) => (
              <div className="cat-card" key={c.id}>
                <div className="icon">{c.icono}</div>
                <h3>{c.nombre}</h3>
                <p>
                  ${c.precio_min?.toLocaleString('es-CL')} – $
                  {c.precio_max?.toLocaleString('es-CL')}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {!error && categorias?.length === 0 && (
        <p>No hay categorías en la base de datos todavía.</p>
      )}
    </main>
  );
}
