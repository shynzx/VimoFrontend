import { ui } from '../theme/styles';
import { Text } from 'react-native';
import { ResultadoCatalogo } from '../types/catalogo';

export function AvisoCatalogo({ source }: { source: ResultadoCatalogo<unknown>['origen'] | null }) {
  if (!source || source === 'network' || source === 'cache') return null;
  const message = source === 'demo'
    ? 'Catálogo pendiente de aprobación: la información puede cambiar.'
    : 'Sin conexión con el servidor. Se muestra la última información guardada.';
  return <Text accessibilityLiveRegion="polite" style={ui.notice}>{message}</Text>;
}
