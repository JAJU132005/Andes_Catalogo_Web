// Toast simple: notificación flotante que aparece y desaparece.
// Se usa para avisar de solicitudes nuevas en tiempo real.

import { useEffect } from 'react';

export default function Toast({ mensaje, tipo = 'info', onCerrar }) {
  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(onCerrar, 4500);
    return () => clearTimeout(t);
  }, [mensaje, onCerrar]);

  if (!mensaje) return null;

  const estilos = {
    info: 'border-andes-blue/40 bg-andes-blue/15 text-andes-sky',
    exito: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300',
    nuevo: 'border-andes-gold/50 bg-andes-gold/15 text-andes-gold',
  }[tipo];

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex justify-end">
      <div className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-md ${estilos}`}
           style={{ animation: 'fade-up 0.35s ease' }}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10">
          <span className="h-2.5 w-2.5 animate-ping rounded-full bg-current" />
        </span>
        <p className="text-sm font-medium">{mensaje}</p>
        <button onClick={onCerrar} className="ml-2 text-current opacity-60 hover:opacity-100">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
