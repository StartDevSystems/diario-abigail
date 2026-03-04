# 📋 Documentación de Requisitos (v1.1.0)

## 1. Introducción
Este documento se actualiza para incluir la infraestructura de nube y la gestión de identidades.

## 2. Requisitos de Usuario (Nuevos)
- El sistema debe permitir el registro e inicio de sesión seguro.
- Los datos deben ser persistentes a través de diferentes dispositivos.
- Debe existir un rol de "Admin Supremo" para supervisión de la plataforma.

## 3. Requisitos Funcionales (v1.1.0)
- **RF-06 (Autenticación):** Registro mediante Email/Password con validación de Firebase.
- **RF-07 (Aislamiento de Datos):** Los datos de un usuario 'A' son invisibles para el usuario 'B' (Multi-tenancy).
- **RF-08 (Saludo Personalizado):** Uso del `displayName` del perfil de Firebase en la interfaz.
- **RF-09 (Panel Admin):** Interfaz restringida para visualizar la lista global de usuarios y estados generales.
- **RF-10 (Lógica de Hábitos):** Bloqueo de edición de días pasados/futuros para garantizar integridad.

## 4. Requisitos No Funcionales (v1.1.0)
- **RNF-06 (Seguridad de Nube):** Implementación de reglas de seguridad a nivel de base de datos (Firestore Rules).
- **RNF-07 (Disponibilidad):** Hosting en Render.com con despliegue continuo.
- **RNF-08 (Confidencialidad):** Uso de variables de entorno (.env) para proteger llaves de API.
