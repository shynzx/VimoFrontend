import { AppButton } from '../components/AppButton';
import { colors } from '../theme/tokens';
import { ui } from '../theme/styles';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Keyboard,
} from 'react-native';
import { CardsController } from '../controllers/CardsController';
import { Card } from '../types/models';
import { CatalogResult } from '../types/catalog';
import { CatalogNotice } from '../components/CatalogNotice';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CardsScreen: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'id' | 'text'>('id');
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<CatalogResult<Card>['source'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const cardsController = useMemo(() => new CardsController(), []);
  const latestRequestIdRef = useRef(0);

  const executeSearch = useCallback(
    async (searchTerm: string, force = false) => {
      const requestId = ++latestRequestIdRef.current;
      if (searchMode === 'id' && searchTerm && !/^[0-9]{4}$/.test(searchTerm.trim())) {
        setError('Escribe el ID completo de 4 dígitos, por ejemplo 0001.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const results = searchTerm.trim()
          ? await cardsController.searchCards(searchTerm.trim(), force)
          : await cardsController.getAllCards(force);

        if (requestId === latestRequestIdRef.current) {
          setCards(results.data);
          setSource(results.source);
          if (searchMode === 'id' && searchTerm.trim() && results.data.length === 1) {
            Keyboard.dismiss();
            setSelectedCard(results.data[0]);
          }
        }
      } catch (err: unknown) {
        if (requestId === latestRequestIdRef.current) {
          const message = err instanceof Error ? err.message : 'Error al buscar cartas';
          setError(message);
        }
      } finally {
        if (requestId === latestRequestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [cardsController, searchMode]
  );

  useEffect(() => {
    let isCancelled = false;
    const requestId = ++latestRequestIdRef.current;

    const loadInitialCards = async () => {
      try {
        const initialCards = await cardsController.getAllCards();
        if (!isCancelled && requestId === latestRequestIdRef.current) {
          setCards(initialCards.data);
          setSource(initialCards.source);
        }
      } catch (err: unknown) {
        if (!isCancelled && requestId === latestRequestIdRef.current) {
          const message = err instanceof Error ? err.message : 'Error al cargar cartas iniciales';
          setError(message);
        }
      } finally {
        if (!isCancelled && requestId === latestRequestIdRef.current) setLoading(false);
      }
    };

    loadInitialCards();

    return () => {
      isCancelled = true;
      latestRequestIdRef.current += 1;
    };
  }, [cardsController]);

  const handleSearchPress = () => {
    executeSearch(query);
  };

  const handleRetry = () => {
    executeSearch(query, true);
  };

  const handleClearQuery = () => {
    setQuery('');
    executeSearch('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.title} accessibilityRole="header">
        Base de datos de cartas
      </Text>

      <Text style={ui.intro}>Consulta en el celular el potenciador que estás viendo en tu partida de PC.</Text>
      <View style={ui.tabs}>
        {(['id', 'text'] as const).map((mode) => (
          <TouchableOpacity key={mode} accessibilityRole="button" accessibilityState={{ selected: searchMode === mode }}
            style={[ui.tab, searchMode === mode && ui.activeTab]}
            onPress={() => {
              latestRequestIdRef.current++;
              setSearchMode(mode); setQuery(''); setError(null); setLoading(false); setCards([]);
            }}>
            <Text style={[ui.tabText, searchMode === mode && ui.activeTabText]}>{mode === 'id' ? 'ID de 4 dígitos' : 'Buscar por texto'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchRow}>
        <TextInput
          key={searchMode}
          style={styles.input}
          placeholder={searchMode === 'id' ? 'ID del juego: 0001' : 'Nombre, efecto, tipo o etiqueta...'}
          keyboardType={searchMode === 'id' ? 'number-pad' : 'default'}
          maxLength={searchMode === 'id' ? 4 : 200}
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearchPress}
          returnKeyType="search"
          accessibilityLabel={searchMode === 'id' ? 'ID de la carta de 4 dígitos' : 'Campo de búsqueda de cartas por texto'}
        />
        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearQuery}
            accessibilityLabel="Limpiar texto de búsqueda"
            accessibilityRole="button"
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <AppButton title="Buscar" onPress={handleSearchPress} disabled={loading} style={ui.actionSpacing} accessibilityLabel="Buscar cartas" />

      <AppButton title="Actualizar catálogo" variant="secondary" onPress={handleRetry} disabled={loading} style={ui.actionSpacing} />
      <CatalogNotice source={source} />

      {error ? (
        <View style={styles.errorContainer} accessibilityRole="alert">
          <Text style={styles.errorText}>{error}</Text>
          <AppButton title="Reintentar" variant="danger" onPress={handleRetry} />
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingContainer} accessibilityLabel="Cargando cartas">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando cartas...</Text>
        </View>
      ) : (
        <FlatList
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          data={cards}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>{query ? 'Sin resultados' : 'Consulta una carta'}</Text>
              <Text style={styles.emptySubtitle}>
                {query ? `No se encontraron cartas para "${query}".` : 'Introduce el ID que aparece en PC o utiliza la búsqueda por texto.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedCard(item)}
              accessibilityRole="button"
              accessibilityLabel={`Carta ${item.name}, costo ${item.cost}, tipo ${item.type}`}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>{item.name}</Text>
                {item.rarity ? <Text style={styles.cardRarity}>{item.rarity}</Text> : null}
              </View>
              {item.gameId && <Text style={styles.cardDetails}>ID: {item.gameId}</Text>}
              <Text style={styles.cardDetails}>
                Tipo: {item.type} | Costo: {item.cost}
              </Text>
              <Text style={styles.cardEffect}>{item.effect}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
              {item.tags && item.tags.length > 0 ? (
                <View style={styles.tagsContainer}>
                  {item.tags.map((tag) => (
                    <View key={tag} style={styles.tagBadge}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </TouchableOpacity>
          )}
          refreshing={loading}
          onRefresh={handleRetry}
        />
      )}

      {/* Modal de Detalle de Carta */}
      <Modal
        visible={!!selectedCard}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCard(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCard && (
              <ScrollView>
                <View style={styles.cardHeader}>
                  <Text style={styles.modalTitle}>{selectedCard.name}</Text>
                  {selectedCard.rarity ? <Text style={styles.cardRarity}>{selectedCard.rarity}</Text> : null}
                </View>
                {selectedCard.gameId && <Text style={styles.modalSubtitle}>ID del juego: {selectedCard.gameId}</Text>}
                <Text style={styles.modalSubtitle}>
                  Tipo: {selectedCard.type} | Costo de energía: {selectedCard.cost}
                </Text>

                <Text style={styles.sectionHeader}>Efecto</Text>
                <Text style={styles.modalEffect}>{selectedCard.effect}</Text>

                <Text style={styles.sectionHeader}>Descripción detallada</Text>
                <Text style={styles.modalDesc}>{selectedCard.description}</Text>

                {selectedCard.tags && selectedCard.tags.length > 0 ? (
                  <>
                    <Text style={styles.sectionHeader}>Etiquetas</Text>
                    <View style={styles.tagsContainer}>
                      {selectedCard.tags.map((tag) => (
                        <View key={tag} style={styles.tagBadge}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                ) : null}

                <AppButton title="Cerrar" onPress={() => setSelectedCard(null)} style={ui.closeSpacing} accessibilityLabel="Cerrar detalle de carta" />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: ui.screen,
  title: ui.title,
  searchRow: ui.searchRow,
  input: ui.input,
  clearButton: ui.clearButton,
  clearButtonText: ui.clearText,
  errorContainer: ui.errorContainer,
  errorText: ui.errorText,
  loadingContainer: ui.loading,
  loadingText: ui.caption,
  emptyContainer: ui.empty,
  emptyTitle: ui.heading,
  emptySubtitle: ui.emptyText,
  card: ui.listItem,
  cardHeader: ui.row,
  cardName: ui.heading,
  cardRarity: ui.badge,
  cardDetails: ui.caption,
  cardEffect: ui.effect,
  cardDesc: ui.description,
  tagsContainer: ui.tags,
  tagBadge: ui.tag,
  tagText: ui.tagText,
  modalOverlay: ui.overlay,
  modalContent: ui.modal,
  modalTitle: ui.heading,
  modalSubtitle: ui.caption,
  sectionHeader: ui.sectionHeading,
  modalEffect: ui.effect,
  modalDesc: ui.body,
};
