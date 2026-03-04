# 🎨 Especificaciones de Diseño: Diario de Abigail

Este documento define la identidad visual y los lineamientos estéticos del proyecto.

## 🎨 Paleta de Colores (Design Tokens)

La aplicación utiliza una paleta de colores pastel suaves con acentos vibrantes para los títulos.

| Color | Hex Code | Uso |
| :--- | :--- | :--- |
| **Cream Pastel** | `#fffcf2` | Fondo principal de la aplicación. |
| **Rose Pastel** | `#fdf2f2` | Fondos de tarjetas y elementos secundarios. |
| **Lavender Pastel**| `#f5f3ff` | Acentos sutiles y estados de hover. |
| **Accent Pink** | `#fbcfe8` | Iconos, checkboxes y estados activos. |
| **Deep Rose** | `#be185d` | Títulos principales y llamadas a la acción. |
| **Soft Text** | `#374151` | Texto principal para lectura (Alto contraste). |

## 🖋 Tipografía

- **Títulos:** `Playfair Display` (Serif elegante, cursiva).
- **Cuerpo:** `Inter` (Sans-serif moderna y limpia).
- **Detalles:** Mayúsculas con espaciado (`tracking-widest`).

## ✨ Elementos Visuales y Animación

1.  **Bordes:** `rounded-[2.5rem]` (Esquinas extremadamente suaves y circulares).
2.  **Sombras:** `journal-shadow` (Sombras muy difusas y ligeras: `rgba(0,0,0,0.05)`).
3.  **Glassmorphism:** Uso de `backdrop-blur-xl` en el sidebar para transparencia inteligente.
4.  **GSAP Timelines:** Las entradas de componentes deben ser fluidas y suaves (`ease: "power3.out"`).
5.  **Decoración Floral:** Elementos SVG minimalistas en las esquinas con baja opacidad (10-20%).

## 📱 Mobile vs Desktop

- **Desktop:** Navegación lateral izquierda fija (Sidebar).
- **Mobile:** Barra de navegación inferior flotante con iconos redondos (`Lucide`).

---
**Objetivo de Diseño:** Generar una atmósfera de tranquilidad, introspección y belleza minimalista.
