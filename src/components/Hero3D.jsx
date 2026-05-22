// ============================================================
//  HERO 3D — Pantalla principal con visor gigante girando
// ============================================================
// Diseño split asimétrico: mensaje potente + visor 3D enorme como
// protagonista. Pensado como enganche visual para el jurado.
// ============================================================

import { useState } from 'react';

export default function Hero3D({ onVerCatalogo, onSolicitar }) {
  const [error, setError] = useState(false);

  // Modelo protagonista del hero: usamos uno de los temáticos propios
  // (figuras) girando en grande. Es liviano y siempre carga.
  const MODELO = '/models/figuras.glb';

  return (
    <section className="relative overflow-hidden">
      {/* Resplandores de fondo de la marca */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-andes-blue/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-andes-gold/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-andes-sky/15 blur-[110px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-4 lg:py-20">
        {/* Columna de texto */}
        <div className="relative z-10 order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-andes-gold/40 bg-andes-gold/10 px-3 py-1 text-xs font-medium text-andes-gold">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-andes-gold" />
            ANDES · 32 años transformando vidas
          </span>

          <h1 className="mt-5 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-andes-ink sm:text-6xl">
            Tócalo.
            <br />
            <span className="bg-gradient-to-r from-andes-blue via-andes-sky to-andes-gold bg-clip-text text-transparent">
              Gíralo. Solicítalo.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">
            El primer catálogo <strong className="text-andes-ink">3D interactivo</strong> de material
            didáctico y de accesibilidad de bajo costo. Explora cada recurso en tres dimensiones
            antes de solicitarlo para tu comunidad.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={onVerCatalogo}
              className="group relative overflow-hidden rounded-xl bg-andes-gold px-6 py-3.5 font-display font-semibold text-andes-ink shadow-lg transition active:scale-95"
            >
              <span className="relative z-10">Explorar catálogo 3D</span>
            </button>
            <button
              onClick={onSolicitar}
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-display font-semibold text-andes-ink backdrop-blur transition hover:bg-white/10"
            >
              Solicitar material
            </button>
          </div>

          {/* Mini-métricas en línea */}
          <div className="mt-8 flex gap-6">
            {[['25', 'recursos'], ['6', 'categorías'], ['+30', 'instituciones']].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-2xl font-bold text-andes-ink">{n}</p>
                <p className="text-xs text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Columna del visor 3D gigante */}
        <div className="relative order-1 lg:order-2">
          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            {/* Anillos decorativos giratorios */}
            <div className="pointer-events-none absolute inset-0 animate-spin rounded-full border border-dashed border-andes-blue/20" style={{ animationDuration: '40s' }} />
            <div className="pointer-events-none absolute inset-6 animate-spin rounded-full border border-andes-gold/15" style={{ animationDuration: '28s', animationDirection: 'reverse' }} />

            {/* Visor 3D protagonista */}
            <div className="absolute inset-8 overflow-hidden rounded-full">
              {!error ? (
                <model-viewer
                  src={MODELO}
                  alt="Material didáctico 3D de ANDES"
                  auto-rotate
                  auto-rotate-delay="0"
                  rotation-per-second="32deg"
                  camera-controls
                  disable-zoom
                  interaction-prompt="none"
                  shadow-intensity="0.8"
                  exposure="1.1"
                  onError={() => setError(true)}
                  style={{ width: '100%', height: '100%', background: 'transparent' }}
                />
              ) : (
                <div className="grid h-full w-full place-items-center">
                  <svg viewBox="0 0 64 64" className="h-32 w-32 animate-pulse">
                    <path d="M32 6l24 14v24L32 58 8 44V20z" fill="none" stroke="#E8A317" strokeWidth="2" />
                    <path d="M32 6v52M8 20l24 14 24-14" stroke="#36C5F0" strokeWidth="1.6" opacity="0.7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Etiqueta flotante */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-andes-ink/80 px-4 py-1.5 text-xs font-medium text-andes-sky backdrop-blur-md">
              ✋ Arrastra para girar
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
