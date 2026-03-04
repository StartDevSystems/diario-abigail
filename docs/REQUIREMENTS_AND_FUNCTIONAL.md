# 📋 Documentación de Requisitos: Diario de Abigail

## 1. Requisitos Funcionales (RF)
- **RF-01: Gestión de Día:** El sistema debe permitir registrar el estado de ánimo, prioridades y tareas diarias.
- **RF-02: Seguimiento de Hábitos:** El sistema debe proveer una tabla semanal para marcar la completitud de hábitos.
- **RF-03: Sección Devocional:** Espacio para lectura de versículos y redacción de reflexiones personales.
- **RF-04: Persistencia Local:** Todos los datos deben guardarse en el navegador del usuario sin necesidad de login (v1.0).
- **RF-05: Navegación Responsive:** Interfaz adaptativa para móvil (bottom nav) y desktop (sidebar).

## 2. Requisitos No Funcionales (RNF)
- **RNF-01: Estética:** Diseño femenino, colores pastel y tipografía serif elegante.
- **RNF-02: Rendimiento:** Carga inicial inferior a 2 segundos.
- **RNF-03: Animaciones:** Transiciones fluidas de 300-500ms usando GSAP/Framer Motion.
- **RNF-04: Disponibilidad:** Funcionamiento offline basado en LocalStorage.
- **RNF-05: Escalabilidad:** Código desacoplado para futura integración con Firebase.

---
# ⚙️ Documentación Funcional

## Descripción de Módulos
1. **Módulo "Hoy":** Orquestador de la rutina diaria. Incluye lógica de filtrado por fecha actual.
2. **Módulo "Semana":** Gestión de metas de alto nivel.
3. **Módulo "Hábitos":** Lógica de persistencia de arrays booleanos por cada hábito registrado.
4. **Módulo "Devocional":** Renderizado de contenido estático (v1.0) con inputs de texto enriquecido para reflexión.
