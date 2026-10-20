const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

test('PostgreSQL: esquema, consultas parametrizadas, detalles y fallo sin fallback ficticio', {
  skip: !process.env.VIMO_TEST_DATABASE_URL && 'Requiere VIMO_TEST_DATABASE_URL con una base de pruebas independiente.',
}, async () => {
  process.env.DATABASE_URL = process.env.VIMO_TEST_DATABASE_URL;
  process.env.DATA_MODE = 'postgres';
  const { DatabaseService } = require('../dist/config/database');
  const { createApp } = require('../dist/app');
  const db = DatabaseService.getInstance();
  const id = 'test-' + randomUUID();
  let server;
  const tables = ['cards', 'characters', 'enemies', 'infrastructure'];
  try {
    await db.query(fs.readFileSync(path.resolve(__dirname, '../src/data/schema.sql'), 'utf8'));
    await db.query('INSERT INTO cards (id,name,type,cost,rarity,effect,description,tags) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [id, 'Carta de prueba', 'Ataque', 1, 'Común', 'Daño', 'Descripción', ['prueba']]);
    const available = await db.query("SELECT lpad(n::text,4,'0') AS code FROM generate_series(0,9999) n WHERE NOT EXISTS (SELECT 1 FROM cards WHERE game_id=lpad(n::text,4,'0')) LIMIT 1");
    const code = available.rows[0].code;
    await db.query('UPDATE cards SET game_id=$1 WHERE id=$2', [code, id]);
    await db.query('INSERT INTO characters (id,name,role,description,lore,related_cards) VALUES ($1,$2,$3,$4,$5,$6)', [id, 'Personaje de prueba', 'Protagonista', 'Descripción', 'Historia', [id]]);
    await db.query('INSERT INTO enemies (id,name,type,description,lore) VALUES ($1,$2,$3,$4,$5)', [id, 'Enemigo de prueba', 'Prueba', 'Descripción', 'Historia']);
    await db.query('INSERT INTO infrastructure (id,name,type,description,lore) VALUES ($1,$2,$3,$4,$5)', [id, 'Lugar de prueba', 'Prueba', 'Descripción', 'Historia']);
    server = await new Promise((resolve) => { const s = createApp().listen(0, '127.0.0.1', () => resolve(s)); });
    const base = 'http://127.0.0.1:' + server.address().port;
    assert.equal((await fetch(base + '/health')).status, 200);
    const byCode = await (await fetch(base + '/api/v1/cards?q=' + code)).json();
    assert.equal(byCode.data.length, 1);
    assert.equal(byCode.data[0].id, id);
    assert.equal(byCode.data[0].gameId, code);
    for (const table of tables) {
      const result = await (await fetch(base + '/api/v1/' + table + '/' + id)).json();
      assert.equal(result.data.id, id);
    }
    const query = await (await fetch(base + '/api/v1/cards?q=' + encodeURIComponent("' OR 1=1 --"))).json();
    assert.equal(query.data.length, 0);
    const original = db.query;
    db.query = async () => { throw new Error('Fallo de base de datos simulado'); };
    try {
      const res = await fetch(base + '/api/v1/cards');
      assert.equal(res.status, 500);
      assert.equal((await res.json()).success, false);
    } finally { db.query = original; }
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    for (const table of tables) await db.query('DELETE FROM ' + table + ' WHERE id=$1', [id]);
    await db.close();
  }
});
