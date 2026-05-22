// ============================================================
//  SEED — carga solicitudes de demostración en Firestore
// ============================================================
// Uso (una sola vez, para tener datos en el demo):
//   1. Asegúrate de tener .env con las credenciales de Firebase.
//   2. node scripts/seed.js
//
// Genera solicitudes realistas basadas en ciudades del oriente
// colombiano y recursos reales del catálogo de ANDES.
// ============================================================

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogo = JSON.parse(readFileSync(join(__dirname, '../src/data/catalogo.json'), 'utf-8'));

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CIUDADES = ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Cúcuta', 'Barrancabermeja', 'San Gil'];
const NOMBRES = ['Laura Quintero', 'Carlos Mendoza', 'Diana Patiño', 'Jorge Rincón', 'Sofía Castro',
  'Andrés Villamizar', 'Paola Serrano', 'Miguel Ardila', 'Valentina Ortiz', 'Daniel Forero',
  'Camila Suárez', 'Felipe Gómez'];
const ESTADOS = ['No responde', 'No contestó', 'Confirmó', 'Llamar después', 'Interesado', 'No interesado'];
const ACCESIBILIDAD = ['Accesibilidad Visual', 'Accesibilidad Motriz', 'Accesorios de Accesibilidad', 'Comunicacion Aumentativa'];

const rand = (a) => a[Math.floor(Math.random() * a.length)];
const tipo = (cat) => ACCESIBILIDAD.includes(cat) ? 'Ayuda de Accesibilidad' : 'Material Didáctico';

async function seed() {
  console.log('Sembrando solicitudes de demostración…');
  for (let i = 0; i < 14; i++) {
    const recurso = rand(catalogo);
    const nombre = rand(NOMBRES);
    await addDoc(collection(db, 'solicitudes'), {
      nombre,
      cedula: String(1000000000 + Math.floor(Math.random() * 99999999)),
      ciudad: rand(CIUDADES),
      correo: nombre.toLowerCase().replace(/ /g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '@correo.com',
      telefono: '3' + String(Math.floor(100000000 + Math.random() * 899999999)),
      materialId: recurso.id,
      materialNombre: recurso.nombre,
      tipoMaterial: tipo(recurso.categoria),
      estado: rand(ESTADOS),
      creadoEn: serverTimestamp(),
    });
    console.log(`  ✔ ${i + 1}/14  ${nombre} → ${recurso.nombre}`);
  }
  console.log('Listo. Recarga el panel administrativo para verlas.');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
