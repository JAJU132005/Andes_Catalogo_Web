import { useState, useEffect, useMemo, useRef } from 'react';
import LoginAdmin from '../components/LoginAdmin';
import GraficoCiudades from '../components/GraficoCiudades';
import Toast from '../components/Toast';
import { escucharSolicitudes, actualizarEstado, sembrarDemo, borrarSolicitudes, diagnosticar, ESTADOS, ESTADO_COLOR } from '../lib/datos';
import { exportarCSV } from '../lib/exportar';

function fechaCorta(ts) {
  if (!ts?.toDate) return '—';
  return ts.toDate().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorConexion, setErrorConexion] = useState('');
  const [fCiudad, setFCiudad] = useState('Todas');
  const [fEstado, setFEstado] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [guardandoId, setGuardandoId] = useState(null);
  const [sembrando, setSembrando] = useState(false);
  const [diag, setDiag] = useState(null);
  const [toast, setToast] = useState(null);
  const [borrando, setBorrando] = useState(false);
  const [vista, setVista] = useState('tabla'); // 'tabla' | 'grafico'
  const conteoPrevio = useRef(null);

  // Detectar solicitudes nuevas para el toast en tiempo real.
  useEffect(() => {
    if (conteoPrevio.current !== null && solicitudes.length > conteoPrevio.current) {
      const nuevas = solicitudes.length - conteoPrevio.current;
      const ultima = solicitudes[0];
      setToast({
        tipo: 'nuevo',
        mensaje: nuevas === 1 && ultima
          ? `Nueva solicitud de ${ultima.nombre} (${ultima.ciudad})`
          : `${nuevas} solicitudes nuevas recibidas`,
      });
    }
    conteoPrevio.current = solicitudes.length;
  }, [solicitudes]);

  // Suscripción en tiempo real: la tabla se actualiza sola.
  useEffect(() => {
    if (!autenticado) return;
    const cancelar = escucharSolicitudes(
      (lista) => { setSolicitudes(lista); setCargando(false); },
      () => { setErrorConexion('No se pudo conectar con la base de datos. Revisa la configuración de Firebase.'); setCargando(false); }
    );
    return () => cancelar?.();
  }, [autenticado]);

  const ciudades = useMemo(
    () => ['Todas', ...Array.from(new Set(solicitudes.map((s) => s.ciudad).filter(Boolean)))],
    [solicitudes]
  );

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return solicitudes.filter((s) => {
      const okCiudad = fCiudad === 'Todas' || s.ciudad === fCiudad;
      const okEstado = fEstado === 'Todos' || s.estado === fEstado;
      const okBusca = !q || s.nombre?.toLowerCase().includes(q) || s.materialNombre?.toLowerCase().includes(q) || s.cedula?.includes(q);
      return okCiudad && okEstado && okBusca;
    });
  }, [solicitudes, fCiudad, fEstado, busca]);

  const metricas = useMemo(() => {
    const total = solicitudes.length;
    const confirmados = solicitudes.filter((s) => s.estado === 'Confirmó').length;
    const interesados = solicitudes.filter((s) => s.estado === 'Interesado').length;
    const pendientes = solicitudes.filter((s) => ['No responde', 'No contestó', 'Llamar después'].includes(s.estado)).length;
    return { total, confirmados, interesados, pendientes };
  }, [solicitudes]);

  const cambiarEstado = async (id, estado) => {
    setGuardandoId(id);
    try { await actualizarEstado(id, estado); }
    catch { setErrorConexion('No se pudo actualizar el estado.'); }
    finally { setGuardandoId(null); }
  };

  const cargarDemo = async () => {
    setSembrando(true);
    try { await sembrarDemo(14); }
    catch (e) { setErrorConexion('No se pudieron cargar los datos de demo: ' + e.message); }
    finally { setSembrando(false); }
  };

  const correrDiagnostico = async () => {
    setDiag({ cargando: true });
    const r = await diagnosticar();
    setDiag(r);
  };

  const exportar = () => {
    if (filtradas.length === 0) {
      setToast({ tipo: 'info', mensaje: 'No hay registros para exportar.' });
      return;
    }
    exportarCSV(filtradas);
    setToast({ tipo: 'exito', mensaje: `${filtradas.length} solicitudes exportadas a CSV.` });
  };

  const borrarDemo = async () => {
    if (!confirm('¿Borrar las solicitudes de demostración? Las solicitudes reales se conservan.')) return;
    setBorrando(true);
    try {
      const n = await borrarSolicitudes('demo');
      setToast({ tipo: 'exito', mensaje: `${n} solicitudes demo eliminadas.` });
    } catch (e) {
      setErrorConexion('No se pudieron borrar: ' + e.message);
    } finally { setBorrando(false); }
  };

  const borrarTodo = async () => {
    if (!confirm('⚠️ Esto borra TODAS las solicitudes (demo y reales). Esta acción no se puede deshacer. ¿Continuar?')) return;
    if (!confirm('Confirma una vez más: se eliminarán todos los registros.')) return;
    setBorrando(true);
    try {
      const n = await borrarSolicitudes('todas');
      setToast({ tipo: 'exito', mensaje: `${n} solicitudes eliminadas.` });
    } catch (e) {
      setErrorConexion('No se pudieron borrar: ' + e.message);
    } finally { setBorrando(false); }
  };

  if (!autenticado) return <LoginAdmin onAcceso={() => setAutenticado(true)} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-andes-ink">Gestión de solicitudes</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Actualización en tiempo real
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportar}
            className="flex items-center gap-1.5 rounded-xl bg-andes-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-andes-deep"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>
            Exportar CSV
          </button>
          <button
            onClick={cargarDemo}
            disabled={sembrando}
            className="rounded-xl bg-andes-gold px-4 py-2 text-sm font-semibold text-andes-ink transition hover:brightness-105 disabled:opacity-60"
          >
            {sembrando ? 'Cargando…' : 'Cargar datos demo'}
          </button>
          <button
            onClick={borrarDemo}
            disabled={borrando}
            className="rounded-xl border border-amber-400/50 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-60"
          >
            {borrando ? 'Borrando…' : 'Borrar demo'}
          </button>
          <button
            onClick={correrDiagnostico}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-andes-deep transition hover:bg-andes-mist"
            title="Diagnosticar conexión"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </button>
        </div>
      </div>

      {/* Resultado del diagnóstico */}
      {diag && (
        <div className={`mb-4 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
          diag.cargando ? 'border-slate-200 bg-slate-50 text-slate-600'
          : diag.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700'
        }`}>
          <span>
            {diag.cargando ? 'Verificando conexión con Firebase…'
              : `${diag.ok ? '✓' : '✕'} ${diag.mensaje}${diag.ok ? ` Documentos en la base: ${diag.cantidad}.` : ''}`}
          </span>
          {!diag.cargando && (
            <button onClick={borrarTodo} className="shrink-0 text-xs font-medium text-red-600 underline hover:text-red-700">
              Borrar TODO
            </button>
          )}
        </div>
      )}

      {/* Métricas */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Total solicitudes', metricas.total, 'text-andes-blue'],
          ['Confirmados', metricas.confirmados, 'text-emerald-600'],
          ['Interesados', metricas.interesados, 'text-indigo-600'],
          ['Pendientes de gestión', metricas.pendientes, 'text-amber-600'],
        ].map(([l, v, c]) => (
          <div key={l} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">{l}</p>
            <p className={`mt-1 font-display text-3xl font-bold ${c}`}>{v}</p>
          </div>
        ))}
      </div>

      {/* Gráfico de impacto regional */}
      <div className="mb-6">
        <GraficoCiudades solicitudes={solicitudes} />
      </div>

      {errorConexion && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {errorConexion}
        </div>
      )}

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nombre, cédula o material…"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-andes-blue focus:ring-2 focus:ring-andes-blue/20 lg:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <select value={fCiudad} onChange={(e) => setFCiudad(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-andes-blue">
            {ciudades.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={fEstado} onChange={(e) => setFEstado(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-andes-blue">
            <option>Todos</option>
            {ESTADOS.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
        <span className="text-sm text-slate-500 lg:ml-auto">{filtradas.length} registro{filtradas.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Tabla (desktop) / Tarjetas (móvil) */}
      {cargando ? (
        <div className="grid place-items-center rounded-2xl border border-slate-200 bg-white py-20 text-slate-400">Cargando solicitudes…</div>
      ) : filtradas.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">
          <svg viewBox="0 0 24 24" className="mb-3 h-12 w-12 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
          <p className="font-medium text-andes-deep">No hay solicitudes para mostrar.</p>
          <p className="mt-1 text-sm">Las nuevas aparecerán aquí automáticamente. Para el demo, usa el botón <span className="font-semibold text-andes-gold">«Cargar datos demo»</span> de arriba.</p>
        </div>
      ) : (
        <>
          {/* Vista de tabla en pantallas grandes */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="w-full text-sm">
              <thead className="bg-andes-ink text-left text-xs uppercase tracking-wide text-blue-100">
                <tr>
                  <th className="px-4 py-3">Solicitante</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Ciudad</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtradas.map((s) => {
                  const color = ESTADO_COLOR[s.estado] || { bg: '#F3F4F6', fg: '#374151' };
                  return (
                    <tr key={s.id} className="transition hover:bg-andes-mist/50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-andes-ink">{s.nombre}</p>
                        <p className="text-xs text-slate-400">CC {s.cedula}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-600">{s.telefono}</p>
                        <p className="text-xs text-slate-400">{s.correo}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{s.ciudad}</td>
                      <td className="px-4 py-3">
                        <p className="text-slate-700">{s.materialNombre}</p>
                        <p className="text-xs text-slate-400">{s.tipoMaterial}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{fechaCorta(s.creadoEn)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={s.estado}
                          disabled={guardandoId === s.id}
                          onChange={(e) => cambiarEstado(s.id, e.target.value)}
                          style={{ backgroundColor: color.bg, color: color.fg }}
                          className="rounded-lg border-0 px-2.5 py-1.5 text-xs font-semibold outline-none ring-1 ring-black/5 disabled:opacity-50"
                        >
                          {ESTADOS.map((e) => <option key={e} value={e} style={{ background: 'white', color: '#0B1F3A' }}>{e}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Vista de tarjetas en móvil */}
          <div className="space-y-3 lg:hidden">
            {filtradas.map((s) => {
              const color = ESTADO_COLOR[s.estado] || { bg: '#F3F4F6', fg: '#374151' };
              return (
                <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display font-semibold text-andes-ink">{s.nombre}</p>
                      <p className="text-xs text-slate-400">CC {s.cedula} · {s.ciudad}</p>
                    </div>
                    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: color.bg, color: color.fg }}>
                      {s.estado}
                    </span>
                  </div>
                  <div className="mt-3 rounded-xl bg-andes-mist p-3 text-sm">
                    <p className="font-medium text-andes-deep">{s.materialNombre}</p>
                    <p className="text-xs text-slate-500">{s.tipoMaterial}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <span>📞 {s.telefono}</span>
                    <span className="truncate">✉️ {s.correo}</span>
                  </div>
                  <select
                    value={s.estado}
                    disabled={guardandoId === s.id}
                    onChange={(e) => cambiarEstado(s.id, e.target.value)}
                    className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium outline-none focus:border-andes-blue"
                  >
                    {ESTADOS.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
              );
            })}
          </div>
        </>
      )}

      <Toast
        mensaje={toast?.mensaje}
        tipo={toast?.tipo}
        onCerrar={() => setToast(null)}
      />
    </div>
  );
}
