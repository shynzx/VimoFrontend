import { Card } from '../types/models';
import { record, text, optionalText, strings } from './validation';

export class CardModel {
  private static instance: CardModel;

  private constructor() {}

  public static getInstance(): CardModel {
    if (!CardModel.instance) {
      CardModel.instance = new CardModel();
    }
    return CardModel.instance;
  }

  public mapToCard(value: unknown): Card {
    const raw = record(value);
    const gameId = optionalText(raw.gameId) ?? (typeof raw.id === 'string' && /^[0-9]{4}$/.test(raw.id) ? raw.id : undefined);
    if (gameId !== undefined && !/^[0-9]{4}$/.test(gameId)) throw new Error('El ID del juego debe contener exactamente 4 dígitos.');
    if (raw.cost != null && (typeof raw.cost !== 'number' || !Number.isFinite(raw.cost))) {
      throw new Error('Costo de carta inválido.');
    }
    return {
      id: text(raw.id),
      gameId,
      name: text(raw.name),
      type: text(raw.type),
      cost: raw.cost == null ? undefined : raw.cost as number,
      rarity: optionalText(raw.rarity),
      effect: text(raw.effect),
      description: text(raw.description),
      tags: strings(raw.tags),
    };
  }
}
