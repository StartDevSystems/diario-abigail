# 🔧 Documentación de Mantenimiento

## 1. Mantenimiento Preventivo
- **Actualización de Dependencias:** Ejecutar `npm update` trimestralmente.
- **Auditoría de Seguridad:** Ejecutar `npm audit` mensualmente.

## 2. Depuración de Almacenamiento
En caso de lentitud, se recomienda limpiar el `localStorage` mediante la consola: `localStorage.removeItem('diario_abigail_data')`.

## 3. Monitoreo de Errores
Uso de la consola del navegador para capturar errores de renderizado de Three.js o fallos en el contexto de React.
