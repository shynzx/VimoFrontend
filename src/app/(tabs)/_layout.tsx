import { Tabs } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { BookOpen, House, Layers } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import type { ColorValue } from 'react-native';
import { Icono } from '../../components/Icono';
import { colors, sizes, typography } from '../../theme/tokens';

const iconoPestana = (icon: LucideIcon) => function IconoPestana({ color }: { color: ColorValue }) {
  // La barra entrega los colores de screenOptions, que son cadenas.
  return <Icono icon={icon} size={sizes.tabIcon} color={color as string} />;
};

// Figma: "Main navigation", 66 de alto con borde superior rojo.
export default function DisenoPestanas() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: typography.tab,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="inicio" options={{ title: 'Inicio', tabBarIcon: iconoPestana(House) }} />
      <Tabs.Screen name="cartas" options={{ title: 'Cartas', tabBarIcon: iconoPestana(Layers) }} />
      <Tabs.Screen name="guia" options={{ title: 'Lore', tabBarIcon: iconoPestana(BookOpen) }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.surface, borderTopColor: colors.primary, borderTopWidth: 1, minHeight: 66, paddingTop: 8 },
});
