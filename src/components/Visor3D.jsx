// ============================================================
//  VISOR 3D — usa <model-viewer> de Google
// ============================================================
// El reto recomienda explícitamente Google Model-Viewer por su
// simplicidad. Carga modelos .glb/.gltf. Como los archivos del
// catálogo son .stl de referencia, mapeamos a modelos .glb de
// demostración alojados en /public/models. Si un modelo no existe,
// mostramos un placeholder geométrico para que el demo NUNCA se rompa.
// ============================================================

import { useState } from 'react';

export default function Visor3D({ src, poster, alt, className = '' }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`relative grid place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-andes-deep to-andes-ink ${className}`}>
        <div className="text-center px-6">
          <div className="mx-auto mb-3 h-16 w-16 animate-pulse-soft">
            <svg viewBox="0 0 64 64" fill="none" className="h-full w-full">
              <path d="M32 6l24 14v24L32 58 8 44V20z" stroke="#E8A317" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M32 6v52M8 20l24 14 24-14" stroke="#36C5F0" strokeWidth="2" opacity="0.7"/>
            </svg>
          </div>
          <p className="font-display text-sm font-medium text-andes-sky">Modelo 3D</p>
          <p className="mt-1 text-xs text-blue-200/70">Vista previa no disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* model-viewer es un Web Component; React lo renderiza como etiqueta */}
      <model-viewer
        src={src}
        poster={poster}
        alt={alt || 'Modelo 3D del recurso'}
        camera-controls
        auto-rotate
        auto-rotate-delay="800"
        rotation-per-second="18deg"
        shadow-intensity="1"
        exposure="0.9"
        interaction-prompt="auto"
        ar
        onError={() => setError(true)}
        style={{ width: '100%', height: '100%' }}
      >
        <div slot="progress-bar" />
      </model-viewer>
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
        Arrastra para rotar · pellizca para zoom
      </span>
    </div>
  );
}
