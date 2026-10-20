import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight } from 'lucide-react-native';
import { AppButton } from '../components/AppButton';
import { CatalogNotice } from '../components/CatalogNotice';
import { Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { GuideController } from '../controllers/GuideController';
import { useCatalog } from '../hooks/useCatalog';
import { LORE_KINDS, LoreEntry, LoreKind } from '../models/LoreEntry';
import { ui } from '../theme/styles';
import { colors, spacing, typography } from '../theme/tokens';

const controller = new GuideController();

// Archivo de lore: el Figma solo define el perfil (05); la lista usa el mismo sistema visual.
export function GuideScreen() {
  const [kind, setKind] = useState<LoreKind>('characters');
  const load = useCallback((force: boolean) => controller.getEntries(kind, force), [kind]);
  const { result, error, loading, reload } = useCatalog(load);

  const open = (entry: LoreEntry) => router.push({ pathname: '/guide/[kind]/[id]', params: { kind: entry.kind, id: entry.id } });

  return (
    <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Archivo de lore" fallback="/home" />
      <FlatList
        data={loading ? [] : result?.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={(
          <View style={styles.header}>
            <View style={ui.tabs} accessibilityRole="tablist">
              {LORE_KINDS.map((item) => {
                const selected = item.kind === kind;
                return (
                  <TouchableOpacity key={item.kind} style={[ui.tab, selected && ui.activeTab]} onPress={() => setKind(item.kind)}
                    accessibilityRole="tab" accessibilityState={{ selected }}>
                    <Text style={[ui.tabText, selected && ui.activeTabText]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <CatalogNotice source={result?.source ?? null} />
            {loading && <ActivityIndicator style={ui.loading} color={colors.primary} accessibilityLabel="Cargando archivo" />}
            {error && !loading && (
              <View style={styles.header}>
                <Text style={ui.errorText} accessibilityRole="alert">{error}</Text>
                <AppButton title="Reintentar" variant="secondary" onPress={() => void reload()} />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={!loading && !error ? <Text style={ui.emptyText}>No hay registros en esta sección.</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity style={ui.listItem} onPress={() => open(item)} accessibilityRole="link"
            accessibilityLabel={`${item.name}. ${item.subtitle}`}>
            <View style={ui.spaceBetween}>
              <Text style={[ui.label, styles.badge]} numberOfLines={1}>{item.badge}</Text>
              <Icon icon={ArrowUpRight} />
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={ui.caption} numberOfLines={1}>{item.subtitle}</Text>
            <Text style={ui.copy} numberOfLines={2}>{item.summary}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl },
  header: { gap: spacing.md },
  badge: { flexShrink: 1 },
  name: { ...typography.heading, fontSize: 22, lineHeight: 24, color: colors.text, textTransform: 'uppercase' },
});
