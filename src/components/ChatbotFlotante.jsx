// ============================================================
//  CHATBOT FLOTANTE
// ============================================================
// Botón flotante presente en todas las páginas. Abre una ventana
// de chat (no es una subpágina) que usa el motor de recomendación
// para sugerir material según lo que escribe el usuario.
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recomendar, explicar } from '../lib/motor';

export default function ChatbotFlotante() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const [escribiendo, setEscribiendo] = useState(false);
  const [texto, setTexto] = useState('');
  const [mensajes, setMensajes] = useState([
    { de: 'bot', tipo: 'texto', contenido: '¡Hola! 👋 Soy el asistente de ANDES. Cuéntame qué necesitas y te recomiendo el material 3D ideal.' },
  ]);
  const finRef = useRef(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, escribiendo]);

  const enviar = (preset) => {
    const q = (preset ?? texto).trim();
    if (!q) return;
    setMensajes((m) => [...m, { de: 'user', tipo: 'texto', contenido: q }]);
    setTexto('');
    setEscribiendo(true);

    setTimeout(() => {
      const r = recomendar(q);
      setEscribiendo(false);
      setMensajes((m) => [
        ...m,
        { de: 'bot', tipo: 'texto', contenido: explicar(r) },
        ...(r.recursos.length
          ? [{ de: 'bot', tipo: 'recursos', contenido: r.recursos }]
          : [{ de: 'bot', tipo: 'texto', contenido: 'Puedes explorar el catálogo completo para ver todas las opciones. 🙂' }]),
      ]);
    }, 600);
  };

  const SUGERENCIAS = ['Material para baja visión', 'Enseñar fracciones', 'Algo para anatomía'];

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setAbierto((v) => !v)}
        className="fixed bottom-6 right-6 z-[70] grid h-14 w-14 place-items-center rounded-full bg-andes-gold text-andes-ink shadow-2xl transition hover:scale-110 active:scale-95"
        style={{ boxShadow: '0 8px 30px rgba(232,163,23,0.45)' }}
        aria-label="Abrir asistente"
      >
        {abierto ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 6l12 12M6 18L18 6" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
        )}
      </button>

      {/* Ventana del chat */}
      {abierto && (
        <div
          className="fixed bottom-24 right-6 z-[70] flex h-[480px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-andes-gold/30 bg-andes-ink/95 shadow-2xl backdrop-blur-xl"
          style={{ animation: 'fade-up 0.3s ease' }}
        >
          {/* Cabecera */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-andes-deep to-andes-ink px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-andes-gold text-andes-ink">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-white">Asistente ANDES</p>
              <p className="flex items-center gap-1 text-[11px] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> En línea
              </p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.de === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.tipo === 'recursos' ? (
                  <div className="w-full space-y-2">
                    {m.contenido.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => { setAbierto(false); navigate('/solicitar', { state: { recurso: r } }); }}
                        className="block w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-andes-gold/40 hover:bg-white/10"
                      >
                        <p className="text-[11px] text-andes-sky">{r.categoria}</p>
                        <p className="text-sm font-medium text-white">{r.nombre}</p>
                        <p className="mt-0.5 text-[11px] text-andes-gold">Solicitar →</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.de === 'user' ? 'bg-andes-blue text-white' : 'bg-white/10 text-blue-50'
                  }`}>
                    {m.contenido}
                  </div>
                )}
              </div>
            ))}
            {escribiendo && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-white/10 px-4 py-3">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-andes-sky" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={finRef} />
          </div>

          {/* Sugerencias rápidas */}
          {mensajes.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {SUGERENCIAS.map((s) => (
                <button key={s} onClick={() => enviar(s)}
                  className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-blue-100 transition hover:border-andes-gold/40 hover:text-andes-gold">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Entrada */}
          <div className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviar()}
              placeholder="Escribe tu necesidad…"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-blue-200/50 focus:border-andes-gold/50"
            />
            <button
              onClick={() => enviar()}
              disabled={!texto.trim()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-andes-gold text-andes-ink transition hover:scale-105 disabled:opacity-40"
              aria-label="Enviar"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
