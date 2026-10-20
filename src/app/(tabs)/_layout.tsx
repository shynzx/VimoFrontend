import { Tabs } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { BookOpen, House, Layers } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import type { ColorValue } from 'react-native';
import { Icon } from '../../components/Icon';
import { colors, sizes, typography } from '../../theme/tokens';

const tabIcon = (icon: LucideIcon) => function TabIcon({ color }: { color: ColorValue }) {
  // La barra entrega los colores de screenOptions, que son cadenas.
  return <Icon icon={icon} size={sizes.tabIcon} color={color as string} />;
};

// Figma: "Main navigation", 66 de alto con borde superior rojo.
export default function TabsLayout() {
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
      <Tabs.Screen name="home" options={{ title: 'Inicio', tabBarIcon: tabIcon(House) }} />
      <Tabs.Screen name="cards" options={{ title: 'Cartas', tabBarIcon: tabIcon(Layers) }} />
      <Tabs.Screen name="guide" options={{ title: 'Lore', tabBarIcon: tabIcon(BookOpen) }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.surface, borderTopColor: colors.primary, borderTopWidth: 1, minHeight: 66, paddingTop: 8 },
});
