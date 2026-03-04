# ⚙️ Documentación Funcional (v1.1.0)

## 1. Flujo de Acceso (Auth Flow)
1. **Public/Auth View:** El usuario llega a una pantalla de acceso. Puede alternar entre "Entrar" y "Registrarse".
2. **Welcome Experience:** Tras el login, si es la primera vez en el día, se dispara el modal de sentimientos y versículo.
3. **Dashboard:** Acceso al diario con el nombre del usuario cargado dinámicamente.

## 2. Módulos Avanzados
### 2.1 Módulo Admin Supremo
- **Acceso:** Solo visible si el campo `role` en Firestore es `admin`.
- **Funcionalidad:** Vista de pájaro de la base de datos de usuarios (IDs, ánimos, agradecimientos).

### 2.2 Gestión de Hábitos (Lógica de Negocio)
- **Restricción Temporal:** El sistema calcula el `currentDayIdx` y deshabilita los botones que no coincidan con el día actual del usuario.
- **Modo Edición:** Permite mutar el objeto `Habit` (nombre/emoji) sin alterar el array de progreso `completedDays`.

### 2.3 Devocional Extendido
- Se han añadido campos para Peticiones, Agradecimientos de oración y Decretos, permitiendo una experiencia espiritual de 360 grados.
