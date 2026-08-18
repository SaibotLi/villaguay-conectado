# Event Media Architecture

## Estado

Diseño aprobado.

Documento previo a la implementación.

Versión 1.0

---

# Objetivo

Esta arquitectura define cómo VillaguayConectado administra todos los recursos visuales asociados a los eventos.

Su propósito no es describir un proveedor de almacenamiento específico.

Su propósito es establecer una arquitectura estable que permita cambiar la tecnología de almacenamiento sin afectar el resto del proyecto.

---

# Filosofía

El objetivo de esta Epic NO es subir imágenes.

El objetivo es permitir que un organizador publique un evento con identidad visual de la forma más simple posible.

Las imágenes forman parte de la experiencia del evento.

No representan un módulo independiente.

---

# Principios

## 1

Toda imagen pertenece a un evento.

Nunca existen imágenes independientes.

---

## 2

La imagen es completamente opcional.

Un evento puede existir perfectamente sin flyer.

Cuando no exista una imagen se utilizará EventPlaceholder.

El placeholder forma parte del producto.

No representa un error.

---

## 3

React nunca debe conocer el proveedor de almacenamiento.

Toda interacción deberá realizarse mediante mediaService.

---

## 4

El proveedor utilizado debe poder cambiar sin modificar la interfaz.

Hoy podrá utilizarse Cloudflare.

Mañana podría utilizarse Firebase Storage, Cloudflare R2, Amazon S3 u otro proveedor.

La aplicación nunca debe depender de uno específico.

---

## 5

Firestore nunca almacenará archivos.

Únicamente almacenará la referencia (imageUrl).

---

# Arquitectura

Flujo oficial

Usuario

↓

CreateEvent

↓

EventForm

↓

MediaPicker

↓

mediaService

↓

Storage Provider

↓

imageUrl

↓

eventService

↓

Firestore

↓

status = pending

↓

Administrador

↓

approved

↓

EventCard

↓

EventImage

↓

EventPlaceholder (si imageUrl no existe)

---

# Componentes

## MediaPicker

Responsabilidad

Seleccionar una imagen local.

Mostrar una vista previa.

Validar formato.

Validar tamaño.

No sube archivos.

No conoce Cloudflare.

No conoce Firestore.

---

## mediaService

Responsabilidad

Subir archivos.

Eliminar archivos.

Obtener URL pública.

Toda comunicación con el proveedor de almacenamiento debe pasar exclusivamente por este servicio.

---

## EventImage

Responsabilidad

Determinar qué mostrar.

Si existe imageUrl

↓

Mostrar imagen.

Si no existe

↓

Renderizar EventPlaceholder.

Nunca consulta Firestore.

Nunca consulta Cloudflare.

---

## EventPlaceholder

Responsabilidad

Representar visualmente un evento sin flyer.

No representa un error.

Debe respetar completamente el Design System.

---

# Restricciones del MVP

Una única imagen por evento.

Imagen opcional.

Sin drag & drop.

Sin crop.

Sin editor.

Sin múltiples imágenes.

Sin galerías.

Sin miniaturas adicionales.

---

# Formatos aceptados

- PNG
- JPG
- JPEG
- WEBP

---

# Tamaño máximo

5 MB

---

# Flujo esperado

El organizador completa el formulario.

Selecciona una imagen.

Visualiza una vista previa.

Publica el evento.

La imagen se almacena.

Se obtiene imageUrl.

Se crea el documento en Firestore.

El evento queda pendiente.

Cuando el administrador lo aprueba, el evento se vuelve visible para todos.

---

# Decisiones descartadas

## Drag & Drop

No aporta valor suficiente para el MVP.

---

## Crop de imágenes

Fuera del alcance.

---

## Múltiples imágenes

Fuera del MVP.

---

## Álbumes

Fuera del MVP.

---

## Editor de imágenes

Fuera del MVP.

---

# Objetivos futuros

Cloudflare Images.

Optimización automática.

Conversión WebP.

Compresión.

Versiones responsive.

CDN global.

Caché.

Transformaciones dinámicas.

Estas funcionalidades deberán implementarse exclusivamente dentro de mediaService.

Nunca desde React.

---

# Regla más importante

La interfaz nunca debe saber dónde están almacenadas las imágenes.

La interfaz únicamente conoce mediaService.

Ese desacoplamiento es obligatorio durante toda la vida del proyecto.