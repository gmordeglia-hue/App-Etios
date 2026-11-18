# App Etios · estado del proyecto

Última actualización: 17/11/2026

- App de una sola página (`index.html`), se instala en el celular. Datos solo en el aparato.
- Pestañas: Inicio, Cargar, Historial, Más. Consumo entre cargas de tanque lleno.

## Novedad: lector del tablero (17/11/2026)
- En Cargar → "Computadora de abordo" → "Sacar foto al tablero". Lee odómetro (llena "Km del odómetro"), pantalla (Inicio/Reinicio), consumo (km/L), velocidad promedio y tiempo.
- Usa Tesseract.js (se baja de internet la primera vez y queda guardado). La foto se lee en el celular y se descarta; no se sube a ningún lado.
- Los datos se pueden corregir a mano antes de guardar. Se guardan en la carga como `comp`.
- Inicio muestra "Computadora vs. real" cuando hay lecturas de "Reinicio".
- Probado con la foto modelo: odómetro, velocidad, tiempo y pantalla bien; el consumo leyó 2,9 en vez de 2,4 (foto chica y borrosa). Falta probar con fotos reales del celular.

## Unidad (17/11/2026)
- Toda la app muestra el consumo en km/L, igual que la computadora del Etios (ya no hay L/100 km a la vista).

## Pendiente
- Probar con fotos reales (de día, de noche, con reflejos) y ajustar.
- Publicar la versión nueva en el celular (hoy solo está en esta carpeta; nada subido a GitHub).
