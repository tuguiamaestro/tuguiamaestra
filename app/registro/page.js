'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function RegistroPage() {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      setCargando(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (cargando) return <main className="wrap"><p>Cargando…</p></main>;

  return (
    <main className="wrap">
      <h1>Registrar mi taller</h1>
      {!user ? <LoginForm /> : <TallerForm user={user} />}
    </main>
  );
}

/* ---------------- Paso 1: crear cuenta / iniciar sesión ---------------- */
function LoginForm() {
  const [modo, setModo] = useState('signup'); // 'signup' | 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setError(null);
    setMensaje(null);
    setCargando(true);

    if (modo === 'signup') {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      setCargando(false);
      if (err) return setError(err.message);
      if (!data.session) {
        setMensaje('Cuenta creada. Revisa tu correo para confirmar antes de continuar.');
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setCargando(false);
      if (err) return setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <p>Primero crea tu cuenta (o inicia sesión si ya la tienes).</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button type="button" onClick={() => setModo('signup')} style={{ fontWeight: modo === 'signup' ? 700 : 400 }}>
          Crear cuenta
        </button>
        <button type="button" onClick={() => setModo('login')} style={{ fontWeight: modo === 'login' ? 700 : 400 }}>
          Iniciar sesión
        </button>
      </div>
      <form onSubmit={enviar}>
        <div className="field">
          <label>Correo</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        {error && <p className="status-error">{error}</p>}
        {mensaje && <p className="status-ok">{mensaje}</p>}
        <button type="submit" disabled={cargando}>
          {cargando ? 'Un momento…' : modo === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}

/* ---------------- Paso 2: datos del taller (ya con sesión activa) ---------------- */
function TallerForm({ user }) {
  const [categorias, setCategorias] = useState([]);
  const [catsSeleccionadas, setCatsSeleccionadas] = useState([]);
  const [comunasSeleccionadas, setComunasSeleccionadas] = useState([]);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    comuna: 'Providencia',
    descripcion: '',
  });

  const comunasDisponibles = ['Providencia', 'Ñuñoa', 'Las Condes', 'Maipú', 'San Miguel', 'Otra'];

  useEffect(() => {
    supabase.from('categorias').select('*').order('nombre').then(({ data }) => {
      if (data) setCategorias(data);
    });
  }, []);

  function toggleCat(id) {
    setCatsSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }
  function toggleComuna(c) {
    setComunasSeleccionadas((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  async function registrarTaller(e) {
    e.preventDefault();
    setError(null);

    if (!form.nombre || !form.rut) {
      setError('El nombre del taller y el RUT son obligatorios.');
      return;
    }
    if (catsSeleccionadas.length === 0) {
      setError('Elige al menos una especialidad.');
      return;
    }

    setEnviando(true);

    // 1. Crear el taller
    const { data: taller, error: errTaller } = await supabase
      .from('talleres')
      .insert([{ ...form, owner_id: user.id, estado: 'pendiente' }])
      .select()
      .single();

    if (errTaller) {
      setEnviando(false);
      setError('No se pudo registrar: ' + errTaller.message);
      return;
    }

    // 2. Guardar especialidades y comunas de cobertura
    const { error: errCats } = await supabase.from('talleres_categorias').insert(
      catsSeleccionadas.map((categoria_id) => ({ taller_id: taller.id, categoria_id }))
    );
    if (errCats) {
      setEnviando(false);
      setError('El taller se creó, pero no se pudieron guardar las especialidades: ' + errCats.message);
      return;
    }

    if (comunasSeleccionadas.length > 0) {
      const { error: errComunas } = await supabase.from('talleres_comunas').insert(
        comunasSeleccionadas.map((comuna) => ({ taller_id: taller.id, comuna }))
      );
      if (errComunas) {
        setEnviando(false);
        setError('El taller se creó, pero no se pudieron guardar las comunas de cobertura: ' + errComunas.message);
        return;
      }
    }

    // 3. Actualizar el perfil del usuario — vincula el taller, pero
    //    nunca le quita el rol 'admin' si ya lo tenía (evita que un
    //    admin pierda su rol por registrar un taller con la misma cuenta)
    const { data: perfilActual } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    const nuevoRol = perfilActual?.rol === 'admin' ? 'admin' : 'taller';

    await supabase
      .from('perfiles')
      .update({ rol: nuevoRol, taller_id: taller.id, nombre: form.nombre })
      .eq('id', user.id);

    setEnviando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div>
        <h2>✓ Taller registrado</h2>
        <p>
          Quedó guardado en la tabla <code>talleres</code> con estado{' '}
          <strong>pendiente</strong>. Revísalo en Supabase → Table Editor →
          talleres.
        </p>
        <a href="/">← Volver al inicio</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <p className="status-ok">✓ Sesión iniciada como {user.email}</p>
      <form onSubmit={registrarTaller}>
        <div className="field">
          <label>Nombre del taller</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>
        <div className="field">
          <label>RUT / Inicio de actividades</label>
          <input
            type="text"
            value={form.rut}
            onChange={(e) => setForm({ ...form, rut: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Comuna base</label>
          <select
            value={form.comuna}
            onChange={(e) => setForm({ ...form, comuna: e.target.value })}
          >
            {comunasDisponibles.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Especialidades</label>
          {categorias.map((c) => (
            <label key={c.id} style={{ display: 'block', fontWeight: 400, marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={catsSeleccionadas.includes(c.id)}
                onChange={() => toggleCat(c.id)}
                style={{ width: 'auto', marginRight: 8 }}
              />
              {c.icono} {c.nombre}
            </label>
          ))}
        </div>

        <div className="field">
          <label>Zonas de cobertura</label>
          {comunasDisponibles.map((c) => (
            <label key={c} style={{ display: 'block', fontWeight: 400, marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={comunasSeleccionadas.includes(c)}
                onChange={() => toggleComuna(c)}
                style={{ width: 'auto', marginRight: 8 }}
              />
              {c}
            </label>
          ))}
        </div>

        {error && <p className="status-error">{error}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? 'Registrando…' : 'Registrar taller'}
        </button>
      </form>
    </div>
  );
}
