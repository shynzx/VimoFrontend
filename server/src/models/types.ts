export interface Card {
  id: string;
  gameId?: string;
  name: string;
  type: string;
  cost: number;
  rarity: string;
  effect: string;
  description: string;
  tags: string[];
  updatedAt?: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  lore: string;
  relatedCards?: string[];
  updatedAt?: string;
}

export interface Enemy {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  description: string;
  lore: string;
  relatedCards?: string[];
  updatedAt?: string;
}

export interface Infrastructure {
  id: string;
  name: string;
  type: string;
  location?: string;
  description: string;
  lore: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
  };
}
