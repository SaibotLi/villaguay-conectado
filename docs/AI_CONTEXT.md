# AI Context

## Nombre del proyecto

VillaguayConectado

---

# Descripción

VillaguayConectado es una aplicación web destinada a centralizar la difusión de eventos locales de la ciudad de Villaguay.

El proyecto nació como Trabajo Final Integrador de la Tecnicatura Universitaria en Informática Aplicada al Diseño Multimedia y de Sitios Web (UNL), pero desde el inicio fue diseñado con una visión de producto real, priorizando una arquitectura escalable, mantenible y reutilizable.

El objetivo del MVP no es desarrollar muchas funcionalidades, sino resolver correctamente el módulo de eventos con una excelente experiencia de usuario y una base técnica sólida para futuras versiones.

---

# Estado actual del proyecto

Actualmente el proyecto ya posee implementadas las siguientes funcionalidades:

## Arquitectura

- Arquitectura desacoplada React → Services → Firebase
- Separación de responsabilidades
- CSS Modules
- Componentes reutilizables
- Design System propio
- Branding inicial
- Responsive

## Autenticación

- Registro mediante Email/Password
- Inicio de sesión
- Google Login
- Verificación de correo electrónico
- Recuperación de contraseña
- Roles (admin / user)
- Protected Routes

## Eventos

- Listado de eventos
- Detalle de evento
- Compartir evento
- Google Maps
- Sistema "Me interesa"
- Mis intereses
- Propuesta de eventos

## Administración

- Aprobar eventos
- Rechazar eventos
- Editar eventos
- Eliminar eventos
- Dashboard administrativo

---

# Stack tecnológico

Frontend

- React
- Vite
- JavaScript
- React Router DOM
- CSS Modules

Backend

- Firebase Authentication
- Cloud Firestore

Media (actual)

- Próxima implementación (Epic Event Media)

Deploy

- Vercel

Control de versiones

- Git
- GitHub

Asistencia IA

- GitHub Copilot
- ChatGPT

---

# Filosofía del proyecto

Toda decisión técnica debe respetar los siguientes principios.

## Simplicidad

Implementar únicamente aquello que aporte valor real al MVP.

Evitar sobreingeniería.

---

## Escalabilidad

Cada módulo debe poder evolucionar sin reescribir el proyecto completo.

---

## Reutilización

Siempre que sea posible se crearán componentes reutilizables antes que soluciones específicas.

---

## Separación de responsabilidades

Cada archivo tiene una única responsabilidad.

---

## Consistencia

Toda nueva funcionalidad debe respetar el Design System, la arquitectura y los patrones ya existentes.

---

# Arquitectura oficial

Todo acceso a Firebase debe seguir obligatoriamente el siguiente flujo:

React

↓

Hooks / Context

↓

Services

↓

Firebase

↓

Authentication / Firestore / Storage Provider

React nunca debe importar directamente funciones del SDK de Firebase.

---

# Organización del proyecto

src/

assets/

components/

pages/

layouts/

routes/

contexts/

hooks/

services/

firebase/

styles/

utils/

types/

---

# Design System

El proyecto posee un Design System propio documentado en:

docs/DESIGN_SYSTEM.md

Toda nueva interfaz debe respetarlo.

No crear colores, botones, espaciados o componentes visuales nuevos sin antes verificar dicho documento.

---

# Roadmap

La planificación oficial del proyecto se encuentra en:

docs/ROADMAP.md

Antes de implementar una nueva funcionalidad verificar que forme parte del roadmap.

---

# Documentación de arquitectura

La arquitectura del proyecto se divide en documentos independientes.

Ejemplos:

docs/ARCHITECTURE/

General Architecture

Authentication

Events

Admin

Interests

UX

Event Media

Deployment

Cada documento representa la única fuente de verdad para dicho módulo.

---

# Reglas para asistentes de IA

Todo asistente que trabaje sobre este repositorio debe respetar obligatoriamente las siguientes reglas.

- No modificar la arquitectura sin aprobación.
- No agregar dependencias innecesarias.
- No romper el Design System.
- No duplicar componentes.
- No acceder directamente a Firebase desde React.
- Mantener separación Pages → Hooks → Services.
- Priorizar reutilización.
- Implementar únicamente el alcance solicitado.
- Explicar mejoras antes de implementarlas.
- Evitar cambios masivos innecesarios.
- Mantener código legible.
- Mantener consistencia visual.
- Ejecutar npm run build al finalizar cada sprint.
- Informar siempre qué archivos fueron modificados.
- Explicar el impacto arquitectónico de los cambios.

---

# Visión

VillaguayConectado no busca únicamente aprobar una materia.

La arquitectura fue diseñada para permitir que el proyecto continúe creciendo una vez finalizada la etapa académica.

Cada decisión debe intentar equilibrar simplicidad para el MVP y escalabilidad para versiones futuras.