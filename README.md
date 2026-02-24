# eFact Bitrix Front

Frontend para la emisión y seguimiento de facturas electrónicas, integrado como aplicación embebida en **Bitrix24**.

## Stack

- **React 18** + **TypeScript**
- **Vite 5** — bundler y dev server
- **Tailwind CSS** — estilos
- **SWR** — data fetching y caché
- **Axios** — cliente HTTP con interceptores JWT
- **React Router v6** — navegación
- **React Hot Toast** — notificaciones

## Requisitos

- Node.js >= 18
- Backend NestJS corriendo (ver variable `VITE_API_BASE_URL`)

## Instalación

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_BASE_URL` | URL base del backend NestJS | `http://localhost:4000` |
| `VITE_POLLING_INTERVAL_MS` | Intervalo de polling para facturas pendientes (ms) | `5000` |
| `VITE_DEV_TOKEN` | Token simulado para desarrollo sin Bitrix24 | — |

## Scripts

```bash
npm run dev       # Inicia el dev server en http://localhost:3000
npm run build     # Compila TypeScript y genera el build de producción
npm run preview   # Previsualiza el build de producción
npm run lint      # Ejecuta ESLint
```

> El dev server incluye un proxy: las peticiones a `/api/*` se redirigen a `http://localhost:4000`.

## Estructura del proyecto

```
src/
├── api/                   # Cliente Axios y manejo de errores
├── components/            # Componentes genéricos (UI, ErrorBoundary)
├── features/
│   ├── bitrix/            # Integración con el SDK de Bitrix24
│   └── invoices/          # Módulo de facturas (hooks, componentes, páginas)
├── hooks/                 # Hooks globales (auth, toast)
├── layouts/               # Layout principal
├── pages/                 # Páginas raíz (Home, NotFound)
├── types/                 # Tipos TypeScript compartidos
└── utils/                 # Utilidades (token, status)
```

## Autenticación

El token JWT se extrae del parámetro `?token=` de la URL (inyectado por Bitrix24 al abrir la app). En desarrollo se puede usar `VITE_DEV_TOKEN` para omitir este paso.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio |
| `/invoices` | Historial de facturas |
| `/invoices/:id` | Detalle y emisión de una factura |
