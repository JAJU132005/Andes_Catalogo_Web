// ============================================================
//  MOTOR DE RECOMENDACIÓN (basado en reglas)
// ============================================================
// Sistema determinista que entiende la NECESIDAD del usuario y
// recomienda recursos del catálogo. No usa IA externa: no cuesta,
// no expone claves, funciona sin internet y NUNCA inventa recursos
// inexistentes. Para un MVP social es una fortaleza, no una carencia.
//
// Cómo funciona:
//  1. A cada recurso le asignamos ETIQUETAS semánticas (temas,
//     poblaciones, niveles, materias) más allá de su texto literal.
//  2. Analizamos la frase del usuario detectando INTENCIONES
//     (qué materia, qué población, qué nivel, qué necesidad).
//  3. Puntuamos cada recurso por coincidencia de intención y
//     devolvemos los mejores, con una explicación generada.
// ============================================================

import catalogo from '../data/catalogo.json';

const sinTildes = (s) =>
  (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// --- 1. Etiquetas semánticas por recurso (curadas a mano) ---
// Enriquecen el catálogo con conceptos que el texto no dice literal.
const ETIQUETAS = {
  'RD-001': ['braille', 'visual', 'lectura', 'alfabeto', 'inicial'],
  'RD-002': ['geometria', 'matematicas', 'tactil', 'visual', 'primaria', 'formas'],
  'RD-003': ['geografia', 'colombia', 'mapa', 'sociales', 'relieve', 'basica'],
  'RD-004': ['braille', 'visual', 'escritura', 'practica'],
  'RD-005': ['quimica', 'ciencias', 'moleculas', 'media', 'atomos'],
  'RD-006': ['comunicacion', 'tea', 'autismo', 'pictogramas', 'lenguaje', 'aac'],
  'RD-007': ['geografia', 'mapa', 'mundo', 'sociales', 'primaria', 'continentes'],
  'RD-008': ['braille', 'visual', 'medicion', 'matematicas', 'regla'],
  'RD-009': ['fracciones', 'matematicas', 'primaria', 'montessori', 'numeros'],
  'RD-010': ['motriz', 'escritura', 'lapiz', 'agarre', 'ergonomico', 'fina'],
  'RD-011': ['visual', 'letras', 'alfabeto', 'inicial', 'lectura', 'tactil'],
  'RD-012': ['tiempo', 'reloj', 'matematicas', 'primaria', 'horas'],
  'RD-013': ['visual', 'braille', 'angulos', 'geometria', 'matematicas', 'media'],
  'RD-014': ['abaco', 'matematicas', 'numeros', 'primaria', 'calculo', 'conteo'],
  'RD-015': ['motriz', 'soporte', 'lectura', 'manos libres', 'atril'],
  'RD-016': ['anatomia', 'corazon', 'ciencias', 'biologia', 'cuerpo', 'media', 'organo'],
  'RD-017': ['astronomia', 'sistema solar', 'planetas', 'ciencias', 'espacio', 'primaria'],
  'RD-018': ['biologia', 'celula', 'ciencias', 'cuerpo', 'media', 'organulos'],
  'RD-019': ['anatomia', 'esqueleto', 'huesos', 'ciencias', 'biologia', 'cuerpo'],
  'RD-020': ['geologia', 'volcan', 'ciencias', 'tierra', 'primaria'],
  'RD-021': ['motriz', 'silla de ruedas', 'accesorio', 'movilidad'],
  'RD-022': ['motriz', 'soporte', 'tablet', 'movilidad reducida', 'cama'],
  'RD-023': ['motriz', 'puertas', 'manija', 'autonomia', 'dedos'],
  'RD-024': ['historia', 'piramide', 'egipto', 'sociales', 'basica'],
  'RD-025': ['motriz', 'lectura', 'paginas', 'libros', 'autonomia', 'mano'],
};

// --- 2. Diccionario de intenciones (sinónimos → concepto) ---
// Cada concepto tiene palabras que el usuario podría usar.
const INTENCIONES = {
  visual:        ['ciego', 'ciega', 'vista', 've', 'visual', 'baja vision', 'invidente', 'no vidente', 'braille', 'ver'],
  motriz:        ['motriz', 'motor', 'mano', 'manos', 'dedos', 'mover', 'agarrar', 'sostener', 'silla de ruedas', 'movilidad', 'paralisis', 'parkinson'],
  tea:           ['autismo', 'autista', 'tea', 'comunicar', 'comunicacion', 'no habla', 'lenguaje', 'pictograma'],
  matematicas:   ['matematica', 'matematicas', 'numero', 'numeros', 'sumar', 'contar', 'calculo', 'aritmetica'],
  fracciones:    ['fraccion', 'fracciones', 'partes', 'mitad'],
  geometria:     ['geometria', 'figura', 'figuras', 'forma', 'formas', 'angulo', 'angulos', 'triangulo', 'circulo'],
  ciencias:      ['ciencia', 'ciencias', 'naturales'],
  biologia:      ['biologia', 'celula', 'cuerpo', 'organo', 'organos', 'esqueleto', 'hueso', 'huesos', 'anatomia'],
  quimica:       ['quimica', 'molecula', 'moleculas', 'atomo', 'atomos', 'elemento'],
  anatomia:      ['anatomia', 'corazon', 'cuerpo humano', 'organo'],
  astronomia:    ['planeta', 'planetas', 'sistema solar', 'espacio', 'astronomia', 'universo'],
  geografia:     ['geografia', 'mapa', 'pais', 'continente', 'colombia', 'mundo', 'departamento'],
  historia:      ['historia', 'piramide', 'egipto', 'antiguo'],
  geologia:      ['volcan', 'geologia', 'tierra', 'capas'],
  tiempo:        ['reloj', 'hora', 'horas', 'tiempo'],
  lectura:       ['leer', 'lectura', 'libro', 'libros', 'pagina', 'paginas'],
  escritura:     ['escribir', 'escritura', 'lapiz', 'lapicero'],
  alfabeto:      ['letra', 'letras', 'alfabeto', 'abecedario'],
};

// Niveles educativos (para afinar, no para filtrar duro)
const NIVELES = {
  inicial:  ['inicial', 'preescolar', 'jardin', 'parvulos', 'pequenos'],
  primaria: ['primaria', 'nino', 'ninos', 'nina', 'ninas', 'basica', 'escolar'],
  media:    ['media', 'secundaria', 'bachillerato', 'adolescente', 'joven'],
};

function detectar(texto, dicc) {
  const t = sinTildes(texto);
  const encontrados = [];
  for (const [concepto, sinonimos] of Object.entries(dicc)) {
    if (sinonimos.some((s) => t.includes(sinTildes(s)))) encontrados.push(concepto);
  }
  return encontrados;
}

// --- 3. Recomendador principal ---
export function recomendar(necesidad) {
  const conceptos = detectar(necesidad, INTENCIONES);
  const niveles = detectar(necesidad, NIVELES);
  const palabras = sinTildes(necesidad).split(/\s+/).filter((w) => w.length > 3);

  const puntuados = catalogo.map((r) => {
    const etiquetas = ETIQUETAS[r.id] || [];
    const blob = sinTildes(`${r.nombre} ${r.descripcion} ${r.poblacion} ${r.categoria} ${etiquetas.join(' ')}`);
    let score = 0;

    // (a) coincidencia de conceptos detectados con etiquetas: peso alto
    conceptos.forEach((c) => { if (etiquetas.includes(c)) score += 6; });

    // (b) coincidencia de nivel educativo: peso medio
    niveles.forEach((n) => { if (etiquetas.includes(n)) score += 3; });

    // (c) coincidencia literal de palabras sueltas: peso bajo
    palabras.forEach((p) => { if (blob.includes(p)) score += 1; });

    return { r, score };
  });

  const ordenados = puntuados.filter((x) => x.score > 0).sort((a, b) => b.score - a.score);

  // Evitar "relleno": si el mejor resultado es fuerte, descartamos los
  // que tengan un score muy inferior (menos de un tercio del máximo).
  let top = ordenados;
  if (ordenados.length > 1) {
    const max = ordenados[0].score;
    top = ordenados.filter((x) => x.score >= Math.max(2, max / 3));
  }

  return {
    conceptos,
    niveles,
    recursos: top.slice(0, 3).map((x) => x.r),
    hayCoincidencia: ordenados.length > 0,
  };
}

// --- 4. Explicación legible generada a partir de la intención ---
const NOMBRE_CONCEPTO = {
  visual: 'discapacidad visual', motriz: 'discapacidad motriz', tea: 'comunicación aumentativa',
  matematicas: 'matemáticas', fracciones: 'fracciones', geometria: 'geometría',
  ciencias: 'ciencias', biologia: 'biología', quimica: 'química', anatomia: 'anatomía',
  astronomia: 'astronomía', geografia: 'geografía', historia: 'historia', geologia: 'geología',
  tiempo: 'enseñanza del tiempo', lectura: 'lectura', escritura: 'escritura', alfabeto: 'el alfabeto',
};

export function explicar(resultado) {
  if (!resultado.hayCoincidencia) {
    return 'No identifiqué una necesidad específica. Te muestro algunos recursos destacados; también puedes explorar el catálogo completo.';
  }
  const temas = resultado.conceptos.map((c) => NOMBRE_CONCEPTO[c]).filter(Boolean);
  if (temas.length === 0) {
    return 'Según lo que describes, estos recursos del catálogo podrían ayudarte:';
  }
  const lista = temas.length === 1 ? temas[0] : temas.slice(0, -1).join(', ') + ' y ' + temas[temas.length - 1];
  return `Detecté que tu necesidad se relaciona con ${lista}. Estos recursos son los más adecuados:`;
}
