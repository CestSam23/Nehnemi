# Nehnemi Web Gobierno

Dashboard territorial de electromovilidad para el Gobierno de la CDMX.

## Requisitos

- Node.js 20.19+ (o 22.12+)
- Backend Nehnemi (FastAPI) corriendo, por defecto en `http://localhost:8000`

## Cómo correrlo

```bash
npm install
cp .env.example .env
npm run dev
```

La app queda en `http://localhost:5173`. Las llamadas a `/api` se redirigen al backend definido en `VITE_API_PROXY_TARGET`.

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción
- `npm run lint`: ESLint
- `npm run typecheck`: verificación de tipos
- `npm run format`: Prettier
