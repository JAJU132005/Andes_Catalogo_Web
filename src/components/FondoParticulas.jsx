// ============================================================
//  FONDO INTERACTIVO DE PARTÍCULAS
// ============================================================
// Red de partículas conectadas por líneas que flotan y reaccionan
// al movimiento del mouse. Colores de la marca AsoAndes. Canvas
// puro (sin librerías) para que sea liviano y fluido.
// Se dibuja detrás de todo el contenido (z-index negativo).
// ============================================================

import { useEffect, useRef } from 'react';

export default function FondoParticulas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let particulas = [];
    const mouse = { x: null, y: null, radio: 140 };

    // Colores de marca para las partículas
    const COLORES = ['rgba(46,123,255,', 'rgba(54,197,240,', 'rgba(232,163,23,'];

    function dimensionar() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Densidad proporcional al área (menos en móvil para fluidez)
      const cantidad = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 110);
      particulas = [];
      for (let i = 0; i < cantidad; i++) {
        particulas.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 0.6,
          c: COLORES[Math.floor(Math.random() * COLORES.length)],
        });
      }
    }

    function dibujar() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particulas.length; i++) {
        const p = particulas[i];

        // Movimiento base
        p.x += p.vx;
        p.y += p.vy;

        // Rebote en bordes
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Interacción con el mouse: las partículas se alejan del cursor
        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radio) {
            const fuerza = (mouse.radio - dist) / mouse.radio;
            p.x += (dx / dist) * fuerza * 2.2;
            p.y += (dy / dist) * fuerza * 2.2;
          }
        }

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + '0.7)';
        ctx.fill();

        // Conexiones con partículas cercanas
        for (let j = i + 1; j < particulas.length; j++) {
          const q = particulas[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(80,140,230,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Línea hacia el mouse si está cerca (resalta la interacción)
        if (mouse.x !== null) {
          const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dm < mouse.radio) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(232,163,23,${0.18 * (1 - dm / mouse.radio)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(dibujar);
    }

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = null; mouse.y = null; };
    const onTouch = (e) => {
      if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
    };

    dimensionar();
    dibujar();
    window.addEventListener('resize', dimensionar);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', dimensionar);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
