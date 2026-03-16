# 📋 Tablero Scrum: Diario de Abigail

## 🚀 SPRINT ACTUAL: Sprint 05 - Temas Dinámicos & Perfil Premium
**Duración:** 16 Mar - 23 Mar 2026 | **Velocidad Estimada:** 19 Story Points

| ID | Historia de Usuario | Prioridad | Estado | Asignado | Story Points |
|:---|:---|:---|:---|:---|:---|
| ABI-26 | Como usuaria, quiero cambiar los colores de toda la app desde Ajustes para personalizar mi experiencia visual. | 🔥 CRÍTICA | ✅ DONE | Dev-1, Dev-2, Dev-3, Tech Lead | 8 |
| ABI-27 | Como usuaria, quiero ver mi perfil como un dashboard personal con estadísticas, foto y resumen emocional. | ⚡ ALTA | ✅ DONE | Agent, Tech Lead | 5 |
| ABI-28 | Como usuaria, quiero un botón Guardar flotante en Ajustes para guardar sin hacer scroll. | 🟡 MEDIA | ✅ DONE | Tech Lead | 1 |
| ABI-29 | Como desarrollador, quiero migrar los 169+ colores hardcodeados a variables CSS para soportar temas dinámicos. | ⚡ ALTA | ✅ DONE | Dev-1, Dev-2, Dev-3 | 5 |

**Sprint Velocity:** 19/19 SP completados (100%) | **Burndown:** Sprint completado

---

## 📜 SPRINTS ANTERIORES

### Sprint 03 - PWA & Optimización de Lectura
**Duración:** 15 Mar - 22 Mar 2026 | **Velocidad Estimada:** 15 Story Points

| ID | Historia de Usuario | Prioridad | Estado | Asignado | Story Points |
|:---|:---|:---|:---|:---|:---|
| ABI-10 | Como usuaria, quiero instalar el diario en mi pantalla de inicio (PWA) para acceder rápido sin usar el navegador. | 🔥 CRÍTICA | ✅ DONE | — | 5 |
| ABI-11 | Como usuaria, quiero que el texto en modo "Grande" se ajuste perfectamente en mi móvil para leer sin esfuerzo. | ⚡ ALTA | ✅ DONE | — | 3 |
| ABI-12 | Como usuaria, quiero ver mi nombre personalizado en la bienvenida para sentir que el diario es mío. | ⚡ ALTA | ✅ DONE | — | 1 |
| ABI-13 | Como administradora, quiero ver los logs del sistema con el nuevo diseño premium para monitorear la app con estilo. | 🟡 MEDIA | ✅ DONE | Dev-2 | 3 |
| ABI-14 | Como usuaria, quiero poder copiar mi versículo favorito del día para compartirlo por WhatsApp. | 🟢 BAJA | ✅ DONE | Dev-3 | 3 |
| ABI-16 | Como usuaria, quiero categorizar mis notas por etiquetas (Oración, Aprendizaje, Sueños). | 🟡 MEDIA | ✅ DONE | Dev-4 | 3 |

**Sprint Velocity:** 18/15 SP completados (120%) | **Burndown:** Día 1 de 7 — Sprint completado con stretch goal

---

## 📂 BACKLOG DE ÉPICAS

### EPIC-01: Identidad & Experiencia Premium (UI/UX)
- [x] ABI-01: Implementar sistema de sombras multicapa (Apple Style).
- [x] ABI-02: Selector de tipografía dinámica (Lora, Playfair, etc.).
- [ ] ABI-03: Modo oscuro "OLED" para lectura nocturna.
- [ ] ABI-04: Animaciones de transición tipo "página de libro".
- [x] ABI-26: Sistema de temas de color dinámico (8 paletas + color picker libre).
- [x] ABI-27: Perfil de usuario premium (dashboard personal con stats y foto).
- [x] ABI-28: Botón Guardar flotante (FAB) en Ajustes.
- [x] ABI-29: Refactor de 169+ colores hardcodeados a variables CSS de tema.

### EPIC-02: Conexión Espiritual (Devocional)
- [x] ABI-05: Integración robusta con Bible API (RVR1960).
- [x] ABI-06: Sistema de versículos por estado de ánimo (Feelings).
- [ ] ABI-07: Plan de lectura bíblica anual integrado.
- [ ] ABI-08: Notificaciones diarias con "La Palabra del Día".

### EPIC-03: Gestión de Vida (Hábitos & Notas)
- [x] ABI-09: Sistema de rachas (Streaks) de 24h.
- [ ] ABI-15: Exportación de notas a PDF/Texto.
- [x] ABI-16: Categorización de notas por etiquetas (Oración, Aprendizaje, Sueños).

### EPIC-04: Infraestructura & Seguridad
- [x] ABI-17: Persistencia de perfil en Firebase Firestore.
- [ ] ABI-18: Backup automático de datos del usuario.
- [ ] ABI-19: Encriptación de notas sensibles.

### EPIC-05: Panel de Administración
- [x] ABI-20: Auditar diario completo de cualquier usuario (vista read-only).
- [x] ABI-21: Gestión de roles (promover/degradar usuarios a admin).
- [x] ABI-22: Enviar "Palabra del Día" push a todos los usuarios.

### EPIC-06: Historial & Retroalimentación
- [ ] ABI-24: Archivar día anterior en historial antes de resetear datos.
- [ ] ABI-25: Vista "Semana" real que lea historial y muestre los últimos 7 días.
- [ ] ABI-23: Buzón de sugerencias (usuario envía, admin visualiza).

---

## 📈 MÉTRICAS DEL PROYECTO
*   **Versión:** v1.3.0
*   **Historias Completadas:** 19 (ABI-01, 02, 05, 06, 09, 10, 11, 12, 13, 14, 16, 17, 20, 21, 22, 26, 27, 28, 29)
*   **En Progreso:** 0
*   **Pendientes:** 8 (ABI-03, 04, 07, 08, 15, 18, 19, 23, 24, 25)
*   **Sprint Health:** 🏆 SPRINT 05 COMPLETADO — 19/19 SP (100%)

---

## 📝 NOTAS DEL SPRINT

### Sprint 05
- **ABI-26**: Dev-1, Dev-2, Dev-3 (refactor colores) + Tech Lead (integración picker + fixes). 8 paletas preset + color picker libre con react-colorful. `applyTheme()` genera 8 variantes HSL. Aprobado (CR-013).
- **ABI-27**: Agent (estructura) + Tech Lead (foto de perfil, fix edición nombre, integración Layout). Dashboard personal tipo ESPN con stats, foto de perfil y resumen emocional. Aprobado (CR-014).
- **ABI-28**: Tech Lead (CR-015). Botón Guardar flotante FAB en esquina inferior derecha. Aprobado.
- **ABI-29**: Dev-1, Dev-2, Dev-3 (CR-016). Migración de 169+ colores hardcodeados a variables CSS en Admin, Hoy, WelcomeScreen, page.tsx y globals.css. Aprobado.

### Sprint 03
- **ABI-11**: Dev-1 (CR-001 + CR-003) + Tech Lead (CR-002). Aprobado.
- **ABI-13**: Dev-2 (CR-005). Panel admin con métricas, logs mock y estado de red. Aprobado 8/10.
- **ABI-14**: Dev-3 (CR-004). Botones copiar + WhatsApp en Devocional. Aprobado 9/10.
- **ABI-16**: Dev-4 (CR-006). Tags en notas con filtro, selector y badge. Aprobado 9/10. Stretch goal cumplido.
- **ABI-20**: Tech Lead. Modal "Auditar Diario" read-only con secciones completas. Build exitoso.
- **ABI-21**: Dev-2 (CR-007). Toggle de roles con badge visual. Corregido bug de auto-degradación por Tech Lead. Aprobado 7/10.
- **ABI-22**: Dev-3 (CR-008). Textarea + envío a Firestore `announcements` con feedback visual. Aprobado 9/10.
- **HOTFIX**: Tech Lead (CR-009). UIDs de Firebase reemplazados por nombres de usuario en Admin, modal y Configuración. Reportado por PO.
- **HOTFIX**: Tech Lead (CR-010). Header Devocional ("Jesús") roto en móvil. Stack vertical + font reducido para <540px. Reportado por PO.
- **HOTFIX**: Tech Lead (CR-011). Nombre "Abigail" para todos los usuarios + mood selector roto en móvil. Reportado por PO.
- **HOTFIX**: Tech Lead (CR-012). Nombre de registro no se guardaba en Firestore (race condition) + texto "¿Cómo te sientes hoy?" cortado en móvil. Reportado por PO.

## 📎 DOCUMENTACIÓN VINCULADA
| Documento | Propósito |
|:---|:---|
| [CODE_REVIEW.md](CODE_REVIEW.md) | Registro de auditorías de código y hallazgos de QA por sprint |
| [09_PRUEBAS.md](09_PRUEBAS.md) | Casos de prueba y estrategia de testing |
