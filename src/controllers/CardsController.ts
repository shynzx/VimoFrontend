import { CatalogResult } from '../types/catalog';
import { ApiService } from '../services/ApiService';
import { Card } from '../types/models';

export class CardsController {
  private apiService = ApiService.getInstance();

  public async searchCards(query: string, force = false): Promise<CatalogResult<Card>> {
    return await this.apiService.searchCards(query, force);
  }

  public async getAllCards(force = false): Promise<CatalogResult<Card>> {
    return await this.apiService.getCards(force);
  }
}
