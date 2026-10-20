import { ui } from '../theme/styles';
import { Text } from 'react-native';
import { CatalogResult } from '../types/catalog';

export function CatalogNotice({ source }: { source: CatalogResult<unknown>['source'] | null }) {
  if (!source || source === 'network') return null;
  const message = source === 'demo'
    ? 'Demostración: este contenido todavía no es el catálogo oficial del juego.'
    : source === 'offline'
      ? 'No se pudo actualizar. Se muestra la última información guardada.'
      : 'Información guardada. Puedes actualizar para consultar el servidor.';
  return <Text accessibilityLiveRegion="polite" style={ui.notice}>{message}</Text>;
}
