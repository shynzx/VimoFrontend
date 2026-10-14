export interface Card {
  id: string;
  name: string;
  type: string;
  cost?: number;
  rarity?: string;
  effect: string;
  description: string;
  tags?: string[];
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  lore: string;
  relatedCards?: string[];
}

export interface Enemy {
  id: string;
  name: string;
  type: string;
  description: string;
  lore: string;
  difficulty?: 'baja' | 'media' | 'alta';
  relatedCards?: string[];
}

export interface Infrastructure {
  id: string;
  name: string;
  type: string;
  description: string;
  lore: string;
  location?: string;
}
