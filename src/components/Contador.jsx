// Contador que anima desde 0 hasta el valor objetivo.
// Soporta decimales y sufijos (ej. "4.6 / 5", "+30").

import { useEffect, useRef, useState } from 'react';

export default function Contador({ valor, duracion = 1200, decimales = 0, prefijo = '', sufijo = '' }) {
  const [actual, setActual] = useState(0);
  const ref = useRef(null);
  const yaAnimo = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !yaAnimo.current) {
        yaAnimo.current = true;
        const inicio = performance.now();
        const animar = (t) => {
          const p = Math.min((t - inicio) / duracion, 1);
          // easing suave (easeOutCubic)
          const e = 1 - Math.pow(1 - p, 3);
          setActual(valor * e);
          if (p < 1) requestAnimationFrame(animar);
          else setActual(valor);
        };
        requestAnimationFrame(animar);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [valor, duracion]);

  return (
    <span ref={ref}>
      {prefijo}{actual.toFixed(decimales)}{sufijo}
    </span>
  );
}
