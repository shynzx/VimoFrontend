import { DatabaseService } from '../config/database';
import { Card } from '../models/types';
import { seedCards } from '../data/seedData';

export class CardRepository {
  private db = DatabaseService.getInstance();

  public async findAll(params: {
    query?: string;
    type?: string;
    page: number;
    limit: number;
  }): Promise<{ cards: Card[]; total: number }> {
    const usePostgres = process.env.DATA_MODE !== 'demo';

    if (usePostgres) {
      const conditions: string[] = [];
      const values: unknown[] = [];
      let valIndex = 1;

      if (params.query) {
        if (/^[0-9]+$/.test(params.query.trim())) {
          conditions.push(`game_id = $${valIndex}`);
          values.push(params.query.trim());
          valIndex += 1;
        } else {
          conditions.push(`(name ILIKE $${valIndex} OR description ILIKE $${valIndex} OR effect ILIKE $${valIndex} OR $${valIndex + 1} = ANY(tags))`);
          values.push(`%${params.query}%`);
          values.push(params.query.toLowerCase());
          valIndex += 2;
        }
      }

      if (params.type) {
        conditions.push(`type ILIKE $${valIndex}`);
        values.push(params.type);
        valIndex += 1;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Total count
      const countResult = await this.db.query<{ total: string }>(
        `SELECT COUNT(*) AS total FROM cards ${whereClause}`,
        values
      );
      const total = parseInt(countResult.rows[0]?.total || '0', 10);

      // Paginated items
      const offset = (params.page - 1) * params.limit;
      values.push(params.limit, offset);
      const itemsResult = await this.db.query<Card>(
        `SELECT id, game_id AS "gameId", name, type, cost, rarity, effect, description, tags, updated_at AS "updatedAt"
         FROM cards ${whereClause}
         ORDER BY id ASC
         LIMIT $${valIndex} OFFSET $${valIndex + 1}`,
        values
      );

      return { cards: itemsResult.rows, total };
    }

    // Datos de ejemplo únicamente en modo demo explícito
    let filtered = [...seedCards];

    if (params.query) {
      const q = params.query.trim().toLowerCase();
      filtered = filtered.filter(
        (c) =>
          /^[0-9]+$/.test(q) ? c.gameId === q :
          c.gameId === q ||
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.effect.toLowerCase().includes(q) ||
          (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (params.type) {
      filtered = filtered.filter((c) => c.type.toLowerCase() === params.type?.toLowerCase());
    }

    const total = filtered.length;
    const offset = (params.page - 1) * params.limit;
    const cards = filtered.slice(offset, offset + params.limit);

    return { cards, total };
  }

  public async findById(id: string): Promise<Card | null> {
    const usePostgres = process.env.DATA_MODE !== 'demo';

    if (usePostgres) {
      const result = await this.db.query<Card>(
        `SELECT id, game_id AS "gameId", name, type, cost, rarity, effect, description, tags, updated_at AS "updatedAt"
         FROM cards WHERE id = $1`,
        [id]
      );
      return result.rows[0] || null;
    }

    return seedCards.find((c) => c.id === id) || null;
  }
}
