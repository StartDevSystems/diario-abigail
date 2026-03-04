# 📋 Documentación de Requisitos (v1.1.0)

## 1. Requisitos Funcionales (Nuevos)
- **RF-11 (Gestión de Identidad):** El sistema debe permitir el registro único por usuario con aislamiento total de datos.
- **RF-12 (Racha Disciplinada):** Implementar un contador de racha (streak) que se resetee si el usuario no registra su ánimo en un ciclo de 24 horas.
- **RF-13 (Panel Maestro):** Capacidad del administrador para supervisar el ecosistema de usuarios sin comprometer el contenido privado.
- **RF-14 (Keep-Alive):** El sistema debe auto-notificarse cada 10 minutos para evitar la suspensión del servicio en entornos gratuitos.

## 2. Requisitos No Funcionales (v1.1.0)
- **RNF-09 (Persistencia Cloud):** Garantizar que los cambios se guarden en Firestore en menos de 500ms tras la acción del usuario.
- **RNF-10 (Seguridad de Variables):** Las llaves de API deben estar ocultas en el servidor y nunca en el código fuente de GitHub.
