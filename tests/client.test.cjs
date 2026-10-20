const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadClient } = require('./load-client.cjs');

// Registros con la forma del contrato JSON en español.
const card = { id: 'c1', nombre: 'Pulsación', categoria: 'Combate', efecto: 'Daño rápido de energía', disponibilidad: 'Tienda y UI', nivelMaximo: 4 };
const body = (datos, pagina = 1, totalPaginas = 1, demo = false) => ({ exito: true, datos, paginacion: { pagina, totalPaginas }, meta: { demo } });
const response = (json) => ({ ok: true, json: async () => json });

test('lee el contrato paginado completo, normaliza acentos y reutiliza la caché', async () => {
  const calls = [];
  const { api } = loadClient({ fetch: async (url) => {
    calls.push(url);
    const page = Number(new URL(url).searchParams.get('pagina'));
    return response(body([{ ...card, id: 'c' + page }], page, 2));
  } });
  const result = await api.obtenerCartas();
  assert.equal(result.datos.length, 2);
  assert.equal(result.origen, 'network');
  assert.equal((await api.buscarCartas('  PULSACION  ')).datos.length, 2);
  assert.equal((await api.buscarCartas('rapido')).datos.length, 2);
  assert.equal((await api.buscarCartas('combate')).datos.length, 2);
  assert.equal((await api.buscarCartas('inexistente')).datos.length, 0);
  assert.equal(calls.length, 2);
});

test('deduplica cargas simultáneas y fuerza la actualización manual', async () => {
  let calls = 0;
  const { api } = loadClient({ fetch: async () => { calls++; return response(body([card])); } });
  await Promise.all([api.obtenerCartas(), api.obtenerCartas(), api.obtenerCartas()]);
  assert.equal(calls, 1);
  await api.obtenerCartas(true);
  assert.equal(calls, 2);
});

test('persiste entre sesiones, conserva el último contenido ante fallos y no lo rejuvenece', async () => {
  const storage = new Map();
  const first = loadClient({ storage, fetch: async () => response(body([card])) });
  await first.api.obtenerCartas();
  const second = loadClient({ storage });
  assert.equal((await second.api.obtenerCartas()).origen, 'cache');
  second.clock.now += 300001;
  assert.equal((await second.api.obtenerCartas()).origen, 'offline');
  assert.equal((await second.api.obtenerCartas(true)).datos[0].id, card.id);
  assert.equal(await second.cache.obtener('http://api.test/api/v1:cartas'), null);
});

test('rechaza HTTP fallido, respuestas mal formadas y registros inválidos sin inventar datos', async () => {
  for (const fetch of [
    async () => ({ ok: false, status: 503 }),
    async () => response([]),
    async () => response(body([{}])),
    async () => response({ exito: true, datos: [card] }),
    async () => response({ success: true, data: [card], pagination: { page: 1, totalPages: 1 } }),
  ]) {
    const { api } = loadClient({ fetch });
    await assert.rejects(api.obtenerCartas());
  }
});

test('separa la caché por servidor y mantiene la etiqueta demo al trabajar sin conexión', async () => {
  let online = true;
  const { api } = loadClient({ fetch: async () => {
    if (!online) throw new Error('sin red');
    return response(body([card], 1, 1, true));
  } });
  assert.equal((await api.obtenerCartas()).origen, 'demo');
  online = false;
  assert.equal((await api.obtenerCartas(true)).origen, 'demo');
  api.establecerUrlBase('http://otro.test/api/v1');
  await assert.rejects(api.obtenerCartas());
});

test('la caché limita entradas sin borrar almacenamiento ajeno y descarta datos corruptos', async () => {
  const { cache, storage } = loadClient();
  storage.set('preferencias', 'conservar');
  storage.set('@vimo_cache:v5:corrupto', '{');
  assert.equal(await cache.obtener('corrupto'), null);
  for (let i = 0; i < 30; i++) await cache.guardar('key-' + i, { i });
  assert.equal([...storage.keys()].filter((key) => key.startsWith('@vimo_cache:v5:')).length, 24);
  await cache.limpiar();
  assert.equal(storage.get('preferencias'), 'conservar');
});

test('un catálogo persistido con forma inválida se recupera desde la red', async () => {
  const { api, cache } = loadClient({ fetch: async () => response(body([card])) });
  await cache.guardar('http://api.test/api/v1:cartas', { datos: [null], demo: false });
  const result = await api.obtenerCartas();
  assert.equal(result.origen, 'network');
  assert.equal(result.datos[0].id, card.id);
});

test('busca el ID de cuatro dígitos exactamente y conserva ceros iniciales entre sesiones', async () => {
  const storage = new Map();
  const { api } = loadClient({ storage, fetch: async () => response(body([
    { ...card, codigoJuego: '0001' },
    { ...card, id: 'c2', codigoJuego: '1001', efecto: 'Menciona 0001 en su texto' },
  ])) });
  assert.equal((await api.buscarCartas('0001')).datos.length, 1);
  assert.equal((await api.buscarCartas('0001')).datos[0].id, 'c1');
  assert.equal((await api.buscarCartas('001')).datos.length, 0);
  assert.equal((await api.buscarCartas('0000')).datos.length, 0);
  const reopened = loadClient({ storage });
  assert.equal((await reopened.api.buscarCartas('0001')).datos[0].codigoJuego, '0001');
});

test('rechaza códigos inválidos y reconoce un ID interno de cuatro dígitos como código del juego', async () => {
  for (const codigoJuego of ['123', '12345', 'AB12', 1234]) {
    const { api } = loadClient({ fetch: async () => response(body([{ ...card, codigoJuego }])) });
    await assert.rejects(api.obtenerCartas());
  }
  for (const nivelMaximo of [0, 1.5, '4']) {
    const { api } = loadClient({ fetch: async () => response(body([{ ...card, nivelMaximo }])) });
    await assert.rejects(api.obtenerCartas());
  }
  const { api } = loadClient({ fetch: async () => response(body([{ ...card, id: '0042' }])) });
  assert.equal((await api.buscarCartas('0042')).datos[0].codigoJuego, '0042');
});

test('deriva el código de cuatro dígitos del ID del diseño y busca por ambos', async () => {
  const { api } = loadClient({ fetch: async () => response(body([
    { ...card, id: 'CAR-013', nombre: 'Gatillo optimizado' },
    { ...card, id: 'CAR-014', codigoJuego: '0014', nombre: 'Recarga táctica' },
  ])) });
  const cards = (await api.obtenerCartas()).datos;
  assert.equal(cards.map((c) => c.codigoJuego).join(), '0013,0014');
  assert.equal((await api.buscarCartas('0013')).datos[0].id, 'CAR-013');
  assert.equal((await api.buscarCartas(' car-014 ')).datos[0].id, 'CAR-014');
  assert.equal((await api.buscarCartas('car-01')).datos.length, 0);
});

test('consulta los recursos y parámetros del contrato en español', async () => {
  const urls = [];
  const { api } = loadClient({ fetch: async (url) => { urls.push(url); return response(body([])); } });
  await Promise.all([api.obtenerCartas(), api.obtenerPersonajes(), api.obtenerEnemigos(), api.obtenerInfraestructura()]);
  assert.equal(urls.map((url) => new URL(url).pathname).sort().join(),
    '/api/v1/cartas,/api/v1/enemigos,/api/v1/infraestructura,/api/v1/personajes');
  assert.equal(new URL(urls[0]).search, '?limite=100&pagina=1');
});

test('lee personajes, enemigos y lugares con los nombres del contrato en español', async () => {
  const records = {
    personajes: { id: 'p1', nombre: 'Nicolás Varela', alias: 'Enlace', rol: 'Operador', descripcion: 'd', habilidades: 'h', debilidades: ['x'], historia: 'l', cartasRelacionadas: [] },
    enemigos: { id: 'e1', nombre: 'Quimera', tipo: 'Enemigo regular', dificultad: 'Media', descripcion: 'd', comportamiento: 'c', debilidades: ['x'], historia: 'l', cartasRelacionadas: ['CAR-008'] },
    infraestructura: { id: 'i1', nombre: 'Terra', tipo: 'Colonia', ubicacion: 'u', descripcion: 'd', funcionJugable: 'f', historia: 'l' },
  };
  const { api } = loadClient({ fetch: async (url) => response(body([records[new URL(url).pathname.split('/').pop()]])) });
  const character = (await api.obtenerPersonajes()).datos[0];
  assert.equal(`${character.nombre}|${character.alias}|${character.rol}|${character.habilidades}|${character.debilidades}`, 'Nicolás Varela|Enlace|Operador|h|x');
  const enemy = (await api.obtenerEnemigos()).datos[0];
  assert.equal(`${enemy.tipo}|${enemy.dificultad}|${enemy.comportamiento}|${enemy.cartasRelacionadas}`, 'Enemigo regular|media|c|CAR-008');
  const place = (await api.obtenerInfraestructura()).datos[0];
  assert.equal(`${place.ubicacion}|${place.funcionJugable}|${place.historia}`, 'u|f|l');
});
