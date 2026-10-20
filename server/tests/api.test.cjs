const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
process.env.DATA_MODE = 'demo';
const { createApp } = require('../dist/app');
let server;
let base;
before(async () => {
  server = await new Promise((resolve) => { const s = createApp().listen(0, '127.0.0.1', () => resolve(s)); });
  base = 'http://127.0.0.1:' + server.address().port;
});
after(() => new Promise((resolve) => server.close(resolve)));

test('expone salud y los cuatro catálogos con detalles y etiqueta demo', async () => {
  assert.equal((await (await fetch(base + '/health')).json()).data.mode, 'demo');
  for (const resource of ['cards', 'characters', 'enemies', 'infrastructure']) {
    const res = await fetch(base + '/api/v1/' + resource);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.meta.demo, true);
    assert.ok(body.data.length > 0);
    const detail = await (await fetch(base + '/api/v1/' + resource + '/' + body.data[0].id)).json();
    assert.equal(detail.data.id, body.data[0].id);
    assert.equal((await fetch(base + '/api/v1/' + resource + '/no-existe')).status, 404);
  }
});

test('pagina y busca sin exponer registros fuera de la página', async () => {
  const res = await (await fetch(base + '/api/v1/cards?limit=1&page=2')).json();
  assert.equal(res.data.length, 1);
  assert.equal(res.pagination.page, 2);
  assert.ok(res.pagination.total > 1);
  const match = await (await fetch(base + '/api/v1/cards?q=VIOLETA')).json();
  assert.ok(match.data.length > 0);
  const empty = await (await fetch(base + '/api/v1/cards?q=inexistente')).json();
  assert.equal(empty.data.length, 0);
  const code = await (await fetch(base + '/api/v1/cards?q=0001')).json();
  assert.equal(code.data.length, 1);
  assert.equal(code.data[0].gameId, '0001');
  assert.equal((await (await fetch(base + '/api/v1/cards?q=001')).json()).data.length, 0);
});

test('rechaza parámetros inválidos y rutas inexistentes con errores JSON', async () => {
  for (const query of ['page=0', 'page=abc', 'limit=101', 'page=1.2', 'q=a&q=b', 'limit=-1']) {
    const res = await fetch(base + '/api/v1/cards?' + query);
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error.code, 'BAD_REQUEST');
  }
  assert.equal((await fetch(base + '/api/v1/no-existe')).status, 404);
});

test('impide activar demo en producción', () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try { assert.throws(() => createApp(), /demo/); }
  finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});

test('el cliente real consume la API y conserva el catálogo al perder conexión', async () => {
  const { loadClient } = require('../../tests/load-client.cjs');
  let online = true;
  const { api } = loadClient({ fetch: (...args) => {
    if (!online) return Promise.reject(new Error('sin conexión'));
    return fetch(...args);
  } });
  api.setBaseUrl(base + '/api/v1');
  const [cards, characters, enemies, infrastructure] = await Promise.all([
    api.getCards(), api.getCharacters(), api.getEnemies(), api.getInfrastructure(),
  ]);
  for (const result of [cards, characters, enemies, infrastructure]) {
    assert.ok(result.data.length > 0);
    assert.equal(result.source, 'demo');
  }
  assert.equal(enemies.data[0].difficulty, 'media');
  assert.equal((await api.searchCards('0001')).data[0].id, 'card-01');
  online = false;
  assert.equal((await api.getCards(true)).data.length, cards.data.length);
});
