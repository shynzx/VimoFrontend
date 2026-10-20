import { ui } from '../theme/styles';
import { Text } from 'react-native';
import { CatalogResult } from '../types/catalog';

export function CatalogNotice({ source }: { source: CatalogResult<unknown>['source'] | null }) {
  if (!source || source === 'network' || source === 'cache') return null;
  const message = source === 'demo'
    ? 'Catálogo pendiente de aprobación: la información puede cambiar.'
    : 'Sin conexión con el servidor. Se muestra la última información guardada.';
  return <Text accessibilityLiveRegion="polite" style={ui.notice}>{message}</Text>;
}
