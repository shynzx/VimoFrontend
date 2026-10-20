import { useCallback, useEffect, useState } from 'react';
import { CatalogResult } from '../types/catalog';

type Loader<T> = (force: boolean) => Promise<CatalogResult<T>>;

interface CatalogState<T> {
  /** Cargador que produjo este estado; si ya no es el actual, el estado está obsoleto. */
  load: Loader<T> | null;
  result: CatalogResult<T> | null;
  error: string | null;
}

const message = (cause: unknown) => (cause instanceof Error ? cause.message : 'No se pudo cargar el catálogo.');

/**
 * Carga un catálogo y descarta respuestas obsoletas (cambio de pestaña, recarga o desmontaje).
 * `load` debe ser estable (definida fuera del componente o con useCallback).
 */
export function useCatalog<T>(load: Loader<T>) {
  const [state, setState] = useState<CatalogState<T>>({ load: null, result: null, error: null });
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    load(false)
      .then((result) => { if (!cancelled) setState({ load, result, error: null }); })
      .catch((cause: unknown) => { if (!cancelled) setState({ load, result: null, error: message(cause) }); });
    return () => { cancelled = true; };
  }, [load]);

  const reload = useCallback(async () => {
    setReloading(true);
    try {
      const result = await load(true);
      setState((previous) => (previous.load === load ? { load, result, error: null } : previous));
    } catch (cause) {
      setState((previous) => (previous.load === load ? { ...previous, error: message(cause) } : previous));
    } finally {
      setReloading(false);
    }
  }, [load]);

  const current = state.load === load;
  return {
    result: current ? state.result : null,
    error: current ? state.error : null,
    loading: !current || reloading,
    reload,
  };
}
