# 🗄 Documentación de Base de Datos (Cloud Firestore)

## 1. Modelo NoSQL
El diario utiliza **Cloud Firestore** para el almacenamiento de datos en tiempo real. Los datos se organizan en documentos dentro de colecciones.

## 2. Colecciones y Esquemas
### Colección: `users`
Cada documento utiliza el **UID de Firebase Auth** como identificador único para garantizar el aislamiento.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `role` | `string` | 'user' o 'admin'. Determina permisos. |
| `streak` | `number` | Contador de días consecutivos. |
| `today` | `map` | Objeto con el estado del día actual. |
| `habits` | `array` | Lista de objetos de hábitos. |
| `notes` | `array` | Lista de objetos de notas con IDs y fechas. |

## 3. Lógica de Multi-inquilino (Multi-tenancy)
Cada vez que un usuario se autentica, el sistema carga el documento correspondiente a su UID. Si no existe, se inicializa un perfil base automáticamente.

## 4. Reglas de Acceso (Firestore Rules)
Se ha implementado el siguiente candado lógico:
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
}
```
Esto permite que cada usuario sea dueño de su dato, pero habilita al Administrador Supremo a visualizar la información para soporte técnico o moderación.
