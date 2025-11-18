# Radio Gestión – Guía de uso (Dev, Test y Producción)

Este proyecto contiene un backend (Node/Express + MongoDB) y un frontend (React CRA) para gestión de radio.

Estructura principal:
- `backend-radio`: API REST con Express/Mongoose.
- `frontend-radio`: SPA en React.

## Requisitos
- Node.js 20+
- npm 9+
- (Opcional) Docker/Docker Compose para levantar Mongo y backend fácilmente

## Variables de entorno
- Backend: `backend-radio/.env.example`
  - `MONGO_URI`: URL de Mongo. Ejemplo local: `mongodb://127.0.0.1:27017/radio-gestion-dev`
  - `PORT`: puerto del backend (por defecto `5000`).
  - `CORS_ORIGINS`: lista de orígenes permitidos (coma-separados). Ej: `http://localhost:3000,https://tu-sitio.netlify.app`.
- Frontend: `frontend-radio/.env.example`
  - `REACT_APP_API_URL`: URL base de la API. Ej: `http://localhost:5000/api`

Copiá los `.env.example` a `.env` y ajustá valores según tu entorno.

## Desarrollo local (sin Docker)
1) Instalación de dependencias:
   - Backend: `cd backend-radio && npm ci`
   - Frontend: `cd ../frontend-radio && npm ci`

2) Ejecutar ambos en paralelo desde la raíz:
   - `npm run dev`

   Scripts raíz disponibles:
   - `dev:backend`: inicia backend con nodemon.
   - `dev:frontend`: inicia CRA dev server.

3) URLs por defecto:
   - Backend: `http://localhost:5000` (salud: `GET /health`)
   - API base: `http://localhost:5000/api`
   - Frontend: `http://localhost:3000`

4) Sin MongoDB instalado? Opciones:
   - Usar DB en memoria: `cd backend-radio && USE_IN_MEMORY_DB=true npm run dev` (no persiste datos).
   - O instalar Mongo local o en contenedor y configurar `MONGO_URI`.

5) Datos de ejemplo (si tenés Mongo real):
   - `cd backend-radio && npm run seed`

## Desarrollo/Pruebas con Docker
Desde la raíz:

```
docker compose up --build
```

Servicios:
- `mongo`: MongoDB 7 con volumen persistente.
- `backend`: Construido desde `backend-radio/Dockerfile`, expone `:5000`.

Frontend se ejecuta fuera de Docker (CRA) o podés desplegarlo aparte (Netlify, Vercel, etc.).
Para usar datos de ejemplo dentro del contenedor, entrá al contenedor del backend y corré `npm run seed`.

## Tests
- Backend (unit tests con Jest):
  - `cd backend-radio && npm test`

Los tests mockean los modelos Mongoose, no requieren DB real.

## Build de producción
- Frontend (CRA):
  - `cd frontend-radio && npm run build`
  - Servir build local: `npm run serve` (sirve `build` en puerto 4173)
  - Despliegue sugerido: Netlify/Vercel. Ajustar `REACT_APP_API_URL` a tu backend público.

- Backend (Node):
  - Local: `cd backend-radio && npm ci --omit=dev && npm start`
  - Docker: usar `docker-compose.yml` o construir `backend-radio/Dockerfile`.

## CORS y configuración
El backend expone CORS configurable por variable `CORS_ORIGINS` (coma-separado). En desarrollo, dejar `http://localhost:3000`. En producción, definí el dominio/s del frontend (ej. Netlify) para evitar errores de CORS.

## Endpoints clave
- `GET /health` → healthcheck
- `GET /` → bienvenida
- `GET /api/clients` y CRUD
- `GET /api/agencies` y CRUD
- `GET /api/transactions` y CRUD parcial
- `GET /api/contracts` y `/api/contracts/summary` + CRUD

## Notas
- El servidor backend ya centraliza middlewares/rutas en `backend-radio/app.js`. El `index.js` solo conecta a la DB y levanta el server.
- Hay un `docker-compose.yml` para dev/prod simple del backend+Mongo. El frontend puede alojarse de forma independiente.
