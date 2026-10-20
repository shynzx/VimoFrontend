import { Stack } from 'expo-router';
import { colors } from '../../../theme/tokens';

// Pila propia para que los perfiles mantengan activa la pestaña "Lore".
export default function DisenoGuia() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
