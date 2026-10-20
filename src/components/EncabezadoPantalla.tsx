import { Text, TouchableOpacity, View } from 'react-native';
import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Icono } from './Icono';
import { ui } from '../theme/styles';
import { colors } from '../theme/tokens';

interface PropsEncabezadoPantalla {
  title: string;
  /** Destino cuando no hay historial al que volver (por ejemplo, al abrir un enlace directo). */
  fallback: Href;
}

export function EncabezadoPantalla({ title, fallback }: PropsEncabezadoPantalla) {
  const goBack = () => (router.canGoBack() ? router.back() : router.replace(fallback));
  return (
    <View style={ui.navigation}>
      <TouchableOpacity onPress={goBack} style={ui.backButton} hitSlop={ui.backHitSlop}
        accessibilityRole="button" accessibilityLabel="Volver">
        <Icono icon={ChevronLeft} color={colors.text} />
      </TouchableOpacity>
      <Text style={ui.navigationTitle} accessibilityRole="header" numberOfLines={2}>{title}</Text>
    </View>
  );
}
