'use client';

import { useState } from 'react';
import AuthStatus from './AuthStatus';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/listado', label: 'Profesionales' },
    { href: '/solicitar', label: 'Pedir presupuesto' },
    { href: '/registro', label: 'Soy mueblista' },
    { href: '/panel', label: 'Panel taller' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <header className="site-header">
      <a href="/" className="logo">
        <svg viewBox="0 0 30 30" width="26" height="26" fill="none">
          <path d="M4 24 L15 6 L26 24 Z" stroke="#241E19" strokeWidth="2" fill="none" />
          <path d="M10 24 L15 15 L20 24" stroke="#B08D3E" strokeWidth="2" />
        </svg>
        TuGuíaMaestra
      </a>

      <nav className="header-desktop-nav">
        {links.map((l) => (
          <a key={l.href} href={l.href}>{l.label}</a>
        ))}
        <AuthStatus />
      </nav>

      <button
        type="button"
        className={`menu-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        <span></span><span></span><span></span>
      </button>

      <div className={`mobile-nav ${open ? 'open' : ''}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <AuthStatus mobile />
      </div>
    </header>
  );
}
