# 🛠 Documentación Técnica

## 1. Especificaciones de Implementación
- **Lenguaje:** TypeScript 5.x (Tipado estricto).
- **Runtime:** Node.js v20+ para entorno de compilación.
- **Framework UI:** React 18+ (Integrado en Next.js).
- **Bundler:** TurboPack (Entorno de desarrollo Next.js).

## 2. Componentes Críticos
- **Context Provider (`JournalContext`):** Maneja el estado global y los reducers de datos.
- **Layout Orquestador:** Controla el renderizado condicional de vistas basado en el estado `activeTab`.

## 3. Manejo de Estado (State Management)
Se ha optado por un patrón de **Levantamiento de Estado** centralizado en un Contexto para evitar el "prop drilling". 

## 4. Optimización de Assets
- **Fuentes:** Uso de `next/font/google` para evitar Layout Shift (CLS).
- **Iconos:** Importación directa de `lucide-react` para permitir Tree-shaking.
