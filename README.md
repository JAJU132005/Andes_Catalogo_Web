# ANDES · Catálogo 3D Social

> Plataforma web (MVP) para centralizar la gestión del catálogo social de **ANDES** — Asociación Nacional para el Desarrollo Social.
> Desarrollada para la **Hackathon Talento Tech Oriente 2026** (Bucaramanga, 21–22 de mayo).

**Frase única:** *Permite a comunidades e instituciones explorar en 3D recursos didácticos y de accesibilidad de bajo costo, solicitarlos en línea, y que ANDES gestione cada solicitud de forma centralizada y en tiempo real.*

---

## El problema que resuelve

ANDES gestiona la entrega de material didáctico y ayudas de accesibilidad impresas en 3D, pero su demanda se gestiona de forma artesanal y dispersa: no hay un repositorio donde la comunidad vea los modelos antes de solicitarlos, ni un sistema único donde el personal capture y organice la demanda. Esta plataforma centraliza ese flujo de punta a punta.

## Qué incluye (los 3 módulos del reto)

1. **Catálogo interactivo web con visor 3D** — explora 25 recursos reales del inventario de ANDES, con visor 3D interactivo (rotar / zoom) basado en Google `<model-viewer>`, búsqueda y filtros por tipo y categoría.
2. **Sistema de captura de datos** — formulario con validación de los campos obligatorios: Nombre, Cédula, Ciudad, Correo, Teléfono y Tipo de Material 3D.
3. **Dashboard administrativo** — tabla de solicitudes en **tiempo real**, con filtrado por ciudad y estado, métricas, y edición manual de los estados obligatorios: *No responde, No contestó, Confirmó, Llamar después, Interesado, No interesado.*

## Stack tecnológico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Frontend | React + Vite | Rápido, moderno, fácil de desplegar como sitio estático |
| Estilos | Tailwind CSS | Interfaz limpia y responsive en poco tiempo |
| Visor 3D | Google `<model-viewer>` | Recomendado por el reto; simple y robusto |
| Backend / Datos | Firebase (Firestore + Auth) | Base de datos en tiempo real sin servidor propio |
| Despliegue | Render (sitio estático) | Publica el `dist/` para que los evaluadores lo usen |

## Cómo correrlo localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar Firebase
cp .env.example .env
#    → rellena .env con las credenciales de tu proyecto Firebase

# 3. Modo desarrollo
npm run dev

# 4. (Opcional) Cargar solicitudes de demostración
npm run seed
```

> La app funciona aunque Firebase no esté configurado: el catálogo y el visor 3D no lo necesitan. El envío de solicitudes y el panel administrativo sí requieren Firebase.

## Configurar Firebase (paso a paso)

1. Entra a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto.
2. **Firestore Database** → *Crear base de datos* → modo producción.
3. Pega el contenido de [`firestore.rules`](./firestore.rules) en la pestaña **Reglas** y publica.
4. **Authentication** → *Sign-in method* → habilita **Anónimo**.
5. **Configuración del proyecto** → *Tus apps* → registra una app web y copia las credenciales a tu `.env`.

## Seguridad

- Las claves del SDK web de Firebase **no son secretas** (identifican el proyecto). La protección real la dan las **reglas de Firestore**: cualquiera puede *crear* una solicitud (formulario público) con campos validados, pero solo usuarios **autenticados** del equipo ANDES pueden *leer* y *actualizar* estados. Nadie borra registros (trazabilidad).
- El panel administrativo exige clave de acceso del equipo + sesión autenticada.
- Validación de campos tanto en el cliente (UX) como en las reglas (servidor).

## Escalabilidad (diseño)

- El frontend es estático: escala automáticamente vía CDN.
- Firestore escala de forma gestionada y sincroniza en tiempo real a todos los clientes.
- Tareas pesadas (ej. generación de reportes) se moverían a *Cloud Functions* asíncronas; el MVP las resuelve en línea por simplicidad.

## Estructura del proyecto

```
src/
├── components/     # NavBar, Visor3D, TarjetaRecurso, ModalRecurso, LoginAdmin
├── pages/          # Catalogo, Solicitar, Admin
├── lib/            # firebase.js (config), datos.js (Firestore), catalogo.js (helpers)
├── data/           # catalogo.json (25 recursos reales de ANDES)
└── App.jsx         # rutas
scripts/seed.js     # datos de demostración
firestore.rules     # reglas de seguridad
render.yaml         # configuración de despliegue
```

## Despliegue en Render

Ver instrucciones detalladas en la sección del entregable. Resumen: conectar el repo de GitHub, tipo *Static Site*, build `npm install && npm run build`, publish `./dist`, y cargar las 6 variables `VITE_FIREBASE_*` en el panel de Environment.

## Datos

El catálogo (`src/data/catalogo.json`) proviene del inventario real de recursos de ANDES: 25 recursos en 6 categorías de inclusión, con una satisfacción promedio de 4.6/5 reportada por más de 30 instituciones beneficiarias.

---

**Equipo:** _[completar nombres y roles]_
**Evento:** Hackathon Talento Tech Oriente · Neomundo · 2026
