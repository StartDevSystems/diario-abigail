# 💻 Documentación de Código (Lineamientos)

## 1. Estándares de Codificación
- **Clean Code:** Funciones pequeñas y con responsabilidad única.
- **Componentes:** Basados en funciones (Functional Components).
- **Hooks:** Uso intensivo de `useState`, `useEffect` y `useRef` para interacciones con Three.js.

## 2. Estructura de Carpetas
- `src/app`: Esqueleto Next.js.
- `src/components`: UI modular.
- `src/pages`: Pantallas lógicas.
- `src/types`: Contratos de TypeScript.

## 3. Documentación Inline (JSDoc)
Los métodos críticos en el `JournalContext` contienen comentarios JSDoc que describen parámetros y retornos para facilitar el uso en el IDE (VS Code).

## 4. Código Externo e Integraciones
- **Three.js:** Encapsulado en el componente `Scene3D`.
- **GSAP:** Inicializado en el Layout para orquestar la entrada de la aplicación.
