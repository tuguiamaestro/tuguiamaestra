'use client';

import { useState } from 'react';
import AuthStatus from './AuthStatus';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/listado', label: 'Profesionales' },
    { href: '/registro', label: 'Soy mueblista' },
    { href: '/panel', label: 'Panel taller' },
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
        <AuthStatus mobile />
      </div>
    </>
  );
}
