import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogo from '../data/catalogo.json';
import TarjetaRecurso from '../components/TarjetaRecurso';
import ModalRecurso from '../components/ModalRecurso';
import Contador from '../components/Contador';
import Hero3D from '../components/Hero3D';
import { tipoMaterial } from '../lib/catalogo';

const CATEGORIAS = ['Todas', ...Array.from(new Set(catalogo.map((r) => r.categoria)))];
const TIPOS = ['Todos', 'Material Didáctico', 'Ayuda de Accesibilidad'];

export default function Catalogo() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [tipo, setTipo] = useState('Todos');
  const [seleccionado, setSeleccionado] = useState(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return catalogo.filter((r) => {
      const coincideBusqueda =
        !q ||
        r.nombre.toLowerCase().includes(q) ||
        r.descripcion.toLowerCase().includes(q) ||
        r.poblacion.toLowerCase().includes(q);
      const coincideCat = categoria === 'Todas' || r.categoria === categoria;
      const coincideTipo = tipo === 'Todos' || tipoMaterial(r.categoria) === tipo;
      return coincideBusqueda && coincideCat && coincideTipo;
    });
  }, [busqueda, categoria, tipo]);

  const irASolicitar = (recurso) => {
    navigate('/solicitar', { state: { recurso } });
  };

  return (
    <div>
      {/* HERO */}
      <Hero3D
        onVerCatalogo={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
        onSolicitar={() => navigate('/solicitar')}
      />

      {/* MÉTRICAS rápidas (datos reales del inventario) */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-6 sm:grid-cols-4 sm:px-6">
          {[
            <Contador key="a" valor={25} />,
            <Contador key="b" valor={6} />,
            <Contador key="c" valor={4.6} decimales={1} sufijo=" / 5" />,
            <Contador key="d" valor={30} prefijo="+" />,
          ].map((comp, i) => {
            const labels = ['Recursos en catálogo', 'Categorías de inclusión', 'Satisfacción promedio', 'Instituciones atendidas'];
            return (
              <div key={i} className="px-2 text-center">
                <p className="font-display text-2xl font-bold text-andes-blue sm:text-3xl">{comp}</p>
                <p className="mt-1 text-xs text-slate-500">{labels[i]}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Controles */}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar recurso, población, descripción…"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-andes-blue focus:ring-2 focus:ring-andes-blue/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-andes-blue"
            >
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-andes-blue"
            >
              {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          {filtrados.length} recurso{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
        </p>

        {filtrados.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 py-20 text-center">
            <p className="text-slate-500">No hay recursos que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <div className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((r) => (
              <TarjetaRecurso key={r.id} recurso={r} onVer={setSeleccionado} onSolicitar={irASolicitar} />
            ))}
          </div>
        )}
      </section>

      {seleccionado && (
        <ModalRecurso
          recurso={seleccionado}
          onCerrar={() => setSeleccionado(null)}
          onSolicitar={(r) => { setSeleccionado(null); irASolicitar(r); }}
        />
      )}
    </div>
  );
}
