// ============================================================
//  GUARDIÁN DEL CLIC DERECHO (easter egg)
// ============================================================
// Intercepta el clic derecho y muestra un mensaje gracioso en vez
// del menú contextual. NOTA: esto NO oculta el código (es imposible
// en la web), es solo un detalle simpático para la demo.
// ============================================================

import { useEffect, useState } from 'react';

const MENSAJES = [
  '👀 ¿Qué quieres ver? ¡Aquí solo hay magia 3D!',
  '🕵️ ¡Atrapado! El código es secreto de ANDES 🤫',
  '🚫 Clic derecho desactivado… pero tu curiosidad nos encanta 😄',
  '🤖 Nada que copiar aquí, ¡todo es 100% original!',
  '✨ ¡Ey! Mejor explora el catálogo, está más interesante 😉',
  '🔒 Shhh… los magos no revelan sus trucos 🪄',
];

export default function GuardianClicDerecho() {
  const [mensaje, setMensaje] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onContext = (e) => {
      e.preventDefault();
      const msg = MENSAJES[Math.floor(Math.random() * MENSAJES.length)];
      // Posicionar cerca del cursor, pero sin salirse de la pantalla
      const x = Math.min(e.clientX, window.innerWidth - 280);
      const y = Math.min(e.clientY, window.innerHeight - 90);
      setPos({ x: Math.max(12, x), y: Math.max(12, y) });
      setMensaje(msg);
    };
    document.addEventListener('contextmenu', onContext);
    return () => document.removeEventListener('contextmenu', onContext);
  }, []);

  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(() => setMensaje(null), 2600);
    return () => clearTimeout(t);
  }, [mensaje]);

  if (!mensaje) return null;

  return (
    <div
      className="pointer-events-none fixed z-[80] max-w-[260px] rounded-2xl border border-andes-gold/50 bg-andes-ink/95 px-4 py-3 text-sm font-medium text-andes-gold shadow-2xl backdrop-blur-md"
      style={{ left: pos.x, top: pos.y, animation: 'fade-up 0.25s ease' }}
    >
      {mensaje}
    </div>
  );
}
