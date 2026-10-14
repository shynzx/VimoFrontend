import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GuideController } from '../controllers/GuideController';
import { Character, Enemy, Infrastructure } from '../types/models';

export const GuideScreen: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([]);
  const [activeTab, setActiveTab] = useState<'characters' | 'enemies' | 'infrastructure'>('characters');
  const guideController = new GuideController();

  const loadData = async () => {
    try {
      const [chars, enem, infra] = await Promise.all([
        guideController.getCharacters(),
        guideController.getEnemies(),
        guideController.getInfrastructure(),
      ]);
      setCharacters(chars);
      setEnemies(enem);
      setInfrastructure(infra);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderItem = (item: Character | Enemy | Infrastructure) => (
    <View style={styles.item} key={item.id}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemType}>Tipo: {(item as any).type || (item as any).role || ''}</Text>
      <Text style={styles.itemDesc}>{item.description}</Text>
      <Text style={styles.itemLore}>{item.lore}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Guía de Personajes</Text>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'characters' && styles.activeTab]}
          onPress={() => setActiveTab('characters')}
        >
          <Text style={styles.tabText}>Personajes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'enemies' && styles.activeTab]}
          onPress={() => setActiveTab('enemies')}
        >
          <Text style={styles.tabText}>Enemigos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'infrastructure' && styles.activeTab]}
          onPress={() => setActiveTab('infrastructure')}
        >
          <Text style={styles.tabText}>Infraestructura</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {activeTab === 'characters' && characters.map(renderItem)}
        {activeTab === 'enemies' && enemies.map(renderItem)}
        {activeTab === 'infrastructure' && infrastructure.map(renderItem)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  itemLore: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
});
