import { Stack } from 'expo-router';
import { colors } from '../../../theme/tokens';

// Pila propia para que el detalle mantenga activa la pestaña "Cartas".
export default function DisenoCartas() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
