# 🔐 Documentación de Seguridad

## 1. Privacidad por Diseño
- **Almacenamiento Local:** Los datos sensibles de Abigail (reflexiones, notas) no se envían a ningún servidor externo. Residen 100% en el hardware del usuario.
- **Sanitización:** Los inputs de texto son procesados por React para prevenir ataques de Cross-Site Scripting (XSS).

## 2. Integridad del Sistema
- **CSP (Content Security Policy):** Configuración básica para permitir solo scripts de fuentes confiables (Google Fonts, Vercel).

## 3. Futuras Consideraciones
- Implementación de reglas de seguridad de Firestore para evitar accesos no autorizados en la base de datos en la nube.
