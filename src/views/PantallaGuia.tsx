import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight } from 'lucide-react-native';
import { BotonApp } from '../components/BotonApp';
import { AvisoCatalogo } from '../components/AvisoCatalogo';
import { Icono } from '../components/Icono';
import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { ControladorGuia } from '../controllers/ControladorGuia';
import { useCatalogo } from '../hooks/useCatalogo';
import { TIPOS_LORE, EntradaLore, TipoLore } from '../models/EntradaLore';
import { ui } from '../theme/styles';
import { colors, spacing, typography } from '../theme/tokens';

const controller = new ControladorGuia();

// Archivo de lore: el Figma solo define el perfil (05); la lista usa el mismo sistema visual.
export function PantallaGuia() {
  const [tipo, setTipo] = useState<TipoLore>('personajes');
  const load = useCallback((force: boolean) => controller.obtenerEntradas(tipo, force), [tipo]);
  const { result, error, loading, reload } = useCatalogo(load);

  const open = (entry: EntradaLore) => router.push({ pathname: '/guia/[tipo]/[id]', params: { tipo: entry.tipo, id: entry.id } });

  return (
    <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
      <EncabezadoPantalla title="Archivo de lore" fallback="/inicio" />
      <FlatList
        data={loading ? [] : result?.datos ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={(
          <View style={styles.header}>
            <View style={ui.tabs} accessibilityRole="tablist">
              {TIPOS_LORE.map((item) => {
                const selected = item.tipo === tipo;
                return (
                  <TouchableOpacity key={item.tipo} style={[ui.tab, selected && ui.activeTab]} onPress={() => setTipo(item.tipo)}
                    accessibilityRole="tab" accessibilityState={{ selected }}>
                    <Text style={[ui.tabText, selected && ui.activeTabText]}>{item.etiqueta}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <AvisoCatalogo source={result?.origen ?? null} />
            {loading && <ActivityIndicator style={ui.loading} color={colors.primary} accessibilityLabel="Cargando archivo" />}
            {error && !loading && (
              <View style={styles.header}>
                <Text style={ui.errorText} accessibilityRole="alert">{error}</Text>
                <BotonApp title="Reintentar" variant="secondary" onPress={() => void reload()} />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={!loading && !error ? <Text style={ui.emptyText}>No hay registros en esta sección.</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity style={ui.listItem} onPress={() => open(item)} accessibilityRole="link"
            accessibilityLabel={`${item.nombre}. ${item.subtitulo}`}>
            <View style={ui.spaceBetween}>
              <Text style={[ui.label, styles.badge]} numberOfLines={1}>{item.insignia}</Text>
              <Icono icon={ArrowUpRight} />
            </View>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={ui.caption} numberOfLines={1}>{item.subtitulo}</Text>
            <Text style={ui.copy} numberOfLines={2}>{item.resumen}</Text>
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
