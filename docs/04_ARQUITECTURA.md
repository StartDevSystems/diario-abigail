# 🏗 Documentación de Arquitectura

## 1. Patrón de Arquitectura
El proyecto sigue una arquitectura de **App Router** de Next.js, basada en componentes del servidor y del cliente (Server/Client Components).

## 2. Diagrama de Capas
1. **Capa de Aplicación (`/src/app`):** Define el esqueleto global y el ruteo.
2. **Capa de Vistas (`/src/pages`):** Componentes de alto nivel que representan las pantallas.
3. **Capa de Negocio (`/src/context`):** Lógica de manipulación de datos y persistencia.
4. **Capa de Presentación (`/src/components`):** UI atómica y decoraciones.
5. **Capa de Dominio (`/src/types`):** Definición de modelos de datos.

## 3. Decisiones de Diseño Arquitectónico (ADR)
- **ADR-001:** Uso de Client-Side Rendering (CSR) para la interactividad del diario, dado que depende del estado del navegador (LocalStorage).
- **ADR-002:** Implementación de Three.js en una capa independiente para no bloquear el hilo principal de la UI.
- **ADR-003:** Estructura modular de páginas para facilitar la futura migración a rutas reales de Next.js (`/hoy`, `/semana`).
