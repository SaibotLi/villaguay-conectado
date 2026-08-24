# Plan Técnico Maestro: Seguridad Firestore + Epic MEDIA (Cloudflare R2)

**Proyecto:** VillaguayConectado  
**Versión:** 1.0 — Auditoría y Preparación Técnica  
**Estado:** Aprobado para Planificación  

---

## 1. Resumen Ejecutivo

Este documento establece la auditoría técnica integral y el plan de acción para las dos próximas etapas fundamentales del proyecto:
1. **Seguridad y Reglas de Acceso en Cloud Firestore**: Protección perimetral, control de roles y prevención de escalada de privilegios.
2. **Epic MEDIA con Cloudflare R2**: Arquitectura desacoplada para la carga, almacenamiento y entrega pública de flyers de eventos mediante Cloudflare Workers y R2.

---

## 2. Auditoría del Estado Actual de Firestore

### 2.1. Colecciones y Esquema de Datos Real

#### Colección `events`
Representa las propuestas y eventos publicados en la plataforma.
- **`id`** (string): ID autogenerado del documento en Firestore.
- **`title`** (string): Título del evento.
- **`description`** (string): Descripción detallada.
- **`location`** (string): Dirección o lugar físico del evento.
- **`mapsUrl`** (string): Enlace a Google Maps (opcional, default `""`).
- **`date`** (string): Fecha del evento (`YYYY-MM-DD`).
- **`time`** (string): Hora del evento (`HH:mm`).
- **`imageUrl`** (string): URL pública del flyer (actualmente inicializada en `""` en `createEvent`).
- **`status`** (string): Estado del ciclo de vida del evento: `'pending'` | `'approved'` | `'rejected'`.
- **`createdBy`** (string): UID del usuario autenticado en Firebase Authentication que propuso el evento.
- **`createdAt`** (Timestamp): Marca de tiempo del servidor (`serverTimestamp()`).

#### Colección `users`
Almacena el perfil enriquecido de cada usuario registrado.
- **`id`** (string): Coincide exactamente con el `user.uid` de Firebase Authentication.
- **`displayName`** (string): Nombre y apellido del usuario.
- **`email`** (string): Correo electrónico del usuario.
- **`role`** (string): Rol de permisos en la aplicación (`'user'` | `'admin'`).
- **`createdAt`** (Timestamp): Fecha y hora de creación del perfil (`serverTimestamp()`).

#### Colección `interests`
Registra la interacción "Me interesa" entre usuarios y eventos.
- **`id`** (string): Clave sintética compuesta: `${eventId}_${userId}`.
- **`eventId`** (string): ID del evento referenciado.
- **`userId`** (string): UID del usuario autenticado.
- **`createdAt`** (Timestamp): Momento en el que se marcó el interés (`serverTimestamp()`).

---

### 2.2. Queries y Operaciones Existentes

| Módulo / Servicio | Operación | Query Firestore | Propósito / Rol |
|---|---|---|---|
| `eventService.js` | `getApprovedEvents()` | `where('status', '==', 'approved')` | Listado público de eventos publicados (ordenados en cliente por `createdAt` desc). |
| `eventService.js` | `getPendingEvents()` | `where('status', '==', 'pending')` | Listado para moderación administrativa (`Admin.jsx`). |
| `eventService.js` | `getEventById(id)` | `doc(db, 'events', id)` | Vista de detalle de evento (`EventDetail.jsx`). |
| `eventService.js` | `getEventsByIds(ids)` | `where(documentId(), 'in', chunk)` | Recupera eventos favoritos del usuario en `MyInterests.jsx`. |
| `eventService.js` | `createEvent(data)` | `addDoc(collection(db, 'events'), ...)` | Usuario propone evento (`status: 'pending'`, `imageUrl: ''`). |
| `eventService.js` | `updateEvent(id, data)` | `updateDoc(doc(db, 'events', id), ...)` | Administrador edita campos informativos de un evento publicado. |
| `eventService.js` | `approveEvent(id)` | `updateDoc(..., { status: 'approved' })` | Administrador aprueba una propuesta. |
| `eventService.js` | `rejectEvent(id)` | `updateDoc(..., { status: 'rejected' })` | Administrador rechaza una propuesta. |
| `eventService.js` | `deleteEvent(id)` | `deleteDoc(doc(db, 'events', id))` | Administrador elimina un evento publicado. |
| `authService.js` | `createUserProfile(...)` | `setDoc(doc(db, 'users', uid), ...)` | Crea perfil inicial asignando `role: 'user'`. |
| `authService.js` | `getUserProfile(uid)` | `getDoc(doc(db, 'users', uid))` | Lee el perfil para resolver el rol en `AuthContext`. |
| `interestService.js` | `isInterested(eId, uId)` | `getDoc(doc(db, 'interests', id))` | Verifica si el usuario actual marcó "Me interesa". |
| `interestService.js` | `getInterestCount(eId)` | `where('eventId', '==', eventId)` | Conteo de personas interesadas para la vista pública. |
| `interestService.js` | `getUserInterests(uId)` | `where('userId', '==', userId)` | Obtiene los IDs de eventos guardados por el usuario. |
| `interestService.js` | `toggleInterest(eId, uId)` | `setDoc` / `deleteDoc` en `interests` | Alterna el estado de interés de un usuario. |

---

### 2.3. Matriz de Permisos por Rol

| Recurso / Colección | Visitante Anónimo | Usuario Autenticado (`user`) | Administrador (`admin`) |
|---|---|---|---|
| `events` (approved) | Lectura (`get`, `list`) | Lectura (`get`, `list`) | Lectura (`get`, `list`) |
| `events` (pending / rejected) | Sin acceso | Solo lectura de sus propios eventos creados | Lectura completa (`list`, `get`) |
| `events` (creación) | Sin acceso | Creación (forzando `status: 'pending'` y `createdBy: auth.uid`) | Creación |
| `events` (edición / moderación) | Sin acceso | Sin acceso | Modificación (`update`) y Eliminación (`delete`) |
| `users/{uid}` | Sin acceso | Lectura y creación de su propio perfil (`uid == auth.uid`, `role: 'user'`) | Lectura de perfiles |
| `interests/{eventId_userId}` | Lectura de conteo (`where eventId == ...`) | Lectura, creación y eliminación de sus propios intereses (`userId == auth.uid`) | Lectura y gestión |

---

## 3. Auditoría de Seguridad: Vulnerabilidades y Riesgos Actuales

Al no existir un archivo `firestore.rules` versionado y restrictivo, las reglas por defecto o en modo prueba exponen los siguientes riesgos críticos:

### Vulnerabilidad 1: Escalada de Privilegios mediante Modificación de `role`
- **Riesgo:** **CRÍTICO**.
- **Comportamiento actual:** `createUserProfile` escribe `{ role: 'user' }` directamente desde el cliente. Si las reglas permiten escritura general al usuario sobre su documento `users/{uid}`, un usuario puede enviar mediante el SDK de Firebase `{ role: 'admin' }` y obtener acceso total al panel `/admin`.
- **Comportamiento esperado:** La creación solo debe permitirse si `request.resource.data.role == 'user'`. Las actualizaciones posteriores jamás deben permitir alterar el campo `role` (`request.resource.data.role == resource.data.role` o prohibir `update` en dicho campo).
- **Regla a aplicar:**
  ```javascript
  match /users/{userId} {
    allow read: if request.auth != null && (request.auth.uid == userId || isAdmin());
    allow create: if request.auth != null && request.auth.uid == userId && request.resource.data.role == 'user';
    allow update: if request.auth != null && request.auth.uid == userId && request.resource.data.role == resource.data.role;
    allow delete: if false;
  }
  ```

### Vulnerabilidad 2: Creación de Eventos Aprobados y Falsificación de `createdBy`
- **Riesgo:** **ALTO / CRÍTICO**.
- **Comportamiento actual:** La función `createEvent` confía en los datos enviados desde React. Un usuario malicioso podría emitir una petición con `status: 'approved'` y evadir la moderación, o enviar el UID de otro usuario en `createdBy`.
- **Comportamiento esperado:** Firestore debe validar que cualquier creación tenga obligatoriamente `status == 'pending'` y que `createdBy == request.auth.uid`.
- **Regla a aplicar:**
  ```javascript
  allow create: if request.auth != null 
    && request.resource.data.status == 'pending'
    && request.resource.data.createdBy == request.auth.uid
    && request.resource.data.title is string
    && request.resource.data.date is string;
  ```

### Vulnerabilidad 3: Lectura Indiscriminada de Eventos en Revisión o Rechazados
- **Riesgo:** **MEDIO / ALTO**.
- **Comportamiento actual:** La query pública `getEvents()` filtra por `status == 'approved'`, pero un atacante que consulte `doc(db, 'events', id)` o liste sin filtro podría ver eventos no aprobados o información interna.
- **Comportamiento esperado:** Solo se permite lectura pública de documentos donde `resource.data.status == 'approved'`. Eventos pendientes/rechazados solo pueden ser leídos por su autor o por un admin.
- **Regla a aplicar:**
  ```javascript
  allow read: if resource.data.status == 'approved'
    || (request.auth != null && (resource.data.createdBy == request.auth.uid || isAdmin()));
  ```

### Vulnerabilidad 4: Moderación o Eliminación por Usuarios No Autorizados
- **Riesgo:** **CRÍTICO**.
- **Comportamiento actual:** `approveEvent`, `rejectEvent`, `updateEvent` y `deleteEvent` residen en el cliente. Si las reglas no comprueban `isAdmin()`, cualquier usuario autenticado podría borrar la base de datos o aprobar contenido ilícito.
- **Comportamiento esperado:** `update` y `delete` sobre `events` quedan estrictamente reservados a administradores autenticados.
- **Regla a aplicar:**
  ```javascript
  allow update, delete: if request.auth != null && isAdmin();
  ```

### Vulnerabilidad 5: Suplantación de Identidad en "Me interesa"
- **Riesgo:** **MEDIO**.
- **Comportamiento actual:** La creación/eliminación de documentos en `interests` debe forzar que el `userId` dentro del documento y en el ID del documento coincida con `request.auth.uid`.
- **Comportamiento esperado:** Un usuario solo puede marcar o desmarcar interés en su propio nombre.
- **Regla a aplicar:**
  ```javascript
  match /interests/{interestId} {
    allow read: if true;
    allow create: if request.auth != null 
      && request.resource.data.userId == request.auth.uid
      && interestId == (request.resource.data.eventId + '_' + request.auth.uid);
    allow delete: if request.auth != null 
      && resource.data.userId == request.auth.uid;
  }
  ```

---

## 4. Reglas Completas de Seguridad Propuestas (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función auxiliar para verificar si el usuario es administrador
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Reglas para la colección users
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || isAdmin());
      allow create: if request.auth != null 
        && request.auth.uid == userId 
        && request.resource.data.role == 'user'
        && request.resource.data.email == request.auth.token.email;
      allow update: if request.auth != null 
        && request.auth.uid == userId 
        && request.resource.data.role == resource.data.role;
      allow delete: if false;
    }

    // Reglas para la colección events
    match /events/{eventId} {
      allow read: if resource.data.status == 'approved' 
        || (request.auth != null && (resource.data.createdBy == request.auth.uid || isAdmin()));
      
      allow create: if request.auth != null 
        && request.resource.data.status == 'pending'
        && request.resource.data.createdBy == request.auth.uid
        && request.resource.data.title is string
        && request.resource.data.description is string
        && request.resource.data.location is string
        && request.resource.data.date is string
        && request.resource.data.time is string
        && request.resource.data.imageUrl is string;

      allow update, delete: if request.auth != null && isAdmin();
    }

    // Reglas para la colección interests
    match /interests/{interestId} {
      allow read: if true;
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.eventId is string
        && interestId == (request.resource.data.eventId + '_' + request.auth.uid);
      allow delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
      allow update: if false;
    }
  }
}
```

---

## 5. Preparación del Modelo de Datos (MEDIA + DISCOVERY)

### 5.1. Campo de Imagen (`imageUrl`)
- El campo `imageUrl` ya existe en el modelo y en `mapEventDocument`.
- **Regla de oro:** No crear ningún campo alternativo (`flyerUrl`, `image`, `mediaUrl`).
- `imageUrl` continuará almacenando la URL pública absoluta HTTPS provista por Cloudflare R2 (ej: `https://media.villaguayconectado.com/events/uuid.webp`).
- Si un evento no posee flyer (`imageUrl == ""`), los componentes `EventImage` y `EventPlaceholder` ya implementan el fallback visual aprobado en el Design System.

### 5.2. Campos Futuros para Filtros (`category` y `audience`)
- **Decisión arquitectónica:** **Incorporar en la Epic Discovery (Filtros y Búsqueda)**, no en esta fase.
- **Justificación:** Introducir hoy `category` o `audience` sin la interfaz de filtros ni la taxonomía municipal validada obligaría a forzar valores arbitrarios y requeriría migrar documentos antiguos. En la Epic Discovery se incorporarán de forma retrocompatible con valores opcionales o por defecto (`'general'`).

---

## 6. Arquitectura de Epic MEDIA con Cloudflare R2

### 6.1. Flujo Integral de Extremo a Extremo (R2 100% Privado)

El bucket R2 permanece **completamente privado**. El Cloudflare Worker es el único punto de entrada y salida (`React ➔ Worker ➔ R2` para upload y lectura):

```
[Usuario en Formulario]
       │
       ▼ (1. Selecciona archivo local)
[MediaPicker.jsx]  ──► (2. Valida tipo MIME, extensión y tamaño <= 5MB)
       │           ──► (3. Genera URL.createObjectURL para Preview local)
       ▼ (4. Submit de propuesta)
[mediaService.js]
       │
       ▼ (5. POST /upload multipart/form-data con Authorization: Bearer <Firebase_ID_Token>)
[Cloudflare Worker]
       │
       ├─► (6. Valida JWT de Firebase Auth)
       ├─► (7. Valida Content-Type y tamaño)
       ├─► (8. Genera clave única: `events/${crypto.randomUUID()}.${ext}`)
       ├─► (9. Escribe en Cloudflare R2 privado vía env.MEDIA_BUCKET.put)
       │
       ▼ (10. Retorna { imageUrl: "https://<worker-domain>/events/..." })
[eventService.js]
       │
       ▼ (11. createEvent con imageUrl y status: 'pending')
[Cloud Firestore]
       │
       ▼ (12. Panel Admin: Administrador aprueba)
[status = 'approved']
       │
       ▼ (13. Renderizado público: GET https://<worker-domain>/events/<key>)
[Cloudflare Worker] ──► (14. env.MEDIA_BUCKET.get con Cache-Control inmutable) ──► [EventImage]
```

---

### 6.2. Comparativa Técnica: Opción A vs Opción B

#### Opción A: Browser → Cloudflare Worker → Cloudflare R2 (RECOMENDADA)
- **Mecanismo:** El navegador interactúa únicamente con el Worker tanto en `POST /upload` como en `GET /events/<key>`. El Worker valida la sesión en subida y sirve las imágenes con cabeceras de caché inmutable (`max-age=31536000, immutable`). El bucket R2 nunca expone dominios ni URLs públicas directas.
- **Ventajas:**
  1. **Privacidad y Control Total:** R2 es inaccesible desde internet salvo a través del Worker.
  2. **Seguridad Robusta:** Se valida el token JWT de Firebase antes de almacenar.
  3. **Control Total de Nombres y Estructura:** El servidor genera los nombres sanitizados (`events/{uuid}.jpg`), impidiendo inyección de nombres maliciosos o sobreescritura de imágenes ajenas.
  4. **Simplicidad de Red:** 1 sola petición HTTP (`fetch`) desde el cliente.
  5. **Costo Cero y Sin Egress:** Cloudflare Workers + Cloudflare R2 sin costo de transferencia saliente.
  6. **Defensa Académica Inmejorable:** Demuestra arquitectura de microservicios serverless perimetral y desacoplamiento limpio.

#### Opción B: Browser → Presigned URL → Cloudflare R2
- **Mecanismo:** El cliente solicita al Worker una URL firmada de S3/R2 y luego realiza un `PUT` directo a R2.
- **Desventajas para este proyecto:** Requiere 2 viajes de red (RTT), configuración de políticas CORS complejas en el bucket de R2 para verbos `PUT`, e importar librerías pesadas de AWS S3 en el Worker (`@aws-sdk/s3-request-presigner`). Para flyers menores a 5 MB agrega complejidad innecesaria.

**Conclusión:** Se adopta formalmente la **Opción A**.

---

## 7. Componentes de Cloudflare Requeridos

1. **R2 Bucket**:
   - Nombre: `villaguay-conectado-media`
   - Configuración de Acceso Público: **Deshabilitado / 100% Privado** (sin r2.dev ni dominios directos al bucket).
2. **Cloudflare Worker**:
   - Nombre: `villaguay-media-api`
   - Binding R2: Variable `MEDIA_BUCKET` asociada al bucket `villaguay-conectado-media`.
   - Endpoints:
     - `POST /upload`: Carga autenticada de flyers.
     - `GET /events/<objectKey>`: Servicio público de flyers desde R2 con caché inmutable.
     - `GET /health`: Health check.
   - Cabeceras CORS: Control estricto de orígenes (`http://localhost:5173`, `https://villaguay-conectado.vercel.app`) sin comodines `*` ni fallbacks ambiguos.
3. **Variables de Entorno en el Worker**:
   - `FIREBASE_PROJECT_ID`: ID del proyecto Firebase para verificar la firma de tokens JWT.
   - `ALLOWED_ORIGINS`: Lista de orígenes permitidos separados por coma.
   - `WORKER_PUBLIC_URL`: Opcional. Dominio base del Worker (autodetectado si se deja vacío).

---

## 8. Distribución de Responsabilidades

### 8.1. Tareas Manuales del Desarrollador en Firebase
1. Acceder a [Firebase Console](https://console.firebase.google.com/) -> Firestore Database -> pestaña **Rules**.
2. Pegar las reglas auditadas de la Sección 4 de este documento y presionar **Publish**.
3. Asegurarse de tener al menos un usuario con `{ role: 'admin' }` en `users/{uid}` para la administración inicial.

### 8.2. Tareas Manuales del Desarrollador en Cloudflare
1. Crear el bucket privado en **Cloudflare Dashboard -> R2 -> Create Bucket** (`villaguay-conectado-media`). Mantener el bucket privado.
2. Desplegar el Worker `villaguay-media-api` (`npx wrangler deploy --config workers/media/wrangler.jsonc`).

### 8.3. Tareas a Implementar en el Código (Frontend - Fase 2)
1. **Crear `src/services/mediaService.js`**:
   - Función `uploadEventImage(file, idToken)` que envía el archivo al Worker y retorna `imageUrl`.
2. **Crear `src/components/forms/MediaPicker/MediaPicker.jsx`**:
   - Componente UI de selección de imagen, validación de extensión/peso y preview local reactivo con opción de remover imagen.
3. **Actualizar `EventForm.jsx` y `CreateEvent.jsx`**:
   - Integrar `MediaPicker` en el formulario para coordinar la subida antes de llamar a `createEvent`.
4. **Verificar `EventImage.jsx` y `EventDetail.jsx`**:
   - Confirmar renderizado responsivo y `loading="lazy"` para flyers servidos por el Worker.

---

## 9. Orden Cronológico Recomendado de Implementación

```
[PASO 1] ──► Publicación de Firestore Security Rules en Firebase Console (Manual - Completado)
    │
[PASO 2] ──► Creación de Bucket R2 Privado y Deploy de Worker en Cloudflare (Manual / Wrangler)
    │
[PASO 3] ──► Implementación de `src/services/mediaService.js` en frontend (Antigravity - Fase 2)
    │
[PASO 4] ──► Implementación de `MediaPicker` y actualización de `EventForm` (Antigravity - Fase 2)
    │
[PASO 5] ──► Pruebas de integración: Subida de flyer -> R2 -> Firestore (pending) -> Aprobación Admin -> Vista pública
    │
[PASO 6] ──► Validación de Build & Lint (`npm run lint`, `npm run build`)
```

---

## 10. Estado de Implementación — Cloudflare Worker (Fase 1)

### 10.1. Archivos Creados
La infraestructura backend de Media se encuentra aislada en el directorio `/workers/media/`:
1. `workers/media/src/index.js`: Enrutador HTTP del Worker, manejo de CORS estricto, endpoint `POST /upload`, endpoint de lectura pública `GET /events/<key>` y health check.
2. `workers/media/src/auth.js`: Verificación criptográfica de tokens JWT de Firebase Authentication mediante la API nativa Web Crypto (`RSASSA-PKCS1-v1_5` con SHA-256) contra las claves públicas JWK de Google Identity Toolkit.
3. `workers/media/src/validator.js`: Validador de archivos (tamaño $\le 5\text{MB}$, tipos MIME `image/jpeg`, `image/png`, `image/webp`).
4. `workers/media/wrangler.jsonc`: Archivo de configuración oficial de Wrangler con el binding R2 y variables de entorno.
5. `workers/media/README.md`: Guía de ejecución local, comandos de deploy y ejemplos de prueba con cURL.

### 10.2. Binding R2 y Nombres de Objetos
- **Binding configurado:** `MEDIA_BUCKET`
- **Bucket R2 objetivo:** `villaguay-conectado-media` (100% privado)
- **Estructura de clave en R2:** `events/<uuid>.<ext>` (generada mediante `crypto.randomUUID()`).
- **Metadatos adjuntos en R2:** `uploadedBy` (UID de Firebase), `originalName` y `uploadedAt` (ISO timestamp).

### 10.3. Endpoints Implementados
- `OPTIONS *`: Manejo de preflight CORS con orígenes configurables (sin comodines ni fallbacks engañosos).
- `GET /health`: Comprobación de estado y disponibilidad del servicio.
- `POST /upload`: Carga autenticada de imagen (`multipart/form-data`). Requiere cabecera `Authorization: Bearer <ID_TOKEN>`. Retorna la URL apuntando al endpoint del Worker (`/events/<key>`).
- `GET /events/<objectKey>`: Sirve la imagen directamente desde el bucket privado de R2 con cabecera `Cache-Control: public, max-age=31536000, immutable`.

### 10.4. Autenticación y Seguridad
- El Worker valida la firma digital de Google del Firebase ID Token en el perímetro (V8 Worker runtime).
- Se validan los claims: `aud == FIREBASE_PROJECT_ID`, `iss == https://securetoken.google.com/<PROJECT_ID>`, `exp > now`, `sub` no vacío.
- Los uploads anónimos o con tokens expirados/falsificados son rechazados con código `401 Unauthorized`.
- La lectura pública en `GET /events/<objectKey>` valida la estructura de la clave para evitar path traversal.

### 10.5. Variables en Wrangler
- `FIREBASE_PROJECT_ID`: `"villaguay-conectado"` (en `vars` de `wrangler.jsonc`).
- `ALLOWED_ORIGINS`: `"http://localhost:5173,https://villaguay-conectado.vercel.app"` (en `vars` de `wrangler.jsonc`).
- `WORKER_PUBLIC_URL`: Opcional. URL base del Worker (autodetectada por defecto).

### 10.6. Comandos de Deploy
Para desplegar el Worker a Cloudflare:
```bash
npx wrangler deploy --config workers/media/wrangler.jsonc
```
Para ejecutar en modo de desarrollo local con emulador de R2:
```bash
npx wrangler dev workers/media/wrangler.jsonc
```

### 10.7. Guía de Pruebas Manuales con cURL

#### A. Verificar rechazo de solicitud sin autenticación (401 Unauthorized)
```bash
curl -X POST http://localhost:8787/upload -F "file=@flyer.jpg"
```
*Respuesta esperada:*
```json
{
  "success": false,
  "error": "Cabecera Authorization no provista."
}
```

#### B. Verificar subida exitosa con Firebase ID Token (201 Created)
```bash
curl -X POST http://localhost:8787/upload \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \
  -F "file=@flyer.jpg"
```
*Respuesta esperada:*
```json
{
  "success": true,
  "key": "events/e4b901f4-3ec9-482d-8959-19942a03cf80.jpg",
  "url": "https://villaguay-media-api.workers.dev/events/e4b901f4-3ec9-482d-8959-19942a03cf80.jpg",
  "size": 312450,
  "type": "image/jpeg",
  "uploadedBy": "5iY4yJ10Y..."
}
```

#### C. Verificar lectura de la imagen a través del Worker (200 OK con Cache-Control inmutable)
```bash
curl -I http://localhost:8787/events/e4b901f4-3ec9-482d-8959-19942a03cf80.jpg
```
*Respuesta esperada:*
```http
HTTP/1.1 200 OK
Content-Type: image/jpeg
Cache-Control: public, max-age=31536000, immutable
```

---

## 11. Estado de Integración Frontend — Flyers End-to-End (Fase 2)

### 11.1. Resumen de Implementación
Se ha completado el circuito integral de medios visuales en la aplicación cliente React respetando estrictamente la separación de responsabilidades:
- **`src/services/authService.js`**: Incorporó `getCurrentUserToken()` para exponer el ID token de Firebase de manera desacoplada.
- **`src/services/mediaService.js`**: Cliente HTTP que gestiona la carga autenticada hacia el Worker en `POST /upload`.
- **`src/services/eventService.js`**: Actualizados `createEvent` y `updateEvent` para persistir `imageUrl`.
- **`src/components/event/MediaPicker/`**: Componente visual reutilizable con selector de archivos, validación reactiva de formato/tamaño, vista previa inmediata, cancelación y reemplazo.
- **`src/components/forms/EventForm/EventForm.jsx`**: Formulario enriquecido con `MediaPicker`.
- **`src/pages/CreateEvent/CreateEvent.jsx` & `src/pages/EditEvent/EditEvent.jsx`**: Coordinan la subida previa al Worker antes de registrar o actualizar el documento en Firestore.
- **`src/components/EventImage/EventImage.jsx`**: Incorporó manejo de errores con fallback reactivo a `EventPlaceholder` si la imagen remota no está disponible.
- **`src/components/event/AdminEventCard.jsx` & `AdminPublishedEventCard.jsx`**: Visualizan el flyer en el panel de administración.

### 11.2. Comportamiento y Casos de Uso

| Caso | Comportamiento en la Aplicación |
|---|---|
| **Evento con flyer válido** | Muestra la imagen con lazy-loading en `EventCard`, `EventDetail` y tarjetas de administración. |
| **Evento sin flyer (`imageUrl == ""`)** | Renderiza limpiamente `EventPlaceholder` con título, fecha y branding municipal. |
| **Fallo en la carga de imagen (error de red/404)** | `EventImage` captura el evento `onError` y conmuta automáticamente a `EventPlaceholder`. |
| **Reemplazo de flyer en `EditEvent`** | Sube el nuevo archivo a R2 y actualiza el campo `imageUrl` en Firestore sin interrumpir el servicio. |
| **Eliminación de flyer en `EditEvent`** | Limpia el campo `imageUrl` fijándolo en `""`, volviendo al estado de placeholder. |
| **Archivo inválido o > 5 MB** | `MediaPicker` bloquea la selección localmente y alerta al usuario sin realizar peticiones de red. |

### 11.3. Deuda Técnica Documentada
- **Limpieza de objetos huérfanos en R2:** Al reemplazar un flyer o eliminar un evento, el objeto antiguo permanece almacenado en R2. Para la escala del MVP esto tiene costo cero (almacenamiento gratuito de R2 hasta 10 GB), pero en fases posteriores se implementará un Cloudflare Cron Trigger o webhook administrativo para depurar archivos huérfanos de forma programada.



