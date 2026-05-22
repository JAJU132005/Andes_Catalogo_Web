// ============================================================
//  CAPA DE DATOS — Firestore (tiempo real)
// ============================================================
// Centraliza TODAS las operaciones de base de datos en un solo
// lugar. Así el resto de la app no sabe que por debajo hay Firebase:
// si mañana cambiáramos de motor, solo se toca este archivo.
// ============================================================

import {
  collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, getDocs, writeBatch, where,
} from 'firebase/firestore';
import { db } from './firebase';
import catalogo from '../data/catalogo.json';

const SOLICITUDES = 'solicitudes';

// Mensaje único cuando Firebase no está disponible.
function sinFirebase() {
  return new Error(
    'La base de datos no está configurada. Configura Firebase (.env) para guardar y gestionar solicitudes.'
  );
}

// Estados obligatorios EXACTOS que pide la ficha técnica del reto
export const ESTADOS = [
  'No responde',
  'No contestó',
  'Confirmó',
  'Llamar después',
  'Interesado',
  'No interesado',
];

// Color por estado para el dashboard (consistencia visual)
export const ESTADO_COLOR = {
  'No responde':   { bg: '#FEE2E2', fg: '#991B1B' },
  'No contestó':   { bg: '#FEF3C7', fg: '#92400E' },
  'Confirmó':      { bg: '#DCFCE7', fg: '#166534' },
  'Llamar después':{ bg: '#DBEAFE', fg: '#1E40AF' },
  'Interesado':    { bg: '#E0E7FF', fg: '#3730A3' },
  'No interesado': { bg: '#F3F4F6', fg: '#374151' },
};

/**
 * Crea una nueva solicitud (formulario público).
 * Devuelve el id del documento creado.
 */
export async function crearSolicitud(datos) {
  if (!db) throw sinFirebase();
  const ref = await addDoc(collection(db, SOLICITUDES), {
    nombre: datos.nombre.trim(),
    cedula: datos.cedula.trim(),
    ciudad: datos.ciudad.trim(),
    correo: datos.correo.trim().toLowerCase(),
    telefono: datos.telefono.trim(),
    materialId: datos.materialId,
    materialNombre: datos.materialNombre,
    tipoMaterial: datos.tipoMaterial, // 'Material Didáctico' | 'Ayuda de Accesibilidad'
    color: datos.color || 'No especificado',
    estado: 'No responde', // estado inicial por defecto
    creadoEn: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Suscripción en TIEMPO REAL a todas las solicitudes.
 * El callback se dispara automáticamente cada vez que cambia
 * cualquier dato en Firestore — sin recargar la página.
 * Devuelve la función para cancelar la suscripción.
 */
export function escucharSolicitudes(callback, onError) {
  if (!db) { onError?.(sinFirebase()); return () => {}; }
  const q = query(collection(db, SOLICITUDES), orderBy('creadoEn', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(lista);
    },
    (err) => {
      console.error('[ANDES] Error escuchando solicitudes:', err);
      onError?.(err);
    }
  );
}

/**
 * Actualiza el estado de seguimiento de una solicitud.
 * El cambio se refleja en TODOS los clientes conectados al instante.
 */
export async function actualizarEstado(id, nuevoEstado) {
  if (!db) throw sinFirebase();
  if (!ESTADOS.includes(nuevoEstado)) {
    throw new Error('Estado no válido: ' + nuevoEstado);
  }
  await updateDoc(doc(db, SOLICITUDES, id), {
    estado: nuevoEstado,
    actualizadoEn: serverTimestamp(),
  });
}

// ------------------------------------------------------------
//  DATOS DE DEMOSTRACIÓN (desde el navegador)
// ------------------------------------------------------------
// Permite poblar la base con un clic desde el panel admin, sin
// tener que correr el script por terminal. Útil para el demo.

const CIUDADES = ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Cúcuta', 'Barrancabermeja', 'San Gil'];
const NOMBRES = ['Laura Quintero', 'Carlos Mendoza', 'Diana Patiño', 'Jorge Rincón', 'Sofía Castro',
  'Andrés Villamizar', 'Paola Serrano', 'Miguel Ardila', 'Valentina Ortiz', 'Daniel Forero',
  'Camila Suárez', 'Felipe Gómez', 'Natalia Bayona', 'Esteban Carreño'];
const ACCESIBILIDAD = new Set(['Accesibilidad Visual', 'Accesibilidad Motriz', 'Accesorios de Accesibilidad', 'Comunicacion Aumentativa']);
const rand = (a) => a[Math.floor(Math.random() * a.length)];

/**
 * Inserta solicitudes de demostración realistas en Firestore.
 * Devuelve la cantidad insertada.
 */
export async function sembrarDemo(cantidad = 14) {
  if (!db) throw sinFirebase();
  const batch = writeBatch(db);
  for (let i = 0; i < cantidad; i++) {
    const recurso = rand(catalogo);
    const nombre = rand(NOMBRES);
    const tipo = ACCESIBILIDAD.has(recurso.categoria) ? 'Ayuda de Accesibilidad' : 'Material Didáctico';
    const ref = doc(collection(db, SOLICITUDES));
    batch.set(ref, {
      nombre,
      cedula: String(1000000000 + Math.floor(Math.random() * 99999999)),
      ciudad: rand(CIUDADES),
      correo: nombre.toLowerCase().replace(/ /g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '@correo.com',
      telefono: '3' + String(Math.floor(100000000 + Math.random() * 899999999)),
      materialId: recurso.id,
      materialNombre: recurso.nombre,
      tipoMaterial: tipo,
      estado: rand(ESTADOS),
      esDemo: true, // etiqueta para poder borrar solo las de demo
      creadoEn: serverTimestamp(),
    });
  }
  await batch.commit();
  return cantidad;
}

/**
 * Borra solicitudes. modo='demo' borra solo las etiquetadas esDemo;
 * modo='todas' borra absolutamente todo (con confirmación en la UI).
 * Devuelve la cantidad borrada.
 */
export async function borrarSolicitudes(modo = 'demo') {
  if (!db) throw sinFirebase();
  let docs;
  if (modo === 'demo') {
    const snap = await getDocs(query(collection(db, SOLICITUDES), where('esDemo', '==', true)));
    docs = snap.docs;
  } else {
    const snap = await getDocs(collection(db, SOLICITUDES));
    docs = snap.docs;
  }
  // Firestore borra en lotes de máx. 500; troceamos por seguridad.
  let borrados = 0;
  for (let i = 0; i < docs.length; i += 400) {
    const lote = writeBatch(db);
    docs.slice(i, i + 400).forEach((d) => lote.delete(d.ref));
    await lote.commit();
    borrados += Math.min(400, docs.length - i);
  }
  return borrados;
}

/**
 * Diagnóstico de conexión: intenta leer la colección y reporta
 * qué pasa. Devuelve { ok, mensaje, cantidad }.
 */
export async function diagnosticar() {
  if (!db) return { ok: false, mensaje: 'Firebase no está configurado (faltan variables de entorno).', cantidad: 0 };
  try {
    const snap = await getDocs(collection(db, SOLICITUDES));
    return { ok: true, mensaje: 'Conexión correcta con Firestore.', cantidad: snap.size };
  } catch (err) {
    let mensaje = 'Error al leer Firestore: ' + (err.code || err.message);
    if (err.code === 'permission-denied') {
      mensaje = 'Permiso denegado por las reglas de Firestore. Verifica que habilitaste Auth Anónimo y publicaste firestore.rules.';
    }
    return { ok: false, mensaje, cantidad: 0 };
  }
}
