import { CatalogResult } from '../types/catalog';
import { ApiService } from '../services/ApiService';
import { Character, Enemy, Infrastructure } from '../types/models';

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
}
