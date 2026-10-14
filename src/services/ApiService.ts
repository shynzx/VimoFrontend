import { Card, Character, Enemy, Infrastructure } from '../types/models';
import { CacheService } from './CacheService';
import { mockCards, mockCharacters, mockEnemies, mockInfrastructure } from '../data/mockData';

export class ApiService {
  private static instance: ApiService;
  private cacheService = CacheService.getInstance();
  private baseUrl: string | null = null;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  private async fetchWithCache<T>(key: string, fetcher: () => Promise<T>, ttlMs?: number): Promise<T> {
    const cached = this.cacheService.get<T>(key);
    if (cached) {
      return cached;
    }
    const data = await fetcher();
    this.cacheService.set(key, data, ttlMs);
    return data;
  }

  public async getCards(): Promise<Card[]> {
    return this.fetchWithCache('cards', async () => {
      if (this.baseUrl) {
        try {
          const response = await fetch(`${this.baseUrl}/cards`);
          const data = await response.json();
          return data;
        } catch (error) {
          return mockCards;
        }
      }
      return mockCards;
    });
  }

  public async searchCards(query: string): Promise<Card[]> {
    const key = `cards:search:${query.toLowerCase()}`;
    return this.fetchWithCache(key, async () => {
      const allCards = await this.getCards();
      if (!query) {
        return allCards;
      }
      return allCards.filter((card) =>
        card.name.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase()) ||
        card.effect.toLowerCase().includes(query.toLowerCase()) ||
        (card.tags && card.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())))
      );
    }, 60000);
  }

  public async getCharacters(): Promise<Character[]> {
    return this.fetchWithCache('characters', async () => {
      if (this.baseUrl) {
        try {
          const response = await fetch(`${this.baseUrl}/characters`);
          const data = await response.json();
          return data;
        } catch (error) {
          return mockCharacters;
        }
      }
      return mockCharacters;
    });
  }

  public async getEnemies(): Promise<Enemy[]> {
    return this.fetchWithCache('enemies', async () => {
      if (this.baseUrl) {
        try {
          const response = await fetch(`${this.baseUrl}/enemies`);
          const data = await response.json();
          return data;
        } catch (error) {
          return mockEnemies;
        }
      }
      return mockEnemies;
    });
  }

  public async getInfrastructure(): Promise<Infrastructure[]> {
    return this.fetchWithCache('infrastructure', async () => {
      if (this.baseUrl) {
        try {
          const response = await fetch(`${this.baseUrl}/infrastructure`);
          const data = await response.json();
          return data;
        } catch (error) {
          return mockInfrastructure;
        }
      }
      return mockInfrastructure;
    });
  }
}
