import { AppButton } from '../components/AppButton';
import { colors } from '../theme/tokens';
import { ui } from '../theme/styles';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardsController } from '../controllers/CardsController';
import { CatalogNotice } from '../components/CatalogNotice';
import { CatalogResult } from '../types/catalog';
import { Card } from '../types/models';

const controller = new CardsController();

export function CardDetailScreen({ id }: { id: string }) {
  const [result, setResult] = useState<CatalogResult<Card> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const requestRef = useRef(0);
  const mountedRef = useRef(true);
  const load = useCallback(async (force = false) => {
    const requestId = ++requestRef.current;
    try {
      const data = await controller.getAllCards(force);
      if (mountedRef.current && requestId === requestRef.current) { setResult(data); setError(null); }
    } catch (cause) {
      if (mountedRef.current && requestId === requestRef.current) setError(cause instanceof Error ? cause.message : 'No se pudo cargar la carta.');
    } finally {
      if (mountedRef.current && requestId === requestRef.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;
    const requestId = ++requestRef.current;
    controller.getAllCards().then((data) => {
      if (!cancelled && requestId === requestRef.current) setResult(data);
    }).catch((cause: unknown) => {
      if (!cancelled && requestId === requestRef.current) setError(cause instanceof Error ? cause.message : 'No se pudo cargar la carta.');
    }).finally(() => {
      if (!cancelled && requestId === requestRef.current) setLoading(false);
    });
    return () => { cancelled = true; mountedRef.current = false; };
  }, []);
  const card = result?.data.find((item) => item.id === id);
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppButton title="Volver" variant="secondary" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />
        <CatalogNotice source={result?.source || null} />
        {loading && <ActivityIndicator color={colors.primary} accessibilityLabel="Cargando carta" />}
        {error && <Text style={ui.errorText} accessibilityRole="alert">{error}</Text>}
        {!loading && !error && !card && <Text style={ui.emptyText}>Carta no encontrada en el catálogo.</Text>}
        {card && <View style={styles.card}>
          <Text style={styles.title} accessibilityRole="header">{card.name}</Text>
          {card.gameId && <Text style={ui.caption}>ID del juego: {card.gameId}</Text>}
          <Text style={ui.caption}>{card.type} · {card.rarity || 'Sin rareza registrada'}</Text>
          <Text style={ui.body}>Costo: {card.cost ?? 'No registrado'}</Text>
          <Text style={styles.heading}>Efecto</Text>
          <Text style={ui.effect}>{card.effect}</Text>
          <Text style={styles.heading}>Descripción</Text>
          <Text style={ui.body}>{card.description}</Text>
          {!!card.tags?.length && <Text style={styles.heading}>Etiquetas: {card.tags.join(', ')}</Text>}
        </View>}
        <AppButton title="Actualizar / Reintentar" disabled={loading} onPress={() => { setLoading(true); void load(true); }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: ui.screen,
  content: ui.scrollContent,
  card: ui.detailCard,
  title: ui.title,
  heading: ui.sectionHeading,
};
