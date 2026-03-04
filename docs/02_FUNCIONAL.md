# ⚙️ Documentación Funcional (v1.1.0)

## 1. Lógica de Negocio de Racha (Estilo Duolingo)
El sistema valida la constancia del usuario siguiendo estas reglas:
- **Éxito:** Si el último registro fue ayer y el usuario marca hoy, la racha sube +1.
- **Fallo:** Si pasan más de 24h sin marcar el ánimo, la racha vuelve a 0.
- **Disparador:** La racha solo aumenta con el primer registro de "Mood" del día.

## 2. Módulo de Administración Supremo
Interfaz exclusiva (`/admin`) que permite:
- Visualizar la base de datos de usuarios registrados.
- Consultar el ID único, el último ánimo y los agradecimientos generales.
- Acceso restringido mediante roles en la base de datos.

## 3. Optimización de Vistas (PC/Mobile)
- **PC:** Tabla de hábitos con resaltado de columna "Hoy" y modo edición integrado en celda.
- **Mobile:** Sistema de tarjetas individuales con botones de gran formato para pulgares.
