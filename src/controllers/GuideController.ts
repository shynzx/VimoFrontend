import { ApiService } from '../services/ApiService';
import { Character, Enemy, Infrastructure } from '../types/models';

export class GuideController {
  private apiService = ApiService.getInstance();

  public async getCharacters(): Promise<Character[]> {
    return await this.apiService.getCharacters();
  }

  public async getEnemies(): Promise<Enemy[]> {
    return await this.apiService.getEnemies();
  }

  public async getInfrastructure(): Promise<Infrastructure[]> {
    return await this.apiService.getInfrastructure();
  }
}
