# VillaguayConectado

Proyecto Final  
Tecnicatura Universitaria en Informatica Aplicada al Diseno Web  
Universidad Nacional del Litoral

## Descripcion

VillaguayConectado es una aplicacion web desarrollada como proyecto final de la carrera. Su objetivo es centralizar la difusion de eventos de la ciudad de Villaguay permitiendo que los usuarios consulten eventos, se registren y propongan nuevas actividades.

## Estado del proyecto

Actualmente el proyecto corresponde al avance solicitado para la primera entrega de código del Proyecto Final (aproximadamente un 50% de desarrollo).

Funcionalidades implementadas:

- Registro de usuarios
- Inicio de sesión y cierre de sesión
- Persistencia de sesión
- Listado de eventos
- Detalle de eventos
- Propuesta de nuevos eventos
- Integración con Firebase Authentication
- Integración con Cloud Firestore

Funcionalidades pendientes:

- Panel de administración
- Aprobación y rechazo de eventos
- Carga de imágenes (Firebase Storage)
- Botón "Me interesa"
- Ajustes de diseño responsive

## Estructura del proyecto

src/

- pages → Pantallas principales
- components → Componentes reutilizables
- services → Comunicación con Firebase
- hooks → Hooks personalizados
- contexts → Estado global
- firebase → Configuración del SDK
- layouts → Layouts de la aplicación

## Variables de entorno

El proyecto utiliza variables de entorno mediante Vite.

Se incluye un archivo `.env` con la configuración necesaria para ejecutar el proyecto.

En caso de ser necesario, las variables utilizadas son:

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

## Documentación

Dentro de la carpeta `docs` se incluye documentación utilizada durante el desarrollo del proyecto. Su objetivo es registrar la arquitectura, las decisiones de diseño y servir como referencia para mantener consistencia a medida que el sistema evoluciona. También se utiliza como contexto técnico al trabajar con herramientas de asistencia como GitHub Copilot, Gemini, Claude o ChatGPT.

## Tecnologias utilizadas

- React
- Vite
- React Router DOM
- Firebase Authentication
- Cloud Firestore
- CSS Modules
- Vercel

## Instalacion

1. Descomprimir el proyecto.
2. Abrir una terminal en la carpeta del proyecto.
3. Ejecutar:

```bash
npm install
```

4. Ejecutar:

```bash
npm run dev
```

5. Abrir:

http://localhost:5173

## Compilacion

```bash
npm run build
```

## Proyecto desplegado

https://villaguay-conectado.vercel.app/
