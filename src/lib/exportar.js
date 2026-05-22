// Exporta solicitudes a un archivo CSV descargable.
// Compatible con Excel (incluye BOM para acentos correctos).

function fechaLegible(ts) {
  if (!ts?.toDate) return '';
  return ts.toDate().toLocaleString('es-CO');
}

function escapar(valor) {
  const s = String(valor ?? '');
  // Si contiene coma, comilla o salto de línea, lo envolvemos en comillas
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export function exportarCSV(solicitudes, nombreArchivo = 'solicitudes_andes.csv') {
  const cabeceras = ['Nombre', 'Cédula', 'Ciudad', 'Correo', 'Teléfono', 'Material', 'Tipo', 'Estado', 'Fecha'];
  const filas = solicitudes.map((s) => [
    s.nombre, s.cedula, s.ciudad, s.correo, s.telefono,
    s.materialNombre, s.tipoMaterial, s.estado, fechaLegible(s.creadoEn),
  ].map(escapar).join(','));

  const contenido = '\uFEFF' + [cabeceras.join(','), ...filas].join('\n');
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
