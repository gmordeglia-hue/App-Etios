# Etios · Nafta (App-Etios)

PWA simple para registrar cargas de nafta del Etios y calcular consumo (L/100 km, km/L, $/km, $/L). Los datos quedan en el aparato (localStorage); no hay servidor. Idioma: español rioplatense.

## Estructura
- `index.html`: toda la app en un solo archivo (HTML + CSS + JS, ~29 KB). Se edita directo; no hay paso de armado ni pruebas automáticas.
- `sw.js`: service worker para uso offline. Caché `V = 'etios-v11'`.
- `manifest.webmanifest` e íconos (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`).

## Reglas
- Al cambiar `index.html` o cualquier archivo de `ARCHIVOS` en `sw.js`, subir `V` (por ejemplo `etios-v12`) para que los celulares tomen la versión nueva.
- El consumo se calcula entre cargas de "tanque lleno"; no cambiar esa lógica sin pedirlo.
- Repo **público**: no subir respaldos (`etios-nafta-*.json`, ya están en `.gitignore`) ni datos reales de cargas.
- Para probar: abrir `index.html` con `python -m http.server` y revisar en el navegador (Playwright está disponible).
- No publicar ni hacer push sin que el usuario lo pida.
