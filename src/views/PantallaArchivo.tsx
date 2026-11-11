import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight } from 'lucide-react-native';
import { ServicioApi, normalizarBusqueda } from '../services/ServicioApi';
import { useCatalogo } from '../hooks/useCatalogo';
import { AvisoCatalogo } from '../components/AvisoCatalogo';
import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { EstadoConsulta } from '../components/EstadoConsulta';
import { Icono } from '../components/Icono';
import { ui } from '../theme/styles';
import { colors, spacing, typography } from '../theme/tokens';

const load = (force: boolean) => ServicioApi.obtenerInstancia().obtenerRegistros(force);
export function PantallaArchivo() {
  const state = useCatalogo(load);
  const [query, setQuery] = useState('');
  const [issac, setIssac] = useState(false);
  const q = normalizarBusqueda(query);
  const rows = state.result?.datos.filter((r) => (!issac || r.relacionadoConIssac)
    && normalizarBusqueda([r.nombre, r.rol, r.ubicacion, r.resumen, r.texto].join(' ')).includes(q)) ?? [];
  return <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
    <EncabezadoPantalla title="Archivo del jugador" fallback="/inicio" />
    <FlatList data={state.loading ? [] : rows} keyExtractor={(r) => r.id} contentContainerStyle={ui.scrollContent} keyboardShouldPersistTaps="handled"
      ListHeaderComponent={<View style={styles.header}>
        <Text style={ui.label}>Testimonios de la Operación Umbral</Text>
        <Text style={ui.title} accessibilityRole="header">Archivo</Text>
        <Text style={ui.description}>Voces de los operativos que llegaron antes de Eco-10. Los registros revelan la historia del complejo.</Text>
        <TextInput value={query} onChangeText={setQuery} style={styles.search} placeholder="Buscar autor, sector o contenido…" placeholderTextColor={colors.muted}
          accessibilityLabel="Buscar registros del archivo" autoCorrect={false} />
        <View style={ui.tabs} accessibilityRole="tablist">
          {[false, true].map((value) => <TouchableOpacity key={String(value)} style={[ui.tab, issac === value && ui.activeTab]}
            accessibilityRole="tab" accessibilityState={{ selected: issac === value }} onPress={() => setIssac(value)}>
            <Text style={[ui.tabText, issac === value && ui.activeTabText]}>{value ? 'Peticiones de Issac' : 'Todos los registros'}</Text>
          </TouchableOpacity>)}
        </View>
        <AvisoCatalogo source={state.result?.origen ?? null} />
        <EstadoConsulta loading={state.loading} error={state.error} reload={state.reload} />
        {state.result && <Text style={ui.fine}>{rows.length} de {state.result.datos.length} registros · Consulta de la guía</Text>}
      </View>}
      ListEmptyComponent={!state.loading && !state.error ? <Text style={ui.emptyText}>No hay registros para esta búsqueda.</Text> : undefined}
      renderItem={({ item }) => <TouchableOpacity style={ui.listItem} accessibilityRole="link" accessibilityLabel={`${item.nombre}, ${item.rol}, ${item.ubicacion}`}
        onPress={() => router.push({ pathname: '/archivo/[id]', params: { id: item.id } })}>
        <View style={ui.spaceBetween}><Text style={ui.label}>{String(item.numero).padStart(2, '0')} / {item.ubicacion}</Text><Icono icon={ArrowUpRight} size={18} /></View>
        <Text style={ui.heading}>{item.nombre}</Text><Text style={ui.caption}>{item.rol}</Text><Text style={ui.copy} numberOfLines={2}>{item.resumen}</Text>
        {item.relacionadoConIssac && <Text style={ui.label}>Vinculado a Issac</Text>}
      </TouchableOpacity>} />
  </SafeAreaView>;
}

export function PantallaDetalleRegistro({ id }: { id: string }) {
  const state = useCatalogo(load);
  const record = state.result?.datos.find((r) => r.id === id);
  return <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
    <EncabezadoPantalla title="Registro del archivo" fallback="/archivo" />
    <ScrollView contentContainerStyle={ui.scrollContent}><View style={styles.header}>
      <AvisoCatalogo source={state.result?.origen ?? null} /><EstadoConsulta loading={state.loading} error={state.error} reload={state.reload} />
      {!state.loading && !state.error && !record && <Text style={ui.emptyText}>Registro no encontrado.</Text>}
      {record && <>
        <Text style={ui.label}>Registro {String(record.numero).padStart(2, '0')} / {record.ubicacion}</Text>
        <Text style={ui.title} accessibilityRole="header">{record.nombre}</Text><Text style={ui.label}>{record.rol}</Text>
        <Text style={styles.transcript} selectable>«{record.texto}»</Text>
        <View style={ui.section}><Text style={ui.label}>Contexto del registro</Text><Text style={ui.copy}>{record.resumen}</Text></View>
        <View style={ui.section}><Text style={ui.label}>Su lugar en la historia</Text><Text style={ui.copy}>{record.funcionNarrativa}</Text></View>
        {record.relacionadoConIssac && <TouchableOpacity style={ui.highlight} accessibilityRole="link" onPress={() => router.push({ pathname: '/manual/[id]', params: { id: 'misiones-y-desafios' } })}>
          <Text style={ui.label}>Peticiones de Issac</Text><Text style={ui.copy}>Este registro interviene en la cadena opcional de Issac. Consultar las misiones.</Text>
        </TouchableOpacity>}
      </>}
    </View></ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  header: { gap: spacing.lg },
  search: { ...typography.body, color: colors.text, minHeight: 48, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, backgroundColor: colors.surface },
  transcript: { ...typography.body, fontSize: 18, lineHeight: 29, color: colors.text, borderLeftColor: colors.primary, borderLeftWidth: 2, paddingLeft: spacing.lg, marginVertical: spacing.lg },
});
