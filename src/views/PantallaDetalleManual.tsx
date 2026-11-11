import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServicioApi } from '../services/ServicioApi';
import { useCatalogo } from '../hooks/useCatalogo';
import { AvisoCatalogo } from '../components/AvisoCatalogo';
import { BotonApp } from '../components/BotonApp';
import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { EstadoConsulta } from '../components/EstadoConsulta';
import { TextoManual } from '../components/TextoManual';
import { ui } from '../theme/styles';
const api = ServicioApi.obtenerInstancia();
const loadChapters = (force: boolean) => api.obtenerManual(force);

export function PantallaDetalleManual({ id, vista = false }: { id: string; vista?: boolean }) {
  const load = useCallback((force: boolean) => vista ? api.obtenerVistas(force) : api.obtenerManual(force), [vista]);
  const state = useCatalogo<Awaited<ReturnType<typeof load>>['datos'][number]>(load);
  const chapters = useCatalogo(loadChapters).result?.datos ?? [];
  const entry = state.result?.datos.find((item) => item.id === id);
  return <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
    <EncabezadoPantalla title={vista ? 'Pantallas y estados' : 'Manual del jugador'} fallback="/manual" />
    <ScrollView contentContainerStyle={ui.scrollContent}>
      <AvisoCatalogo source={state.result?.origen ?? null} />
      <EstadoConsulta loading={state.loading} error={state.error} reload={state.reload} />
      {!state.loading && !state.error && !entry && <Text style={ui.emptyText}>Tema no encontrado.</Text>}
      {entry && <>
        <Text style={ui.label}>{entry.categoria}</Text><Text style={ui.title} accessibilityRole="header">{entry.titulo}</Text>
        {'contenido' in entry ? <TextoManual contenido={entry.contenido} /> : <>
          <Text style={ui.body}>{entry.descripcion}</Text>
          <View style={ui.section}>{entry.capituloIds.length > 0 && <Text style={ui.label}>Consulta relacionada</Text>}
            {entry.capituloIds.map((chapter) => <BotonApp key={chapter} title={chapters.find((c) => c.id === chapter)?.titulo ?? 'Leer tema relacionado'} variant="secondary"
              onPress={() => router.push({ pathname: '/manual/[id]', params: { id: chapter } })} />)}
            {entry.id === 'archivo' && <BotonApp title="Abrir los registros" onPress={() => router.navigate('/archivo')} />}
            {['elige-mejora', 'cartas-mejora'].includes(entry.id) && <BotonApp title="Explorar las cartas" onPress={() => router.navigate('/cartas')} />}
          </View>
        </>}
      </>}
    </ScrollView>
  </SafeAreaView>;
}
