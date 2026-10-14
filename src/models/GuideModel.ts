import { Character, Enemy, Infrastructure } from '../types/models';

export class GuideModel {
  private static instance: GuideModel;

  private constructor() {}

  public static getInstance(): GuideModel {
    if (!GuideModel.instance) {
      GuideModel.instance = new GuideModel();
    }
    return GuideModel.instance;
  }

  public mapToCharacter(raw: any): Character {
    return {
      id: raw.id || '',
      name: raw.name || '',
      role: raw.role || '',
      description: raw.description || '',
      lore: raw.lore || '',
      relatedCards: raw.relatedCards || [],
    };
  }

  public mapToEnemy(raw: any): Enemy {
    return {
      id: raw.id || '',
      name: raw.name || '',
      type: raw.type || '',
      description: raw.description || '',
      lore: raw.lore || '',
      difficulty: raw.difficulty,
      relatedCards: raw.relatedCards || [],
    };
  }

  public mapToInfrastructure(raw: any): Infrastructure {
    return {
      id: raw.id || '',
      name: raw.name || '',
      type: raw.type || '',
      description: raw.description || '',
      lore: raw.lore || '',
      location: raw.location,
    };
  }
}
