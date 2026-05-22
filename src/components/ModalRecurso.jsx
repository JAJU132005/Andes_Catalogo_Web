import { useEffect } from 'react';
import Visor3D from './Visor3D';
import { modeloDe, formatoCOP, tipoMaterial } from '../lib/catalogo';

export default function ModalRecurso({ recurso, onCerrar, onSolicitar }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onCerrar]);

  if (!recurso) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-andes-ink/70 p-4 backdrop-blur-sm"
      onClick={onCerrar}
    >
      <div
        className="relative grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCerrar}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-andes-ink shadow hover:bg-white"
          aria-label="Cerrar"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>

        {/* Visor */}
        <div className="h-64 md:h-auto">
          <Visor3D src={modeloDe(recurso)} alt={recurso.nombre} className="h-full" />
        </div>

        {/* Detalle */}
        <div className="flex flex-col overflow-y-auto p-6">
          <span className="mb-2 w-fit rounded-full bg-andes-mist px-3 py-1 text-xs font-medium text-andes-blue">
            {recurso.categoria} · {tipoMaterial(recurso.categoria)}
          </span>
          <h2 className="font-display text-2xl font-bold leading-tight text-andes-ink">
            {recurso.nombre}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{recurso.descripcion}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-andes-mist p-3">
              <dt className="text-[11px] uppercase tracking-wide text-slate-400">Material</dt>
              <dd className="font-semibold text-andes-ink">{recurso.material}</dd>
            </div>
            <div className="rounded-xl bg-andes-mist p-3">
              <dt className="text-[11px] uppercase tracking-wide text-slate-400">Costo estimado</dt>
              <dd className="font-semibold text-andes-blue">{formatoCOP(recurso.costo)}</dd>
            </div>
            <div className="col-span-2 rounded-xl bg-andes-mist p-3">
              <dt className="text-[11px] uppercase tracking-wide text-slate-400">Población objetivo</dt>
              <dd className="font-medium text-andes-ink">{recurso.poblacion}</dd>
            </div>
          </dl>

          <button
            onClick={() => onSolicitar(recurso)}
            className="mt-6 w-full rounded-xl bg-andes-blue py-3 font-display font-semibold text-white shadow-sm transition hover:bg-andes-deep active:scale-[0.98]"
          >
            Solicitar este material
          </button>
        </div>
      </div>
    </div>
  );
}
