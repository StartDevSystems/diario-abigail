# 🚀 Documentación de Despliegue (Render.com)

## 1. Pipeline de Integración Continua (CI/CD)
- **Repo:** `StartDevSystems/diario-abigail`
- **Rama:** `main`
- **Comando de Build:** `npm install --force; npm run build`
- **Comando de Start:** `npm run start`

## 2. Optimización de Historial
Se han eliminado del seguimiento de Git las carpetas `node_modules` y `.next` para reducir el peso del repositorio de 137MB a <1MB, permitiendo despliegues ágiles.
