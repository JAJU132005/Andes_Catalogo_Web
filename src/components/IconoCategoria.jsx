// Íconos SVG temáticos por categoría para las tarjetas del catálogo.
// Cada categoría tiene una ilustración distinta con los colores de marca,
// para que el usuario reconozca el tipo de recurso de un vistazo.

const G = '#E8A317', B = '#2E7BFF', S = '#36C5F0', W = '#EAF1FB';

const ICONOS = {
  'Material Didactico': (
    <g fill="none" strokeWidth="2.4" strokeLinejoin="round">
      <rect x="10" y="26" width="18" height="18" rx="2" stroke={B} />
      <circle cx="44" cy="22" r="9" stroke={G} />
      <path d="M36 46l8-14 8 14z" stroke={S} />
    </g>
  ),
  'Figuras Didacticas': (
    <g fill="none" strokeWidth="2.4">
      <circle cx="32" cy="32" r="7" stroke={G} />
      <circle cx="14" cy="20" r="4" stroke={B} />
      <circle cx="50" cy="20" r="4" stroke={B} />
      <circle cx="16" cy="46" r="4" stroke={S} />
      <circle cx="48" cy="46" r="4" stroke={S} />
      <path d="M26 28l-9-6M38 28l9-6M27 37l-9 7M37 37l9 7" stroke={W} strokeWidth="1.8" />
    </g>
  ),
  'Accesibilidad Visual': (
    <g fill="none" strokeWidth="2">
      <rect x="12" y="14" width="40" height="36" rx="4" stroke={B} />
      {[20, 32, 44].map((y) => [22, 32, 42].map((x, i) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6"
          fill={(x + y) % 3 === 0 ? G : 'none'} stroke={(x + y) % 3 === 0 ? G : S} />
      )))}
    </g>
  ),
  'Accesibilidad Motriz': (
    <g fill="none" strokeWidth="2.4" strokeLinecap="round">
      <path d="M24 12c-3 6-3 14 0 40" stroke={B} />
      <path d="M40 12c3 6 3 14 0 40" stroke={B} />
      <ellipse cx="32" cy="20" rx="12" ry="5" stroke={G} />
      <path d="M22 30h20M22 38h20" stroke={S} strokeWidth="1.8" />
    </g>
  ),
  'Comunicacion Aumentativa': (
    <g fill="none" strokeWidth="2">
      <rect x="10" y="16" width="44" height="32" rx="4" stroke={B} />
      <rect x="16" y="22" width="9" height="9" rx="1.5" stroke={G} fill={G} fillOpacity="0.3" />
      <rect x="28" y="22" width="9" height="9" rx="1.5" stroke={S} />
      <rect x="40" y="22" width="9" height="9" rx="1.5" stroke={W} />
      <rect x="16" y="34" width="9" height="9" rx="1.5" stroke={S} />
      <rect x="28" y="34" width="9" height="9" rx="1.5" stroke={G} fill={G} fillOpacity="0.3" />
      <rect x="40" y="34" width="9" height="9" rx="1.5" stroke={B} />
    </g>
  ),
  'Accesorios de Accesibilidad': (
    <g fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="32" cy="48" rx="14" ry="4" stroke={B} />
      <path d="M32 44V22" stroke={B} />
      <path d="M32 22a8 8 0 108-8" stroke={G} />
      <circle cx="32" cy="16" r="3" fill={S} stroke={S} />
    </g>
  ),
};

export default function IconoCategoria({ categoria, className = '' }) {
  const icono = ICONOS[categoria] || ICONOS['Material Didactico'];
  return (
    <svg viewBox="0 0 64 64" className={className}>
      {icono}
    </svg>
  );
}
