# 🚀 Documentación de Despliegue (Render.com)

## 1. Configuración de la Instancia
- **Servicio:** Web Service.
- **Runtime:** Node.js.
- **Plan:** Free Tier.

## 2. Variables de Entorno (Environment Variables)
Es obligatorio configurar las siguientes llaves en el panel de Render para que la aplicación funcione:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ... (todas las listadas en `.env.local`).

## 3. Pipeline de Despliegue
1. **Trigger:** Cada vez que se hace un `git push origin main`.
2. **Build:** Render ejecuta `npm install --force; npm run build`.
3. **Start:** Si el build es exitoso, se ejecuta `npm run start`.

## 4. Troubleshooting de Despliegue
- **Error "Next: not found":** Asegurarse de que `dependencies` incluya `next`.
- **Error de Peer Dependencies:** El flag `--force` en el comando de instalación es crítico.
