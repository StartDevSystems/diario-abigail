# 🌸 Diario de Abigail - Proyecto de Vida & Devocional

Este archivo es la fuente de verdad para Gemini CLI. Define la identidad, arquitectura y reglas críticas del proyecto.

## 📝 Identidad del Proyecto
*   **Nombre:** Diadio-Abiagil (Diario de Abigail)
*   **Misión:** Proporcionar un espacio digital seguro, estético (estilo Apple/Premium) y espiritual para el crecimiento personal diario.
*   **Estilo Visual:** "Premium White" / Apple Style. Fondos off-white (`#EFEFF4`), tarjetas elevadas (`.card-premium`), sombras multicapa, tipografía elegante (Lora, Playfair Display) y detalles en rosa profundo (`#DB2777`).

## 🛠️ Stack Tecnológico
*   **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS.
*   **Base de Datos & Auth:** Firebase (Firestore & Authentication).
*   **Animaciones:** Framer Motion, GSAP.
*   **Iconografía:** Lucide React.

## 🏗️ Arquitectura & Reglas de Oro
1.  **Vistas vs Páginas:** La navegación principal se maneja mediante pestañas (`activeTab`) en `src/components/Layout.tsx`. Las vistas reales están en `src/views/`.
2.  **Contexto Global:** `JournalContext.tsx` es el cerebro. Todo lo que deba persistir (hábitos, notas, perfil, ajustes) DEBE pasar por las funciones `updateToday`, `updateProfile` o `updateSettings`.
3.  **Diseño Card-Premium:** Ningún contenedor principal debe ser un `div` blanco plano. Debe usar la clase `.card-premium` definida en `globals.css` para mantener la profundidad y coherencia.
4.  **Bible API:** Conexión con `https://bible-api.deno.dev/api/read/rv1960/`. Siempre manejar fallbacks para que la app nunca se quede sin "Palabra de Dios".

## 📍 Estado Actual (15 de Marzo 2026)
*   **Completado:** Persistencia total de perfil/ajustes, sistema de tipografía dinámica, rediseño premium Apple Style en todas las vistas, bug de versículos solucionado.
*   **En curso:** Verificación de iconos PWA y refinamiento de UI en pantallas pequeñas.

## 🚀 Flujo de Trabajo (Sprinter Corazón)
*   Trabajamos por **Sprints** cortos y enfocados.
*   Cada cambio visual debe ser validado contra el estándar "Apple Premium".
*   La documentación en `docs/SPRINT_ACTUAL.md` debe actualizarse al final de cada sesión.
