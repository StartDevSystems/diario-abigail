# 🔐 Documentación de Seguridad (Cloud Security)

## 1. Prevención de Bots y Ataques
- **DDoS Mitigation:** Gestionado por el WAF de Render.com.
- **Brute Force Protection:** Firebase Auth limita los intentos de login por IP automáticamente.
- **Keep-Alive Robot:** El sistema de ping automático está limitado a un intervalo de 10 minutos para no saturar las cuotas de red.

## 2. Integridad de Datos
- **Server-Side Validation:** Las reglas de Firestore impiden que un usuario modifique el rol de otro o acceda a documentos ajenos.
- **Encryption in Transit:** Uso obligatorio de HTTPS/TLS en Render.
