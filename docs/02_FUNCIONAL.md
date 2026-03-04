# ⚙️ Documentación Funcional

## 1. Descripción del Sistema
El "Diario de Abigail" es un orquestador de bienestar personal. Funciona de manera atómica, dividiendo la experiencia en 5 módulos principales accesibles mediante un menú persistente.

## 2. Descripción de Módulos
### 2.1 Módulo Hoy
- **Lógica:** Captura datos del día actual (Date ISO).
- **Inputs:** Selectores de botones para Mood, text-inputs para prioridades.
- **Feedback:** Los agradecimientos se guardan en un array de 3 posiciones.

### 2.2 Módulo Semana
- **Lógica:** Gestión de metas de mediano plazo.
- **Visualización:** Tarjeta expandida con enfoque en tipografía serif.

### 2.3 Módulo Hábitos
- **Lógica:** Array de objetos `{name, status: [7]}`.
- **Cálculo:** Función reductora para contar los `true` en el array de completitud y mostrar el ratio x/7.

### 2.4 Módulo Devocional
- **Lógica:** Visualización de versículo destacado y dos áreas de reflexión persistente.

### 2.5 Módulo Notas
- **Lógica:** Lista dinámica de strings con opción de borrado (TrashIcon).

## 3. Flujos de Usuario (User Journeys)
- **Inicio del día:** El usuario abre la app, marca su ánimo y define 3 prioridades.
- **Cierre del día:** El usuario marca tareas completadas y escribe sus agradecimientos.
- **Reflexión:** El usuario usa la pestaña Devocional para su tiempo de oración/estudio.
