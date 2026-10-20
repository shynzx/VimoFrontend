export interface ResultadoCatalogo<T> {
  datos: T[];
  origen: 'network' | 'cache' | 'offline' | 'demo';
}
