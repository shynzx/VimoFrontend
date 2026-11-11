const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadClient } = require('./load-client.cjs');
const record = { id: 'tomas-rivas', numero: 1, nombre: 'Tomás Rivas', rol: 'Soldado', resumen: 'Mensaje a su familia', funcionNarrativa: 'Humanizar', ubicacion: 'Vestíbulo', texto: 'Hola, campeón.', relacionadoConIssac: false };
const fixtures = {
  registros: record,
  manual: { id: 'controles', titulo: 'Controles', categoria: 'Supervivencia', contenido: '## Mover\nW A S D', fuente: 'GDD', actualizadoEn: '2026-11-10' },
  vistas: { id: 'hud', titulo: 'HUD', categoria: 'Combate', descripcion: 'Vida y batería', nodoFigma: '2009:230', capituloIds: ['controles'] },
  creditos: { id: 'equipo', rol: 'Equipo', nombre: 'Por definir' },
};
test('valida los cuatro nuevos catálogos, los persiste y los recupera sin red', async () => {
  const storage = new Map();
  const first = loadClient({ storage, fetch: async (url) => ({ ok: true, json: async () => ({ exito: true, datos: [fixtures[new URL(url).pathname.split('/').pop()]], meta: { demo: false } }) }) });
  for (const method of ['obtenerManual', 'obtenerRegistros', 'obtenerVistas', 'obtenerCreditos']) {
    assert.equal((await first.api[method]()).origen, 'network');
  }
  const second = loadClient({ storage });
  second.clock.now += 300001;
  for (const method of ['obtenerManual', 'obtenerRegistros', 'obtenerVistas', 'obtenerCreditos']) {
    const result = await second.api[method]();
    assert.equal(result.origen, 'offline');
    assert.equal(result.datos.length, 1);
  }
  assert.equal((await second.api.obtenerRegistros()).datos[0].texto, record.texto);
});
test('rechaza registros corruptos y no sobrescribe el último archivo válido', async () => {
  let bad = false;
  const { api } = loadClient({ fetch: async () => ({ ok: true, json: async () => ({ exito: true, datos: [{ ...record, numero: bad ? -1 : 1 }], meta: { demo: false } }) }) });
  await api.obtenerRegistros();
  bad = true;
  const recovered = await api.obtenerRegistros(true);
  assert.equal(recovered.origen, 'offline');
  assert.equal(recovered.datos[0].numero, 1);
  const malformed = loadClient({ fetch: async () => ({ ok: true, json: async () => ({ exito: true, datos: [{ ...record, relacionadoConIssac: 'sí' }] }) }) });
  await assert.rejects(malformed.api.obtenerRegistros());
});
