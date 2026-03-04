# 🗄 Documentación de Base de Datos (Persistencia Local)

## 1. Motor de Persistencia
Se utiliza la API nativa de **LocalStorage** de los navegadores modernos. 

## 2. Esquema de Datos (JSON)
Los datos se almacenan bajo la clave `diario_abigail_data` con la siguiente estructura:

```json
{
  "today": {
    "date": "string",
    "mood": "string",
    "priorities": ["string", "string", "string"],
    "tasks": [
      { "id": "string", "text": "string", "completed": "boolean" }
    ],
    "gratitude": ["string", "string", "string"]
  },
  "habits": [
    { "id": "string", "name": "string", "completedDays": [false, false, ...] }
  ]
}
```

## 3. Estrategia de Sincronización
- **Efecto de Escritura:** Cada vez que el estado de React cambia, se dispara un `useEffect` que serializa el estado y lo guarda en LocalStorage.
- **Efecto de Lectura:** Solo se ejecuta una vez al montar el componente raíz (`mounted: true`).

## 4. Limitaciones Actuales
- Límite de ~5MB impuesto por el navegador.
- Los datos no se sincronizan entre diferentes dispositivos/navegadores.
