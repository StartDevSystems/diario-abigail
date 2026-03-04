# 🏗 Arquitectura del Sistema: Diario de Abigail

Este documento describe la arquitectura técnica, el flujo de datos y el stack tecnológico utilizado en la **versión 1.0.0**.

## 🚀 Stack Tecnológico

La aplicación se ha desarrollado con un enfoque moderno de rendimiento y estética:

- **Frontend Framework:** Next.js 14+ con App Router.
- **Styling:** Tailwind CSS v4 (Configuración basada en `@theme`).
- **State Management:** React Context API (`JournalContext.tsx`).
- **Persistencia:** LocalStorage API (Sincronización automática con estado).
- **Animaciones:** 
  - **GSAP:** Orquestación de entrada y micro-interacciones.
  - **Framer Motion:** Transiciones de estado y renderizado condicional.
- **Gráficos 3D:** Three.js (Renderizado de partículas interactivas en segundo plano).

## 🧩 Estructura de Componentes

La aplicación sigue una arquitectura de capas limpia:

1.  **Capa de Presentación (`src/app/`, `src/pages/`):** Define las vistas principales y la estructura de enrutamiento.
2.  **Capa de Componentes (`src/components/`):** Bloques visuales atómicos y decorativos (`Scene3D`, `Layout`).
3.  **Capa de Lógica (`src/context/`):** El `JournalContext` centraliza el estado global de la aplicación.
4.  **Capa de Datos (`src/types/`):** Define los contratos de TypeScript para garantizar la integridad de los datos.

## 🔄 Flujo de Datos

1.  **Carga:** Al montar la aplicación (`useEffect`), se lee el `localStorage`.
2.  **Sincronización:** El estado global se actualiza y se propaga a través de la Context API.
3.  **Persistencia:** Cualquier cambio en el estado activa un efecto que actualiza automáticamente el `localStorage`.
4.  **Optimización:** El componente `Scene3D` se renderiza en una capa aislada (`z-index: 0`) para evitar interferencias con la interactividad de la UI.

---
**Nota Técnica:** El proyecto está preparado para una migración directa a Firebase mediante la sustitución del almacenamiento local por una integración con Firestore en `JournalContext.tsx`.
