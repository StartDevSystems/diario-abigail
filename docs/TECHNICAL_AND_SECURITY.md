# 🛠 Documentación Técnica, Datos y Seguridad (v1.0.0)

Este documento detalla el motor interno, la gestión de datos y las medidas de seguridad actuales.

## 1. Documentación de Base de Datos (LocalStorage)
En esta versión, la base de datos es un **Key-Value Store** en el navegador del usuario.

### Esquema de Datos (`diario_abigail_data`):
```json
{
  "today": {
    "date": "ISO-8601 String",
    "mood": "Emoji String",
    "priorities": ["String", "String", "String"],
    "tasks": [
      { "id": "uuid", "text": "String", "completed": "Boolean" }
    ],
    "gratitude": ["String", "String", "String"]
  },
  "habits": [
    { "id": "uuid", "name": "String", "completedDays": [Boolean, Boolean, ...] }
  ]
}
```

## 2. Documentación de Seguridad
- **Privacidad del Dato:** Dado que el almacenamiento es local (LocalStorage), los datos **nunca salen del dispositivo** del usuario.
- **Validación de Datos:** Uso de TypeScript para prevenir la inyección de tipos incorrectos en el estado.
- **Futura Implementación:** Al integrar Firebase, se implementará **Firebase Authentication** y **Firestore Security Rules** para aislamiento de datos por usuario.

## 3. Documentación de API e Integración
- **API Interna:** La aplicación usa un patrón **Context API (JournalContext)** que actúa como una API interna para el resto de componentes.
- **Hooks de Integración:** `useJournal()` es el punto de integración principal para acceder a la lógica de negocio.

## 4. Documentación de Configuración
- **Configuración de Estilos:** `src/app/globals.css` controla los tokens de diseño (colores, fuentes).
- **Configuración de Build:** `next.config.mjs` optimiza el renderizado y los assets estáticos.

---
**Firmado:** Desarrollador Principal - v1.0.0 Stable
