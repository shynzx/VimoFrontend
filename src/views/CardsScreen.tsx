import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { CardsController } from '../controllers/CardsController';
import { Card } from '../types/models';

export const CardsScreen: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const cardsController = new CardsController();

  const loadCards = async () => {
    setLoading(true);
    try {
      const results = query ? await cardsController.searchCards(query) : await cardsController.getAllCards();
      setCards(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscador de Cartas</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar cartas..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={loadCards}
      />
      <TouchableOpacity style={styles.button} onPress={loadCards}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardDetails}>Tipo: {item.type} | Costo: {item.cost}</Text>
            <Text style={styles.cardEffect}>{item.effect}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
        )}
        refreshing={loading}
        onRefresh={loadCards}
      />
    </View>
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
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardEffect: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#333',
  },
});
