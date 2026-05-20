# Avacom — Workspace Harness

> Prueba técnica — Fernando Freire  
> Aplicación Serverless SPA para gestión de evaluaciones de cursos

---

## Estructura del proyecto

```
avacom/
├── docker-compose.yml
├── setup.sh
├── domain.sh
├── aws-env.sh
├── backend/
│   ├── handler.js
│   ├── serverless.yml
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── global.css
│       ├── assets/
│       │   └── hero.png
│       ├── components/
│       │   └── ui/
│       │       ├── Loading.tsx
│       │       └── Toaster.tsx
│       ├── layouts/
│       │   └── MainLayout.tsx
│       ├── pages/
│       │   └── evaluations/
│       │       ├── page.tsx
│       │       ├── List.tsx
│       │       ├── Form.tsx
│       │       ├── service.ts
│       │       └── types.ts
│       ├── router/
│       │   └── index.tsx
│       ├── services/
│       │   └── api.ts
│       └── utils/
│           └── formatDate.ts
```

---

## Lenguajes

| Lenguaje    | Versión        | Dónde              |
|-------------|----------------|---------------------|
| TypeScript  | ~6.0.2         | Frontend            |
| JavaScript  | ES2022         | Backend (handler.js) |
| Node.js     | 20.x           | Backend runtime      |
| Shell       | Bash           | setup.sh, domain.sh  |
| YAML        | —              | docker-compose, serverless |
| HTML        | HTML5          | index.html           |
| CSS         | Tailwind v4    | global.css           |

---

## Frameworks y librerías principales

### Frontend

| Paquete                  | Versión   | Propósito                   |
|--------------------------|-----------|-----------------------------|
| React                    | ^19.2.6   | UI framework                |
| Vite                     | ^8.0.12   | Build tool / dev server     |
| Tailwind CSS             | ^4.3.0    | CSS utility-first           |
| Axios                    | ^1.16.1   | HTTP client                 |
| React Hook Form          | ^7.76.0   | Manejo de formularios       |
| Zod                      | ^4.4.3    | Validación de esquemas      |
| @hookform/resolvers      | ^5.2.2    | Integración Zod + RHF       |
| ESLint                   | ^10.3.0   | Linter                      |

### Backend

| Paquete                      | Versión     | Propósito                    |
|------------------------------|-------------|------------------------------|
| @aws-sdk/client-dynamodb     | ^3.1049.0   | SDK DynamoDB                 |
| @aws-sdk/lib-dynamodb        | ^3.1049.0   | Document client (nivel alto) |
| Serverless Framework         | ^3          | Infraestructura como código  |

---

## Infraestructura

| Componente        | Detalle                                  |
|-------------------|------------------------------------------|
| Compute           | AWS Lambda (Node.js 20.x)                |
| API Gateway       | HTTP API con CORS habilitado             |
| Base de datos     | Amazon DynamoDB (1 RCU / 1 WCU)          |
| Logging           | Amazon CloudWatch                        |
| Contenerización   | Docker Compose (frontend + backend)      |

### Modelo de datos (DynamoDB)

```json
{
  "evaluationId": "string (PK, timestamp-based)",
  "courseId": "string",
  "title": "string",
  "description": "string",
  "dueDate": "string (ISO date)",
  "status": "string (active | completed | cancelled)",
  "createdAt": "string (ISO datetime)"
}
```

### Endpoints API

| Método | Ruta             | Handler           |
|--------|------------------|-------------------|
| GET    | /evaluations     | scan evaluations  |
| GET    | /evaluations/:id | get evaluation    |
| POST   | /evaluations     | create evaluation |
| PUT    | /evaluations/:id | update evaluation |
| DELETE | /evaluations/:id | delete evaluation |

---

## Configuración

### Docker Compose

```yaml
services:
  frontend:
    image: node:20-alpine
    ports: ["5173:5173"]
    command: npm install && npm run dev -- --host
    environment:
      - VITE_API_URL=<api-gateway-url>
  backend-deploy:
    build: ./backend
    profiles: ["deploy"]
    environment:
      - AWS_ACCESS_KEY_ID
      - AWS_SECRET_ACCESS_KEY
```

### Routing

- SPA con ruta única: `/evaluations`
- Router estático (sin React Router DOM dinámico)
- Layout principal con barra de navegación

---

## Stack resumido

```
React 19 + TypeScript + Vite + Tailwind CSS v4
        ↕ Axios (REST)
AWS API Gateway → Lambda (Node.js 20) → DynamoDB
        ↕ Serverless Framework v3
Infraestructura como código + Docker Compose
```

---
