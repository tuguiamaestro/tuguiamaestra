import './globals.css';

export const metadata = {
  title: 'TuGuíaMaestra — Encuentra a tu mueblista',
  description: 'Directorio de mueblistas y carpinteros de confianza en Santiago.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  );
}
