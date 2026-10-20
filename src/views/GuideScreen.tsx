import { AppButton } from '../components/AppButton';
import { colors } from '../theme/tokens';
import { ui } from '../theme/styles';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { GuideController } from '../controllers/GuideController';
import { Character, Enemy, Infrastructure } from '../types/models';
import { CatalogResult } from '../types/catalog';
import { CatalogNotice } from '../components/CatalogNotice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type GuideTab = 'characters' | 'enemies' | 'infrastructure';
type GuideItem = Character | Enemy | Infrastructure;

export const GuideScreen: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([]);
  const [activeTab, setActiveTab] = useState<GuideTab>('characters');
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<Partial<Record<GuideTab, CatalogResult<unknown>['source']>>>({});
  const requestRef = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GuideItem | null>(null);

  const guideController = useMemo(() => new GuideController(), []);

  const loadData = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const [chars, enem, infra] = await Promise.all([
        guideController.getCharacters(true),
        guideController.getEnemies(true),
        guideController.getInfrastructure(true),
      ]);
      if (requestId !== requestRef.current) return;
      setCharacters(chars.data);
      setEnemies(enem.data);
      setInfrastructure(infra.data);
      setSources({ characters: chars.source, enemies: enem.source, infrastructure: infra.source });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar los datos de la guía';
      if (requestId === requestRef.current) setError(message);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [guideController]);

  useEffect(() => {
    let isCancelled = false;
    const requestId = ++requestRef.current;

    const fetchInitialData = async () => {
      try {
        const [chars, enem, infra] = await Promise.all([
          guideController.getCharacters(),
          guideController.getEnemies(),
          guideController.getInfrastructure(),
        ]);
        if (!isCancelled && requestId === requestRef.current) {
          setCharacters(chars.data);
          setEnemies(enem.data);
          setInfrastructure(infra.data);
          setSources({ characters: chars.source, enemies: enem.source, infrastructure: infra.source });
        }
      } catch (err: unknown) {
        if (!isCancelled && requestId === requestRef.current) {
          const message = err instanceof Error ? err.message : 'Error al cargar la información';
          setError(message);
        }
      } finally {
        if (!isCancelled && requestId === requestRef.current) setLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      isCancelled = true;
      requestRef.current += 1;
    };
  }, [guideController]);

  const renderItem = (item: GuideItem) => {
    const roleOrType =
      'role' in item && item.role
        ? item.role
        : 'type' in item && item.type
        ? item.type
        : 'Elemento';

    return (
      <TouchableOpacity
        style={styles.item}
        key={item.id}
        onPress={() => setSelectedItem(item)}
        accessibilityRole="button"
        accessibilityLabel={`Elemento ${item.name}, ${roleOrType}`}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemBadge}>{roleOrType}</Text>
        </View>
        <Text style={styles.itemDesc} numberOfLines={2}>
          {item.description}
        </Text>
        {item.lore ? (
          <Text style={styles.itemLore} numberOfLines={2}>
            &ldquo;{item.lore}&rdquo;
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const getActiveList = (): GuideItem[] => {
    switch (activeTab) {
      case 'characters':
        return characters;
      case 'enemies':
        return enemies;
      case 'infrastructure':
        return infrastructure;
      default:
        return [];
    }
  };

  const activeItems = getActiveList();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.title} accessibilityRole="header">
        Archivos lore
      </Text>

      <View style={styles.tabs} accessibilityRole="tablist">
        <TouchableOpacity
          style={[styles.tab, activeTab === 'characters' && styles.activeTab]}
          onPress={() => setActiveTab('characters')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'characters' }}
        >
          <Text style={[styles.tabText, activeTab === 'characters' && styles.activeTabText]}>
            Personajes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'enemies' && styles.activeTab]}
          onPress={() => setActiveTab('enemies')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'enemies' }}
        >
          <Text style={[styles.tabText, activeTab === 'enemies' && styles.activeTabText]}>
            Enemigos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'infrastructure' && styles.activeTab]}
          onPress={() => setActiveTab('infrastructure')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'infrastructure' }}
        >
          <Text style={[styles.tabText, activeTab === 'infrastructure' && styles.activeTabText]}>
            Instalaciones
          </Text>
        </TouchableOpacity>
      </View>

      <AppButton title="Actualizar guía" variant="secondary" onPress={loadData} disabled={loading} style={ui.actionSpacing} />
      <CatalogNotice source={sources[activeTab] || null} />
      {error ? (
        <View style={styles.errorContainer} accessibilityRole="alert">
          <Text style={styles.errorText}>{error}</Text>
          <AppButton title="Reintentar" variant="danger" onPress={loadData} />
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      ) : (
        <FlatList
          style={styles.content}
          data={activeItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem(item)}
          refreshing={loading}
          onRefresh={loadData}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay registros disponibles en esta sección.</Text>
            </View>
          }
        />
      )}

      {/* Modal de Detalle */}
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <ScrollView>
                <View style={styles.itemHeader}>
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                  {'role' in selectedItem && selectedItem.role ? (
                    <Text style={styles.itemBadge}>{selectedItem.role}</Text>
                  ) : 'type' in selectedItem && selectedItem.type ? (
                    <Text style={styles.itemBadge}>{selectedItem.type}</Text>
                  ) : null}
                </View>

                {'difficulty' in selectedItem && selectedItem.difficulty ? (
                  <Text style={styles.difficultyText}>Dificultad: {selectedItem.difficulty}</Text>
                ) : null}

                {'location' in selectedItem && selectedItem.location ? (
                  <Text style={styles.locationText}>Ubicación: {selectedItem.location}</Text>
                ) : null}

                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.modalDescription}>{selectedItem.description}</Text>

                {selectedItem.lore ? (
                  <>
                    <Text style={styles.sectionTitle}>Historia / Trasfondo</Text>
                    <Text style={styles.modalLore}>&ldquo;{selectedItem.lore}&rdquo;</Text>
                  </>
                ) : null}

                {'relatedCards' in selectedItem &&
                selectedItem.relatedCards &&
                selectedItem.relatedCards.length > 0 ? (
                  <>
                    <Text style={styles.sectionTitle}>Cartas vinculadas</Text>
                    <View style={styles.tagsContainer}>
                      {selectedItem.relatedCards.map((cardId) => (
                        <TouchableOpacity key={cardId} style={[styles.tagBadge, ui.tagLink]}
                          accessibilityRole="link" accessibilityLabel={`Ver carta ${cardId}`}
                          onPress={() => {
                            setSelectedItem(null);
                            router.push({ pathname: '/card/[id]', params: { id: cardId } });
                          }}>
                          <Text style={styles.tagText}>Ver carta {cardId}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                ) : null}

                <AppButton title="Cerrar" onPress={() => setSelectedItem(null)} style={ui.closeSpacing} accessibilityLabel="Cerrar detalle" />
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
  tabs: ui.tabs,
  tab: ui.tab,
  activeTab: ui.activeTab,
  tabText: ui.tabText,
  activeTabText: ui.activeTabText,
  content: ui.flex,
  loadingContainer: ui.loading,
  loadingText: ui.caption,
  errorContainer: ui.errorContainer,
  errorText: ui.errorText,
  emptyContainer: ui.empty,
  emptyText: ui.emptyText,
  item: ui.listItem,
  itemHeader: ui.row,
  itemName: ui.heading,
  itemBadge: ui.badge,
  itemDesc: ui.body,
  itemLore: ui.lore,
  difficultyText: ui.caption,
  locationText: ui.caption,
  modalOverlay: ui.overlay,
  modalContent: ui.modal,
  modalTitle: ui.heading,
  sectionTitle: ui.sectionHeading,
  modalDescription: ui.body,
  modalLore: ui.lore,
  tagsContainer: ui.tags,
  tagBadge: ui.tag,
  tagText: ui.tagText,
};
