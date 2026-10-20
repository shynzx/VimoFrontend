import { Character, Enemy, Infrastructure } from '../types/models';
import { record, text, optionalText, strings } from './validation';

export class GuideModel {
  private static instance: GuideModel;

  private constructor() {}

  public static getInstance(): GuideModel {
    if (!GuideModel.instance) {
      GuideModel.instance = new GuideModel();
    }
    return GuideModel.instance;
  }

  public mapToCharacter(value: unknown): Character {
    const raw = record(value);
    return {
      id: text(raw.id),
      name: text(raw.name),
      role: text(raw.role),
      description: text(raw.description),
      lore: text(raw.lore),
      relatedCards: strings(raw.relatedCards),
    };
  }

  public mapToEnemy(value: unknown): Enemy {
    const raw = record(value);
    const difficulty = optionalText(raw.difficulty)?.toLowerCase();
    if (difficulty && !['baja', 'media', 'alta'].includes(difficulty)) throw new Error('Dificultad inválida.');
    return {
      id: text(raw.id),
      name: text(raw.name),
      type: text(raw.type),
      description: text(raw.description),
      lore: text(raw.lore),
      difficulty: difficulty as Enemy['difficulty'],
      relatedCards: strings(raw.relatedCards),
    };
  }

  public mapToInfrastructure(value: unknown): Infrastructure {
    const raw = record(value);
    return {
      id: text(raw.id),
      name: text(raw.name),
      type: text(raw.type),
      description: text(raw.description),
      lore: text(raw.lore),
      location: optionalText(raw.location),
    };
  }
}
