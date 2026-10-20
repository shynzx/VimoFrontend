import { DatabaseService } from '../config/database';
import { Infrastructure } from '../models/types';
import { seedInfrastructure } from '../data/seedData';

export class InfrastructureRepository {
  private db = DatabaseService.getInstance();

  public async findAll(): Promise<Infrastructure[]> {
    const usePostgres = process.env.DATA_MODE !== 'demo';
    if (usePostgres) {
      const result = await this.db.query<Infrastructure>(
        `SELECT id, name, type, location, description, lore, updated_at AS "updatedAt"
         FROM infrastructure ORDER BY id ASC`
      );
      return result.rows;
    }
    return seedInfrastructure;
  }

  public async findById(id: string): Promise<Infrastructure | null> {
    const usePostgres = process.env.DATA_MODE !== 'demo';
    if (usePostgres) {
      const result = await this.db.query<Infrastructure>(
        `SELECT id, name, type, location, description, lore, updated_at AS "updatedAt"
         FROM infrastructure WHERE id = $1`,
        [id]
      );
      return result.rows[0] || null;
    }
    return seedInfrastructure.find((i) => i.id === id) || null;
  }
}
