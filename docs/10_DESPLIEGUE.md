# 🚀 Documentación de Despliegue

## 1. Entorno de Producción
Se recomienda el despliegue en la plataforma **Vercel** debido a su optimización nativa para Next.js.

## 2. Proceso de Build
1. Ejecutar `npm install` para resolver dependencias.
2. Ejecutar `npm run build`.
3. El comando genera una carpeta optimizada `.next`.

## 3. Variables de Entorno
Actualmente, no se requieren variables secretas (`.env`) ya que todo el procesamiento es client-side. En la v2.0 se requerirán las API Keys de Firebase.

## 4. Despliegue Continuo (CI/CD)
Integración mediante GitHub Actions para despliegue automático al hacer push a la rama `main`.
