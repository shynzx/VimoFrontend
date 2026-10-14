import { ApiService } from '../services/ApiService';
import { Card } from '../types/models';

export class CardsController {
  private apiService = ApiService.getInstance();

  public async searchCards(query: string): Promise<Card[]> {
    return await this.apiService.searchCards(query);
  }

  public async getAllCards(): Promise<Card[]> {
    return await this.apiService.getCards();
  }
}
