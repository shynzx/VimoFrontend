import { Card, Character, Enemy, Infrastructure } from '../types/models';
import { CatalogResult } from '../types/catalog';
import { CardModel } from '../models/CardModel';
import { GuideModel } from '../models/GuideModel';
import { CacheService } from './CacheService';

interface Envelope {
  success: boolean;
  data: unknown;
  pagination?: { page: number; totalPages: number };
  meta?: { demo?: boolean };
}

export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

export class ApiService {
  private static instance: ApiService;
  private cache = CacheService.getInstance();
  private baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '') || null;
  private inFlight = new Map<string, Promise<CatalogResult<unknown>>>();
  private constructor() {}
  public static getInstance(): ApiService {
    if (!ApiService.instance) ApiService.instance = new ApiService();
    return ApiService.instance;
  }
  public setBaseUrl(url: string): void { this.baseUrl = url.replace(/\/+$/, ''); }
  public getBaseUrl(): string | null { return this.baseUrl; }

  private saved<T>(value: unknown, map: (raw: unknown) => T): { data: T[]; demo: boolean } | null {
    if (!value || typeof value !== 'object' || !('data' in value) || !('demo' in value)) return null;
    if (!Array.isArray(value.data) || typeof value.demo !== 'boolean') return null;
    try { return { data: value.data.map(map), demo: value.demo }; }
    catch { return null; }
  }

  private async request(url: string): Promise<Envelope> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error('El servidor respondió con el estado ' + response.status + '.');
      const body: Envelope = await response.json();
      if (!body || body.success !== true || !Array.isArray(body.data)) {
        throw new Error('La respuesta del servidor no tiene el formato esperado.');
      }
      return body;
    } finally { clearTimeout(timeout); }
  }

  private async load<T>(resource: string, map: (raw: unknown) => T, force = false): Promise<CatalogResult<T>> {
    const base = this.baseUrl;
    if (!base) throw new Error('No se ha configurado la conexión al servidor de VIMO.');
    const key = base + ':' + resource;
    const existing = this.inFlight.get(key);
    if (existing) return existing as Promise<CatalogResult<T>>;
    const operation = (async (): Promise<CatalogResult<T>> => {
      if (!force) {
        const cached = this.saved(await this.cache.get(key), map);
        if (cached) return { data: cached.data, source: cached.demo ? 'demo' : 'cache' };
      }
      try {
        const data: T[] = [];
        let page = 1;
        let totalPages = 1;
        let demo = false;
        do {
          const result = await this.request(base + '/' + resource + '?limit=100&page=' + page);
          data.push(...(result.data as unknown[]).map(map));
          demo ||= result.meta?.demo === true;
          if (resource === 'cards') {
            if (!result.pagination || result.pagination.page !== page ||
                !Number.isSafeInteger(result.pagination.totalPages) ||
                result.pagination.totalPages < 1 || result.pagination.totalPages > 1000) {
              throw new Error('La paginación del servidor es inválida.');
            }
            totalPages = result.pagination.totalPages;
          }
          page += 1;
        } while (page <= totalPages);
        await this.cache.set(key, { data, demo });
        return { data, source: demo ? 'demo' : 'network' };
      } catch (error) {
        const fallback = await this.cache.getStaleFallback(key);
        const saved = this.saved(fallback?.data, map);
        if (saved) return { data: saved.data, source: saved.demo ? 'demo' : 'offline' };
        throw error;
      }
    })();
    this.inFlight.set(key, operation as Promise<CatalogResult<unknown>>);
    try { return await operation; }
    finally { this.inFlight.delete(key); }
  }
  public getCards(force = false): Promise<CatalogResult<Card>> {
    return this.load('cards', (raw) => CardModel.getInstance().mapToCard(raw), force);
  }
  public async searchCards(query: string, force = false): Promise<CatalogResult<Card>> {
    const result = await this.getCards(force);
    const q = normalizeSearch(query);
    if (/^[0-9]+$/.test(q)) {
      return { ...result, data: /^[0-9]{4}$/.test(q) ? result.data.filter((card) => card.gameId === q) : [] };
    }
    return { ...result, data: result.data.filter((card) =>
      [card.name, card.type, card.description, card.effect, ...(card.tags || [])]
        .some((value) => normalizeSearch(value).includes(q))) };
  }
  public getCharacters(force = false): Promise<CatalogResult<Character>> {
    return this.load('characters', (raw) => GuideModel.getInstance().mapToCharacter(raw), force);
  }
  public getEnemies(force = false): Promise<CatalogResult<Enemy>> {
    return this.load('enemies', (raw) => GuideModel.getInstance().mapToEnemy(raw), force);
  }
  public getInfrastructure(force = false): Promise<CatalogResult<Infrastructure>> {
    return this.load('infrastructure', (raw) => GuideModel.getInstance().mapToInfrastructure(raw), force);
  }
}
