// Etios · Nafta — programita para la planilla de Google (Google Apps Script).
// Se pega UNA vez en la planilla: Extensiones → Apps Script. No lleva datos tuyos.
// Lo único que hay que cambiar es la contraseña de la línea de abajo.

const CLAVE = 'CAMBIAR-POR-TU-CONTRASEÑA-LARGA';   // la misma que pegás en la app (Más → Planilla de Google)
const HOJA = 'Cargas';
const COLS = ['id','fh','litros','plata','km','tipo','lleno','est','lat','lon','comp_pant','comp_kml','comp_vel','comp_tiempo','estado','actualizado'];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let h = ss.getSheetByName(HOJA);
  if (!h) h = ss.insertSheet(HOJA);
  if (h.getLastRow() === 0) {
    h.appendRow(COLS);
    h.setFrozenRows(1);
    h.getRange('B:B').setNumberFormat('@');   // la fecha queda como texto, no la convierte Google
  }
  return h;
}

function salida_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Para probar en el navegador: abrir el enlace y debe decir que está andando.
function doGet() {
  return ContentService.createTextOutput('Etios: la planilla está andando.');
}

function fila_(c) {
  const k = c.comp || {};
  return [
    String(c.id), String(c.fh), Number(c.litros), Number(c.plata), Number(c.km),
    c.tipo || 'mixto', c.lleno ? 'sí' : 'no', c.est || '',
    c.lat != null ? Number(c.lat) : '', c.lon != null ? Number(c.lon) : '',
    k.pant || '', k.kml != null ? Number(k.kml) : '', k.vel != null ? Number(k.vel) : '', k.tiempo || '',
    'activa', new Date().toISOString()
  ];
}

function carga_(f) {
  const c = { id: String(f[0]), fh: String(f[1]), litros: Number(f[2]), plata: Number(f[3]), km: Number(f[4]),
              tipo: f[5] || 'mixto', lleno: f[6] === 'sí', est: String(f[7] || '') };
  if (f[8] !== '' && f[9] !== '') { c.lat = Number(f[8]); c.lon = Number(f[9]); }
  if (f[10] || f[11] !== '' || f[12] !== '' || f[13]) {
    c.comp = { pant: f[10] || 'reinicio' };
    if (f[11] !== '') c.comp.kml = Number(f[11]);
    if (f[12] !== '') c.comp.vel = Number(f[12]);
    if (f[13]) c.comp.tiempo = String(f[13]);
  }
  return c;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d || CLAVE === 'CAMBIAR-POR-TU-CONTRASEÑA-LARGA' || d.clave !== CLAVE) return salida_({ ok: false, error: 'clave' });
    const h = hoja_();
    const n = h.getLastRow();
    const datos = n > 1 ? h.getRange(2, 1, n - 1, COLS.length).getValues() : [];

    if (d.accion === 'leer') {
      return salida_({ ok: true, cargas: datos.filter(f => f[14] !== 'borrada').map(carga_) });
    }

    if (d.accion === 'lote') {
      const fila = {};                                  // id → número de fila en la hoja
      datos.forEach((f, i) => { fila[String(f[0])] = i + 2; });
      (d.ops || []).forEach(op => {
        if (op.t === 'u' && op.c && op.c.id) {          // guardar o corregir una carga
          const f = fila_(op.c);
          if (fila[f[0]]) h.getRange(fila[f[0]], 1, 1, COLS.length).setValues([f]);
          else { h.appendRow(f); fila[f[0]] = h.getLastRow(); }
        } else if (op.t === 'd' && op.id && fila[String(op.id)]) {   // borrar = marcar, no se pierde
          h.getRange(fila[String(op.id)], 15, 1, 2).setValues([['borrada', new Date().toISOString()]]);
        }
      });
      return salida_({ ok: true });
    }

    return salida_({ ok: false, error: 'accion' });
  } catch (err) {
    return salida_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
