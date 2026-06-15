**PetOne — Frontend**

Resumen
- Proyecto frontend de PetOne (React + Vite). Este README explica cómo instalar dependencias, ejecutar en desarrollo y correr las pruebas unitarias.

**Requisitos**
- **Node.js:** v18 LTS recomendado (funciona con Node >=16 en la mayoría de los casos).
- **npm:** viene con Node; se recomienda npm v8+.

**Instalación**
- Abrir una terminal y situarse en el directorio del frontend:

  `cd petone-frontend`

- Instalar dependencias (recomendado reproducible):

  `npm ci`

- Si `npm ci` falla por dependencias peer, usar:

  `npm install --legacy-peer-deps`

**Variables de entorno**
- Copiar el ejemplo y editar si es necesario:

  - Unix / macOS: `cp .env.example .env`
  - PowerShell: `Copy-Item .env.example .env`
  - CMD: `copy .env.example .env`

- Valor importante en `.env`: `VITE_BFF_URL` — url base del BFF (por defecto `/bff`). Ajusta si tu BFF está en otra ruta o puerto.

**Ejecutar en desarrollo**
- Iniciar servidor de desarrollo:

  `npm run dev`

- Abrir en el navegador: `http://localhost:5173` (puerto por defecto de Vite).

**Generar build**
- Construir para producción:

  `npm run build`

- Previsualizar el build localmente:

  `npm run preview`

**Tests unitarios (Vitest)**
- Ejecutar todos los tests:

  `npm test`

- Ejecutar en modo observador (watch):

  `npm run test:watch`

- Generar reporte de cobertura:

  `npm run test:coverage`

- Ejecutar un test específico (ejemplo):

  `npx vitest run src/components/Test/CreatePetModal.test.jsx`

Notas sobre tests
- Los tests son unitarios y usan `jsdom`. La mayoría mockea llamadas `fetch`. Si ves fallos relacionados con red o rutas del BFF, asegura que `VITE_BFF_URL` en `.env` esté apuntando a la URL esperada o deja el valor por defecto `/bff`.
- Si hay errores al ejecutar tests tras una instalación limpia, prueba a reinstalar dependencias con `npm ci` o con `--legacy-peer-deps`.

**Lint**
- Ejecutar linters:

  `npm run lint`

**Consejos rápidos**
- Para desarrollo integrado, ejecuta el BFF/backend localmente y ajusta `VITE_BFF_URL` a `http://localhost:<bff-port>`.
- Si necesitas depurar tests, agrega `console.log` temporalmente y ejecuta `npm run test:watch`.

---

Archivo: [petone-frontend/README.md](petone-frontend/README.md)
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
