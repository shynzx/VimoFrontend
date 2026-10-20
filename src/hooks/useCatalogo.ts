import { useCallback, useEffect, useState } from 'react';
import { ResultadoCatalogo } from '../types/catalogo';

type Cargador<T> = (force: boolean) => Promise<ResultadoCatalogo<T>>;

interface EstadoCatalogo<T> {
  /** Cargador que produjo este estado; si ya no es el actual, el estado está obsoleto. */
  cargador: Cargador<T> | null;
  resultado: ResultadoCatalogo<T> | null;
  error: string | null;
}

const message = (cause: unknown) => (cause instanceof Error ? cause.message : 'No se pudo cargar el catálogo.');

/**
 * Carga un catálogo y descarta respuestas obsoletas (cambio de pestaña, recarga o desmontaje).
 * `load` debe ser estable (definida fuera del componente o con useCallback).
 */
export function useCatalogo<T>(load: Cargador<T>) {
  const [state, setState] = useState<EstadoCatalogo<T>>({ cargador: null, resultado: null, error: null });
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    load(false)
      .then((result) => { if (!cancelled) setState({ cargador: load, resultado: result, error: null }); })
      .catch((cause: unknown) => { if (!cancelled) setState({ cargador: load, resultado: null, error: message(cause) }); });
    return () => { cancelled = true; };
  }, [load]);

  const reload = useCallback(async () => {
    setReloading(true);
    try {
      const result = await load(true);
      setState((previous) => (previous.cargador === load ? { cargador: load, resultado: result, error: null } : previous));
    } catch (cause) {
      setState((previous) => (previous.cargador === load ? { ...previous, error: message(cause) } : previous));
    } finally {
      setReloading(false);
    }
  }, [load]);

  const current = state.cargador === load;
  return {
    result: current ? state.resultado : null,
    error: current ? state.error : null,
    loading: !current || reloading,
    reload,
  };
}
