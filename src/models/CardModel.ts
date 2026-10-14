import { Card } from '../types/models';

export class CardModel {
  private static instance: CardModel;

  private constructor() {}

  public static getInstance(): CardModel {
    if (!CardModel.instance) {
      CardModel.instance = new CardModel();
    }
    return CardModel.instance;
  }

  public mapToCard(raw: any): Card {
    return {
      id: raw.id || '',
      name: raw.name || '',
      type: raw.type || '',
      cost: raw.cost,
      rarity: raw.rarity,
      effect: raw.effect || '',
      description: raw.description || '',
      tags: raw.tags || [],
    };
  }
}
