const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadClient } = require('./load-client.cjs');

const card = { id: 'c1', name: 'Pulsación', type: 'Ataque', cost: 1, effect: 'Daño', description: 'Ataque de energía', tags: ['rápido'] };
const body = (data, page = 1, totalPages = 1, demo = false) => ({ success: true, data, pagination: { page, totalPages }, meta: { demo } });
const response = (json) => ({ ok: true, json: async () => json });

test('lee el contrato paginado completo, normaliza acentos y reutiliza la caché', async () => {
  const calls = [];
  const { api } = loadClient({ fetch: async (url) => {
    calls.push(url);
    const page = Number(new URL(url).searchParams.get('page'));
    return response(body([{ ...card, id: 'c' + page }], page, 2));
  } });
  const result = await api.getCards();
  assert.equal(result.data.length, 2);
  assert.equal(result.source, 'network');
  assert.equal((await api.searchCards('  PULSACION  ')).data.length, 2);
  assert.equal((await api.searchCards('rapido')).data.length, 2);
  assert.equal((await api.searchCards('ataque')).data.length, 2);
  assert.equal((await api.searchCards('inexistente')).data.length, 0);
  assert.equal(calls.length, 2);
});

test('deduplica cargas simultáneas y fuerza la actualización manual', async () => {
  let calls = 0;
  const { api } = loadClient({ fetch: async () => { calls++; return response(body([card])); } });
  await Promise.all([api.getCards(), api.getCards(), api.getCards()]);
  assert.equal(calls, 1);
  await api.getCards(true);
  assert.equal(calls, 2);
});

test('persiste entre sesiones, conserva el último contenido ante fallos y no lo rejuvenece', async () => {
  const storage = new Map();
  const first = loadClient({ storage, fetch: async () => response(body([card])) });
  await first.api.getCards();
  const second = loadClient({ storage });
  assert.equal((await second.api.getCards()).source, 'cache');
  second.clock.now += 300001;
  assert.equal((await second.api.getCards()).source, 'offline');
  assert.equal((await second.api.getCards(true)).data[0].id, card.id);
  assert.equal(await second.cache.get('http://api.test/api/v1:cards'), null);
});

test('rechaza HTTP fallido, respuestas mal formadas y registros inválidos sin inventar datos', async () => {
  for (const fetch of [
    async () => ({ ok: false, status: 503 }),
    async () => response([]),
    async () => response(body([{}])),
    async () => response({ success: true, data: [card] }),
  ]) {
    const { api } = loadClient({ fetch });
    await assert.rejects(api.getCards());
  }
});

test('separa la caché por servidor y mantiene la etiqueta demo al trabajar sin conexión', async () => {
  let online = true;
  const { api } = loadClient({ fetch: async () => {
    if (!online) throw new Error('sin red');
    return response(body([card], 1, 1, true));
  } });
  assert.equal((await api.getCards()).source, 'demo');
  online = false;
  assert.equal((await api.getCards(true)).source, 'demo');
  api.setBaseUrl('http://otro.test/api/v1');
  await assert.rejects(api.getCards());
});

test('la caché limita entradas sin borrar almacenamiento ajeno y descarta datos corruptos', async () => {
  const { cache, storage } = loadClient();
  storage.set('preferencias', 'conservar');
  storage.set('@vimo_cache:v2:corrupto', '{');
  assert.equal(await cache.get('corrupto'), null);
  for (let i = 0; i < 30; i++) await cache.set('key-' + i, { i });
  assert.equal([...storage.keys()].filter((key) => key.startsWith('@vimo_cache:v2:')).length, 24);
  await cache.clear();
  assert.equal(storage.get('preferencias'), 'conservar');
});

test('un catálogo persistido con forma inválida se recupera desde la red', async () => {
  const { api, cache } = loadClient({ fetch: async () => response(body([card])) });
  await cache.set('http://api.test/api/v1:cards', { data: [null], demo: false });
  const result = await api.getCards();
  assert.equal(result.source, 'network');
  assert.equal(result.data[0].id, card.id);
});

test('busca el ID de cuatro dígitos exactamente y conserva ceros iniciales entre sesiones', async () => {
  const storage = new Map();
  const { api } = loadClient({ storage, fetch: async () => response(body([
    { ...card, gameId: '0001' },
    { ...card, id: 'c2', gameId: '1001', description: 'Menciona 0001 en su texto' },
  ])) });
  assert.equal((await api.searchCards('0001')).data.length, 1);
  assert.equal((await api.searchCards('0001')).data[0].id, 'c1');
  assert.equal((await api.searchCards('001')).data.length, 0);
  assert.equal((await api.searchCards('0000')).data.length, 0);
  const reopened = loadClient({ storage });
  assert.equal((await reopened.api.searchCards('0001')).data[0].gameId, '0001');
});

test('rechaza códigos inválidos y reconoce un ID interno de cuatro dígitos como código del juego', async () => {
  for (const gameId of ['123', '12345', 'AB12', 1234]) {
    const { api } = loadClient({ fetch: async () => response(body([{ ...card, gameId }])) });
    await assert.rejects(api.getCards());
  }
  const { api } = loadClient({ fetch: async () => response(body([{ ...card, id: '0042' }])) });
  assert.equal((await api.searchCards('0042')).data[0].gameId, '0042');
});
