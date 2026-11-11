import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowUpRight } from 'lucide-react-native';
import { ServicioApi, normalizarBusqueda } from '../services/ServicioApi';
import { useCatalogo } from '../hooks/useCatalogo';
import { AvisoCatalogo } from '../components/AvisoCatalogo';
import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { EstadoConsulta } from '../components/EstadoConsulta';
import { Icono } from '../components/Icono';
import { ParticulasCreditos, VolverCreditos } from '../components/DecoracionCreditos';
import { ui } from '../theme/styles';
import { colors, spacing, typography } from '../theme/tokens';

const api = ServicioApi.obtenerInstancia();
type Section = 'manual' | 'vistas' | 'creditos';
export function PantallaManual() {
  const [section, setSection] = useState<Section>('manual');
  const [query, setQuery] = useState('');
  const load = useCallback((force: boolean) => section === 'manual' ? api.obtenerManual(force)
    : section === 'vistas' ? api.obtenerVistas(force) : api.obtenerCreditos(force), [section]);
  const state = useCatalogo<Awaited<ReturnType<typeof load>>['datos'][number]>(load);
  const q = normalizarBusqueda(query);
  const rows = state.result?.datos.filter((item) => normalizarBusqueda(Object.values(item).join(' ')).includes(q)) ?? [];

  return <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
    <EncabezadoPantalla title="Manual del jugador" fallback="/inicio" />
    <ScrollView contentContainerStyle={ui.scrollContent} keyboardShouldPersistTaps="handled">
      {section === 'creditos' && <ParticulasCreditos />}
      <Text style={ui.label}>{section === 'creditos' ? 'AfterLight' : 'Operación Umbral / Inteligencia de campo'}</Text>
      <Text style={ui.title} accessibilityRole="header">{section === 'creditos' ? 'Créditos' : 'Conoce el despliegue'}</Text>
      {section !== 'creditos' && <Text style={ui.description}>Mecánicas, controles, pantallas y estados de AfterLight. Consulta los desenlaces a tu ritmo: contienen revelaciones de la historia.</Text>}
      <View style={ui.tabs} accessibilityRole="tablist">
        {(['manual', 'vistas', 'creditos'] as const).map((s) => <TouchableOpacity key={s} onPress={() => { setSection(s); setQuery(''); }}
          style={[ui.tab, s === section && ui.activeTab]} accessibilityRole="tab" accessibilityState={{ selected: s === section }}>
          <Text style={[ui.tabText, s === section && ui.activeTabText]}>{s === 'manual' ? 'Manual' : s === 'vistas' ? 'Pantallas' : 'Créditos'}</Text>
        </TouchableOpacity>)}
      </View>
      {section !== 'creditos' && <TextInput style={styles.search} value={query} onChangeText={setQuery} placeholder="Buscar tema o palabra…"
        placeholderTextColor={colors.muted} accessibilityLabel="Buscar en el manual" autoCorrect={false} />}
      <AvisoCatalogo source={state.result?.origen ?? null} />
      <EstadoConsulta loading={state.loading} error={state.error} reload={state.reload} />
      {!state.loading && !state.error && rows.length === 0 && <Text style={ui.emptyText}>No hay resultados para esta búsqueda.</Text>}
      {!state.loading && rows.map((item) => {
        if ('rol' in item) return <View style={styles.credit} key={item.id}><Text style={styles.creditRole}>{item.rol}</Text><Text style={styles.creditName}>{item.nombre}</Text></View>;
        const chapter = 'contenido' in item;
        return <TouchableOpacity key={item.id} style={ui.listItem} accessibilityRole="link" accessibilityLabel={item.titulo}
          onPress={() => router.push(chapter ? { pathname: '/manual/[id]', params: { id: item.id } } : { pathname: '/manual/vista/[id]', params: { id: item.id } })}>
          <View style={ui.spaceBetween}><Text style={ui.label}>{item.categoria}</Text><Icono icon={ArrowUpRight} size={18} /></View>
          <Text style={ui.heading}>{item.titulo}</Text>
          {!chapter && <Text style={ui.copy} numberOfLines={2}>{item.descripcion}</Text>}
        </TouchableOpacity>;
      })}
      {section === 'creditos' && <VolverCreditos />}
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  search: { ...typography.body, color: colors.text, minHeight: 48, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, backgroundColor: colors.surface },
  credit: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl, borderBottomColor: colors.border, borderBottomWidth: 1 },
  creditName: { ...typography.heading, color: colors.text, textAlign: 'center' },
  creditRole: { ...typography.label, color: colors.muted, textAlign: 'center', textTransform: 'uppercase' },
});
