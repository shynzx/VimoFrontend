import AsyncStorage from '@react-native-async-storage/async-storage';
interface EntradaCache<T> { datos: T; marcaTiempo: number; duracion: number }
const PREFIX = '@vimo_cache:v5:';
const MAX_ENTRIES = 24;
const MAX_ENTRY_BYTES = 2 * 1024 * 1024;

export class ServicioCache {
  private static instancia: ServicioCache;
  private memoria = new Map<string, EntradaCache<unknown>>();
  private escrituras: Promise<void> = Promise.resolve();
  private constructor() {}
  public static obtenerInstancia(): ServicioCache {
    if (!ServicioCache.instancia) ServicioCache.instancia = new ServicioCache();
    return ServicioCache.instancia;
  }
  private recordar(key: string, entry: EntradaCache<unknown>) {
    this.memoria.delete(key);
    this.memoria.set(key, entry);
    if (this.memoria.size > MAX_ENTRIES) this.memoria.delete(this.memoria.keys().next().value!);
  }
  private async leer<T>(key: string): Promise<EntradaCache<T> | null> {
    const mem = this.memoria.get(key);
    if (mem) return mem as EntradaCache<T>;
    try {
      const raw = await AsyncStorage.getItem(PREFIX + key);
      if (!raw) return null;
      const entry = JSON.parse(raw) as EntradaCache<T>;
      if (!entry || !('datos' in entry) || !Number.isFinite(entry.marcaTiempo) || !Number.isFinite(entry.duracion) || entry.duracion < 0) return null;
      this.recordar(key, entry);
      return entry;
    } catch { return null; }
  }
  public async guardar<T>(key: string, datos: T, duracion = 300000): Promise<void> {
    const entry = { datos, marcaTiempo: Date.now(), duracion };
    this.recordar(key, entry);
    // Serializar escrituras evita carreras entre cargas paralelas de la guía.
    this.escrituras = this.escrituras.then(async () => {
      const raw = JSON.stringify(entry);
      if (raw.length * 2 > MAX_ENTRY_BYTES) return;
      await AsyncStorage.setItem(PREFIX + key, raw);
      const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(PREFIX));
      if (keys.length > MAX_ENTRIES) {
        const entries = [...await AsyncStorage.multiGet(keys)];
        const age = (raw: string | null) => { try { return JSON.parse(raw || '{}').marcaTiempo || 0; } catch { return 0; } };
        entries.sort((a, b) => age(a[1]) - age(b[1]));
        await AsyncStorage.multiRemove(entries.slice(0, keys.length - MAX_ENTRIES).map(([k]) => k));
      }
    }).catch(() => { /* La consulta sigue disponible en memoria si el dispositivo no permite persistir. */ });
    await this.escrituras;
  }
  public async obtener<T>(key: string): Promise<T | null> {
    const entry = await this.leer<T>(key);
    return entry && Date.now() - entry.marcaTiempo <= entry.duracion ? entry.datos : null;
  }
  public async obtenerRespaldo<T>(key: string): Promise<{ datos: T; caducado: true } | null> {
    const entry = await this.leer<T>(key);
    return entry ? { datos: entry.datos, caducado: true } : null;
  }
  public async invalidar(key: string): Promise<void> {
    await this.escrituras;
    this.memoria.delete(key);
    try { await AsyncStorage.removeItem(PREFIX + key); } catch { /* Sin almacenamiento disponible. */ }
  }
  public async limpiar(): Promise<void> {
    await this.escrituras;
    this.memoria.clear();
    try {
      const keys = (await AsyncStorage.getAllKeys()).filter((key) => key.startsWith(PREFIX));
      if (keys.length) await AsyncStorage.multiRemove(keys);
    } catch { /* Sin almacenamiento disponible. */ }
  }
}
