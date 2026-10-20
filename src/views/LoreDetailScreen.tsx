import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight } from 'lucide-react-native';
import { AppButton } from '../components/AppButton';
import { CatalogNotice } from '../components/CatalogNotice';
import { Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { loreIcons } from '../components/catalogIcons';
import { CardsController } from '../controllers/CardsController';
import { GuideController } from '../controllers/GuideController';
import { useCatalog } from '../hooks/useCatalog';
import { isLoreKind, LoreKind } from '../models/LoreEntry';
import { ui } from '../theme/styles';
import { colors, radius, spacing, typography } from '../theme/tokens';

const controller = new GuideController();
const cardsController = new CardsController();
const loadCards = (force: boolean) => cardsController.getAllCards(force);

// Figma 05 · Perfil del archivo de lore. Sin retratos ni "poder táctico" en el catálogo:
// el recuadro del retrato muestra un icono del tipo de registro y se omite el medidor.
export function LoreDetailScreen({ kind, id }: { kind: string; id: string }) {
  const validKind: LoreKind = isLoreKind(kind) ? kind : 'characters';
  const load = useCallback((force: boolean) => controller.getEntries(validKind, force), [validKind]);
  const { result, error, loading, reload } = useCatalog(load);
  const entry = isLoreKind(kind) ? result?.data.find((item) => item.id === id) : undefined;
  // Solo para mostrar el nombre de las cartas relacionadas; si falla, se muestra su ID.
  const cards = useCatalog(loadCards).result?.data ?? [];
  const cardName = (cardId: string) => cards.find((card) => card.id === cardId)?.name;

  return (
    <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Archivo de lore" fallback="/guide" />
      <ScrollView contentContainerStyle={styles.content}>
        <CatalogNotice source={result?.source ?? null} />
        {loading && !entry && <ActivityIndicator style={ui.loading} color={colors.primary} accessibilityLabel="Cargando registro" />}
        {error && !entry && (
          <View style={styles.message}>
            <Text style={ui.errorText} accessibilityRole="alert">{error}</Text>
            <AppButton title="Reintentar" variant="secondary" onPress={() => void reload()} />
          </View>
        )}
        {!loading && !error && !entry && <Text style={ui.emptyText}>Registro no encontrado en el archivo.</Text>}

        {entry && (
          <>
            <View style={styles.portrait}>
              <View style={styles.watermark} accessible={false}>
                <Icon icon={loreIcons[entry.kind]} size={140} color={colors.border} />
              </View>
              <LinearGradient colors={['rgba(7, 15, 29, 0)', 'rgba(7, 15, 29, 0)', 'rgba(7, 15, 29, 0.96)']}
                locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
              <View style={ui.badge}>
                <Text style={ui.label}>{entry.badge}</Text>
              </View>
              <View style={styles.name}>
                <Text style={styles.title} accessibilityRole="header">{entry.name}</Text>
                <Text style={styles.subtitle}>{entry.subtitle}</Text>
              </View>
            </View>

            {entry.sections.map((section) => (
              <View key={section.label} style={ui.section}>
                <Text style={ui.label}>{section.label}</Text>
                <Text style={ui.copy}>{section.text}</Text>
              </View>
            ))}

            {entry.relatedCards.length > 0 && (
              <View style={ui.section}>
                <Text style={ui.label}>{entry.relatedLabel}</Text>
                {entry.relatedCards.map((cardId) => (
                  <TouchableOpacity key={cardId} style={styles.related} accessibilityRole="link"
                    accessibilityLabel={`Abrir carta ${cardName(cardId) ?? cardId}`}
                    onPress={() => router.navigate({ pathname: '/cards/[id]', params: { id: cardId } })}>
                    <View style={styles.relatedText}>
                      <Text style={ui.body}>{cardName(cardId) ?? cardId}</Text>
                      {cardName(cardId) && <Text style={ui.label}>{cardId}</Text>}
                    </View>
                    <Icon icon={ArrowUpRight} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { gap: 15, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.lg },
  message: { gap: spacing.md },
  portrait: {
    height: 230, borderRadius: radius.lg, backgroundColor: colors.surface, padding: 18,
    justifyContent: 'space-between', overflow: 'hidden',
  },
  watermark: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  name: { gap: spacing.xxs },
  title: { ...typography.display, fontSize: 34, lineHeight: 36, color: colors.text, textTransform: 'uppercase' },
  subtitle: { ...typography.fine, color: colors.textSecondary },
  related: {
    minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.md,
  },
  relatedText: { flex: 1, gap: 2, paddingVertical: spacing.sm },
});
