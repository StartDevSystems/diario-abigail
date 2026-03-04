# 🏗 Documentación de Arquitectura (v1.1.0)

## 1. Arquitectura Cloud-Native
La aplicación ha evolucionado de una arquitectura local a una **Cloud-Native SPA** apoyada en servicios administrados.

## 2. Capa de Datos (Sincronización)
- **Patrón Observador:** `onAuthStateChanged` monitorea la sesión.
- **Persistencia Reactiva:** Se utiliza un `useEffect` en `JournalContext` que realiza un `setDoc` en Firestore cada vez que el estado local cambia, manteniendo la nube siempre actualizada.

## 3. Seguridad de Capas (RBAC)
- **Front-end:** El componente `Layout` renderiza condicionalmente el botón de Admin basado en el estado `isAdmin`.
- **Back-end:** Firebase Security Rules valida el UID y el rol antes de permitir cualquier operación de lectura/escritura en Firestore.

## 4. Diagrama de Carpetas Actualizado
- `src/app`: Enrutamiento y Layout base.
- `src/views`: Componentes de pantalla (vistas lógicas).
- `src/components`: UI atómica y 3D.
- `src/lib`: Configuración de servicios externos (Firebase).
