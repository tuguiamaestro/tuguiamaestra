'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import CategoriaIcon from '../components/CategoriaIcon';

const comunasDisponibles = ['Providencia', 'Ñuñoa', 'Las Condes', 'Maipú', 'San Miguel', 'Otra'];
const urgencias = ['Lo antes posible', 'En 1 mes', 'Aún explorando'];

export default function SolicitarPage() {
  return (
    <Suspense fallback={<main className="wrap"><p>Cargando…</p></main>}>
      <SolicitarWizard />
    </Suspense>
  );
}

function SolicitarWizard() {
  const searchParams = useSearchParams();
  const tallerIdDirecto = searchParams.get('taller');

  const [paso, setPaso] = useState(1);
  const totalPasos = 4;

  const [categorias, setCategorias] = useState([]);
  const [tallerDirecto, setTallerDirecto] = useState(null);

  const [form, setForm] = useState({
    categoria_id: '',
    comuna: 'Providencia',
    descripcion: '',
    urgencia: 'Lo antes posible',
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_email: '',
  });

  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [talleresNotificados, setTalleresNotificados] = useState(0);

  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [telefonoVerificado, setTelefonoVerificado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [verificando, setVerificando] = useState(false);
  const [errorVerificacion, setErrorVerificacion] = useState(null);

  useEffect(() => {
    supabase.from('categorias').select('*').order('nombre').then(({ data }) => {
      if (data) setCategorias(data);
    });
    if (tallerIdDirecto) {
      supabase.from('talleres').select('id, nombre').eq('id', tallerIdDirecto).single()
        .then(({ data }) => setTallerDirecto(data || null));
    }
  }, [tallerIdDirecto]);

  function actualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function siguiente() {
    if (paso === 1 && !form.categoria_id) {
      setError('Elige una categoría para continuar.');
      return;
    }
    setError(null);
    setPaso((p) => Math.min(p + 1, totalPasos));
  }
  function atras() {
    setError(null);
    setPaso((p) => Math.max(p - 1, 1));
  }

  async function enviarCodigo() {
    setErrorVerificacion(null);
    if (!form.cliente_telefono) {
      setErrorVerificacion('Ingresa tu teléfono primero.');
      return;
    }
    setVerificando(true);
    const res = await fetch('/api/enviar-codigo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefono: form.cliente_telefono }),
    });
    const data = await res.json();
    setVerificando(false);
    if (!res.ok) {
      setErrorVerificacion(data.error || 'No se pudo enviar el código.');
      return;
    }
    setCodigoEnviado(true);
  }

  async function verificarCodigo() {
    setErrorVerificacion(null);
    setVerificando(true);
    const res = await fetch('/api/verificar-codigo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefono: form.cliente_telefono, codigo }),
    });
    const data = await res.json();
    setVerificando(false);
    if (!res.ok || !data.verificado) {
      setErrorVerificacion(data.error || 'Código incorrecto, intenta de nuevo.');
      return;
    }
    setTelefonoVerificado(true);
  }

  async function enviarSolicitud() {
    setError(null);

    if (!form.cliente_nombre || !form.cliente_telefono) {
      setError('Ingresa al menos tu nombre y teléfono.');
      return;
    }

    setEnviando(true);

    // Generamos el ID nosotros mismos (en vez de pedirle a Supabase que
    // nos devuelva la fila con .select()) — así evitamos necesitar
    // permiso de LECTURA sobre la tabla, que por privacidad solo debe
    // tenerlo el admin (no queremos que cualquiera pueda leer teléfonos
    // y correos de otros clientes).
    const nuevaSolicitudId = crypto.randomUUID();

    const { error: insertError } = await supabase
      .from('solicitudes')
      .insert([{
        id: nuevaSolicitudId,
        ...form,
        telefono_verificado: telefonoVerificado,
        taller_id_directo: tallerIdDirecto || null,
      }]);

    if (insertError) {
      setEnviando(false);
      setError('No se pudo enviar: ' + insertError.message);
      return;
    }

    if (!tallerIdDirecto) {
      const { data: candidatos } = await supabase
        .from('talleres_categorias')
        .select('taller_id, talleres!inner(id, estado, comuna, nombre, email)')
        .eq('categoria_id', form.categoria_id)
        .eq('talleres.estado', 'activo')
        .eq('talleres.comuna', form.comuna);

      if (candidatos && candidatos.length > 0) {
        const nuevosLeads = candidatos.map((c) => ({
          solicitud_id: nuevaSolicitudId,
          taller_id: c.taller_id,
          estado: 'nuevo',
        }));
        await supabase.from('leads').insert(nuevosLeads);
        setTalleresNotificados(candidatos.length);

        candidatos.forEach((c) => {
          fetch('/api/notificar-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tallerEmail: c.talleres.email,
              tallerNombre: c.talleres.nombre,
              categoria: form.categoria_id,
              comuna: form.comuna,
              descripcion: form.descripcion,
            }),
          }).catch(() => {});
        });
      } else {
        setTalleresNotificados(0);
      }
    }

    setEnviando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <main className="wizard-shell">
        <div className="success-box">
          <div className="mark-ok">✓</div>
          <h2>Solicitud enviada</h2>
          {tallerIdDirecto ? (
            <p className="status-ok">Se envió directo a <strong>{tallerDirecto?.nombre}</strong>.</p>
          ) : talleresNotificados > 0 ? (
            <p className="status-ok">
              Se notificó a {talleresNotificados} taller{talleresNotificados === 1 ? '' : 'es'} que trabajan esa categoría en tu comuna.
            </p>
          ) : (
            <p className="status-error">
              Tu solicitud quedó guardada, pero hoy no hay ningún taller activo en esa categoría/comuna —
              puedes buscar directo en <a href="/listado">el listado</a>.
            </p>
          )}
          <a href="/"><button type="button" style={{ marginTop: 20 }}>Volver al inicio</button></a>
        </div>
      </main>
    );
  }

  const labels = ['Categoría', 'Detalles', 'Contacto', 'Resumen'];

  return (
    <main className="wizard-shell">
      <div className="wizard-head">
        <div className="eyebrow">Solicitud de presupuesto</div>
        <h1>Cuéntanos qué necesitas</h1>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(paso / totalPasos) * 100}%` }}></div>
      </div>
      <div className="progress-labels">
        {labels.map((label, i) => (
          <span key={label} className={i + 1 <= paso ? 'done' : ''}>{label}</span>
        ))}
      </div>

      {tallerDirecto && (
        <p className="status-ok" style={{ marginBottom: 20 }}>
          Esta solicitud se enviará directo a <strong>{tallerDirecto.nombre}</strong>.
        </p>
      )}

      {paso === 1 && (
        <div className="wizard-panel">
          <h2>¿Qué tipo de mueble necesitas?</h2>
          <p className="hint">Elige la categoría que más se acerca a tu proyecto.</p>
          <div className="opt-grid">
            {categorias.map((c) => (
              <div
                key={c.id}
                className={`opt-card ${form.categoria_id === c.id ? 'selected' : ''}`}
                onClick={() => actualizarCampo('categoria_id', c.id)}
              >
                <span className="oicon"><CategoriaIcon nombre={c.nombre} /></span>
                <span className="oname">{c.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {paso === 2 && (
        <div className="wizard-panel">
          <h2>Detalles del proyecto</h2>
          <p className="hint">Mientras más precisa la descripción, mejores presupuestos recibirás.</p>
          <div className="field">
            <label>Describe tu proyecto</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => actualizarCampo('descripcion', e.target.value)}
              placeholder="Ej: Cocina en L de 4x2,5 m, con isla, melamina blanca…"
            />
          </div>
          <div className="field">
            <label>Comuna</label>
            <select value={form.comuna} onChange={(e) => actualizarCampo('comuna', e.target.value)}>
              {comunasDisponibles.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>¿Cuándo te gustaría partir?</label>
            <div className="chip-row">
              {urgencias.map((u) => (
                <div
                  key={u}
                  className={`chip ${form.urgencia === u ? 'selected' : ''}`}
                  onClick={() => actualizarCampo('urgencia', u)}
                >
                  {u}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="wizard-panel">
          <h2>Tus datos de contacto</h2>
          <p className="hint">Solo los talleres que elijas responder verán tus datos.</p>
          <div className="field">
            <label>Nombre</label>
            <input type="text" value={form.cliente_nombre} onChange={(e) => actualizarCampo('cliente_nombre', e.target.value)} />
          </div>
          <div className="field">
            <label>Teléfono</label>
            <input
              type="text"
              value={form.cliente_telefono}
              onChange={(e) => {
                actualizarCampo('cliente_telefono', e.target.value);
                setTelefonoVerificado(false);
                setCodigoEnviado(false);
              }}
              placeholder="+56 9 …"
            />
          </div>
          <div className="field">
            <label>Correo (opcional)</label>
            <input type="email" value={form.cliente_email} onChange={(e) => actualizarCampo('cliente_email', e.target.value)} />
          </div>
          <div className="field">
            <label>Verificación de teléfono</label>
            {telefonoVerificado ? (
              <p className="status-ok">✓ Teléfono verificado</p>
            ) : !codigoEnviado ? (
              <button type="button" className="btn-ghost" onClick={enviarCodigo} disabled={verificando}>
                {verificando ? 'Enviando…' : 'Enviar código SMS'}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Código de 6 dígitos"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  style={{ maxWidth: 160 }}
                />
                <button type="button" className="btn-brass" onClick={verificarCodigo} disabled={verificando}>
                  {verificando ? 'Verificando…' : 'Verificar'}
                </button>
              </div>
            )}
            {errorVerificacion && <p className="status-error">{errorVerificacion}</p>}
            <p style={{ fontSize: '0.78rem', opacity: 0.65, marginTop: 6 }}>
              Opcional por ahora mientras se activa el servicio de SMS.
            </p>
          </div>
        </div>
      )}

      {paso === 4 && (
        <div className="wizard-panel">
          <h2>Revisa tu solicitud</h2>
          <p className="hint">Puedes volver atrás para editar cualquier paso.</p>
          <div className="summary-box">
            <div className="summary-row"><span className="k">Categoría</span><span className="v">{categorias.find((c) => c.id === form.categoria_id)?.nombre || '—'}</span></div>
            <div className="summary-row"><span className="k">Descripción</span><span className="v">{form.descripcion || '—'}</span></div>
            <div className="summary-row"><span className="k">Comuna</span><span className="v">{form.comuna}</span></div>
            <div className="summary-row"><span className="k">Cuándo partir</span><span className="v">{form.urgencia}</span></div>
            <div className="summary-row"><span className="k">Nombre</span><span className="v">{form.cliente_nombre || '—'}</span></div>
            <div className="summary-row"><span className="k">Contacto</span><span className="v">{form.cliente_telefono} · {form.cliente_email || 'sin correo'}</span></div>
          </div>
        </div>
      )}

      {error && <p className="status-error">{error}</p>}

      <div className="wizard-nav">
        <button type="button" className="btn-ghost" onClick={atras} style={{ visibility: paso === 1 ? 'hidden' : 'visible' }}>
          Atrás
        </button>
        {paso < totalPasos ? (
          <button type="button" onClick={siguiente}>Continuar</button>
        ) : (
          <button type="button" onClick={enviarSolicitud} disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar solicitud'}
          </button>
        )}
      </div>
    </main>
  );
}
