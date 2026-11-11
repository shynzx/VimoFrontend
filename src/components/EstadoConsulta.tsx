import { ActivityIndicator, Text, View } from 'react-native';
import { BotonApp } from './BotonApp';
import { colors } from '../theme/tokens';
import { ui } from '../theme/styles';

export function EstadoConsulta({ loading, error, reload }: { loading: boolean; error: string | null; reload: () => Promise<void> }) {
  if (loading) return <ActivityIndicator style={ui.loading} color={colors.primary} accessibilityLabel="Cargando contenido" />;
  if (!error) return null;
  return <View style={ui.section}><Text style={ui.errorText} accessibilityRole="alert">{error}</Text>
    <BotonApp title="Reintentar" variant="secondary" onPress={() => void reload()} /></View>;
}
