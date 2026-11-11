import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ControladorCartas } from '../controllers/ControladorCartas';
import { normalizarBusqueda } from '../services/ServicioApi';
import { useCatalogo } from '../hooks/useCatalogo';
import { AvisoCatalogo } from '../components/AvisoCatalogo';
import { BotonApp } from '../components/BotonApp';
import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { EstadoConsulta } from '../components/EstadoConsulta';
import { IconoCarta } from '../components/IconoCarta';
import { ui } from '../theme/styles';
import { colors, fonts, spacing, typography } from '../theme/tokens';
const load = (force: boolean) => new ControladorCartas().obtenerTodasLasCartas(force);

// Figma · Cartas de mejora. El botón ELEGIR del juego se adapta a consulta de detalles.
export function PantallaCatalogoCartas() {
  const state = useCatalogo(load);
  const [category, setCategory] = useState('Todas');
  const [query, setQuery] = useState('');
  const q = normalizarBusqueda(query);
  const categories = ['Todas', ...new Set(state.result?.datos.map((c) => c.categoria))];
  const cards = state.result?.datos.filter((c) => (category === 'Todas' || c.categoria === category)
    && (q.match(/^\d+$/) ? c.codigoJuego === q : q.match(/^car-\d{3}$/) ? c.id.toLowerCase() === q
      : normalizarBusqueda([c.nombre, c.categoria, c.efecto].join(' ')).includes(q))) ?? [];
  return <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
    <EncabezadoPantalla title="Cartas de mejora" fallback="/inicio" />
    <FlatList data={state.loading ? [] : cards} keyExtractor={(c) => c.id} numColumns={2} columnWrapperStyle={styles.columns}
      contentContainerStyle={ui.scrollContent} keyboardShouldPersistTaps="handled"
      ListHeaderComponent={<View style={styles.header}>
        <Text style={ui.label}>Arsenal / Mejoras del despliegue</Text><Text style={ui.title} accessibilityRole="header">Cartas de mejora</Text>
        <Text style={ui.description}>Explora sus efectos por nivel. Consulta una carta para preparar tu siguiente elección.</Text>
        <TextInput style={styles.search} value={query} onChangeText={setQuery} accessibilityLabel="Buscar cartas por nombre, efecto o código"
          placeholder="Nombre, efecto o código (0013)…" placeholderTextColor={colors.muted} autoCorrect={false} />
        <BotonApp title="Teclado de códigos" variant="secondary" onPress={() => router.push('/cartas/codigo')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {categories.map((c) => <TouchableOpacity key={c} style={[styles.chip, c === category && ui.activeTab]} onPress={() => setCategory(c)}
            accessibilityRole="button" accessibilityState={{ selected: c === category }}><Text style={[ui.tabText, c === category && ui.activeTabText]}>{c}</Text></TouchableOpacity>)}
        </ScrollView>
        <AvisoCatalogo source={state.result?.origen ?? null} /><EstadoConsulta loading={state.loading} error={state.error} reload={state.reload} />
        {state.result && <Text style={ui.fine}>{cards.length} cartas / {category}</Text>}
      </View>}
      ListEmptyComponent={!state.loading && !state.error ? <Text style={ui.emptyText}>No hay cartas para esta búsqueda.</Text> : undefined}
      renderItem={({ item }) => <TouchableOpacity style={styles.card} accessibilityRole="link" accessibilityLabel={`${item.nombre}. ${item.efecto}. Nivel máximo ${item.nivelMaximo ?? 'sin definir'}.`}
        onPress={() => router.push({ pathname: '/cartas/[id]', params: { id: item.id } })}>
        <IconoCarta id={item.id} />
        <Text style={styles.category}>{item.categoria}</Text>
        <Text style={styles.name}>{item.nombre}</Text>
        <Text style={styles.level}>Máx. {item.nivelMaximo ?? '—'} / {item.codigoJuego ?? item.id}</Text>
        <Text style={styles.effect}>{item.efecto}</Text>
        <View style={styles.read}><Text style={styles.readLabel}>CONSULTAR</Text></View>
      </TouchableOpacity>} />
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  header: { gap: spacing.lg },
  columns: { gap: spacing.md },
  categories: { gap: spacing.sm },
  chip: { minHeight: 48, justifyContent: 'center', paddingHorizontal: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  search: { ...typography.body, color: colors.text, minHeight: 48, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, backgroundColor: colors.surface },
  card: { flex: 1, maxWidth: '50%', minHeight: 328, alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm,
    borderRadius: 3, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  category: { fontFamily: fonts.bodySemiBold, fontSize: 8, color: colors.primary, textTransform: 'uppercase', textAlign: 'center' },
  name: { fontFamily: fonts.display, fontSize: 17, lineHeight: 22, color: colors.text, textAlign: 'center' },
  level: { fontFamily: fonts.body, fontSize: 9, lineHeight: 14, color: colors.muted, textTransform: 'uppercase', textAlign: 'center' },
  effect: { ...typography.caption, textAlign: 'center', color: colors.textSecondary },
  read: { minHeight: 36, width: '100%', borderColor: colors.border, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  readLabel: { fontFamily: fonts.bodySemiBold, color: colors.textSecondary, fontSize: 10 },
});
