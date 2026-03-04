# 🗄 Documentación de Base de Datos (Cloud Firestore)

## 1. Esquema de Aislamiento
Se utiliza el `userId` como llave primaria del documento en la colección `users`. Esto garantiza el cumplimiento de la privacidad de datos.

## 2. Reglas de Seguridad (Definitivas)
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }
  }
}
```

## 3. Manejo de Variables de Entorno
Para el despliegue en Render, se han configurado los secretos fuera del código fuente:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- (etc.)
