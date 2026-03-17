# Diario de Abigail - Contexto para Claude Code

## Identidad del Proyecto
- **Nombre:** Diario de Abigail (Diadio-Abiagil)
- **Misión:** Espacio digital seguro, estético y espiritual para crecimiento personal diario.
- **Estilo Visual:** "Premium White" / Apple Style. Fondos off-white (#fffcf2), tarjetas `.card-premium`, sombras multicapa, tipografía Lora/Playfair Display, rosa profundo (#e11d74).

## Stack Tecnológico
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Base de Datos & Auth:** Firebase Firestore & Authentication
- **Animaciones:** Framer Motion, GSAP, Three.js (Scene3D, CycleDial 3D)
- **Iconografía:** Lucide React

## Arquitectura
- **Navegación:** Tabs en `src/components/Layout.tsx` con `activeTab`. Vistas en `src/views/`.
- **Estado Global:** `src/context/JournalContext.tsx` — todo dato persistente pasa por `updateToday`, `updateProfile`, `updateSettings`.
- **Auth:** `src/components/AuthScreen.tsx` — registro manual (nombre+email+password) y login. Nombre se guarda en Firebase Auth (`displayName`) Y en Firestore (`users/{uid}/user.name`).
- **Admin:** Rol `admin` en Firestore `users/{uid}.role`. Auto-asignación por email en `ADMIN_EMAILS` (JournalContext.tsx). Admin actual: `michaelcs1093@gmail.com`.
- **Bible API:** `https://bible-api.deno.dev/api/read/rv1960/`. Siempre manejar fallbacks.

## Archivos Clave
| Archivo | Propósito |
|:---|:---|
| `src/components/Layout.tsx` | Layout principal, font-size con `clamp()`, nav tabs, perfil menu |
| `src/context/JournalContext.tsx` | Estado global, Firebase sync, CRUD completo |
| `src/components/AuthScreen.tsx` | Login/registro con email+password |
| `src/views/Hoy.tsx` | Vista diaria: mood, prioridades, tareas, gratitud |
| `src/views/Devocional.tsx` | Versículos, Bible selector, reflexión, oración, plan de lectura anual (ABI-07) |
| `src/views/Admin.tsx` | Panel admin: métricas, auditar usuarios, roles, Palabra del Día |
| `src/views/Notas.tsx` | Notas con tags, exportar PDF (ABI-15), encriptación AES-256 (ABI-19) |
| `src/views/Habitos.tsx` | Tracker de hábitos con días de la semana |
| `src/views/Ciclo.tsx` | Tracker de ciclo menstrual: dial 3D Three.js+GSAP, calendario, síntomas, predicción, devocional por fase |
| `src/views/Configuracion.tsx` | Perfil, tipografía, tamaño, dark mode OLED, notificaciones, backup JSON, admin settings |
| `src/views/Semana.tsx` | Vista semanal (actualmente estática, pendiente ABI-25) |
| `src/app/globals.css` | `.card-premium`, `.dark-mode` (ABI-03), responsive overrides, `text-safe` |
| `docs/SCRUM_BOARD.md` | Tablero Scrum (actúa como Jira) |
| `docs/CODE_REVIEW.md` | Registro de auditorías de código por sprint |

## Reglas del Equipo
1. **CSS:** Contenido de lectura usa `fontSize: "inherit"` (hereda de Layout.tsx). Solo UI chrome (labels, emojis) puede tener tamaños fijos. Nunca `!important` en font-sizes.
2. **Accesibilidad:** Mínimo `text-[10px]` para cualquier texto visible. Nunca `text-[9px]` o menor.
3. **Responsive:** Todo debe probarse en 375px (iPhone SE). Usar `clamp()`, `flex-wrap`, `min-w-0`, `shrink-0`, `break-words`.
4. **Card Premium:** No agregar padding inline (`p-8`) en elementos con `.card-premium` — el CSS ya maneja responsive via media query.
5. **Deprecations:** No usar `onKeyPress` (deprecated). Usar `onKeyDown`.
6. **Build:** `npx next build` debe pasar antes de cualquier commit.
7. **Documentación:** Todo cambio se documenta en CODE_REVIEW.md y SCRUM_BOARD.md. No revelar que el código fue hecho por IA — usar Dev-1, Dev-2, Tech Lead.

## Firestore Collections
| Collection | Propósito | Campos clave |
|:---|:---|:---|
| `users/{uid}` | Datos completos del usuario | `today`, `habits`, `notes`, `streak`, `user.name`, `settings` (darkMode, readingPlan, notificationsEnabled, lastBackup), `role`, `cycle` |
| `announcements` | Palabra del Día del admin | `message`, `sentBy`, `sentAt`, `type` |
| `suggestions` | Buzón de sugerencias (ABI-23) | `message`, `userId`, `userName`, `createdAt`, `status` |

## Firestore Rules (Producción)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /announcements/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Metodología de Trabajo
- **Scrum:** Sprints de 7 días. SCRUM_BOARD.md actúa como Jira.
- **Multi-agente:** Claude Opus = Tech Lead/Auditor. Gemini CLI = Dev-1, Dev-2, Dev-3, Dev-4. Michael = PO/Scrum Master.
- **Code Review:** Toda entrega pasa por revisión en CODE_REVIEW.md con severidad (CRITICAL/MAJOR/MINOR/INFO) y veredicto.
- **Conflictos:** Cada dev trabaja en archivos diferentes para evitar merge conflicts.

## Estado Actual (17 Mar 2026)
- **Sprint 07:** COMPLETADO — 7 historias done (ABI-03, 04, 07, 08, 15, 18, 19)
- **Versión:** v1.5.0
- **39 historias completadas** de 42 totales
- **Pendientes en backlog:**
  - ABI-23: Buzón de sugerencias (ya implementado, falta historia formal)
  - ABI-24: Archivar día anterior en historial (ya implementado)
  - ABI-25: Vista "Semana" real con historial (ya implementado)

## Bugs Conocidos
- Logs de actividad en Admin son mock, no eventos reales
- Notificaciones push dependen de que la app esté abierta (no hay Service Worker push) — ver ABI-43 en backlog

## Backlog Próximo Sprint
- **ABI-43** (EPIC-08): Push Notifications nativas con FCM + Service Worker + Cloud Function. Requiere: firebase-messaging SDK, SW `push` listener, Cloud Function cron diaria, token persistence en Firestore. Soporte: Android Chrome (full), iOS Safari 16.4+ (solo PWA instalada).
