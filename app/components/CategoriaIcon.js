// Set de íconos simples tipo "línea" (sin depender de ninguna librería externa),
// para reemplazar los emojis por algo más consistente entre dispositivos.

function Base({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function IconCocinas() {
  return (
    <Base>
      <path d="M4 8c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v1H4V8z" />
      <path d="M4 9h16l-1 9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 9z" />
      <path d="M9 4v2M12 4v2M15 4v2" />
    </Base>
  );
}

export function IconClosets() {
  return (
    <Base>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M12 3v18" />
      <path d="M9 12v.01M15 12v.01" />
    </Base>
  );
}

export function IconBanos() {
  return (
    <Base>
      <path d="M5 12h14a1 1 0 0 1 1 1 6 6 0 0 1-6 6H10a6 6 0 0 1-6-6 1 1 0 0 1 1-1z" />
      <path d="M8 12V6a2 2 0 0 1 3.2-1.6" />
      <path d="M7 21h10" />
    </Base>
  );
}

export function IconRepisas() {
  return (
    <Base>
      <path d="M3 8h18M3 16h18" />
      <path d="M6 8v3M9 8v3M18 8v3" />
      <path d="M6 16v3M15 16v3" />
    </Base>
  );
}

export function IconRestauracion() {
  return (
    <Base>
      <path d="M6 4h12l-1 6H7L6 4z" />
      <path d="M7 10v6M17 10v6" />
      <path d="M7 16h10l-1.5 4h-7L7 16z" />
    </Base>
  );
}

export function IconGeneral() {
  return (
    <Base>
      <path d="M14.5 3.5 20.5 9.5 18 12l-6-6z" />
      <path d="M13 7 4 16v3h3l9-9" />
    </Base>
  );
}

export function IconGenerico() {
  return (
    <Base>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l3 2" />
    </Base>
  );
}

const iconosPorNombre = {
  'Cocinas': IconCocinas,
  'Closets': IconClosets,
  'Baños / Vanitorios': IconBanos,
  'Repisas': IconRepisas,
  'Restauración': IconRestauracion,
  'Carpintería general': IconGeneral,
};

export default function CategoriaIcon({ nombre, className }) {
  const Icono = iconosPorNombre[nombre] || IconGenerico;
  return (
    <span className={className || 'cat-icon'}>
      <Icono />
    </span>
  );
}
