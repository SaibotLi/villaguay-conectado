# DESIGN SYSTEM

Estado: Aprobado
Versión: 1.0

Proyecto:
VillaguayConectado

Objetivo:

Este documento define la identidad visual oficial del proyecto.

Toda nueva interfaz deberá respetar las reglas aquí establecidas.

Las decisiones documentadas aquí tienen prioridad sobre decisiones visuales tomadas durante implementaciones individuales.

---

## 0. Contexto real detectado en el repo

Antes de proponer cambios se inspeccionó el estado visual real: `index.css`/`App.css` corresponden al boilerplate por defecto de Vite (acento violeta, fuente mono, layout de 1126px) y no reflejan la identidad del producto. Los módulos reales (`Navbar`, `EventCard`, `Home`) usan grises sueltos (`#d9d9d9`, `#2b2b2b`, `#f2f2f2`) sin tokens compartidos, sin sombras y sin estados de foco visibles.

**Conclusión:** no existía una identidad visual real — es una base funcional tipo wireframe. Este documento la reemplaza como referencia única.

---

## 1. Filosofía visual

**Personalidad:** institucional-cercana. No es una app corporativa fría ni una red social ruidosa. Debe sentirse como una "cartelera digital municipal moderna": confiable como un sitio oficial, pero cálida y fácil como una app de consumo.

**Sensaciones que debe transmitir:**
- **Confianza** → información pública de eventos reales; un adulto mayor debe sentir que es un canal serio, no un sitio improvisado.
- **Calma / orden** → mucho contenido (eventos) sin sensación de caos; jerarquía clara.
- **Cercanía** → tono cálido en acentos y microcopy, no burocrático.
- **Rapidez** → poca fricción visual, pocos elementos compitiendo por atención.

**Por qué:** el usuario objetivo es heterogéneo (joven y adulto mayor), y el contenido (eventos) debe ganar siempre contra la decoración. Un patrón "SaaS calmo" (fondo neutro claro, una superficie de tarjeta, un color de acción) es el que reduce más carga cognitiva y es el más familiar hoy (Eventbrite, Meetup, portales municipales modernos).

---

## 2. Branding e identidad del producto

VillaguayConectado no debe sentirse como software empresarial ni como una red social. Debe sentirse como un producto hecho específicamente para la comunidad de Villaguay.

**Reglas de marca:**
- La marca **acompaña** el contenido, nunca compite con él. Logo y color de marca aparecen en puntos de anclaje (navbar, footer, estados vacíos) pero nunca invaden el área de lectura de un evento.
- Los **protagonistas visuales siempre son los eventos y sus flyers/imágenes**. Ningún elemento decorativo de marca debe tener más peso visual que la imagen o el título de un evento.
- El tono debe transmitir **cercanía, confianza y pertenencia local**: preferir microcopy en primera persona del plural / trato directo ("Descubrí los próximos eventos de tu ciudad") antes que lenguaje corporativo genérico.
- Evitar iconografía o imágenes de stock genéricas tipo "empresa tech"; cuando se usen ilustraciones (estados vacíos, onboarding), deben sentirse simples y locales, no corporativas.
- La identidad visual (color primario, tipografía, tono) debe ser reconocible pero discreta: el usuario debe recordar "la app de eventos de Villaguay", no "una app con un logo llamativo".

---

## 3. Paleta de colores

| Token | Valor | Uso | Justificación |
|---|---|---|---|
| `--color-primary` | `#0F5C5C` (teal profundo) | Marca, navbar, links activos, iconografía, **botones de acciones generales** (iniciar sesión, registrarse, guardar cambios, editar) | El teal/verde-azulado se asocia a Entre Ríos (ríos, naturaleza) y es un color "institucional" moderno sin ser tan frío como el azul corporativo genérico. Al ser también el color de las acciones generales, refuerza la marca en toda la app sin saturar. |
| `--color-primary-hover` | `#0C4A4A` | Hover de botones/links primarios | Mismo matiz, ~15% más oscuro → feedback de interacción sin cambiar de familia de color. |
| `--color-accent` | `#E8862E` (naranja cálido) | **Reservado exclusivamente** para acciones de conversión/interacción de alto valor: "Me interesa", "Proponer evento", "Publicar evento" | Contraste cálido/frío (teal + naranja) es un patrón probado (Eventbrite, Ticketmaster) para destacar la acción más importante de la pantalla. Se usa con moderación para que no pierda significado: si todo fuera naranja, nada resaltaría. |
| `--color-accent-hover` | `#CF6F1C` | Hover del accent | Oscurecido consistente, mismo criterio que primary-hover. |
| `--color-bg` | `#F7F8F7` | Fondo general de la app | Gris-blanco neutro, no blanco puro: reduce fatiga visual y hace que las tarjetas (blancas) resalten como superficie. |
| `--color-surface` | `#FFFFFF` | Tarjetas, modales, inputs | Blanco puro reservado solo a "superficie de contenido", generando jerarquía fondo/contenido sin bordes marcados. |
| `--color-surface-alt` | `#EEF1F0` | Secciones alternas, hover suave de filas/listas | Da variación de layout sin introducir un color nuevo. |
| `--color-text` | `#1B1F1D` | Texto principal | Casi negro (no negro puro) → mejor legibilidad prolongada. |
| `--color-text-secondary` | `#5B645F` | Descripciones, metadatos, fechas | Contraste reducido intencional para jerarquía tipográfica sin cambiar tamaño de fuente. |
| `--color-border` | `#DCE0DE` | Bordes de tarjetas/inputs | Sutil, evita el efecto "wireframe" de bordes grises genéricos actuales. |
| `--color-success` | `#1E8E5A` | Confirmaciones (evento publicado, registro ok) | Verde estándar reconocible universalmente = menor carga cognitiva. |
| `--color-warning` | `#B7791F` | Estados pendientes (evento en revisión) | Ámbar, distinto del accent naranja para no confundir "acción" con "advertencia". |
| `--color-error` | `#C0392B` | Errores de formulario, rechazo | Rojo clásico de error, cumple expectativa universal. |
| `--color-link` | `--color-primary` | Enlaces de texto | Un solo color de "navegación" en toda la app. |
| `--color-link-hover` | subrayado + `--color-primary-hover` | Hover de enlaces | Reduce ruido visual manteniendo affordance. |

**Regla de uso del accent (ampliada):** el naranja se reserva únicamente para la acción de mayor valor de conversión en una pantalla (❤️ Me interesa, Proponer evento, Publicar evento). Acciones generales (guardar, iniciar sesión, registrarse, editar, cancelar-confirmar administrativo) usan el color primario. Máximo un elemento en accent visible por vista.

---

## 4. Tipografía

**Familia:** system-ui stack (`-apple-system, "Segoe UI", Roboto, sans-serif`). Justificación: rendimiento (sin fuentes web a descargar → carga percibida más rápida), legibilidad probada en todos los sistemas operativos, coherencia con "familiaridad".

| Uso | Tamaño | Peso | Line-height | Notas |
|---|---|---|---|---|
| H1 (título de página) | 28–32px | 700 | 1.2 | Uno solo por página. |
| H2 (sección) | 22–24px | 600 | 1.25 | |
| H3 (subsección / título de tarjeta) | 18px | 600 | 1.3 | Usado en `EventCard`. |
| Texto normal (body) | 16px | 400 | 1.5 | Nunca bajar de 16px en contenido principal. |
| Texto secundario (meta, fechas, ubicación) | 14px | 400 | 1.4 | Color `--color-text-secondary`. |
| Botones | 15px | 600 | 1 | Peso mayor al body para reforzar affordance de acción. |
| Inputs / labels | 15px / 13px | 400 / 600 | 1.4 | Label siempre visible (no placeholder-only). |
| Badges (estado: pendiente/publicado) | 12px | 600 | 1 | Uppercase + letter-spacing leve. |
| Pie de página | 13–14px | 400 | 1.5 | Color secundario. |

**Escala:** progresión simple (12 / 13 / 14 / 15 / 16 / 18 / 22 / 24 / 28 / 32).

---

## 5. Espaciado

Sistema de **múltiplos de 4px**:

`--space-1: 4px · --space-2: 8px · --space-3: 12px · --space-4: 16px · --space-5: 24px · --space-6: 32px · --space-7: 48px · --space-8: 64px`

- **Padding interno de componentes** (botones, inputs, badges): `--space-2` a `--space-3`.
- **Padding interno de tarjetas**: `--space-4`.
- **Margin entre elementos relacionados** (label + input, título + descripción): `--space-2`.
- **Espacio entre componentes dentro de una sección** (tarjetas en un grid): `--space-4` a `--space-5`.
- **Espacio entre secciones de una página** (hero → listado → footer): `--space-7` a `--space-8`.

---

## 6. Bordes

- Botones / inputs / badges: `--radius-sm = 6px`.
- Tarjetas / modales / contenedores: `--radius-md = 12px`.
- Avatares / elementos circulares: `--radius-full = 999px`.
- **Cuándo usar borde:** inputs y tarjetas sobre fondo `--color-bg` cuando no hay suficiente contraste con sombra sola (formularios, tablas admin).
- **Cuándo NO usar borde:** cuando la tarjeta ya se distingue por sombra + color de superficie.

---

## 7. Sombras

| Nivel | Uso |
|---|---|
| `--shadow-sm` | Tarjetas en reposo (`EventCard` en el listado). |
| `--shadow-md` | Hover de tarjetas interactivas, dropdowns, popovers. |
| `--shadow-lg` | Modales, diálogos de confirmación. |

Regla: nunca combinar sombra fuerte + borde fuerte en el mismo elemento.

---

## 8. Botones

| Variante | Uso | Estilo base |
|---|---|---|
| **Primario** | Acciones generales (iniciar sesión, registrarse, guardar cambios, editar) | Fondo `--color-primary`, texto blanco, `--radius-sm`, sin borde. |
| **Accent / Conversión** | Única acción de mayor valor por vista (Me interesa, Proponer evento, Publicar evento) | Fondo `--color-accent`, texto blanco, `--radius-sm`, sin borde. |
| **Secundario** | Acciones alternativas de igual jerarquía baja (Cancelar, Volver) | Fondo transparente, borde `--color-border`, texto `--color-text`. |
| **Ghost** | Acciones terciarias dentro de tarjetas/listas (Compartir, "Ver más") | Sin fondo ni borde, texto `--color-primary`, subrayado solo en hover. |
| **Danger** | Rechazar evento, eliminar, cerrar sesión con confirmación | Fondo transparente o `--color-error` según peso de la acción. |
| **Disabled** | Cualquier variante en estado no disponible | Opacidad 0.5, `cursor: not-allowed`, sin hover/focus activos. |
| **Hover** | Todas las variantes | Oscurecer el color base ~10–15% (nunca cambiar de familia de color). |
| **Focus** | Todas las variantes | Anillo visible `outline: 2px solid` con color de contraste — obligatorio para navegación por teclado. |

**Regla de jerarquía:** máximo un botón primario y un botón accent visibles por vista/sección, para que "cuál es la acción principal" sea inequívoco.

---

## 9. Tarjetas (EventCard y afines)

- Superficie `--color-surface`, `--radius-md`, `--shadow-sm`, padding `--space-4`.
- Imagen del evento arriba (protagonismo visual), relación de aspecto fija para evitar saltos de layout.
- Título (H3) con máximo 2 líneas.
- Metadatos secundarios (fecha, lugar) en texto secundario, con icono pequeño para escaneabilidad.
- Badge de estado (pendiente/publicado) solo en variantes admin, esquina superior, con colores semánticos.
- Acción principal alineada abajo, siempre en la misma posición entre tarjetas del mismo tipo.
- Hover: eleva a `--shadow-md` + leve `translateY(-2px)` respetando la duración definida en Motion.

**Nota de reutilización:** hoy existen 3 variantes de tarjeta de evento con CSS duplicado; un sprint futuro debería proponer una tarjeta base reutilizable con slots para acciones/badge.

---

## 10. Formularios

- **Inputs/Textarea:** superficie blanca, borde `--color-border` (`1px`), `--radius-sm`, padding `--space-3`. Foco: borde `--color-primary` + halo suave.
- **Select:** mismo tratamiento visual que input.
- **Labels:** siempre visibles arriba del campo, 13–14px, peso 600.
- **Mensajes de error:** texto `--color-error`, 13–14px, debajo del campo; borde del input pasa a `--color-error`.
- **Mensajes de éxito:** banner o texto `--color-success`, tras acciones (ej. "Evento enviado a revisión").
- **Estados de carga:** deshabilitar el botón de submit + texto de estado ("Guardando…").
- **Estados vacíos:** mensaje corto + acción sugerida (ej. "Todavía no hay eventos publicados. Volvé pronto.").

---

## 11. Layout general

- **Ancho máximo de contenido:** ~1200px centrado, con padding lateral fluido (`--space-4`–`--space-6`) en mobile.
- **Separación entre secciones:** `--space-7`/`--space-8`, consistente en todas las páginas.
- **Responsive:** mobile-first; grid de tarjetas de eventos con `auto-fill`/`minmax`.
- **Jerarquía visual:** patrón consistente en cada página: 1) título de página + una línea de contexto, 2) contenido principal (protagonista), 3) acciones secundarias.

---

## 12. Accesibilidad

- **Contraste:** todos los pares texto/fondo cumplen mínimo AA (4.5:1 texto normal, 3:1 texto grande/iconos).
- **Foco:** anillo de foco visible y consistente en todos los elementos interactivos.
- **Tamaño mínimo de controles:** 40–44px de alto en botones/inputs táctiles.
- **Legibilidad:** cuerpo de texto nunca menor a 16px en contenido principal; line-height mínimo 1.4.

---

## 13. Motion & Microinteracciones

Las animaciones existen únicamente para **comunicar estado o reforzar una interacción**, nunca como espectáculo visual.

**Reglas generales:**
- Duración: **150–250ms**.
- Curva de easing suave (`ease-out` para entradas, `ease-in-out` para transiciones de estado); nunca rebotes (`bounce`) ni efectos elásticos.
- Propiedades animables preferidas: `opacity`, `transform` (translate/scale sutil). Evitar animar propiedades costosas (`width`, `height`, `top/left`).
- Sin animaciones de entrada llamativas en listados (no "cascadas" ni "fade-in" secuenciales largos): el contenido debe estar disponible de inmediato.
- Casos válidos de motion:
  - Hover de tarjetas (elevación de sombra + leve traslación).
  - Transición de estado de botones (hover/focus/disabled).
  - Aparición/desaparición de mensajes (alert, toast, error de formulario).
  - Apertura/cierre de modales y menús desplegables.
- Casos a evitar: animaciones decorativas sin función (parallax, iconos que "laten", transiciones de página largas), cualquier motion que retrase la percepción de velocidad de la app.

**Justificación:** microinteracciones cortas y predecibles transmiten calidad y pulido sin distraer del contenido (los eventos), y no penalizan a usuarios con preferencia de movimiento reducido (`prefers-reduced-motion` debe respetarse siempre).

---

## 14. Componentes reutilizables a futuro (propuesta, no implementar aún)

1. **`Card` base** (slots: imagen, título, meta, badge, acciones) → reemplaza duplicación entre `EventCard`, `AdminEventCard`, `AdminPublishedEventCard`.
2. **`Button`** único con variantes (`primary/accent/secondary/ghost/danger`) vía props.
3. **`Badge`** (estado: pendiente/publicado/rechazado) — reutilizable entre admin y detalle de evento.
4. **`FormField`** (label + input/textarea/select + mensaje de error) — evita repetir estructura en `EventForm`, `Login`, `Register`, `Contact`.
5. **`EmptyState`** (icono/ilustración + mensaje + acción opcional).
6. **`Alert`/`Toast`** de éxito/error/advertencia, un solo componente parametrizado por tipo.
7. **`PageHeader`** (título + descripción corta + acción principal opcional).
8. **`Skeleton`/loading state** consistente para listas y detalle.

---

Este documento es el **contrato de diseño oficial** para todos los sprints UX posteriores. Ningún color, tamaño, componente o animación debería definirse "sobre la marcha" sin volver a esta referencia.
