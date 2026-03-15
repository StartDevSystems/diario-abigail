# 📋 Tablero Scrum: Diario de Abigail

## 🚀 SPRINT ACTUAL: Sprint 03 - PWA & Optimización de Lectura
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

### EPIC-06: Feedback & Comunidad
- [ ] ABI-23: Buzón de sugerencias (usuario envía, admin visualiza).

---

## 📈 MÉTRICAS DEL PROYECTO
*   **Historias Completadas:** 15 (ABI-01, 02, 05, 06, 09, 10, 11, 12, 13, 14, 16, 17, 20, 21, 22)
*   **En Progreso:** 0
*   **Pendientes:** 6
*   **Sprint Health:** 🏆 SPRINT COMPLETADO — 18/15 SP (120%) en día 1 de 7

---

## 📝 NOTAS DEL SPRINT
- **ABI-11**: Dev-1 (CR-001 + CR-003) + Tech Lead (CR-002). Aprobado.
- **ABI-13**: Dev-2 (CR-005). Panel admin con métricas, logs mock y estado de red. Aprobado 8/10.
- **ABI-14**: Dev-3 (CR-004). Botones copiar + WhatsApp en Devocional. Aprobado 9/10.
- **ABI-16**: Dev-4 (CR-006). Tags en notas con filtro, selector y badge. Aprobado 9/10. Stretch goal cumplido.
- **ABI-20**: Tech Lead. Modal "Auditar Diario" read-only con secciones completas. Build exitoso.
- **ABI-21**: Dev-2 (CR-007). Toggle de roles con badge visual. Corregido bug de auto-degradación por Tech Lead. Aprobado 7/10.
- **ABI-22**: Dev-3 (CR-008). Textarea + envío a Firestore `announcements` con feedback visual. Aprobado 9/10.
- **HOTFIX**: Tech Lead (CR-009). UIDs de Firebase reemplazados por nombres de usuario en Admin, modal y Configuración. Reportado por PO.
- **HOTFIX**: Tech Lead (CR-010). Header Devocional ("Jesús") roto en móvil. Stack vertical + font reducido para <540px. Reportado por PO.

## 📎 DOCUMENTACIÓN VINCULADA
| Documento | Propósito |
|:---|:---|
| [CODE_REVIEW.md](CODE_REVIEW.md) | Registro de auditorías de código y hallazgos de QA por sprint |
| [09_PRUEBAS.md](09_PRUEBAS.md) | Casos de prueba y estrategia de testing |
