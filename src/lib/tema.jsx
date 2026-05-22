// ============================================================
//  TEMA CLARO / OSCURO
// ============================================================
// Aplica una clase 'tema-claro' o 'tema-oscuro' al <html>.
// El CSS reacciona a esa clase. Recuerda la preferencia en memoria
// de sesión (no usamos localStorage por compatibilidad).
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';

const TemaContext = createContext();

export function ProveedorTema({ children }) {
  // Detecta la preferencia del sistema operativo del usuario.
  const preferenciaSistema = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'oscuro';
    }
    return 'oscuro';
  };
  const [tema, setTema] = useState(preferenciaSistema);
  const [tocadoPorUsuario, setTocado] = useState(false);

  // Si el usuario cambia el tema del sistema y no ha tocado el botón,
  // reflejamos el cambio en vivo.
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => { if (!tocadoPorUsuario) setTema(e.matches ? 'claro' : 'oscuro'); };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [tocadoPorUsuario]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('tema-claro', 'tema-oscuro');
    html.classList.add(tema === 'claro' ? 'tema-claro' : 'tema-oscuro');
  }, [tema]);

  const alternar = () => { setTocado(true); setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro')); };

  return (
    <TemaContext.Provider value={{ tema, alternar }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  return useContext(TemaContext);
}
