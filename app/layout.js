import './globals.css';
import AuthStatus from './components/AuthStatus';

export const metadata = {
  title: 'TuGuíaMaestra — Encuentra a tu mueblista',
  description: 'Directorio de mueblistas y carpinteros de confianza en Santiago.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-CL">
      <body>
        <header className="site-header">
          <a href="/" className="logo">
            <svg viewBox="0 0 30 30" width="26" height="26" fill="none">
              <path d="M4 24 L15 6 L26 24 Z" stroke="#241E19" strokeWidth="2" fill="none" />
              <path d="M10 24 L15 15 L20 24" stroke="#B08D3E" strokeWidth="2" />
            </svg>
            TuGuíaMaestra
          </a>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <a href="/listado">Profesionales</a>
            <a href="/solicitar">Pedir presupuesto</a>
            <a href="/registro">Soy mueblista</a>
            <a href="/panel">Panel taller</a>
            <a href="/admin">Admin</a>
            <AuthStatus />
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
