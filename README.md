# Avacom

Aplicación para la gestión de evaluaciones de cursos.  
SPA construida con **React 19 + TypeScript + Vite + Tailwind CSS v4**, con backend serverless en **AWS Lambda + API Gateway + DynamoDB** orquestado con **Serverless Framework v3**.

## Requisitos

- Node.js 20.x
- npm
- Docker y Docker Compose (opcional, pero recomendado)

## Levantar el frontend en local

### Con Docker (recomendado)

```bash
docker compose up frontend
```

Esto inicia el servidor de desarrollo de Vite en `http://localhost:5173`.

### Sin Docker

```bash
cd frontend
npm install
npm run dev
```

## Backend

El backend se despliega directamente a AWS mediante Serverless Framework.

### Con Docker

```bash
docker compose --profile deploy run backend-deploy
```

### Sin Docker

```bash
cd backend
npm install
npx serverless deploy
```

Requiere credenciales de AWS configuradas (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`).

## Variables de entorno

| Variable | Defecto | Descripción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | URL base de la API backend |
| `AWS_ACCESS_KEY_ID` | — | Access key de AWS (solo para deploy) |
| `AWS_SECRET_ACCESS_KEY` | — | Secret key de AWS (solo para deploy) |
| `AWS_DEFAULT_REGION` | `us-east-1` | Región de AWS (solo para deploy) |

## Scripts disponibles (frontend)

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm run lint     # Ejecuta ESLint
npm run preview  # Previsualiza la build de producción
```

## Estructura del proyecto

```
avacom/
├── frontend/          # Aplicación React (Vite + TypeScript + Tailwind)
│   └── src/
│       ├── components/   # Componentes reutilizables
│       ├── layouts/      # Layout principal con navegación
│       ├── pages/        # Páginas de la aplicación
│       ├── router/       # Enrutador
│       ├── services/     # Capa de API (Axios)
│       └── utils/        # Utilidades
├── backend/           # Backend serverless (AWS Lambda + DynamoDB)
│   ├── handler.js     # Manejador de las rutas CRUD
│   └── serverless.yml # Configuración de infraestructura
└── docker-compose.yml # Orquestación de servicios
```
