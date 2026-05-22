import { formatoCOP, CATEGORIA_CHIP, tipoMaterial, imagenDe } from '../lib/catalogo';
import IconoCategoria from './IconoCategoria';

export default function TarjetaRecurso({ recurso, onVer, onSolicitar }) {
  const chip = CATEGORIA_CHIP[recurso.categoria] || 'bg-slate-100 text-slate-700';
  const esAccesibilidad = tipoMaterial(recurso.categoria) === 'Ayuda de Accesibilidad';
  const imagen = imagenDe(recurso);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {/* Cabecera visual */}
      <button
        onClick={() => onVer(recurso)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-andes-deep to-andes-ink text-left"
      >
        {imagen ? (
          <img
            src={imagen}
            alt={recurso.nombre}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <IconoCategoria categoria={recurso.categoria} className="h-24 w-24 opacity-95 drop-shadow-lg transition group-hover:scale-110 group-hover:rotate-3" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-andes-ink/40 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full bg-andes-gold px-2.5 py-1 text-[11px] font-semibold text-andes-ink">
          {recurso.material}
        </span>
        {recurso.estadoStock && (
          <span className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            recurso.estadoStock === 'Disponible'
              ? 'bg-emerald-500/90 text-white'
              : 'bg-amber-500/90 text-white'
          }`}>
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {recurso.estadoStock === 'Disponible'
              ? `${recurso.disponibles} disp.`
              : 'Stock bajo'}
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur transition group-hover:bg-andes-gold group-hover:text-andes-ink">
          Ver en 3D →
        </span>
      </button>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${chip}`}>
            {recurso.categoria}
          </span>
          {esAccesibilidad && (
            <span className="rounded-full bg-andes-ink px-2.5 py-0.5 text-[11px] font-medium text-andes-sky">
              Inclusión
            </span>
          )}
        </div>
        <h3 className="font-display text-base font-semibold leading-snug text-andes-ink">
          {recurso.nombre}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{recurso.descripcion}</p>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Costo estimado</p>
            <p className="font-display text-lg font-bold text-andes-blue">{formatoCOP(recurso.costo)}</p>
          </div>
          <button
            onClick={() => onSolicitar(recurso)}
            className="rounded-xl bg-andes-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-andes-deep active:scale-95"
          >
            Solicitar
          </button>
        </div>
      </div>
    </article>
  );
}
