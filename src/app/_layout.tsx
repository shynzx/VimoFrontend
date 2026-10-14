import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: 'VIMO',
        tabBarActiveTintColor: '#4CAF50',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Cartas',
          tabBarIcon: ({ color, size }) => <Ionicons name="card-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Guía',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
