import { Personaje, Enemigo, Infraestructura } from '../types/modelos';

export type TipoLore = 'personajes' | 'enemigos' | 'infraestructura';

export interface SeccionLore {
  etiqueta: string;
  texto: string;
}

/** Representación común de personajes, enemigos y lugares para el Archivo de lore. */
export interface EntradaLore {
  id: string;
  tipo: TipoLore;
  nombre: string;
  insignia: string;
  subtitulo: string;
  resumen: string;
  secciones: SeccionLore[];
  cartasRelacionadas: string[];
  etiquetaRelacionadas: string;
}

export const TIPOS_LORE: { tipo: TipoLore; etiqueta: string }[] = [
  { tipo: 'personajes', etiqueta: 'Personajes' },
  { tipo: 'enemigos', etiqueta: 'Enemigos' },
  { tipo: 'infraestructura', etiqueta: 'Lugares' },
];

export function esTipoLore(value: string): value is TipoLore {
  return TIPOS_LORE.some((item) => item.tipo === value);
}

const vinietas = (items: string[]) => items.map((item) => '• ' + item).join('\n');

/** Omite las secciones sin contenido para no mostrar encabezados vacíos. */
function crearSecciones(...items: [string, string | undefined][]): SeccionLore[] {
  return items.filter((item): item is [string, string] => !!item[1]?.trim()).map(([etiqueta, texto]) => ({ etiqueta, texto }));
}

export function entradaPersonaje(item: Personaje): EntradaLore {
  return {
    id: item.id, tipo: 'personajes', nombre: item.nombre,
    insignia: item.alias ?? 'Personaje', subtitulo: item.rol, resumen: item.descripcion,
    secciones: crearSecciones(
      ['Descripción', item.descripcion],
      ['Habilidades', item.habilidades],
      ['Debilidades', vinietas(item.debilidades)],
      ['Historia', item.historia],
    ),
    cartasRelacionadas: item.cartasRelacionadas, etiquetaRelacionadas: 'Cartas relacionadas',
  };
}

export function entradaEnemigo(item: Enemigo): EntradaLore {
  const difficulty = item.dificultad ? ` · Dificultad ${item.dificultad}` : '';
  return {
    id: item.id, tipo: 'enemigos', nombre: item.nombre,
    insignia: 'Vimer', subtitulo: item.tipo + difficulty, resumen: item.descripcion,
    secciones: crearSecciones(
      ['Rol de combate', item.descripcion],
      ['Comportamiento', item.comportamiento],
      ['Debilidades', vinietas(item.debilidades)],
      ['Aspecto', item.historia],
    ),
    cartasRelacionadas: item.cartasRelacionadas, etiquetaRelacionadas: 'Cartas útiles',
  };
}

export function entradaInfraestructura(item: Infraestructura): EntradaLore {
  return {
    id: item.id, tipo: 'infraestructura', nombre: item.nombre,
    insignia: item.tipo, subtitulo: item.ubicacion ? `Ubicación · ${item.ubicacion}` : 'Terra', resumen: item.descripcion,
    secciones: crearSecciones(
      ['Descripción', item.descripcion],
      ['En la partida', item.funcionJugable],
      ['Importancia', item.historia],
    ),
    cartasRelacionadas: [], etiquetaRelacionadas: '',
  };
}
