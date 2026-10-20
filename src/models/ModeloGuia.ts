import { Personaje, Enemigo, Infraestructura } from '../types/modelos';
import { registro, texto, textoOpcional, cadenas } from './validacion';

/** Convierte personajes, enemigos y lugares del contrato JSON (en español) al modelo de la app. */
export class ModeloGuia {
  private static instancia: ModeloGuia;

  private constructor() {}

  public static obtenerInstancia(): ModeloGuia {
    if (!ModeloGuia.instancia) {
      ModeloGuia.instancia = new ModeloGuia();
    }
    return ModeloGuia.instancia;
  }

  public mapearPersonaje(value: unknown): Personaje {
    const raw = registro(value);
    return {
      id: texto(raw.id),
      nombre: texto(raw.nombre),
      alias: textoOpcional(raw.alias),
      rol: texto(raw.rol),
      descripcion: texto(raw.descripcion),
      habilidades: textoOpcional(raw.habilidades),
      debilidades: cadenas(raw.debilidades),
      historia: texto(raw.historia),
      cartasRelacionadas: cadenas(raw.cartasRelacionadas),
    };
  }

  public mapearEnemigo(value: unknown): Enemigo {
    const raw = registro(value);
    const difficulty = textoOpcional(raw.dificultad)?.toLowerCase();
    if (difficulty && !['baja', 'media', 'alta'].includes(difficulty)) throw new Error('Dificultad inválida.');
    return {
      id: texto(raw.id),
      nombre: texto(raw.nombre),
      tipo: texto(raw.tipo),
      descripcion: texto(raw.descripcion),
      comportamiento: textoOpcional(raw.comportamiento),
      debilidades: cadenas(raw.debilidades),
      historia: texto(raw.historia),
      dificultad: difficulty as Enemigo['dificultad'],
      cartasRelacionadas: cadenas(raw.cartasRelacionadas),
    };
  }

  public mapearInfraestructura(value: unknown): Infraestructura {
    const raw = registro(value);
    return {
      id: texto(raw.id),
      nombre: texto(raw.nombre),
      tipo: texto(raw.tipo),
      descripcion: texto(raw.descripcion),
      funcionJugable: textoOpcional(raw.funcionJugable),
      historia: texto(raw.historia),
      ubicacion: textoOpcional(raw.ubicacion),
    };
  }
}
