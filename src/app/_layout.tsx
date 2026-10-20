import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { colors, typography } from '../theme/tokens';
import { ui } from '../theme/styles';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: 'VIMO',
        headerTintColor: colors.primary,
        headerStyle: ui.navigationBar,
        headerTitleStyle: typography.heading,
        tabBarStyle: ui.navigationBar,
        tabBarLabelStyle: typography.caption,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        sceneStyle: ui.scene,
      }}
    >
      <Tabs.Screen name="card/[id]" options={{ href: null, title: 'Detalle de carta' }} />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cartas',
          tabBarIcon: ({ color, size }) => <Ionicons name="card-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Archivos lore',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
