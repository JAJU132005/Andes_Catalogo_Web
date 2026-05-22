// ============================================================
//  ASISTENTE DE RECOMENDACIÓN
// ============================================================
// Recomienda material del catálogo de ANDES según la necesidad
// que describe el usuario. Usa un motor de reglas determinista
// (src/lib/motor.js): rápido, sin costo, sin claves expuestas y
// que nunca recomienda recursos inexistentes. Funciona offline.
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recomendar, explicar } from '../lib/motor';

const EJEMPLOS = [
  'Enseñar fracciones a niños de primaria',
  'Material para una persona con discapacidad visual',
  'Explicar anatomía en clase de ciencias',
  'Ayuda para alguien con dificultad motriz en las manos',
  'Enseñar el sistema solar a niños',
  'Una persona con autismo que se comunica poco',
];

export default function Asistente() {
  const navigate = useNavigate();
  const [necesidad, setNecesidad] = useState('');
  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [explicacion, setExplicacion] = useState('');

  const consultar = (texto) => {
    const q = (texto ?? necesidad).trim();
    if (!q) return;
    setNecesidad(q);
    setAnalizando(true);
    setResultado(null);
    setTimeout(() => {
      const r = recomendar(q);
      setResultado(r);
      setExplicacion(explicar(r));
      setAnalizando(false);
    }, 450);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-andes-gold/40 bg-andes-gold/10 px-3 py-1 text-xs font-medium text-andes-gold">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
          Asistente de recomendación inteligente
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold text-andes-ink">¿Qué necesitas resolver?</h1>
        <p className="mt-2 text-sm text-slate-600">
          Describe la necesidad educativa o de accesibilidad y te recomendamos el material 3D ideal del catálogo.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <textarea
          value={necesidad}
          onChange={(e) => setNecesidad(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) consultar(); }}
          rows={3}
          placeholder="Ej. Necesito ayudar a un estudiante con baja visión a aprender geometría…"
          className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-andes-blue focus:ring-2 focus:ring-andes-blue/20"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {EJEMPLOS.map((ej) => (
            <button key={ej} onClick={() => consultar(ej)}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-600 transition hover:border-andes-blue hover:text-andes-blue">
              {ej}
            </button>
          ))}
        </div>
        <button
          onClick={() => consultar()}
          disabled={analizando || !necesidad.trim()}
          className="mt-4 w-full rounded-xl bg-andes-blue py-3 font-display font-semibold text-white transition hover:bg-andes-deep disabled:opacity-60"
        >
          {analizando ? 'Analizando tu necesidad…' : 'Recomendar material'}
        </button>
      </div>

      {resultado && (
        <div className="mt-6">
          {explicacion && (
            <p className="mb-4 rounded-2xl bg-andes-blue/10 px-4 py-3 text-sm text-andes-sky">
              {explicacion}
            </p>
          )}
          {resultado.recursos.length > 0 ? (
            <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2">
              {resultado.recursos.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate('/solicitar', { state: { recurso: r } })}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="rounded-full bg-andes-mist px-2.5 py-0.5 text-[11px] font-medium text-andes-blue">
                    {r.categoria}
                  </span>
                  <h3 className="mt-2 font-display font-semibold text-andes-ink">{r.nombre}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{r.descripcion}</p>
                  <p className="mt-2 text-xs font-medium text-andes-gold">Solicitar este material →</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
              <p className="text-sm text-slate-600">No encontramos una coincidencia directa.</p>
              <button onClick={() => navigate('/')} className="mt-3 rounded-xl bg-andes-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-andes-deep">
                Explorar catálogo completo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
