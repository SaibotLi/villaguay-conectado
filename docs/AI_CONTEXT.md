# Nombre del proyecto

VillaguayConectado

## Descripcion breve

VillaguayConectado es una aplicacion web para centralizar la difusion de eventos locales de la ciudad de Villaguay.

El objetivo del MVP es publicar, descubrir y gestionar eventos en una primera version funcional, con autenticacion de usuarios, interaccion basica y un panel administrativo inicial.

## Stack tecnologico

- React + Vite
- JavaScript
- React Router DOM
- CSS Modules
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Git
- GitHub
- Vercel

## Alcance del MVP

Funcionalidades incluidas en el MVP:

- Inicio
- Listado de eventos
- Detalle de evento
- Registro
- Inicio de sesion
- Propuesta de eventos
- Panel de administracion
- Boton "Me interesa"
- Compartir evento

Funcionalidades fuera del MVP (no implementar en esta etapa):

- Noticias
- Comercios
- Servicios
- Marketplace
- Sistema de puntos
- Cualquier modulo no listado en el alcance del MVP

## Arquitectura del proyecto

Estructura base en src:

- assets: recursos estaticos (imagenes, iconos, fuentes)
- components: componentes reutilizables de UI y bloques funcionales
- pages: vistas de ruta (pantallas)
- layouts: layouts base de la aplicacion
- routes: configuracion de enrutamiento
- firebase: capa de acceso base a Firebase (config + modulos)
- services: logica de acceso a datos y reglas de interaccion con backend
- hooks: hooks personalizados para encapsular estado y comportamiento
- contexts: contextos globales de React
- types: definiciones de estructuras de datos del proyecto (en JS, como referencia documental)
- utils: utilidades puras y helpers
- styles: estilos globales compartidos

Submodulos relevantes ya definidos:

- components/common, components/layout, components/forms, components/event, components/ui
- pages/Home, pages/Events, pages/EventDetail, pages/CreateEvent, pages/Login, pages/Register, pages/Contact, pages/About, pages/Admin, pages/NotFound
- firebase/config.js, firebase/auth.js, firebase/firestore.js, firebase/storage.js
- services/authService.js, services/eventService.js
- hooks/useAuth.js, hooks/useEvents.js
- contexts/AuthContext.jsx

## Flujo de datos

Regla obligatoria: los componentes React no deben comunicarse directamente con Firebase.

Flujo oficial del proyecto:

React -> Services -> Firebase -> Firestore / Storage / Authentication

Criterio:

- Pages y components consumen hooks/contexts/services.
- Services centralizan llamadas a Firebase y transformacion de datos.
- Firebase modules encapsulan inicializacion y acceso a SDK.

## Regla de Autenticacion

Ningun componente React (Pages o Components) puede importar directamente funciones del SDK de Firebase Authentication.

Toda interaccion con Firebase Authentication debe respetar este flujo:

Pages / Components -> useAuth() -> AuthContext -> AuthService -> Firebase Authentication

Esta regla es obligatoria para todo el proyecto.

## Modelo de datos

Colecciones principales (nivel conceptual inicial):

- users
- events
- interests

Nota: el detalle completo de campos, indices y validaciones se definira por iteraciones, manteniendo consistencia con el alcance del MVP.

## Convenciones

- Componentes en PascalCase
- Variables y funciones en camelCase
- Colecciones de Firestore en ingles
- CSS Modules para estilos de componentes
- Un componente por carpeta cuando corresponda
- Evitar duplicacion de codigo
- Mantener imports ordenados y responsabilidad clara por modulo

## Principios de desarrollo

El proyecto prioriza:

- simplicidad
- escalabilidad
- reutilizacion
- codigo legible
- separacion de responsabilidades

Lineamientos practicos:

- implementar solo lo necesario para el alcance actual
- evitar sobreingenieria
- preferir composicion y reutilizacion antes que duplicar logica
- mantener interfaces de servicios claras y estables

## Reglas para la IA

Reglas obligatorias para cualquier asistente de IA que trabaje en este repositorio:

- Respetar la arquitectura existente.
- No modificar nombres de carpetas ni estructura base sin aprobacion previa.
- No agregar dependencias sin autorizacion explicita.
- No cambiar tecnologias definidas en el stack.
- No inventar nuevas funcionalidades fuera del MVP.
- Proponer mejoras antes de implementarlas.
- Generar codigo limpio y comentado solo cuando sea necesario.
- Respetar siempre el alcance del MVP.
- Evitar cambios masivos no solicitados.
- Mantener separacion de responsabilidades entre pages, components, services y firebase.

## Uso recomendado de este documento

Este archivo funciona como contexto permanente para prompts cortos.

Ejemplos de uso:

- "Basandote en docs/ARCHITECTURE.md, implementa Login respetando CSS Modules y arquitectura."
- "Basandote en docs/ARCHITECTURE.md, implementa eventService.js con Firestore dentro del alcance MVP."

Si hay conflicto entre una solicitud puntual y estas reglas, priorizar este documento y pedir confirmacion antes de aplicar cambios estructurales.
