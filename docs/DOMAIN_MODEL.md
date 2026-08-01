# DOMAIN_MODEL

## Proposito

Este documento resume el modelo conceptual de VillaguayConectado para uso rapido durante el desarrollo.
No reemplaza la documentacion academica ni define detalles tecnicos de implementacion.

## 1) Entidades principales

### User
Representa a la persona que usa la aplicacion.
Puede registrarse, iniciar sesion, proponer eventos y marcar eventos como "Me interesa".
Campos clave a nivel conceptual: identidad basica del usuario, email y rol.

### Event
Representa una propuesta de actividad local que puede publicarse en la plataforma.
Incluye la informacion esencial para que la comunidad la descubra (titulo, descripcion, fecha/lugar y estado de revision).
Tambien conserva la referencia de quien lo propuso.

### Interest
Representa la accion de un usuario sobre un evento para indicar "Me interesa".
Sirve para registrar vinculaciones entre usuarios y eventos, y para mostrar interes de la comunidad.
Campos clave a nivel conceptual: usuario asociado y evento asociado.

## 2) Roles

En el MVP existen unicamente dos roles:

- user: puede navegar, registrarse/iniciar sesion, proponer eventos y marcar "Me interesa".
- admin: revisa propuestas y decide su publicacion mediante aprobacion o rechazo.

No se contemplan otros roles en esta etapa.

## 3) Estados de un evento

- pending: el evento fue propuesto y esta pendiente de revision administrativa.
- approved: el evento fue aprobado y queda visible para los usuarios.
- rejected: el evento fue rechazado y no se publica.

## 4) Relaciones principales

Un usuario puede proponer muchos eventos.
Cada evento pertenece a un usuario creador.
Un usuario puede marcar muchos eventos como "Me interesa".
Un evento puede ser marcado como "Me interesa" por muchos usuarios.

## 5) Flujo general del sistema

Visitante -> Registro/Inicio de sesion -> Usuario -> Propone evento -> Admin revisa -> Evento aprobado y visible -> Usuarios marcan "Me interesa".

## Nota de alcance

Este modelo se limita al MVP definido en el proyecto.
No incluye modulos de noticias, marketplace, sistema de puntos, comercios ni otras funcionalidades fuera de alcance.
