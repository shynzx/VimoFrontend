import { Card } from '../types/models';
import { record, text, optionalText } from './validation';

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
    const id = text(raw.id);
    const gameId = optionalText(raw.gameId) ?? gameIdFromId(id);
    if (gameId !== undefined && !/^[0-9]{4}$/.test(gameId)) throw new Error('El ID del juego debe contener exactamente 4 dígitos.');
    if (raw.maxLevel != null && (typeof raw.maxLevel !== 'number' || !Number.isInteger(raw.maxLevel) || raw.maxLevel < 1)) {
      throw new Error('Nivel máximo de carta inválido.');
    }
    return {
      id,
      gameId,
      name: text(raw.name),
      category: text(raw.category),
      effect: text(raw.effect),
      availability: optionalText(raw.availability),
      maxLevel: raw.maxLevel == null ? undefined : raw.maxLevel as number,
    };
  }
}

/** Deriva el código de la app cuando el servidor no lo envía: "0042" → "0042", "CAR-042" → "0042". */
function gameIdFromId(id: string): string | undefined {
  if (/^[0-9]{4}$/.test(id)) return id;
  const design = /^CAR-([0-9]{3})$/i.exec(id);
  return design ? '0' + design[1] : undefined;
}
