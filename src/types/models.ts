export interface Card {
  /** ID del diseño, por ejemplo "CAR-013". */
  id: string;
  /** Código de cuatro dígitos que escribe el jugador, por ejemplo "0013". */
  gameId?: string;
  name: string;
  /** Supervivencia, Batería, Linterna, Combate, Movimiento o Interacción. */
  category: string;
  /** Efecto de cada nivel; los niveles se acumulan. */
  effect: string;
  availability?: string;
  maxLevel?: number;
}

export interface Character {
  id: string;
  name: string;
  alias?: string;
  role: string;
  description: string;
  abilities?: string;
  weaknesses: string[];
  lore: string;
  relatedCards: string[];
}

export interface Enemy {
  id: string;
  name: string;
  type: string;
  difficulty?: 'baja' | 'media' | 'alta';
  description: string;
  behavior?: string;
  weaknesses: string[];
  lore: string;
  relatedCards: string[];
}

export interface Infrastructure {
  id: string;
  name: string;
  type: string;
  location?: string;
  description: string;
  gameplay?: string;
  lore: string;
}
