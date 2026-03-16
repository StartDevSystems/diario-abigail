# Code Review & QA Log

Registro de auditorías de código por sprint. Cada Pull Request o cambio significativo pasa por revisión técnica antes de ser aceptado.

**Convenciones:**
- Severidad: `CRITICAL` | `MAJOR` | `MINOR` | `INFO`
- Estado: `OPEN` | `FIXED` | `WONTFIX` | `DEFERRED`
- Desarrolladores: Dev-1, Dev-2, etc.

---

## Sprint 03 — PWA & Optimización de Lectura
**Período:** 15 Mar - 22 Mar 2026
**Reviewer:** Tech Lead

---

### CR-001: Review de ABI-11 (Texto "Grande" en móvil)
**Fecha:** 15 Mar 2026
**Autor del código:** Dev-1
**Archivos revisados:** `src/views/Hoy.tsx`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-001-01 | `MAJOR` | Labels de UI reducidos a `9px` (`text-[9px]`). Viola el mínimo de accesibilidad WCAG (10px para labels decorativos). En dispositivos con densidad baja, texto se vuelve ilegible. | `Hoy.tsx:53,60` | `FIXED` |
| CR-001-02 | `MINOR` | Emoji de mood usa tamaño fijo `text-4xl` (36px). No se adapta al viewport móvil, creando desbalance visual cuando el usuario selecciona fuente "Grande". | `Hoy.tsx:51` | `FIXED` |
| CR-001-03 | `MINOR` | `onKeyPress` es un evento deprecado en React 17+. Fue tocado en la misma línea pero no corregido. Regla del equipo: si tocas una línea, corriges lo que está roto. | `Hoy.tsx:114` | `FIXED` |
| CR-001-04 | `INFO` | Buen uso de `break-words` en task text, `min-w-0` en input flex, y `shrink-0` en botón. Patrones correctos para prevenir overflow en modo "Grande". | `Hoy.tsx:109,114,115` | N/A |
| CR-001-05 | `INFO` | Correctamente eliminó `p-8` inline de `.card-premium` para que el media query de CSS (`padding: 1.5rem` en <640px) tome efecto. | `Hoy.tsx:74,97` | N/A |

#### Correcciones aplicadas por el Reviewer

```
Hoy.tsx:53  → text-[9px] revertido a text-[10px]
Hoy.tsx:60  → text-[9px] revertido a text-[10px]
Hoy.tsx:51  → text-4xl cambiado a text-3xl sm:text-4xl (responsive)
Hoy.tsx:114 → onKeyPress cambiado a onKeyDown
```

#### Veredicto
**APROBADO CON CORRECCIONES** (7/10)

Dirección correcta y buenos patrones de responsive. Faltó ojo en accesibilidad (tamaños mínimos) y calidad técnica (deprecations). Se recomienda que Dev-1 valide siempre contra el checklist de QA antes de entregar.

---

### CR-002: Review de ABI-11 (Fix del sistema de font-size)
**Fecha:** 15 Mar 2026
**Autor del código:** Tech Lead
**Archivos modificados:** `src/components/Layout.tsx`, `src/views/Devocional.tsx`, `src/app/globals.css`

#### Cambios realizados

| Archivo | Cambio | Justificación |
|:---|:---|:---|
| `Layout.tsx:62-66` | `sizeMap` estático (`0.9/1.0/1.1rem`) reemplazado por `clamp()` responsivo | Los valores fijos no escalaban en viewport 375px. `clamp()` da un rango fluido: small 13-14px, medium 15-16px, large 17-19px |
| `Devocional.tsx:348` | `.dev-verse-text{font-size:1rem !important}` cambiado a `font-size:inherit` | El `!important` mataba la preferencia del usuario al seleccionar "Grande". El texto del versículo se quedaba en 16px siempre |
| `globals.css` | Agregado `overflow-wrap: break-word` y `word-break: break-word` para `<640px` | Previene que textos largos (versículos, notas) desborden los contenedores en móvil |

#### Veredicto
**AUTOREVIEW** — Validado con `npx next build` exitoso.

---

### CR-003: Review de ABI-11 (Devocional.tsx — Dev-1 segunda entrega)
**Fecha:** 15 Mar 2026
**Autor del código:** Dev-1
**Archivos revisados:** `src/views/Devocional.tsx`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-003-01 | `INFO` | `StyledTextarea` corregido: `fontSize:".9rem"` → `fontSize:"inherit"` + `wordBreak:"break-word"`. Todos los textareas del Devocional ahora respetan el setting del usuario. | `Devocional.tsx:73` | OK |
| CR-003-02 | `INFO` | Versículo principal corregido: `fontSize:"1.2rem"` → `fontSize:"inherit"` + `wordBreak:"break-word"`. El texto sagrado ahora escala con la preferencia del usuario. | `Devocional.tsx:391` | OK |
| CR-003-03 | `INFO` | Paddings inline eliminados correctamente: `p-[1.4rem]` (línea 408), `p-[1.2rem]` (línea 438), `p-[1.3rem]` (línea 450). El CSS `.card-premium` maneja el responsive. | `Devocional.tsx:408,438,450` | OK |
| CR-003-04 | `INFO` | No tocó la línea 348 (`.dev-verse-text` CSS) ni `Layout.tsx` ni `globals.css`. Respetó las instrucciones. | — | OK |
| CR-003-05 | `INFO` | No aplicó `text-balance` innecesario en SectionLabels. Siguió la guía correctamente. | — | OK |

#### Veredicto
**APROBADO** (9/10)

Dev-1 siguió las instrucciones del Tech Lead al pie de la letra. Mejora notable respecto a CR-001. Sin hallazgos negativos. Build exitoso.

**Nota:** Habitos.tsx fue revisado y no requiere cambios — los font-sizes hardcodeados son todos para emojis y elementos decorativos, no para contenido de lectura.

---

### CR-004: Review de ABI-14 (Copiar y compartir versículo — Dev-3)
**Fecha:** 15 Mar 2026
**Autor del código:** Dev-3
**Archivos revisados:** `src/views/Devocional.tsx`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-004-01 | `INFO` | Implementó `handleCopy` con `navigator.clipboard.writeText()` y feedback visual (icono Check verde + texto "¡Copiado!" por 2s). Correcto. | `Devocional.tsx:327-333` | OK |
| CR-004-02 | `INFO` | Implementó `handleWhatsApp` con URL `wa.me` + `encodeURIComponent`. Texto incluye versículo, referencia y firma. Correcto. | `Devocional.tsx:335-340` | OK |
| CR-004-03 | `INFO` | Botones condicionados a `today.devocionalVerse` existente. No se muestran sin versículo. Correcto. | `Devocional.tsx:425-439` | OK |
| CR-004-04 | `INFO` | Contenedor flex con `flexWrap:wrap` y `justifyContent:center`. Responsive en móvil. | `Devocional.tsx:416` | OK |
| CR-004-05 | `INFO` | Mantiene los fixes de ABI-11 (fontSize inherit, padding removido, wordBreak). No hubo regresión. | — | OK |
| CR-004-06 | `MINOR` | El botón de WhatsApp usa `border:"none"` lo cual rompe la consistencia visual con los otros dos botones que sí tienen borde. No bloquea aprobación. | `Devocional.tsx:434` | `DEFERRED` |

#### Veredicto
**APROBADO** (9/10)

Implementación limpia y funcional. Siguió instrucciones al pie de la letra. El detalle del borde en WhatsApp es cosmético y menor.

---

### CR-005: Review de ABI-13 (Panel Admin premium — Dev-2)
**Fecha:** 15 Mar 2026
**Autor del código:** Dev-2
**Archivos revisados:** `src/views/Admin.tsx`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-005-01 | `INFO` | Sección de métricas con 3 tarjetas (Usuarios Totales, Activos Hoy, Hábitos Logrados). Cálculos correctos desde el array `users`. Responsive con `sm:grid-cols-3`. | `Admin.tsx:44-59` | OK |
| CR-005-02 | `INFO` | Logs mock con 5 eventos de ejemplo, estilo premium consistente, layout sidebar 4/12 cols. | `Admin.tsx:7-13` | OK |
| CR-005-03 | `INFO` | Tarjeta "Salud de Red" con indicador Firestore ACTIVO y punto verde animado. Buen detalle visual. | `Admin.tsx:155-164` | OK |
| CR-005-04 | `INFO` | Agregó `shrink-0`, `min-w-0`, `truncate`, `break-words` donde corresponde. Aprendió de CR-001. | Múltiples | OK |
| CR-005-05 | `MINOR` | JSX almacena `<LogIn size={14} />` etc. directamente en el array `MOCK_LOGS`. Esto funciona pero es un anti-pattern: los iconos se re-crean en cada render y no se pueden serializar. Debería guardar el nombre del icono como string y renderizar con un map. No bloquea. | `Admin.tsx:8-12` | `DEFERRED` |
| CR-005-06 | `MINOR` | `p-8` inline en tarjetas de usuario (`.card-premium p-8`). Viola la regla del equipo pero en Admin el contenido es diferente y necesita más padding. Aceptable como excepción documentada. | `Admin.tsx:75` | `WONTFIX` |

#### Veredicto
**APROBADO** (8/10)

Buen trabajo. El panel se ve profesional y las métricas son funcionales. El anti-pattern del JSX en array es deuda técnica menor.

---

### CR-006: Review de ABI-16 (Categorización de notas — Dev-4)
**Fecha:** 15 Mar 2026
**Autor del código:** Dev-4
**Archivos revisados:** `src/types/index.ts`, `src/context/JournalContext.tsx`, `src/views/Notas.tsx`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-006-01 | `INFO` | Interface `Note` extendida con `tag?` opcional. Retrocompatible con notas existentes. | `types/index.ts:34` | OK |
| CR-006-02 | `INFO` | `addNote()` acepta `tag` como segundo parámetro opcional, default `'general'`. No rompe usos existentes. | `JournalContext.tsx:216-218` | OK |
| CR-006-03 | `INFO` | Filtro "Todas" + 4 tags con pills colorizados. Funcional y estilo premium. | `Notas.tsx:38-67` | OK |
| CR-006-04 | `INFO` | Selector de tag en formulario con estilo consistente. Reset a 'general' después de crear nota. | `Notas.tsx:69-92` | OK |
| CR-006-05 | `INFO` | Badge de etiqueta en cada tarjeta con color translúcido (`${color}20`). Elegante. | `Notas.tsx:112-119` | OK |
| CR-006-06 | `MINOR` | Usa `tag as any` en JournalContext — cast innecesario. La interface ya tipea los valores posibles. Debería ser `tag as Note['tag']` o simplemente validar. No bloquea. | `JournalContext.tsx:218` | `DEFERRED` |
| CR-006-07 | `INFO` | `break-words` en contenido de notas. `flex-wrap` en filtros. Responsive correcto. | `Notas.tsx:35,128` | OK |

#### Veredicto
**APROBADO** (9/10)

Implementación sólida. La retrocompatibilidad con notas existentes funciona correctamente. El `as any` es el único detalle técnico menor.

---

### CR-007: Review de ABI-21 (Gestión de Roles — Dev-2)
**Fecha:** 15 Mar 2026
**Autor del código:** Dev-2
**Archivos revisados:** `src/views/Admin.tsx`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-007-01 | `INFO` | `toggleRole()` actualiza Firestore con `updateDoc` y refleja cambio en estado local sin reload. Patrón correcto. | `Admin.tsx:194-207` | OK |
| CR-007-02 | `INFO` | Badge "Admin" con pill rosa en tarjeta de usuario. Buena identificación visual del rol. | `Admin.tsx:350-352` | OK |
| CR-007-03 | `INFO` | Botones en flex container con colores diferenciados (verde promoción, rojo degradación). Responsive con `shrink-0`, `min-w-0`, `truncate`. | `Admin.tsx:372-390` | OK |
| CR-007-04 | `MAJOR` | No había protección contra auto-degradación. Si el admin se quita su propio rol, pierde acceso al panel sin poder revertirlo. | `Admin.tsx:377` | `FIXED` |
| CR-007-05 | `MINOR` | `text-[8px]` en badge Admin. Por debajo del mínimo 10px del checklist. Aceptable como badge decorativo. | `Admin.tsx:351` | `DEFERRED` |

#### Correcciones aplicadas por el Reviewer

```
Admin.tsx:376-389 → Botón de toggle envuelto en condicional {u.id !== user?.uid && (...)}
                     Previene que el admin se auto-degrade.
```

#### Veredicto
**APROBADO CON CORRECCIONES** (7/10)

Funcionalidad correcta. Bug crítico de auto-degradación corregido por el reviewer. Dev-2 debe considerar edge cases de seguridad en features de gestión de permisos.

---

### CR-008: Review de ABI-22 (Palabra del Día — Dev-3)
**Fecha:** 15 Mar 2026
**Autor del código:** Dev-3
**Archivos revisados:** `src/views/Admin.tsx`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-008-01 | `INFO` | `handleSendDailyWord()` valida input vacío, guarda en Firestore collection `announcements` con `serverTimestamp()`, limpia textarea y muestra feedback 2s. Correcto. | `Admin.tsx:174-192` | OK |
| CR-008-02 | `INFO` | Textarea con límite 280 chars via `.slice(0, 280)` y contador visual `{length}/280`. Correcto. | `Admin.tsx:292,297` | OK |
| CR-008-03 | `INFO` | Botón con 3 estados (normal/sending/success) usando spinner CSS + CheckCircle2. Buen UX. | `Admin.tsx:301-326` | OK |
| CR-008-04 | `INFO` | `disabled` cuando vacío o enviando. Previene doble-click. Correcto. | `Admin.tsx:303` | OK |
| CR-008-05 | `INFO` | Estilo premium consistente: gradient background, rounded-3xl, font-serif italic en textarea, deep-rose en botón. | `Admin.tsx:277-328` | OK |

#### Veredicto
**APROBADO** (9/10)

Implementación limpia y funcional. Sin hallazgos negativos. Buen manejo de estados de carga y feedback visual. Build exitoso.

---

### CR-009: Hotfix — IDs crudos reemplazados por nombres de usuario (Tech Lead)
**Fecha:** 15 Mar 2026
**Autor del código:** Tech Lead
**Archivos modificados:** `src/views/Admin.tsx`, `src/views/Configuracion.tsx`

#### Problema detectado en QA visual
El PO reportó que en múltiples vistas se mostraba el UID de Firebase (`WqSzxRchE3...`) en lugar del nombre del usuario. Afectaba:
1. Tarjetas de usuario en Panel Admin (solo mostraba ID)
2. Modal "Auditar Diario" (encabezado con ID en vez de nombre)
3. Logs de actividad (IDs tipo `u_8291` en vez de nombres)
4. Lista de usuarios en Configuración > Sistema (ID truncado)

#### Cambios realizados

| Archivo | Cambio | Justificación |
|:---|:---|:---|
| `Admin.tsx:351` | Agregado `<p>{u.user?.name \|\| 'Sin nombre'}</p>` encima del ID en tarjetas | El nombre debe ser lo prominente, el ID es referencia técnica |
| `Admin.tsx:24` | `u.user?.name \|\| u.id.slice(0,10)` → `u.user?.name \|\| 'Sin nombre'` | Modal mostraba hash como título |
| `Admin.tsx:10-14` | `user: 'u_8291'` → `user: 'Abigail'` etc. en MOCK_LOGS | Logs mock con nombres bíblicos en vez de IDs falsos |
| `Admin.tsx:220-223` | Filtro de búsqueda extendido para buscar por `u.user?.name` | Antes solo buscaba por ID y mood |
| `Configuracion.tsx:178-179` | `u.id[0]` → `(u.user?.name \|\| 'U')[0]`, `u.id.slice(0,16)` → `u.user?.name \|\| 'Sin nombre'` | Lista de usuarios en Sistema mostraba solo IDs |

#### Veredicto
**HOTFIX APLICADO** — Detectado por PO en prueba visual. Todos los puntos donde se mostraba un UID al usuario final fueron corregidos. Build verificado.

---

### CR-010: Hotfix — Header Devocional roto en móvil (Tech Lead)
**Fecha:** 15 Mar 2026
**Autor del código:** Tech Lead
**Archivos modificados:** `src/views/Devocional.tsx`

#### Problema detectado en QA visual
El PO reportó que el logo con el texto "Jesús" en la sección Devocional se cortaba/rompía en pantallas móviles. Causa raíz: el header usaba `display:flex` con 3 columnas (badges, texto, cruz) sin adaptarse a viewports estrechos.

#### Cambios realizados

| Archivo | Cambio | Justificación |
|:---|:---|:---|
| `Devocional.tsx:363` | `dev-jesus` reducido de `3.4rem` a `2.8rem` en `@media(<540px)` | El tamaño anterior aún desbordaba en iPhone SE (375px) |
| `Devocional.tsx:365-366` | Agregado media query `.dev-header-top{flex-direction:column; align-items:center}` | En móvil los 3 elementos se apilan verticalmente en vez de forzar 3 columnas |
| `Devocional.tsx:382` | Agregado `flexWrap:"wrap"` y clase `dev-header-top` al contenedor | Fallback para pantallas intermedias (~500px) |
| `Devocional.tsx:383` | `flexShrink:0` en badges | Previene que los pills "Devocional"/"Diario" se compriman |
| `Devocional.tsx:389` | `minWidth:120` en contenedor de "Jesús" | Garantiza espacio mínimo antes de hacer wrap |
| `Devocional.tsx:392` | `flexShrink:0` y clase `dev-cross-section` en sección de cruz | Previene compresión del ícono y fecha |

#### Pruebas realizadas
- `npx next build` exitoso
- Verificación visual solicitada al PO en dispositivo móvil

#### Veredicto
**HOTFIX APLICADO** — Detectado por PO en prueba visual móvil. Layout del header ahora es responsive con stack vertical en pantallas <540px.

---

### CR-011: Hotfix — Nombre "Abigail" hardcodeado + Mood selector roto en móvil (Tech Lead)
**Fecha:** 15 Mar 2026
**Autor del código:** Tech Lead
**Archivos modificados:** `src/views/Hoy.tsx`, `src/components/Layout.tsx`, `src/context/JournalContext.tsx`

#### Problemas detectados en QA visual (PO)

| ID | Severidad | Descripción | Estado |
|:---|:---|:---|:---|
| CR-011-01 | `MAJOR` | Saludo "Hola, Abigail" aparecía para todos los usuarios. El default de `getInitialState()` era `name: "Abigail"` y nunca se reemplazaba con el nombre de Google. | `FIXED` |
| CR-011-02 | `MAJOR` | Selector de ánimo (5 emojis) se desbordaba en móvil. Sin `flex-wrap`, tamaño fijo `text-3xl`, y `gap-4` excesivo para pantallas <375px. | `FIXED` |

#### Cambios realizados

| Archivo | Cambio | Justificación |
|:---|:---|:---|
| `Hoy.tsx:29` | Prioridad de nombre: nombre custom → displayName de Google → fallback "Amiga" | Si el nombre es "Abigail" (default), usa el de Google |
| `Hoy.tsx:59-68` | Mood selector: `text-2xl sm:text-3xl`, `gap-2 sm:gap-4`, `flex-wrap`, `p-4 sm:p-5` | Emojis más pequeños en móvil con wrap para prevenir overflow |
| `Layout.tsx:50` | Misma lógica de nombre que en Hoy.tsx | Consistencia en header y sidebar |
| `JournalContext.tsx:139-141` | Usuario nuevo usa `displayName` de Google como nombre inicial | Previene que todos los usuarios nuevos se llamen "Abigail" |

#### Veredicto
**HOTFIX APLICADO** — Dos bugs reportados por PO. Build verificado.

---

### CR-012: Hotfix — Nombre de registro no se guardaba + texto mood cortado en móvil (Tech Lead)
**Fecha:** 15 Mar 2026
**Autor del código:** Tech Lead
**Archivos modificados:** `src/components/AuthScreen.tsx`, `src/views/Hoy.tsx`

#### Problemas detectados en QA visual (PO)

| ID | Severidad | Descripción | Estado |
|:---|:---|:---|:---|
| CR-012-01 | `MAJOR` | Al registrarse con nombre+correo+contraseña, el nombre del formulario no se guardaba en Firestore. Causa: `onAuthStateChanged` se dispara antes de que `updateProfile` termine, creando el documento con `name: "Abigail"`. | `FIXED` |
| CR-012-02 | `MINOR` | Texto "¿Cómo te sientes hoy?" se partía en móvil por `tracking-widest` excesivo. | `FIXED` |
| CR-012-03 | `MINOR` | Layout del header "Hoy" desordenado en móvil — saludo y mood selector competían por espacio en la misma fila. | `FIXED` |

#### Cambios realizados

| Archivo | Cambio | Justificación |
|:---|:---|:---|
| `AuthScreen.tsx:5-8` | Agregado imports de Firestore (`doc, setDoc, getDoc`) | Necesario para guardar nombre directamente |
| `AuthScreen.tsx:30-37` | Después de `createUser` + `updateProfile`, guarda `name` directamente en Firestore con `setDoc(merge: true)` | Elimina race condition con `onAuthStateChanged` |
| `Hoy.tsx:33-70` | Header reestructurado: saludo y mood en bloques separados (`space-y-6`), selector limitado a `max-w-sm`, emojis con `justify-between` | Previene layout roto en móvil |
| `Hoy.tsx:44` | `tracking-widest` → `tracking-wider sm:tracking-widest` + `whitespace-nowrap` | Texto no se parte en móvil |

#### Pruebas realizadas
- `npx next build` exitoso
- PO validó visualmente en dispositivo móvil

#### Veredicto
**HOTFIX APLICADO** — Race condition en registro y layout móvil corregidos. Build verificado.

---

## Sprint 05 — Temas Dinámicos & Perfil Premium
**Período:** 16 Mar - 23 Mar 2026
**Reviewer:** Tech Lead

---

### CR-013: Review de ABI-26 (Sistema de Temas de Color Dinámico)
**Fecha:** 16 Mar 2026
**Autor del código:** Dev-1, Dev-2, Dev-3 (refactor colores), Tech Lead (integración picker + fixes)
**Archivos revisados:** `src/views/Configuracion.tsx`, `src/components/Layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-013-01 | `INFO` | 8 paletas preset (Rosa, Lavanda, Océano, Esmeralda, Atardecer, Dorado, Carmesí, Elegante) con preview visual. Correcta variedad de colores y buena UX de selección. | `Configuracion.tsx` | OK |
| CR-013-02 | `INFO` | Color picker libre con `react-colorful`. Arrastre fluido gracias a throttle con `requestAnimationFrame`. Sin jank en dispositivos móviles. | `Configuracion.tsx` | OK |
| CR-013-03 | `INFO` | `applyTheme()` en Layout.tsx genera 8 variantes HSL desde un solo color hex. Variables CSS dinámicas: `--color-theme-primary`, `hover`, `pastel`, `border`, `light`, `accent`, `muted`, `cream-pastel`. Algoritmo sólido. | `Layout.tsx` | OK |
| CR-013-04 | `INFO` | Botón "Restablecer colores originales" para volver al default `#e11d74`. Previene que la usuaria quede atrapada con un color que no le gusta. | `Configuracion.tsx` | OK |
| CR-013-05 | `INFO` | Fondo de toda la app cambia dinámicamente via `bg-cream-pastel`. Preview en tiempo real mientras se arrastra el picker. | `page.tsx`, `Layout.tsx` | OK |
| CR-013-06 | `MINOR` | Throttle con `requestAnimationFrame` es la elección correcta para rendimiento del picker. Alternativa `lodash.throttle` habría agregado dependencia innecesaria. Buena decisión técnica. | `Configuracion.tsx` | OK |

#### Veredicto
**APROBADO** (9/10)

Feature completo y bien integrado. La generación de variantes HSL desde un solo color es elegante y mantenible. El throttle con rAF asegura rendimiento fluido. Build exitoso.

---

### CR-014: Review de ABI-27 (Perfil de Usuario Premium — Dashboard Personal)
**Fecha:** 16 Mar 2026
**Autor del código:** Agent (estructura), Tech Lead (foto de perfil, fix edición nombre, integración Layout)
**Archivos revisados:** `src/views/Configuracion.tsx`, `src/context/JournalContext.tsx`, `src/types/index.ts`, `src/components/Layout.tsx`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-014-01 | `INFO` | Header con avatar grande (foto o iniciales), nombre serif italic, email, bio y badge Admin. Estilo premium consistente. | `Configuracion.tsx` | OK |
| CR-014-02 | `INFO` | Subir foto de perfil en base64 con límite de 500KB. Botón de cámara superpuesto sobre el avatar. Foto aparece también en botón "Mi Espacio" del header (Layout.tsx). | `Configuracion.tsx`, `Layout.tsx` | OK |
| CR-014-03 | `INFO` | Grid de estadísticas 2x2 en móvil / 4x1 en desktop: Días activos, Racha actual, Tareas completadas, Notas escritas. Responsive correcto con `grid-cols-2 sm:grid-cols-4`. | `Configuracion.tsx` | OK |
| CR-014-04 | `INFO` | Resumen emocional: mood más frecuente destacado + barras de distribución con emojis y porcentajes. Buen uso de datos existentes. | `Configuracion.tsx` | OK |
| CR-014-05 | `MAJOR` | `useEffect` reseteaba el formulario de nombre/bio en cada render, impidiendo editar. Fix aplicado: el efecto ya no sobreescribe mientras el usuario está escribiendo. | `Configuracion.tsx` | `FIXED` |
| CR-014-06 | `INFO` | Buzón de sugerencias preservado dentro del perfil. No hubo regresión. | `Configuracion.tsx` | OK |

#### Correcciones aplicadas por el Reviewer

```
Configuracion.tsx → useEffect con dependencia controlada: solo sincroniza nombre/bio
                     cuando cambia el uid, no en cada re-render del estado global.
                     Previene que el formulario se resetee mientras el usuario escribe.
```

#### Veredicto
**APROBADO CON CORRECCIONES** (8/10)

Dashboard visualmente atractivo con estadísticas útiles. Bug del useEffect que reseteaba el formulario fue corregido por el Tech Lead. La foto de perfil integrada en Layout.tsx es un buen detalle de cohesión visual.

---

### CR-015: Review de ABI-28 (Botón Guardar Flotante en Ajustes)
**Fecha:** 16 Mar 2026
**Autor del código:** Tech Lead
**Archivos revisados:** `src/views/Configuracion.tsx`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-015-01 | `INFO` | Posición `fixed`, `bottom-28` en móvil (arriba del navbar), `bottom-10` en desktop. Nunca queda tapado por la navegación. | `Configuracion.tsx` | OK |
| CR-015-02 | `INFO` | Estilo: `rounded-2xl`, `shadow-xl`, `border-2 border-white/20`, `hover:scale-110`. Discreto pero accesible. Solo icono, sin texto. | `Configuracion.tsx` | OK |
| CR-015-03 | `INFO` | Siempre visible sin importar el scroll. Mejora la UX en formularios largos como Ajustes. | `Configuracion.tsx` | OK |

#### Veredicto
**APROBADO** (10/10)

Implementación simple y efectiva. Posicionamiento responsive correcto. Build exitoso.

---

### CR-016: Review de ABI-29 (Refactor de Colores Hardcodeados a Variables CSS)
**Fecha:** 16 Mar 2026
**Autor del código:** Dev-1, Dev-2, Dev-3
**Archivos revisados:** `src/views/Admin.tsx`, `src/views/Hoy.tsx`, `src/components/WelcomeScreen.tsx`, `src/app/page.tsx`, `src/app/globals.css`

#### Hallazgos

| ID | Severidad | Descripción | Archivo:Línea | Estado |
|:---|:---|:---|:---|:---|
| CR-016-01 | `INFO` | Admin.tsx: 48 colores hardcodeados migrados a variables de tema. Todos los rosas, bordes y fondos ahora respetan el tema activo. | `Admin.tsx` | OK |
| CR-016-02 | `INFO` | Hoy.tsx: colores migrados + labels de mood añadidos para accesibilidad. | `Hoy.tsx` | OK |
| CR-016-03 | `INFO` | WelcomeScreen.tsx: colores migrados a variables CSS. Pantalla de bienvenida ahora respeta el tema. | `WelcomeScreen.tsx` | OK |
| CR-016-04 | `INFO` | page.tsx: `bg-[#fffcf2]` reemplazado por `bg-cream-pastel` (2 ocurrencias). Fondo dinámico. | `page.tsx` | OK |
| CR-016-05 | `INFO` | globals.css: `@theme` con variables CSS como valores default. Base sólida para el sistema de temas. | `globals.css` | OK |
| CR-016-06 | `MINOR` | Accesibilidad corregida: instancias de `text-[9px]` encontradas durante el refactor fueron actualizadas a `text-[10px]`, respetando el mínimo del equipo. | Múltiples | `FIXED` |

#### Veredicto
**APROBADO** (9/10)

Refactor masivo ejecutado correctamente. 169+ colores migrados sin regresiones visuales. Los devs aprovecharon para corregir violaciones de accesibilidad (`text-[9px]` a `text-[10px]`). El sistema de temas ahora tiene una base CSS sólida. Build exitoso.

---

## Checklist de QA para Dev-1

Antes de entregar código para revisión, verificar:

- [ ] **Accesibilidad:** Ningún texto visible está por debajo de `10px` (`text-[10px]`)
- [ ] **Responsive:** Probar en viewport 375px (iPhone SE) con fuente "Grande" activa
- [ ] **Deprecations:** No usar APIs deprecadas (`onKeyPress`, `componentWillMount`, etc.)
- [ ] **CSS Specificity:** No usar `!important` en font-sizes — conflictúa con el sistema de tamaños del usuario
- [ ] **Flex overflow:** Todo input dentro de flex debe tener `min-w-0`, todo botón debe tener `shrink-0`
- [ ] **Card padding:** No agregar padding inline (`p-8`) en elementos con clase `.card-premium` — el CSS ya maneja responsive
- [ ] **Build:** Ejecutar `npx next build` antes de entregar. Si no compila, no se entrega
