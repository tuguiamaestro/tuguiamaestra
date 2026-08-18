'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user || null);

      if (userData.user) {
        const { data: perfilData } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', userData.user.id)
          .single();
        setPerfil(perfilData || null);
      }
      setCargando(false);
    }
    cargar();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      cargar();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (cargando) return <main className="wrap"><p>Cargando…</p></main>;

  if (!user) return <LoginForm />;

  if (!perfil || perfil.rol !== 'admin') {
    return (
      <main className="wrap">
        <h1>Panel admin</h1>
        <p className="status-error">
          Tu cuenta ({user.email}) no tiene rol de administrador todavía.
        </p>
        <p>
          Para convertirte en admin, ve a Supabase → SQL Editor y ejecuta
          (reemplazando por tu correo):
        </p>
        <pre style={{ background: '#fff', padding: 12, border: '1px solid var(--line)', overflowX: 'auto' }}>
{`update perfiles set rol = 'admin'
where id = (select id from auth.users where email = '${user.email}');`}
        </pre>
        <p>Luego recarga esta página.</p>
      </main>
    );
  }

  return <PanelAdmin adminEmail={user.email} />;
}

/* ---------------- Login simple ---------------- */
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
    <main className="wrap">
      <h1>Panel admin</h1>
      <p>Inicia sesión con tu cuenta de administrador.</p>
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
        ¿No tienes cuenta todavía? Créala primero en{' '}
        <a href="/registro">/registro</a>, y luego vuelve aquí para
        convertirte en admin.
      </p>
    </main>
  );
}

/* ---------------- Panel una vez confirmado el rol admin ---------------- */
function PanelAdmin({ adminEmail }) {
  const [pendientes, setPendientes] = useState([]);
  const [activos, setActivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  async function cargarTalleres() {
    setCargando(true);
    const { data: pend } = await supabase
      .from('talleres')
      .select('*')
      .eq('estado', 'pendiente')
      .order('creado_en', { ascending: false });
    const { data: act } = await supabase
      .from('talleres')
      .select('*')
      .eq('estado', 'activo')
      .order('creado_en', { ascending: false });
    setPendientes(pend || []);
    setActivos(act || []);
    setCargando(false);
  }

  useEffect(() => {
    cargarTalleres();
  }, []);

  async function aprobar(taller) {
    setMensaje(null);
    const { error } = await supabase
      .from('talleres')
      .update({ estado: 'activo', documento_estado: 'aprobado' })
      .eq('id', taller.id);
    if (error) {
      setMensaje('Error al aprobar: ' + error.message);
    } else {
      setMensaje(`✓ ${taller.nombre} fue aprobado y ya está activo.`);
      cargarTalleres();
    }
  }

  async function rechazar(taller) {
    setMensaje(null);
    const { error } = await supabase
      .from('talleres')
      .update({ estado: 'rechazado', documento_estado: 'rechazado' })
      .eq('id', taller.id);
    if (error) {
      setMensaje('Error al rechazar: ' + error.message);
    } else {
      setMensaje(`${taller.nombre} fue rechazado.`);
      cargarTalleres();
    }
  }

  return (
    <main className="wrap">
      <h1>Panel admin</h1>
      <p className="status-ok">✓ Conectado como {adminEmail}</p>

      {mensaje && <p style={{ fontWeight: 600 }}>{mensaje}</p>}

      <h2 style={{ marginTop: 32 }}>Pendientes de aprobar ({pendientes.length})</h2>
      {cargando && <p>Cargando…</p>}
      {!cargando && pendientes.length === 0 && <p>No hay talleres pendientes.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {pendientes.map((t) => (
          <div key={t.id} className="cat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>{t.nombre}</h3>
              <p style={{ margin: '4px 0 0' }}>{t.comuna} · RUT {t.rut}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.7 }}>{t.descripcion}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn-ghost" onClick={() => rechazar(t)}>Rechazar</button>
              <button type="button" onClick={() => aprobar(t)}>Aprobar</button>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>Talleres activos ({activos.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {activos.map((t) => (
          <div key={t.id} className="cat-card">
            <h3 style={{ margin: 0 }}>{t.nombre}</h3>
            <p style={{ margin: '4px 0 0' }}>{t.comuna} · ★ {t.rating}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
