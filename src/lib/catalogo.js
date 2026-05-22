// Utilidades del catálogo: clasificación, modelos de demo y formato.

// Modelos .glb por ID de producto. Si ANDES sube un modelo real con el
// nombre del ID (ej. /public/models/RD-001.glb), se usa ese. Para
// declararlo, agrégalo a este set (o simplemente sube el archivo y
// añade el ID aquí). Mientras tanto, se usa el modelo temático de la
// categoría como respaldo, así el visor 3D NUNCA queda vacío.
const MODELOS_REALES = new Set([
  // Agrega aquí los IDs que ya tengan su .glb real subido. Ejemplos:
    'RD-001', // Material didáctico
    'RD-002', // Figuras geométricas
    'RD-003', // Motriz
    'RD-004', // Motriz
    'RD-005', // Motriz
    'RD-006', // Motriz
    'RD-007', // Motriz
    'RD-008', // Motriz
    'RD-009', // Motriz
    'RD-010', // Motriz
    'RD-011', // Motriz
    'RD-012', // Motriz
    'RD-013', // Motriz
    'RD-014', // Motriz
    'RD-015', // Motriz
    'RD-016', // Motriz
    'RD-017', // Motriz
]);

// Mapa opcional para nombres de archivo que no coinciden con el ID.
const MODELO_ARCHIVO = {
  'RD-001': '/models/RD-uno.glb', // GLB real subido (material didáctico)
  'RD-002': '/models/RD-dos.glb', // GLB real subido (figuras geométricas)
  'RD-003': '/models/RD-tres.glb', // GLB real subido (Motriz)
  'RD-004': '/models/RD-cuatro.glb', // GLB real subido (Motriz)
  'RD-005': '/models/RD-cinco.glb', // GLB real subido (Motriz)
  'RD-006': '/models/RD-seis.glb', // GLB real subido (Motriz)
  'RD-007': '/models/RD-siete.glb', // GLB real subido (Motriz)
  'RD-008': '/models/RD-ocho.glb', // GLB real subido (Motriz)
  'RD-009': '/models/RD-nueve.glb', // GLB real subido (Motriz)
  'RD-010': '/models/RD-diez.glb', // GLB real subido (Motriz)
  'RD-011': '/models/RD-once.glb', // GLB real subido (Motriz)
  'RD-012': '/models/RD-doce.glb', // GLB real subido (Motriz)
  'RD-013': '/models/RD-trece.glb', // GLB real subido (Motriz)
  'RD-014': '/models/RD-catorce.glb', // GLB real subido (Motriz)
  'RD-015': '/models/RD-quince.glb', // GLB real subido (Motriz)
  'RD-016': '/models/RD-dieciseis.glb', // GLB real subido (Motriz)
  'RD-017': '/models/RD-diecisiete.glb', // GLB real subido (Motriz)
};

// Modelos .glb temáticos por categoría (respaldo). Propios y livianos.
const MODELO_POR_CATEGORIA = {
  'Material Didactico':          '/models/didactico.glb',
  'Figuras Didacticas':          '/models/figuras.glb',
  'Accesibilidad Visual':        '/models/visual.glb',
  'Accesibilidad Motriz':        '/models/motriz.glb',
  'Comunicacion Aumentativa':    '/models/aac.glb',
  'Accesorios de Accesibilidad': '/models/accesorio.glb',
};

// Las categorías del Excel se agrupan en los DOS tipos que pide el reto.
const ACCESIBILIDAD = new Set([
  'Accesibilidad Visual',
  'Accesibilidad Motriz',
  'Accesorios de Accesibilidad',
  'Comunicacion Aumentativa',
]);

export function tipoMaterial(categoria) {
  return ACCESIBILIDAD.has(categoria)
    ? 'Ayuda de Accesibilidad'
    : 'Material Didáctico';
}

export function modeloDe(recurso) {
  // 1) Archivo explícito por ID
  if (MODELO_ARCHIVO[recurso.id]) return MODELO_ARCHIVO[recurso.id];
  // 2) Convención: /models/{ID}.glb si está declarado como real
  if (MODELOS_REALES.has(recurso.id)) return `/models/${recurso.id}.glb`;
  // 3) Respaldo temático por categoría
  return MODELO_POR_CATEGORIA[recurso.categoria] || null;
}

// ============================================================
//  IMÁGENES DE PRODUCTOS (por ruta directa)
// ============================================================
// Pon aquí la ruta directa de la imagen de cada producto. Las
// imágenes van en la carpeta /public/images/ y aquí las enlazas
// por su nombre de archivo exacto (el que tú quieras).
//
// PASOS PARA AGREGAR UNA IMAGEN:
//  1. Copia tu imagen a la carpeta:  public/images/
//     Ej:  public/images/corazon.jpg
//  2. Agrega una línea aquí con el ID del producto y la ruta:
//     'RD-016': '/images/corazon.jpg',
//  3. Guarda, sube a GitHub. ¡Listo!
//
// Si un producto NO tiene imagen aquí, se muestra su ícono 3D
// temático (no se rompe nada).
// ============================================================
const IMAGEN_POR_ID = {
  // Ejemplos (descomenta y ajusta a tus archivos reales):
  // 'RD-001': '/images/braille-abecedario.jpg',
  // 'RD-002': '/images/figuras-geometricas.jpg',
  // 'RD-016': '/images/corazon-humano.png',
};

// Devuelve la ruta de la imagen del producto, o null si no tiene.
export function imagenDe(recurso) {
  return IMAGEN_POR_ID[recurso.id] || null;
}

export function formatoCOP(valor) {
  if (valor == null) return '—';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(valor);
}

// Color de chip por categoría
export const CATEGORIA_CHIP = {
  'Material Didactico':          'bg-blue-100 text-blue-800',
  'Figuras Didacticas':          'bg-indigo-100 text-indigo-800',
  'Accesibilidad Visual':        'bg-amber-100 text-amber-800',
  'Accesibilidad Motriz':        'bg-emerald-100 text-emerald-800',
  'Comunicacion Aumentativa':    'bg-fuchsia-100 text-fuchsia-800',
  'Accesorios de Accesibilidad': 'bg-teal-100 text-teal-800',
};
