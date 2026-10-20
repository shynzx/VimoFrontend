export interface CatalogResult<T> {
  data: T[];
  source: 'network' | 'cache' | 'offline' | 'demo';
}
