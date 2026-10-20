import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client } from 'pg';
import { seedCards, seedCharacters, seedEnemies, seedInfrastructure } from './seedData';

async function setup() {
  if (!process.env.DATABASE_URL) throw new Error('Configura DATABASE_URL.');
  const seed = process.argv.includes('--seed-demo');
  if (seed && process.env.NODE_ENV === 'production') throw new Error('No se permite cargar demostraciones en producción.');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query(await readFile(resolve(__dirname, '../../src/data/schema.sql'), 'utf8'));
    if (seed) {
      for (const c of seedCards) await client.query(
        'INSERT INTO cards (id,name,type,cost,rarity,effect,description,tags,game_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO NOTHING',
        [c.id,c.name,c.type,c.cost,c.rarity,c.effect,c.description,c.tags,c.gameId]);
      for (const c of seedCharacters) await client.query(
        'INSERT INTO characters (id,name,role,description,lore,related_cards) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING',
        [c.id,c.name,c.role,c.description,c.lore,c.relatedCards || []]);
      for (const e of seedEnemies) await client.query(
        'INSERT INTO enemies (id,name,type,difficulty,description,lore,related_cards) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING',
        [e.id,e.name,e.type,e.difficulty,e.description,e.lore,e.relatedCards || []]);
      for (const i of seedInfrastructure) await client.query(
        'INSERT INTO infrastructure (id,name,type,location,description,lore) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING',
        [i.id,i.name,i.type,i.location,i.description,i.lore]);
    }
    await client.query('COMMIT');
    console.log(seed ? 'Esquema listo; datos de demostración insertados sin reemplazar registros existentes.' : 'Esquema creado; sin contenido ficticio.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { await client.end(); }
}
void setup().catch((error) => { console.error(error); process.exitCode = 1; });
