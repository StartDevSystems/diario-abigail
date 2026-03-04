# 🏗 Documentación de Arquitectura (v1.1.0)

## 1. Estructura de Proyecto Actualizada
Se ha realizado una refactorización crítica para la estabilidad en la nube:
- `src/app`: Rutas y Layout base de Next.js.
- `src/views`: Contiene la lógica de las secciones (antes `pages`) para evitar errores de pre-renderizado en el build de producción.
- `src/lib`: Punto de conexión con Firebase.

## 2. Flujo de Datos en Tiempo Real
1. El usuario interactúa con la UI.
2. `JournalContext` recibe la acción y actualiza el estado local.
3. Simultáneamente, se dispara una petición asíncrona a Firestore para persistir el dato.
4. El sistema `Keep-Alive` vía GitHub Actions mantiene el túnel de Render abierto cada 10 minutos.
