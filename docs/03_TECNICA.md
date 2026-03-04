# 🛠 Documentación Técnica (v1.1.0)

## 1. Infraestructura de Backend
- **Firebase SDK v10.x:** Implementado para manejar la comunicación con los servicios de Google.
- **Firebase Auth:** Proveedor de identidad para el manejo de sesiones.
- **Cloud Firestore:** Base de Datos NoSQL basada en documentos.

## 2. Gestión de Entorno
- **Variables de Entorno:** Se utiliza un archivo `.env.local` (local) y el dashboard de Render (producción) para inyectar las credenciales mediante el prefijo `NEXT_PUBLIC_`.

## 3. Cambios en la Estructura de Archivos
- **Refactorización `views/`:** Se movieron los componentes de página de `src/pages` a `src/views` para evitar conflictos con el prerendering automático de Next.js en componentes que requieren Contexto de Cliente.

## 4. Scripts de Construcción
- **Comando Build:** `npm install --force; npm run build`. El flag `--force` es necesario para resolver conflictos de peer dependencies entre React 19 y Lucide React.
