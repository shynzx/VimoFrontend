import { Carta, Personaje, Enemigo, Infraestructura } from '../types/modelos';
import { ResultadoCatalogo } from '../types/catalogo';
import { ModeloCarta } from '../models/ModeloCarta';
import { ModeloGuia } from '../models/ModeloGuia';
import { ServicioCache } from './ServicioCache';

/** Envoltorio del contrato JSON: { exito, datos, paginacion?, meta? }. */
interface Sobre {
  exito: boolean;
  datos: unknown;
  paginacion?: { pagina: number; totalPaginas: number };
  meta?: { demo?: boolean };
}

/** Contenido guardado en caché: los registros tal como los envía la API, para volver a validarlos al leerlos. */
interface CatalogoGuardado {
  datos: unknown[];
  demo: boolean;
}

export function normalizarBusqueda(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
}

export class ServicioApi {
  private static instancia: ServicioApi;
  private cache = ServicioCache.obtenerInstancia();
  private urlBase = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '') || null;
  private enCurso = new Map<string, Promise<ResultadoCatalogo<unknown>>>();
  private constructor() {}
  public static obtenerInstancia(): ServicioApi {
    if (!ServicioApi.instancia) ServicioApi.instancia = new ServicioApi();
    return ServicioApi.instancia;
  }
  public establecerUrlBase(url: string): void { this.urlBase = url.replace(/\/+$/, ''); }
  public obtenerUrlBase(): string | null { return this.urlBase; }

  /** Convierte un catálogo guardado; devuelve null si su forma ya no es válida. */
  private restaurar<T>(value: unknown, map: (raw: unknown) => T): { datos: T[]; demo: boolean } | null {
    if (!value || typeof value !== 'object' || !('datos' in value) || !('demo' in value)) return null;
    if (!Array.isArray(value.datos) || typeof value.demo !== 'boolean') return null;
    try { return { datos: value.datos.map(map), demo: value.demo }; }
    catch { return null; }
  }

  private async solicitar(url: string): Promise<Sobre> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error('El servidor respondió con el estado ' + response.status + '.');
      const body: Sobre = await response.json();
      if (!body || body.exito !== true || !Array.isArray(body.datos)) {
        throw new Error('La respuesta del servidor no tiene el formato esperado.');
      }
      return body;
    } finally { clearTimeout(timeout); }
  }

  private async cargar<T>(resource: string, map: (raw: unknown) => T, force = false): Promise<ResultadoCatalogo<T>> {
    const base = this.urlBase;
    if (!base) throw new Error('No se ha configurado la conexión al servidor de VIMO.');
    const key = base + ':' + resource;
    const existing = this.enCurso.get(key);
    if (existing) return existing as Promise<ResultadoCatalogo<T>>;
    const operation = (async (): Promise<ResultadoCatalogo<T>> => {
      if (!force) {
        const cached = this.restaurar(await this.cache.obtener(key), map);
        if (cached) return { datos: cached.datos, origen: cached.demo ? 'demo' : 'cache' };
      }
      try {
        const raws: unknown[] = [];
        let page = 1;
        let totalPages = 1;
        let demo = false;
        do {
          const result = await this.solicitar(base + '/' + resource + '?limite=100&pagina=' + page);
          raws.push(...(result.datos as unknown[]));
          demo ||= result.meta?.demo === true;
          if (resource === 'cartas') {
            if (!result.paginacion || result.paginacion.pagina !== page ||
                !Number.isSafeInteger(result.paginacion.totalPaginas) ||
                result.paginacion.totalPaginas < 1 || result.paginacion.totalPaginas > 1000) {
              throw new Error('La paginación del servidor es inválida.');
            }
            totalPages = result.paginacion.totalPaginas;
          }
          page += 1;
        } while (page <= totalPages);
        // Se valida antes de guardar para no persistir registros que la app no puede mostrar.
        const data = raws.map(map);
        await this.cache.guardar<CatalogoGuardado>(key, { datos: raws, demo });
        return { datos: data, origen: demo ? 'demo' : 'network' };
      } catch (error) {
        const fallback = await this.cache.obtenerRespaldo(key);
        const saved = this.restaurar(fallback?.datos, map);
        if (saved) return { datos: saved.datos, origen: saved.demo ? 'demo' : 'offline' };
        throw error;
      }
    })();
    this.enCurso.set(key, operation as Promise<ResultadoCatalogo<unknown>>);
    try { return await operation; }
    finally { this.enCurso.delete(key); }
  }
  public obtenerCartas(force = false): Promise<ResultadoCatalogo<Carta>> {
    return this.cargar('cartas', (raw) => ModeloCarta.obtenerInstancia().mapearCarta(raw), force);
  }
  public async buscarCartas(query: string, force = false): Promise<ResultadoCatalogo<Carta>> {
    const result = await this.obtenerCartas(force);
    const q = normalizarBusqueda(query);
    if (/^[0-9]+$/.test(q)) {
      return { ...result, datos: /^[0-9]{4}$/.test(q) ? result.datos.filter((card) => card.codigoJuego === q) : [] };
    }
    if (/^car-[0-9]{3}$/.test(q)) {
      return { ...result, datos: result.datos.filter((card) => card.id.toLowerCase() === q) };
    }
    return { ...result, datos: result.datos.filter((card) =>
      [card.nombre, card.categoria, card.efecto].some((value) => normalizarBusqueda(value).includes(q))) };
  }
  public obtenerPersonajes(force = false): Promise<ResultadoCatalogo<Personaje>> {
    return this.cargar('personajes', (raw) => ModeloGuia.obtenerInstancia().mapearPersonaje(raw), force);
  }
  public obtenerEnemigos(force = false): Promise<ResultadoCatalogo<Enemigo>> {
    return this.cargar('enemigos', (raw) => ModeloGuia.obtenerInstancia().mapearEnemigo(raw), force);
  }
  public obtenerInfraestructura(force = false): Promise<ResultadoCatalogo<Infraestructura>> {
    return this.cargar('infraestructura', (raw) => ModeloGuia.obtenerInstancia().mapearInfraestructura(raw), force);
  }
}
