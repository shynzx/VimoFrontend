import { DatabaseService } from '../config/database';
import { Enemy } from '../models/types';
import { seedEnemies } from '../data/seedData';

export class EnemyRepository {
  private db = DatabaseService.getInstance();

  public async findAll(): Promise<Enemy[]> {
    const usePostgres = process.env.DATA_MODE !== 'demo';
    if (usePostgres) {
      const result = await this.db.query<Enemy>(
        `SELECT id, name, type, difficulty, description, lore, related_cards AS "relatedCards", updated_at AS "updatedAt"
         FROM enemies ORDER BY id ASC`
      );
      return result.rows;
    }
    return seedEnemies;
  }

  public async findById(id: string): Promise<Enemy | null> {
    const usePostgres = process.env.DATA_MODE !== 'demo';
    if (usePostgres) {
      const result = await this.db.query<Enemy>(
        `SELECT id, name, type, difficulty, description, lore, related_cards AS "relatedCards", updated_at AS "updatedAt"
         FROM enemies WHERE id = $1`,
        [id]
      );
      return result.rows[0] || null;
    }
    return seedEnemies.find((e) => e.id === id) || null;
  }
}
