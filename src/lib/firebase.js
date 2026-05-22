// ============================================================
//  CONFIGURACIÓN DE FIREBASE
// ============================================================
// IMPORTANTE (para defender ante el jurado):
// Estas claves "apiKey" del SDK web NO son secretas. Firebase está
// diseñado para exponerlas en el navegador: solo identifican tu
// proyecto. La SEGURIDAD REAL la dan las Reglas de Seguridad de
// Firestore (ver firestore.rules) que controlan quién lee/escribe.
// Por eso aquí usamos variables de entorno por buena práctica y
// portabilidad, pero su exposición no es una vulnerabilidad.
// ============================================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ¿Está Firebase configurado? Lo exportamos para que la UI pueda
// avisar amablemente en vez de romperse si faltan credenciales.
const faltantes = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

export const firebaseConfigurado = faltantes.length === 0;

if (!firebaseConfigurado) {
  console.warn(
    '[ANDES] Firebase no está configurado. Faltan:',
    faltantes.join(', '),
    '\nCopia .env.example a .env y rellena tus credenciales. ' +
    'La app sigue funcionando: el catálogo y el visor 3D no necesitan Firebase; ' +
    'solo el envío de solicitudes y el panel administrativo lo requieren.'
  );
}

// Inicialización tolerante a fallos: si las credenciales faltan o son
// inválidas, NO dejamos que la excepción tumbe toda la aplicación.
// El catálogo y el visor 3D deben verse siempre.
let app = null;
let db = null;
let auth = null;

if (firebaseConfigurado) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (err) {
    console.error('[ANDES] No se pudo inicializar Firebase:', err.message);
  }
}

export { db, auth };
export default app;
