import { CatalogResult } from '../types/catalog';
import { ApiService } from '../services/ApiService';
import { Character, Enemy, Infrastructure } from '../types/models';
import { characterEntry, enemyEntry, infrastructureEntry, LoreEntry, LoreKind } from '../models/LoreEntry';

export class GuideController {
  private apiService = ApiService.getInstance();

  public async getCharacters(force = false): Promise<CatalogResult<Character>> {
    return await this.apiService.getCharacters(force);
  }

  public async getEnemies(force = false): Promise<CatalogResult<Enemy>> {
    return await this.apiService.getEnemies(force);
  }

  public async getInfrastructure(force = false): Promise<CatalogResult<Infrastructure>> {
    return await this.apiService.getInfrastructure(force);
  }

  /** Personajes, enemigos o lugares con la forma común que muestra el Archivo de lore. */
  public async getEntries(kind: LoreKind, force = false): Promise<CatalogResult<LoreEntry>> {
    if (kind === 'characters') {
      const result = await this.getCharacters(force);
      return { ...result, data: result.data.map(characterEntry) };
    }
    if (kind === 'enemies') {
      const result = await this.getEnemies(force);
      return { ...result, data: result.data.map(enemyEntry) };
    }
    const result = await this.getInfrastructure(force);
    return { ...result, data: result.data.map(infrastructureEntry) };
  }
}
