import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import catalogo from '../data/catalogo.json';
import { crearSolicitud } from '../lib/datos';
import { tipoMaterial } from '../lib/catalogo';
import { COLORES_FILAMENTO } from '../lib/colores';

const VACIO = { nombre: '', cedula: '', ciudad: '', correo: '', telefono: '', materialId: '', color: '' };

// Validaciones de cada campo obligatorio
function validar(f) {
  const e = {};
  if (!f.nombre.trim() || f.nombre.trim().length < 3) e.nombre = 'Ingresa tu nombre completo.';
  if (!/^\d{6,12}$/.test(f.cedula.trim())) e.cedula = 'La cédula debe tener entre 6 y 12 dígitos.';
  if (!f.ciudad.trim()) e.ciudad = 'Indica tu ciudad.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo.trim())) e.correo = 'Correo no válido.';
  if (!/^\d{7,10}$/.test(f.telefono.trim())) e.telefono = 'Teléfono de 7 a 10 dígitos.';
  if (!f.materialId) e.materialId = 'Selecciona el material requerido.';
  return e;
}

export default function Solicitar() {
  const location = useLocation();
  const navigate = useNavigate();
  const preseleccion = location.state?.recurso;

  const [form, setForm] = useState({
    ...VACIO,
    materialId: preseleccion?.id || '',
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');

  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
    if (errores[campo]) setErrores({ ...errores, [campo]: undefined });
  };

  const enviar = async (e) => {
    e.preventDefault();
    setErrorEnvio('');
    const errs = validar(form);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    const material = catalogo.find((r) => r.id === form.materialId);
    setEnviando(true);
    try {
      await crearSolicitud({
        ...form,
        materialNombre: material.nombre,
        tipoMaterial: tipoMaterial(material.categoria),
      });
      setExito(true);
    } catch (err) {
      setErrorEnvio('No se pudo registrar la solicitud. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm animate-fade-up">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold text-andes-ink">¡Solicitud registrada!</h2>
          <p className="mt-2 text-sm text-slate-600">
            Hemos recibido tu solicitud. El equipo de ANDES se pondrá en contacto contigo
            para dar seguimiento. Gracias por confiar en nosotros.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button onClick={() => { setExito(false); setForm(VACIO); }} className="rounded-xl bg-andes-blue py-3 font-display font-semibold text-white transition hover:bg-andes-deep">
              Registrar otra solicitud
            </button>
            <button onClick={() => navigate('/')} className="rounded-xl border border-slate-300 py-3 font-display font-semibold text-andes-deep transition hover:bg-andes-mist">
              Volver al catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const campo = (label, name, props = {}) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-andes-deep">{label}</label>
      <input
        value={form[name]}
        onChange={set(name)}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-andes-blue/20 ${
          errores[name] ? 'border-red-400' : 'border-slate-300 focus:border-andes-blue'
        }`}
        {...props}
      />
      {errores[name] && <p className="mt-1 text-xs text-red-600">{errores[name]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-andes-ink">Solicitar material</h1>
        <p className="mt-1 text-sm text-slate-600">
          Completa el formulario. Todos los campos son obligatorios para garantizar el seguimiento.
        </p>
      </div>

      <form onSubmit={enviar} noValidate className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {campo('Nombre completo', 'nombre', { placeholder: 'Ej. María Fernanda Rojas' })}
          {campo('Cédula', 'cedula', { placeholder: 'Solo números', inputMode: 'numeric' })}
          {campo('Ciudad', 'ciudad', { placeholder: 'Ej. Bucaramanga' })}
          {campo('Teléfono', 'telefono', { placeholder: 'Ej. 3001234567', inputMode: 'tel' })}
        </div>
        {campo('Correo electrónico', 'correo', { placeholder: 'tucorreo@ejemplo.com', type: 'email' })}

        <div>
          <label className="mb-1 block text-sm font-medium text-andes-deep">Tipo de material 3D requerido</label>
          <select
            value={form.materialId}
            onChange={set('materialId')}
            className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-andes-blue/20 ${
              errores.materialId ? 'border-red-400' : 'border-slate-300 focus:border-andes-blue'
            }`}
          >
            <option value="">Selecciona un recurso del catálogo…</option>
            <optgroup label="Material Didáctico">
              {catalogo.filter((r) => tipoMaterial(r.categoria) === 'Material Didáctico')
                .map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </optgroup>
            <optgroup label="Ayudas de Accesibilidad">
              {catalogo.filter((r) => tipoMaterial(r.categoria) === 'Ayuda de Accesibilidad')
                .map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </optgroup>
          </select>
          {errores.materialId && <p className="mt-1 text-xs text-red-600">{errores.materialId}</p>}
        </div>

        {/* Selector de color: aparece si el material seleccionado está disponible */}
        {(() => {
          const sel = catalogo.find((r) => r.id === form.materialId);
          if (!sel || sel.estadoStock !== 'Disponible') return null;
          return (
            <div className="rounded-2xl border border-andes-gold/30 bg-andes-gold/5 p-4">
              <label className="mb-1 block text-sm font-medium text-andes-deep">
                Color del filamento
                <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">Disponible</span>
              </label>
              <p className="mb-3 text-xs text-slate-500">Elige el color en que quieres tu material 3D.</p>
              <div className="flex flex-wrap gap-2.5">
                {COLORES_FILAMENTO.map((c) => {
                  const activo = form.color === c.nombre;
                  return (
                    <button
                      key={c.nombre}
                      type="button"
                      onClick={() => setForm({ ...form, color: c.nombre })}
                      title={c.nombre}
                      className={`group relative h-9 w-9 rounded-full transition ${activo ? 'ring-2 ring-andes-gold ring-offset-2 ring-offset-transparent scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c.hex, border: c.hex === '#F4F6FA' ? '1px solid #ccc' : 'none' }}
                    >
                      {activo && (
                        <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto h-4 w-4" fill="none"
                          stroke={c.hex === '#F4F6FA' || c.hex === '#E8A317' ? '#1E2330' : '#fff'} strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              {form.color && (
                <p className="mt-3 text-xs text-slate-400">Color elegido: <span className="font-medium text-andes-gold">{form.color}</span></p>
              )}
            </div>
          );
        })()}

        {errorEnvio && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorEnvio}
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-xl bg-andes-blue py-3.5 font-display font-semibold text-white shadow-sm transition hover:bg-andes-deep active:scale-[0.99] disabled:opacity-60"
        >
          {enviando ? 'Registrando…' : 'Enviar solicitud'}
        </button>
        <p className="text-center text-xs text-slate-400">
          Tus datos se usan únicamente para gestionar tu solicitud, conforme a la normativa de protección de datos personales.
        </p>
      </form>
    </div>
  );
}
