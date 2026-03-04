# 🔌 Documentación de API e Interfaz de Contexto

## 1. Definición de la "API" de Contexto
En la v1.0.0, la aplicación no consume endpoints REST externos, sino que utiliza una interfaz de Contexto (`JournalContext`) que expone métodos de manipulación de datos a toda la aplicación.

## 2. Métodos Expuestos
### `updateToday(data: Partial<DayData>)`
- **Uso:** Actualiza los campos de la sección 'Hoy'.
- **Payload:** Objeto con cambios parciales.

### `toggleHabitDay(habitId: string, dayIndex: number)`
- **Uso:** Alterna el estado (true/false) de un día específico de un hábito.
- **Parámetros:** ID único del hábito e índice del día (0-6).

### `addHabit(name: string)`
- **Uso:** Crea una nueva instancia de hábito en el estado global.

## 3. Manejo de Errores
- Validación interna para evitar que se guarden strings vacíos en prioridades críticas.
- Try/Catch implementado en la carga inicial de LocalStorage para prevenir fallos si el JSON está corrupto.
