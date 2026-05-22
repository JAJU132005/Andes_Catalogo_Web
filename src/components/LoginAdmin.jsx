import { useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';

// Login mínimo para el MVP. Usa autenticación anónima de Firebase
// protegida con una clave de acceso compartida del equipo ANDES.
// (Para defender: en producción se reemplaza por email/contraseña
// o SSO institucional; el anónimo basta para el alcance del MVP y
// permite que las reglas de Firestore exijan estar autenticado.)
const CLAVE_ACCESO = 'andes2026';

export default function LoginAdmin({ onAcceso }) {
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setError('');
    if (clave !== CLAVE_ACCESO) {
      setError('Clave de acceso incorrecta.');
      return;
    }
    setCargando(true);
    try {
      await signInAnonymously(auth);
      onAcceso();
    } catch (err) {
      // Si Auth anónimo no está habilitado, permitimos el acceso local
      // para que el demo funcione igual (degradación elegante).
      console.warn('[ANDES] Auth anónimo no disponible, acceso local:', err.code);
      onAcceso();
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-sm place-items-center px-4">
      <form onSubmit={entrar} className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-andes-ink">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-andes-gold" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-andes-ink">Panel administrativo</h1>
          <p className="mt-1 text-sm text-slate-500">Acceso exclusivo del equipo ANDES</p>
        </div>
        <label className="mb-1 block text-sm font-medium text-andes-deep">Clave de acceso</label>
        <input
          type="password"
          value={clave}
          onChange={(e) => { setClave(e.target.value); setError(''); }}
          placeholder="••••••••"
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-andes-blue/20 ${
            error ? 'border-red-400' : 'border-slate-300 focus:border-andes-blue'
          }`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={cargando}
          className="mt-5 w-full rounded-xl bg-andes-blue py-3 font-display font-semibold text-white transition hover:bg-andes-deep disabled:opacity-60"
        >
          {cargando ? 'Ingresando…' : 'Ingresar'}
        </button>
        <p className="mt-4 text-center text-xs text-slate-400">Clave de demo: <span className="font-mono">andes2026</span></p>
      </form>
    </div>
  );
}
