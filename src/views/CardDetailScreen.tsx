import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Layers, Zap } from 'lucide-react-native';
import { AppButton } from '../components/AppButton';
import { CatalogNotice } from '../components/CatalogNotice';
import { Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { categoryIcon } from '../components/catalogIcons';
import { CardsController } from '../controllers/CardsController';
import { useCatalog } from '../hooks/useCatalog';
import { ui } from '../theme/styles';
import { colors, radius, spacing, typography } from '../theme/tokens';

const controller = new CardsController();
const loadCards = (force: boolean) => controller.getAllCards(force);

// Figma 04 · Detalle de carta. El catálogo no tiene ilustraciones ni duración: el recuadro de la
// ilustración muestra el emblema de la categoría y las estadísticas muestran el efecto por nivel.
export function CardDetailScreen({ id }: { id: string }) {
  const { result, error, loading, reload } = useCatalog(loadCards);
  const card = result?.data.find((item) => item.id === id);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/cards'));

  return (
    <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
      <ScreenHeader title={card?.gameId ? `Resultado / ${card.gameId}` : 'Resultado'} fallback="/cards" />
      <ScrollView contentContainerStyle={styles.content}>
        <CatalogNotice source={result?.source ?? null} />
        {loading && !card && <ActivityIndicator style={ui.loading} color={colors.primary} accessibilityLabel="Cargando carta" />}
        {error && !card && (
          <View style={styles.message}>
            <Text style={ui.errorText} accessibilityRole="alert">{error}</Text>
            <AppButton title="Reintentar" variant="secondary" onPress={() => void reload()} />
          </View>
        )}
        {!loading && !error && !card && <Text style={ui.emptyText}>Carta no encontrada en el catálogo.</Text>}

        {card && (
          <>
            <View style={styles.identity}>
              <View style={ui.spaceBetween}>
                <Text style={ui.label}>{card.gameId ? `Código ${card.gameId}` : card.id}</Text>
                <Text style={ui.label}>{card.category}{card.maxLevel ? ` / Máx. ${card.maxLevel}` : ''}</Text>
              </View>
              <Text style={ui.display} accessibilityRole="header">{card.name}</Text>
            </View>

            <View style={styles.illustration} accessible={false}>
              <View style={styles.watermark}>
                <Icon icon={categoryIcon(card.category)} size={120} color={colors.border} />
              </View>
              <LinearGradient colors={['rgba(7, 15, 29, 0.13)', 'rgba(7, 15, 29, 0)', 'rgba(7, 15, 29, 0.9)']}
                locations={[0, 0.65, 1]} style={StyleSheet.absoluteFill} />
              <View style={styles.emblem}>
                <Icon icon={categoryIcon(card.category)} />
              </View>
              <Text style={ui.label}>{card.id}</Text>
            </View>

            <View style={ui.highlight}>
              <View style={styles.statRow}>
                <Icon icon={Zap} />
                <Text style={styles.effect}>{card.effect}</Text>
              </View>
              {card.maxLevel != null && (
                <View style={styles.statRow}>
                  <Icon icon={Layers} size={18} />
                  <Text style={styles.stat}>Nivel máximo: {card.maxLevel} · cada nivel se suma al anterior.</Text>
                </View>
              )}
            </View>

            {card.availability && (
              <View style={styles.lore}>
                <Text style={ui.label}>Disponibilidad</Text>
                <Text style={ui.copy}>{card.availability}</Text>
              </View>
            )}
          </>
        )}

        <AppButton title="Volver" direction="back" onPress={back} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: 18 },
  message: { gap: spacing.md },
  identity: { gap: spacing.sm },
  illustration: {
    height: 238, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    padding: spacing.lg, justifyContent: 'space-between', overflow: 'hidden',
  },
  watermark: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  emblem: {
    width: 38, height: 38, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.primary,
    backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  effect: { ...typography.heading, fontSize: 22, lineHeight: 26, color: colors.primary, flex: 1 },
  stat: { ...typography.body, fontFamily: typography.key.fontFamily, color: colors.text, flex: 1 },
  lore: { gap: spacing.xs },
});
