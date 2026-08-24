# Villaguay Media API (Cloudflare Worker + R2)

Backend serverless para la subida segura y entrega pública de flyers de eventos en VillaguayConectado.

> **Arquitectura de Privacidad:** El bucket R2 se mantiene **100% privado** (sin URLs públicas directas ni dominios expuestos al bucket). El Cloudflare Worker es la única puerta de entrada y salida:
> `React → Worker → R2` tanto para **subida** (`POST /upload`) como para **lectura** (`GET /events/<key>`).

## Requisitos
- Node.js 18+
- Cuenta de Cloudflare con R2 habilitado
- Bucket privado `villaguay-conectado-media` creado en Cloudflare R2

## Estructura
```
workers/media/
├── src/
│   ├── index.js        # Entrypoint: enrutador HTTP, CORS, POST /upload y GET /events/<key>
│   ├── auth.js         # Verificación criptográfica de Firebase ID Token (Web Crypto RS256)
│   └── validator.js    # Validación de formato (JPEG/PNG/WebP) y tamaño (<= 5 MB)
├── wrangler.jsonc      # Configuración de Wrangler y binding R2
└── README.md
```

## Variables en `wrangler.jsonc`
- `FIREBASE_PROJECT_ID`: ID del proyecto Firebase (`villaguay-conectado`).
- `ALLOWED_ORIGINS`: Orígenes autorizados separados por coma (`http://localhost:5173,https://villaguay-conectado.vercel.app`).
- `WORKER_PUBLIC_URL`: Opcional. URL base pública del Worker (si se deja vacía, se autodetecta desde el request origin).

## Endpoints

| Método | Ruta | Autenticación | Descripción |
|---|---|---|---|
| `GET` | `/health` | No | Comprobación de estado del servicio |
| `POST` | `/upload` | Sí (`Bearer <Firebase_ID_Token>`) | Carga de flyer (`multipart/form-data`) hacia R2 |
| `GET` | `/events/<objectKey>` | No (Público) | Sirve la imagen desde R2 con caché inmutable (`max-age=31536000, immutable`) |

## Comandos de Desarrollo y Deploy

### 1. Ejecutar en local con emulador de R2
```bash
npx wrangler dev workers/media/wrangler.jsonc
```

### 2. Desplegar a Cloudflare
```bash
npx wrangler deploy --config workers/media/wrangler.jsonc
```

## Pruebas Manuales (cURL)

### A. Verificar estado del servicio (Health Check)
```bash
curl http://localhost:8787/health
```

### B. Probar rechazo sin autenticación
```bash
curl -X POST http://localhost:8787/upload -F "file=@flyer.jpg"
```
*Respuesta esperada (401 Unauthorized):*
```json
{
  "success": false,
  "error": "Cabecera Authorization no provista."
}
```

### C. Probar subida con Firebase ID Token
```bash
curl -X POST http://localhost:8787/upload \
  -H "Authorization: Bearer <TU_FIREBASE_ID_TOKEN>" \
  -F "file=@flyer.jpg"
```
*Respuesta esperada (201 Created):*
```json
{
  "success": true,
  "key": "events/e4b901f4-3ec9-482d-8959-19942a03cf80.jpg",
  "url": "https://villaguay-media-api.workers.dev/events/e4b901f4-3ec9-482d-8959-19942a03cf80.jpg",
  "size": 312450,
  "type": "image/jpeg",
  "uploadedBy": "user_uid_123"
}
```

### D. Probar lectura pública a través del Worker
```bash
curl -I http://localhost:8787/events/e4b901f4-3ec9-482d-8959-19942a03cf80.jpg
```
*Respuesta esperada (200 OK con headers de caché y Content-Type):*
```http
HTTP/1.1 200 OK
Content-Type: image/jpeg
Cache-Control: public, max-age=31536000, immutable
```
