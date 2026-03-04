# 🔌 Documentación de API e Interfaz de Datos

## 1. Interfaz de Firebase
Aunque no existe una API REST propia, el sistema consume los servicios de Firebase mediante métodos asíncronos en el `JournalContext`.

## 2. Operaciones de Escritura (SetDoc)
- **Persistencia de Estado:** Se realiza una escritura atómica en `users/{userId}`.
- **Merge Strategy:** Se utiliza `{ merge: true }` para asegurar que el campo `role` no se sobrescriba accidentalmente desde el cliente.

## 3. Consultas de Administrador (getDocs)
- **Método `getAllUsersData()`:** Realiza un barrido de la colección `users`. Solo retorna resultados si el token de autenticación del solicitante tiene los permisos adecuados en el servidor.

## 4. Integraciones de Terceros
- **Bible API:** `https://bible-api.com/` se utiliza para obtener versículos dinámicos basados en la referencia bíblica asociada a cada sentimiento.
