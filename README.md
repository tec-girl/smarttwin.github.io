# SmartTwin

**Haz match con tu modo, no con una foto.**

SmartTwin es una plataforma web para conocer personas por **mente, intención y planes**: tests de IQ e inteligencia emocional, personas verificadas y actividades reales para conocer gente sin juegos raros.

> Proyecto piloto. Solo para mayores de 18 años.

## Qué incluye

- **Tests de IQ e inteligencia emocional** con batería puntuada (`tests-data.js`, `bateria.js`).
- **Bóveda cifrada** para guardar tus respuestas y datos sensibles en el navegador (`vault.js`).
- **Top 10 de afinidad** y **chat dentro de la app** según tus resultados.
- **Seis idiomas**: español, English, français, Deutsch, 中文 y português.
- Página de **privacidad** (`privacidad.html`).

## Tecnología

Sitio estático en HTML, CSS y JavaScript puro, sin proceso de compilación:

| Archivo | Función |
| --- | --- |
| `index.html` | Página principal |
| `app.js` | Lógica principal de la aplicación |
| `script.js` | Interacciones y flujo de los tests |
| `bateria.js` | Batería de tests y puntuación |
| `tests-data.js` | Datos de los tests de IQ y EQ |
| `vault.js` | Bóveda cifrada en el navegador |
| `style.css` | Estilos |
| `privacidad.html` | Aviso de privacidad |

## Cómo ejecutarlo

No requiere instalación ni servidor: basta abrir `index.html` en un navegador moderno, o servir la carpeta con cualquier servidor estático, por ejemplo:

```bash
python3 -m http.server 8000
```

y abrir `http://localhost:8000`.

## Sitio en vivo

Publicado con GitHub Pages: https://tec-girl.github.io/smarttwin.github.io/
