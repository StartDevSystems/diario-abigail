# 🔧 Documentación de Mantenimiento

## 1. Sistema Keep-Alive (Robot)
Ubicación: `.github/workflows/keep-alive.yml`.
Este robot realiza un `curl` a la URL de producción cada 10 minutos para evitar que la instancia gratuita de Render entre en modo hibernación.

## 2. Depuración de Usuarios
En caso de que un usuario no vea su racha correctamente, verificar el campo `today.date` en el documento del usuario dentro de la consola de Firebase.

## 3. Actualización de Logo e Iconos
Los archivos fuente se encuentran en:
- `src/app/icon.png` (Pestaña/Móvil)
- `public/logo-full.png` (Interfaz)
