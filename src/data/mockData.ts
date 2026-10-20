import { Card, Character, Enemy, Infrastructure } from '../types/models';

export const mockCards: Card[] = [
  {
    id: 'c1',
    name: 'Golpe Potente',
    type: 'ataque',
    cost: 2,
    rarity: 'común',
    effect: '+3 daño',
    description: 'Realiza un ataque de 3 puntos de daño',
    tags: ['ataque', 'físico'],
  },
  {
    id: 'c2',
    name: 'Escudo Protector',
    type: 'defensa',
    cost: 1,
    rarity: 'común',
    effect: '+5 bloque',
    description: 'Gana 5 de bloqueo',
    tags: ['defensa', 'bloqueo'],
  },
  {
    id: 'c3',
    name: 'Furia',
    type: 'habilidad',
    cost: 3,
    rarity: 'raro',
    effect: 'daño aumentado',
    description: 'Duplica el daño del siguiente ataque',
    tags: ['habilidad', 'daño'],
  },
];

export const mockCharacters: Character[] = [
  {
    id: 'ch1',
    name: 'Protagonista',
    role: 'principal',
    description: 'Personaje jugable',
    lore: 'El personaje principal envuelto en la historia de VIMO.',
    relatedCards: ['c1', 'c2'],
  },
];

export const mockEnemies: Enemy[] = [
  {
    id: 'e1',
    name: 'Espectro',
    type: 'muerte',
    description: 'Enemigo espectral',
    lore: 'Restos de los que cayeron en la oscuridad.',
    difficulty: 'media',
    relatedCards: ['c3'],
  },
];

export const mockInfrastructure: Infrastructure[] = [
  {
    id: 'i1',
    name: 'Santuario',
    type: 'lugar',
    description: 'Lugar de descanso',
    lore: 'Un santuario que ofrece reposo a los viajeros.',
    location: 'ruinas',
  },
];
