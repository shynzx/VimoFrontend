import AsyncStorage from '@react-native-async-storage/async-storage';
interface CacheEntry<T> { data: T; timestamp: number; ttl: number }
const PREFIX = '@vimo_cache:v2:';
const MAX_ENTRIES = 24;
const MAX_ENTRY_BYTES = 2 * 1024 * 1024;

export class CacheService {
  private static instance: CacheService;
  private memory = new Map<string, CacheEntry<unknown>>();
  private writes: Promise<void> = Promise.resolve();
  private constructor() {}
  public static getInstance(): CacheService {
    if (!CacheService.instance) CacheService.instance = new CacheService();
    return CacheService.instance;
  }
  private remember(key: string, entry: CacheEntry<unknown>) {
    this.memory.delete(key);
    this.memory.set(key, entry);
    if (this.memory.size > MAX_ENTRIES) this.memory.delete(this.memory.keys().next().value!);
  }
  private async read<T>(key: string): Promise<CacheEntry<T> | null> {
    const mem = this.memory.get(key);
    if (mem) return mem as CacheEntry<T>;
    try {
      const raw = await AsyncStorage.getItem(PREFIX + key);
      if (!raw) return null;
      const entry = JSON.parse(raw) as CacheEntry<T>;
      if (!entry || !('data' in entry) || !Number.isFinite(entry.timestamp) || !Number.isFinite(entry.ttl) || entry.ttl < 0) return null;
      this.remember(key, entry);
      return entry;
    } catch { return null; }
  }
  public async set<T>(key: string, data: T, ttl = 300000): Promise<void> {
    const entry = { data, timestamp: Date.now(), ttl };
    this.remember(key, entry);
    // Serializar escrituras evita carreras entre cargas paralelas de la guía.
    this.writes = this.writes.then(async () => {
      const raw = JSON.stringify(entry);
      if (raw.length * 2 > MAX_ENTRY_BYTES) return;
      await AsyncStorage.setItem(PREFIX + key, raw);
      const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(PREFIX));
      if (keys.length > MAX_ENTRIES) {
        const entries = [...await AsyncStorage.multiGet(keys)];
        const age = (raw: string | null) => { try { return JSON.parse(raw || '{}').timestamp || 0; } catch { return 0; } };
        entries.sort((a, b) => age(a[1]) - age(b[1]));
        await AsyncStorage.multiRemove(entries.slice(0, keys.length - MAX_ENTRIES).map(([k]) => k));
      }
    }).catch(() => { /* La consulta sigue disponible en memoria si el dispositivo no permite persistir. */ });
    await this.writes;
  }
  public async get<T>(key: string): Promise<T | null> {
    const entry = await this.read<T>(key);
    return entry && Date.now() - entry.timestamp <= entry.ttl ? entry.data : null;
  }
  public async getStaleFallback<T>(key: string): Promise<{ data: T; isStale: true } | null> {
    const entry = await this.read<T>(key);
    return entry ? { data: entry.data, isStale: true } : null;
  }
  public async invalidate(key: string): Promise<void> {
    await this.writes;
    this.memory.delete(key);
    try { await AsyncStorage.removeItem(PREFIX + key); } catch { /* Sin almacenamiento disponible. */ }
  }
  public async clear(): Promise<void> {
    await this.writes;
    this.memory.clear();
    try {
      const keys = (await AsyncStorage.getAllKeys()).filter((key) => key.startsWith(PREFIX));
      if (keys.length) await AsyncStorage.multiRemove(keys);
    } catch { /* Sin almacenamiento disponible. */ }
  }
}
