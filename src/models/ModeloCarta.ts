import { Carta } from '../types/modelos';
import { registro, texto, textoOpcional } from './validacion';

/** Convierte una carta del contrato JSON (en español) al modelo de la app. */
export class ModeloCarta {
  private static instancia: ModeloCarta;

  private constructor() {}

  public static obtenerInstancia(): ModeloCarta {
    if (!ModeloCarta.instancia) {
      ModeloCarta.instancia = new ModeloCarta();
    }
    return ModeloCarta.instancia;
  }

  public mapearCarta(value: unknown): Carta {
    const raw = registro(value);
    const id = texto(raw.id);
    const gameId = textoOpcional(raw.codigoJuego) ?? codigoJuegoDesdeId(id);
    if (gameId !== undefined && !/^[0-9]{4}$/.test(gameId)) throw new Error('El ID del juego debe contener exactamente 4 dígitos.');
    const maxLevel = raw.nivelMaximo;
    if (maxLevel != null && (typeof maxLevel !== 'number' || !Number.isInteger(maxLevel) || maxLevel < 1)) {
      throw new Error('Nivel máximo de carta inválido.');
    }
    return {
      id,
      codigoJuego: gameId,
      nombre: texto(raw.nombre),
      categoria: texto(raw.categoria),
      efecto: texto(raw.efecto),
      disponibilidad: textoOpcional(raw.disponibilidad),
      nivelMaximo: maxLevel == null ? undefined : maxLevel as number,
    };
  }
}

/** Deriva el código de la app cuando el servidor no lo envía: "0042" → "0042", "CAR-042" → "0042". */
function codigoJuegoDesdeId(id: string): string | undefined {
  if (/^[0-9]{4}$/.test(id)) return id;
  const design = /^CAR-([0-9]{3})$/i.exec(id);
  return design ? '0' + design[1] : undefined;
}
