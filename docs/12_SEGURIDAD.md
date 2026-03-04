# 🔐 Documentación de Seguridad (Cloud Security)

## 1. Autenticación Robusta
Se utiliza **Firebase Authentication**, lo que delega a Google el manejo seguro de contraseñas, encriptación y sesiones.

## 2. Reglas de Seguridad del Lado del Servidor (Server-Side)
No confiamos en el cliente. Firestore bloquea cualquier acceso que no cumpla con:
- `request.auth != null` (Debe estar logueado).
- `request.auth.uid == userId` (Solo acceso a sus datos).
- `isAdmin()` (Excepción para el administrador).

## 3. Protección de Credenciales
Las llaves de Firebase se inyectan en tiempo de construcción (build-time) mediante variables de entorno, evitando que queden expuestas en el código fuente de GitHub.

## 4. Aislamiento de Red
Render proporciona certificados SSL (HTTPS) automáticos para encriptar el tráfico entre el navegador de Abigail y los servidores.
