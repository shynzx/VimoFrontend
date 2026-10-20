import { ResultadoCatalogo } from '../types/catalogo';
import { ServicioApi } from '../services/ServicioApi';
import { Personaje, Enemigo, Infraestructura } from '../types/modelos';
import { entradaPersonaje, entradaEnemigo, entradaInfraestructura, EntradaLore, TipoLore } from '../models/EntradaLore';

export class ControladorGuia {
  private servicioApi = ServicioApi.obtenerInstancia();

  public async obtenerPersonajes(force = false): Promise<ResultadoCatalogo<Personaje>> {
    return await this.servicioApi.obtenerPersonajes(force);
  }

  public async obtenerEnemigos(force = false): Promise<ResultadoCatalogo<Enemigo>> {
    return await this.servicioApi.obtenerEnemigos(force);
  }

  public async obtenerInfraestructura(force = false): Promise<ResultadoCatalogo<Infraestructura>> {
    return await this.servicioApi.obtenerInfraestructura(force);
  }

  /** Personajes, enemigos o lugares con la forma común que muestra el Archivo de lore. */
  public async obtenerEntradas(tipo: TipoLore, force = false): Promise<ResultadoCatalogo<EntradaLore>> {
    if (tipo === 'personajes') {
      const result = await this.obtenerPersonajes(force);
      return { ...result, datos: result.datos.map(entradaPersonaje) };
    }
    if (tipo === 'enemigos') {
      const result = await this.obtenerEnemigos(force);
      return { ...result, datos: result.datos.map(entradaEnemigo) };
    }
    const result = await this.obtenerInfraestructura(force);
    return { ...result, datos: result.datos.map(entradaInfraestructura) };
  }
}
