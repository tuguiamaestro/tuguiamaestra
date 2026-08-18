'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function SolicitarPage() {
  return (
    <Suspense fallback={<main className="wrap"><p>Cargando…</p></main>}>
      <SolicitarContent />
    </Suspense>
  );
}

function SolicitarContent() {
  const searchParams = useSearchParams();
  const tallerIdDirecto = searchParams.get('taller');

  const [categorias, setCategorias] = useState([]);
  const [tallerDirecto, setTallerDirecto] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const [form, setForm] = useState({
    categoria_id: '',
    comuna: 'Providencia',
    descripcion: '',
    urgencia: 'Lo antes posible',
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_email: '',
  });

  useEffect(() => {
    async function cargarCategorias() {
      const { data } = await supabase.from('categorias').select('*').order('nombre');
      if (data) {
        setCategorias(data);
        setForm((f) => ({ ...f, categoria_id: data[0]?.id || '' }));
      }
    }
    cargarCategorias();

    if (tallerIdDirecto) {
      supabase
        .from('talleres')
        .select('id, nombre')
        .eq('id', tallerIdDirecto)
        .single()
        .then(({ data }) => setTallerDirecto(data || null));
    }
  }, [tallerIdDirecto]);

  function actualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function enviarSolicitud(e) {
    e.preventDefault();
    setError(null);

    if (!form.cliente_nombre || !form.cliente_telefono) {
      setError('Ingresa al menos tu nombre y teléfono.');
      return;
    }

    setEnviando(true);
    const { error: insertError } = await supabase
      .from('solicitudes')
      .insert([{ ...form, taller_id_directo: tallerIdDirecto || null }]);
    setEnviando(false);

    if (insertError) {
      setError('No se pudo enviar: ' + insertError.message);
      return;
    }

    setEnviado(true);
  }

  if (enviado) {
    return (
      <main className="wrap">
        <h1>✓ Solicitud enviada</h1>
        <p>
          Quedó guardada en tu base de datos real de Supabase (tabla{' '}
          <code>solicitudes</code>). En el sitio final, esto es lo que
          dispara el matching hacia los talleres correspondientes.
        </p>
        <a href="/">← Volver al inicio</a>
      </main>
    );
  }

  return (
    <main className="wrap">
      <h1>Pedir presupuesto</h1>
      {tallerDirecto && (
        <p className="status-ok">
          Esta solicitud se enviará directo a <strong>{tallerDirecto.nombre}</strong>.
        </p>
      )}
      <p>Este formulario escribe directo en tu base de datos de Supabase.</p>

      <form onSubmit={enviarSolicitud} style={{ maxWidth: 480, marginTop: 24 }}>
        <div className="field">
          <label>Categoría</label>
          <select
            value={form.categoria_id}
            onChange={(e) => actualizarCampo('categoria_id', e.target.value)}
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Comuna</label>
          <select
            value={form.comuna}
            onChange={(e) => actualizarCampo('comuna', e.target.value)}
          >
            {['Providencia', 'Ñuñoa', 'Las Condes', 'Maipú', 'San Miguel', 'Otra'].map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )
            )}
          </select>
        </div>

        <div className="field">
          <label>Describe tu proyecto</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => actualizarCampo('descripcion', e.target.value)}
            placeholder="Ej: Cocina en L de 3x2,5m, melamina blanca…"
          />
        </div>

        <div className="field">
          <label>Nombre</label>
          <input
            type="text"
            value={form.cliente_nombre}
            onChange={(e) => actualizarCampo('cliente_nombre', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Teléfono</label>
          <input
            type="text"
            value={form.cliente_telefono}
            onChange={(e) => actualizarCampo('cliente_telefono', e.target.value)}
            placeholder="+56 9 …"
          />
        </div>

        <div className="field">
          <label>Correo (opcional)</label>
          <input
            type="email"
            value={form.cliente_email}
            onChange={(e) => actualizarCampo('cliente_email', e.target.value)}
          />
        </div>

        {error && <p className="status-error">{error}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar solicitud'}
        </button>
      </form>
    </main>
  );
}
