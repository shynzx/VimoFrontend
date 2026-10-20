import { ResultadoCatalogo } from '../types/catalogo';
import { ServicioApi } from '../services/ServicioApi';
import { Carta } from '../types/modelos';

export class ControladorCartas {
  private servicioApi = ServicioApi.obtenerInstancia();

  public async buscarCartas(query: string, force = false): Promise<ResultadoCatalogo<Carta>> {
    return await this.servicioApi.buscarCartas(query, force);
  }

  public async obtenerTodasLasCartas(force = false): Promise<ResultadoCatalogo<Carta>> {
    return await this.servicioApi.obtenerCartas(force);
  }
}
