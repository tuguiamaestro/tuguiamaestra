'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PanelTallerPage() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user || null);
      if (userData.user) {
        const { data: perfilData } = await supabase.from('perfiles').select('*').eq('id', userData.user.id).single();
        setPerfil(perfilData || null);
      }
      setCargando(false);
    }
    cargar();
    const { data: listener } = supabase.auth.onAuthStateChange(() => cargar());
    return () => listener.subscription.unsubscribe();
  }, []);

  if (cargando) return <main className="wrap"><p>Cargando…</p></main>;

  if (!user) {
    return (
      <main className="wrap">
        <div className="auth-layout">
          <div>
            <h1>Panel de mi taller</h1>
            <LoginForm />
          </div>
          <div className="auth-side">
            <div className="auth-side-photo">
              <img src="/images/categoria-cocinas.jpg" alt="Panel de taller" className="photo" />
            </div>
            <h3>Tu panel, siempre a mano</h3>
            <ul className="auth-benefits">
              <li>Revisa cada solicitud que te llega, con nombre y contacto del cliente.</li>
              <li>Acepta o descarta leads con un clic, sin que se te pasen.</li>
              <li>Ve el estado de tu perfil (activo o pendiente de aprobación).</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  if (!perfil?.taller_id) {
    return (
      <main className="wrap">
        <h1>Panel de mi taller</h1>
        <p className="status-error">Esta cuenta ({user.email}) no tiene un taller registrado todavía.</p>
        <p><a href="/registro">→ Registrar mi taller</a></p>
      </main>
    );
  }

  return <PanelTaller tallerId={perfil.taller_id} userEmail={user.email} />;
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setCargando(false);
    if (err) setError(err.message);
  }

  return (
    <>
      <p>Inicia sesión con la cuenta de tu taller.</p>
      <form onSubmit={entrar} style={{ maxWidth: 380 }}>
        <div className="field">
          <label>Correo</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="status-error">{error}</p>}
        <button type="submit" disabled={cargando}>{cargando ? 'Un momento…' : 'Iniciar sesión'}</button>
      </form>
      <p style={{ marginTop: 16, fontSize: '0.85rem', opacity: 0.7 }}>
        ¿No tienes cuenta? Regístrate en <a href="/registro">/registro</a>.
      </p>
    </>
  );
}

function PanelTaller({ tallerId, userEmail }) {
  const [taller, setTaller] = useState(null);
  const [directas, setDirectas] = useState([]);
  const [leads, setLeads] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  async function cargarTodo() {
    setCargando(true);
    const { data: tallerData } = await supabase.from('talleres').select('*').eq('id', tallerId).single();
    setTaller(tallerData || null);

    const { data: directasData } = await supabase.from('solicitudes').select('*').eq('taller_id_directo', tallerId).order('creado_en', { ascending: false });
    setDirectas(directasData || []);

    const { data: leadsData } = await supabase.from('leads').select('*, solicitudes(*)').eq('taller_id', tallerId).order('creado_en', { ascending: false });
    setLeads(leadsData || []);
    setCargando(false);
  }

  useEffect(() => { cargarTodo(); }, [tallerId]);

  async function actualizarLead(leadId, estado) {
    setMensaje(null);
    const { error } = await supabase.from('leads').update({ estado }).eq('id', leadId);
    if (error) setMensaje('Error: ' + error.message);
    else { setMensaje(estado === 'aceptado' ? '✓ Lead aceptado.' : 'Lead descartado.'); cargarTodo(); }
  }

  if (cargando) return <main className="wrap"><p>Cargando…</p></main>;

  return (
    <main className="wrap">
      <h1>{taller?.nombre || 'Mi taller'}</h1>
      <p className="status-ok">✓ Sesión: {userEmail} · Estado del taller: {taller?.estado}</p>
      {taller?.estado === 'pendiente' && (
        <p className="status-error">Tu taller está pendiente de aprobación — no aparece en el listado público todavía.</p>
      )}

      {mensaje && <p style={{ fontWeight: 600 }}>{mensaje}</p>}

      <h2 style={{ marginTop: 32 }}>Solicitudes directas a tu perfil ({directas.length})</h2>
      {directas.length === 0 && <p>Todavía no tienes solicitudes directas.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {directas.map((s) => (
          <div key={s.id} className="cat-card">
            <h3 style={{ margin: 0 }}>{s.categoria_id} · {s.comuna}</h3>
            <p style={{ margin: '4px 0 0' }}>{s.descripcion}</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
              <strong>{s.cliente_nombre}</strong> · {s.cliente_telefono} · {s.cliente_email || 'sin correo'}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>Leads asignados por matching ({leads.length})</h2>
      {leads.length === 0 && <p>No tienes leads asignados todavía.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {leads.map((l) => (
          <div key={l.id} className="cat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>{l.solicitudes?.categoria_id} · {l.solicitudes?.comuna}</h3>
              <p style={{ margin: '4px 0 0' }}>{l.solicitudes?.descripcion}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Estado: {l.estado}</p>
              {l.estado === 'aceptado' && (
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
                  <strong>{l.solicitudes?.cliente_nombre}</strong> · {l.solicitudes?.cliente_telefono}
                </p>
              )}
            </div>
            {l.estado === 'nuevo' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn-ghost" onClick={() => actualizarLead(l.id, 'descartado')}>Descartar</button>
                <button type="button" onClick={() => actualizarLead(l.id, 'aceptado')}>Ver contacto</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
