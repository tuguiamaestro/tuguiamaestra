'use client';

import { useState } from 'react';
import AuthStatus from './AuthStatus';

function IconoCuenta() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c0-4 3.5-6.5 7.5-6.5s7.5 2.5 7.5 6.5" />
    </svg>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/listado', label: 'Profesionales' },
    { href: '/registro', label: 'Soy mueblista' },
  ];

  return (
    <>
      <div className="top-bar">
        <p>
          🔨 ¿Tienes un taller de muebles? <a href="/registro">Suscríbete gratis y recibe tus primeros clientes →</a>
        </p>
      </div>

      <header className="site-header">
        <a href="/" className="logo">
          <img src="/images/logo-icon.png" alt="TuGuíaMaestra" width="26" height="26" style={{ objectFit: 'contain' }} />
          TuGuíaMaestra
        </a>

        <nav className="header-desktop-nav">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <AuthStatus />
          <a
            href="/panel"
            aria-label="Iniciar sesión / Panel de taller"
            title="Iniciar sesión / Panel de taller"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--line)',
              color: 'var(--ink)', opacity: 0.75,
            }}
          >
            <IconoCuenta />
          </a>
          <a href="/solicitar" className="btn-brass nav-cta">Pedir presupuesto</a>
        </nav>

        <button
          type="button"
          className={`menu-toggle ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <span></span><span></span><span></span>
        </button>
      </header>

      {/* Este panel va FUERA del <header> a propósito: el header usa
          backdrop-filter, y eso hace que en iPhone un elemento position:fixed
          adentro quede atrapado dentro de la cajita del header en vez de
          ocupar toda la pantalla. */}
      <div className={`mobile-nav ${open ? 'open' : ''}`}>
        <a href="/solicitar" className="btn-brass nav-cta-mobile" onClick={() => setOpen(false)}>
          Pedir presupuesto
        </a>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <a href="/panel" onClick={() => setOpen(false)}>Iniciar sesión / Panel taller</a>
        <AuthStatus mobile />
      </div>
    </>
  );
}
