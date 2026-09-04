'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import CategoriaIcon from '../components/CategoriaIcon';

export default function RegistroPage() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
      if (data.user) {
        const { data: perfilData } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
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
            <h1>Registrar mi taller</h1>
            <LoginForm />
          </div>
          <div className="auth-side">
            <div className="auth-side-photo">
              <img src="/images/categoria-general.jpg" alt="Taller de carpintería" className="photo" />
            </div>
            <h3>¿Por qué unirte a TuGuíaMaestra?</h3>
            <ul className="auth-benefits">
              <li>Recibe solicitudes reales de clientes en tu comuna, sin salir a buscarlos.</li>
              <li>Gratis mientras estamos en lanzamiento — no pagas nada por estar en el directorio.</li>
              <li>Tú decides qué solicitudes aceptar, con el contacto oculto hasta que confirmes.</li>
              <li>Aumenta tu visibilidad frente a talleres que solo dependen del boca a boca.</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  // Ya tiene sesión iniciada Y ya registró un taller antes — lo mandamos
  // a su panel en vez de mostrarle el formulario de registro de nuevo
  // (evita que registre un segundo taller por error).
  if (perfil?.taller_id) {
    return (
      <main className="wrap">
        <h1>Ya tienes un taller registrado</h1>
        <p style={{ opacity: 0.7, maxWidth: '48ch' }}>
          Esta cuenta ({user.email}) ya tiene un taller asociado. Ve a tu
          panel para revisar tus solicitudes y el estado de tu perfil.
        </p>
        <a href="/panel"><button type="button" style={{ marginTop: 12 }}>Ir a mi panel →</button></a>
      </main>
    );
  }

  return (
    <main className="wrap">
      <h1>Registrar mi taller</h1>
      <TallerForm user={user} />
    </main>
  );
}

function LoginForm() {
  const [modo, setModo] = useState('signup');
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
      if (!data.session) setMensaje('Cuenta creada. Revisa tu correo para confirmar antes de continuar.');
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setCargando(false);
      if (err) return setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <p>Primero crea tu cuenta (o inicia sesión si ya la tienes).</p>
      <div className="chip-row" style={{ marginBottom: 16 }}>
        <div className={`chip ${modo === 'signup' ? 'selected' : ''}`} onClick={() => setModo('signup')}>Crear cuenta</div>
        <div className={`chip ${modo === 'login' ? 'selected' : ''}`} onClick={() => setModo('login')}>Iniciar sesión</div>
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

function TallerForm({ user }) {
  const [categorias, setCategorias] = useState([]);
  const [catsSeleccionadas, setCatsSeleccionadas] = useState([]);
  const [comunasSeleccionadas, setComunasSeleccionadas] = useState([]);
  const [documento, setDocumento] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const [form, setForm] = useState({ nombre: '', rut: '', comuna: 'Providencia', descripcion: '' });
  const comunasDisponibles = ['Providencia', 'Ñuñoa', 'Las Condes', 'Maipú', 'San Miguel', 'Otra'];

  useEffect(() => {
    supabase.from('categorias').select('*').order('nombre').then(({ data }) => {
      if (data) setCategorias(data);
    });
  }, []);

  function toggleCat(id) {
    setCatsSeleccionadas((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }
  function toggleComuna(c) {
    setComunasSeleccionadas((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  }

  async function registrarTaller(e) {
    e.preventDefault();
    setError(null);

    if (!form.nombre || !form.rut) return setError('El nombre del taller y el RUT son obligatorios.');
    if (catsSeleccionadas.length === 0) return setError('Elige al menos una especialidad.');
    if (!documento) return setError('Sube tu documento de verificación (Inicio de Actividades o cédula).');

    setEnviando(true);

    const { data: taller, error: errTaller } = await supabase
      .from('talleres')
      .insert([{ ...form, owner_id: user.id, email: user.email, estado: 'pendiente' }])
      .select()
      .single();

    if (errTaller) {
      setEnviando(false);
      return setError('No se pudo registrar: ' + errTaller.message);
    }

    const extension = documento.name.split('.').pop();
    const rutaArchivo = `${taller.id}/documento.${extension}`;
    const { error: errUpload } = await supabase.storage
      .from('documentos-talleres')
      .upload(rutaArchivo, documento, { upsert: true });

    if (errUpload) {
      setEnviando(false);
      return setError('El taller se creó, pero no se pudo subir el documento: ' + errUpload.message);
    }

    await supabase.from('talleres').update({ documento_verificacion_url: rutaArchivo, documento_estado: 'pendiente' }).eq('id', taller.id);

    const { error: errCats } = await supabase.from('talleres_categorias').insert(
      catsSeleccionadas.map((categoria_id) => ({ taller_id: taller.id, categoria_id }))
    );
    if (errCats) {
      setEnviando(false);
      return setError('El taller se creó, pero no se pudieron guardar las especialidades: ' + errCats.message);
    }

    if (comunasSeleccionadas.length > 0) {
      const { error: errComunas } = await supabase.from('talleres_comunas').insert(
        comunasSeleccionadas.map((comuna) => ({ taller_id: taller.id, comuna }))
      );
      if (errComunas) {
        setEnviando(false);
        return setError('El taller se creó, pero no se pudieron guardar las comunas: ' + errComunas.message);
      }
    }

    const { data: perfilActual } = await supabase.from('perfiles').select('rol').eq('id', user.id).single();
    const nuevoRol = perfilActual?.rol === 'admin' ? 'admin' : 'taller';

    await supabase.from('perfiles').update({ rol: nuevoRol, taller_id: taller.id, nombre: form.nombre }).eq('id', user.id);

    fetch('/api/notificar-taller-pendiente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tallerNombre: form.nombre, comuna: form.comuna, rut: form.rut }),
    }).catch(() => {});

    setEnviando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div>
        <h2>✓ Taller registrado</h2>
        <p>Quedó guardado con estado <strong>pendiente</strong>. Un administrador revisará tu documento antes de activar tu perfil.</p>
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
          <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        </div>
        <div className="field">
          <label>RUT / Inicio de actividades</label>
          <input type="text" value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} />
        </div>
        <div className="field">
          <label>Comuna base</label>
          <select value={form.comuna} onChange={(e) => setForm({ ...form, comuna: e.target.value })}>
            {comunasDisponibles.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
        </div>

        <div className="field">
          <label>Documento de verificación (Inicio de Actividades SII o cédula)</label>
          <input type="file" accept="image/*,.pdf" onChange={(e) => setDocumento(e.target.files[0] || null)} />
          <p style={{ fontSize: '0.78rem', opacity: 0.65, marginTop: 6 }}>
            No se publica tu perfil hasta que revisemos este documento. Solo lo ve un administrador.
          </p>
        </div>

        <div className="field">
          <label>Especialidades</label>
          <div className="opt-grid">
            {categorias.map((c) => (
              <div key={c.id} className={`opt-card ${catsSeleccionadas.includes(c.id) ? 'selected' : ''}`} onClick={() => toggleCat(c.id)}>
                <span className="oicon"><CategoriaIcon nombre={c.nombre} /></span>
                <span className="oname">{c.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Zonas de cobertura</label>
          <div className="chip-row">
            {comunasDisponibles.map((c) => (
              <div key={c} className={`chip ${comunasSeleccionadas.includes(c) ? 'selected' : ''}`} onClick={() => toggleComuna(c)}>
                {c}
              </div>
            ))}
          </div>
        </div>

        {error && <p className="status-error">{error}</p>}

        <button type="submit" disabled={enviando}>{enviando ? 'Registrando…' : 'Registrar taller'}</button>
      </form>
    </div>
  );
}
