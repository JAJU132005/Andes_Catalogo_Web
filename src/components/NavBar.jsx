import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTema } from '../lib/tema.jsx';

function BotonTema() {
  const { tema, alternar } = useTema();
  return (
    <button
      onClick={alternar}
      className="grid h-10 w-10 place-items-center rounded-lg text-andes-deep transition hover:bg-andes-mist"
      aria-label={tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro'}
    >
      {tema === 'oscuro' ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        </svg>
      )}
    </button>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8">
        <rect width="32" height="32" rx="7" fill="#10294D" />
        <path d="M16 6l8 18H8z" fill="none" stroke="#E8A317" strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="16" cy="19" r="2.4" fill="#36C5F0" />
      </svg>
      <div className="leading-none">
        <span className="block font-display text-lg font-bold tracking-tight text-andes-ink">ANDES</span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-andes-blue">Catálogo 3D Social</span>
      </div>
    </Link>
  );
}

export default function NavBar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const link = (to, label) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        pathname === to ? 'bg-andes-blue text-white' : 'text-andes-deep hover:bg-andes-mist'
      }`}
    >
      {label}
    </Link>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-1 sm:flex">
          {link('/', 'Catálogo')}
          {link('/solicitar', 'Solicitar material')}
          {link('/admin', 'Panel administrativo')}
          <BotonTema />
        </div>
        <div className="flex items-center gap-1 sm:hidden">
          <BotonTema />
          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded-lg text-andes-deep hover:bg-andes-mist"
            aria-label="Menú"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="flex flex-col gap-1 border-t border-slate-200/70 px-4 pb-3 sm:hidden">
          {link('/', 'Catálogo')}
          {link('/solicitar', 'Solicitar material')}
          {link('/admin', 'Panel administrativo')}
        </div>
      )}
    </header>
  );
}
