// Gráfico de barras horizontales de solicitudes por ciudad.
// SVG puro (sin librerías) para mantener el bundle liviano.
// Visualiza el impacto regional — criterio clave del reto.

const COLORES = ['#2E7BFF', '#36C5F0', '#E8A317', '#5B8DEF', '#4FD1C5', '#F6AD55'];

export default function GraficoCiudades({ solicitudes }) {
  // Agrupar por ciudad
  const conteo = {};
  solicitudes.forEach((s) => {
    if (!s.ciudad) return;
    conteo[s.ciudad] = (conteo[s.ciudad] || 0) + 1;
  });
  const datos = Object.entries(conteo)
    .map(([ciudad, n]) => ({ ciudad, n }))
    .sort((a, b) => b.n - a.n);

  if (datos.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        Aún no hay datos para graficar.
      </div>
    );
  }

  const max = Math.max(...datos.map((d) => d.n));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display font-semibold text-andes-ink">Solicitudes por ciudad</h3>
        <span className="text-xs text-slate-400">Impacto regional</span>
      </div>
      <div className="space-y-3">
        {datos.map((d, i) => (
          <div key={d.ciudad} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-right text-sm text-slate-600" title={d.ciudad}>
              {d.ciudad}
            </span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-andes-mist">
              <div
                className="flex h-full items-center justify-end rounded-lg pr-2 text-xs font-semibold text-white transition-all duration-700"
                style={{
                  width: `${Math.max((d.n / max) * 100, 10)}%`,
                  background: `linear-gradient(90deg, ${COLORES[i % COLORES.length]}cc, ${COLORES[i % COLORES.length]})`,
                }}
              >
                {d.n}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
