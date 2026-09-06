'use client';

import { useState } from 'react';

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    motivo: 'Consulta general',
    mensaje: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  function actualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function enviar(e) {
    e.preventDefault();
    setError(null);

    if (!form.nombre || !form.correo || !form.mensaje) {
      setError('Completa tu nombre, correo y mensaje.');
      return;
    }

    setEnviando(true);
    const res = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setEnviando(false);

    if (!res.ok) {
      setError(data.error || 'No se pudo enviar el mensaje.');
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <main className="wrap" style={{ maxWidth: 600 }}>
        <div className="success-box">
          <div className="mark-ok">✓</div>
          <h2>Mensaje enviado</h2>
          <p style={{ opacity: 0.7, marginTop: 10 }}>
            Gracias por escribirnos — te responderemos a la brevedad a{' '}
            {form.correo}.
          </p>
          <a href="/"><button type="button" style={{ marginTop: 20 }}>Volver al inicio</button></a>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap" style={{ maxWidth: 600 }}>
      <div className="eyebrow">Ayuda</div>
      <h1 style={{ marginTop: 10 }}>¿En qué te ayudamos?</h1>
      <p style={{ opacity: 0.65, marginBottom: 28 }}>
        Para dudas, reclamos entre cliente y taller, o problemas con tu cuenta.
      </p>

      <form onSubmit={enviar}>
        <div className="field">
          <label>Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => actualizar('nombre', e.target.value)}
          />
        </div>
        <div className="field">
          <label>Correo electrónico</label>
          <input
            type="email"
            value={form.correo}
            onChange={(e) => actualizar('correo', e.target.value)}
          />
        </div>
        <div className="field">
          <label>Motivo</label>
          <select value={form.motivo} onChange={(e) => actualizar('motivo', e.target.value)}>
            <option>Consulta general</option>
            <option>Reclamo sobre un trabajo</option>
            <option>Problema con mi cuenta</option>
            <option>Quiero denunciar un perfil</option>
            <option>Otro</option>
          </select>
        </div>
        <div className="field">
          <label>Mensaje</label>
          <textarea
            value={form.mensaje}
            onChange={(e) => actualizar('mensaje', e.target.value)}
            placeholder="Cuéntanos qué pasó…"
          />
        </div>

        {error && <p className="status-error">{error}</p>}

        <button type="submit" disabled={enviando} style={{ width: '100%', justifyContent: 'center' }}>
          {enviando ? 'Enviando…' : 'Enviar mensaje'}
        </button>
      </form>
    </main>
  );
}
