import { DatabaseService } from '../config/database';
import { Character } from '../models/types';
import { seedCharacters } from '../data/seedData';

export class CharacterRepository {
  private db = DatabaseService.getInstance();

  public async findAll(): Promise<Character[]> {
    const usePostgres = process.env.DATA_MODE !== 'demo';
    if (usePostgres) {
      const result = await this.db.query<Character>(
        `SELECT id, name, role, description, lore, related_cards AS "relatedCards", updated_at AS "updatedAt"
         FROM characters ORDER BY id ASC`
      );
      return result.rows;
    }
    return seedCharacters;
  }

  public async findById(id: string): Promise<Character | null> {
    const usePostgres = process.env.DATA_MODE !== 'demo';
    if (usePostgres) {
      const result = await this.db.query<Character>(
        `SELECT id, name, role, description, lore, related_cards AS "relatedCards", updated_at AS "updatedAt"
         FROM characters WHERE id = $1`,
        [id]
      );
      return result.rows[0] || null;
    }
    return seedCharacters.find((c) => c.id === id) || null;
  }
}
