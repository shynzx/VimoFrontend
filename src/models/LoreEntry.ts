import { Character, Enemy, Infrastructure } from '../types/models';

export type LoreKind = 'characters' | 'enemies' | 'infrastructure';

export interface LoreSection {
  label: string;
  text: string;
}

/** Representación común de personajes, enemigos y lugares para el Archivo de lore. */
export interface LoreEntry {
  id: string;
  kind: LoreKind;
  name: string;
  badge: string;
  subtitle: string;
  summary: string;
  sections: LoreSection[];
  relatedCards: string[];
  relatedLabel: string;
}

export const LORE_KINDS: { kind: LoreKind; label: string }[] = [
  { kind: 'characters', label: 'Personajes' },
  { kind: 'enemies', label: 'Enemigos' },
  { kind: 'infrastructure', label: 'Lugares' },
];

export function isLoreKind(value: string): value is LoreKind {
  return LORE_KINDS.some((item) => item.kind === value);
}

const bullets = (items: string[]) => items.map((item) => '• ' + item).join('\n');

/** Omite las secciones sin contenido para no mostrar encabezados vacíos. */
function sections(...items: [string, string | undefined][]): LoreSection[] {
  return items.filter((item): item is [string, string] => !!item[1]?.trim()).map(([label, text]) => ({ label, text }));
}

export function characterEntry(item: Character): LoreEntry {
  return {
    id: item.id, kind: 'characters', name: item.name,
    badge: item.alias ?? 'Personaje', subtitle: item.role, summary: item.description,
    sections: sections(
      ['Descripción', item.description],
      ['Habilidades', item.abilities],
      ['Debilidades', bullets(item.weaknesses)],
      ['Historia', item.lore],
    ),
    relatedCards: item.relatedCards, relatedLabel: 'Cartas relacionadas',
  };
}

export function enemyEntry(item: Enemy): LoreEntry {
  const difficulty = item.difficulty ? ` · Dificultad ${item.difficulty}` : '';
  return {
    id: item.id, kind: 'enemies', name: item.name,
    badge: 'Vimer', subtitle: item.type + difficulty, summary: item.description,
    sections: sections(
      ['Rol de combate', item.description],
      ['Comportamiento', item.behavior],
      ['Debilidades', bullets(item.weaknesses)],
      ['Aspecto', item.lore],
    ),
    relatedCards: item.relatedCards, relatedLabel: 'Cartas útiles',
  };
}

export function infrastructureEntry(item: Infrastructure): LoreEntry {
  return {
    id: item.id, kind: 'infrastructure', name: item.name,
    badge: item.type, subtitle: item.location ? `Ubicación · ${item.location}` : 'Terra', summary: item.description,
    sections: sections(
      ['Descripción', item.description],
      ['En la partida', item.gameplay],
      ['Importancia', item.lore],
    ),
    relatedCards: [], relatedLabel: '',
  };
}
