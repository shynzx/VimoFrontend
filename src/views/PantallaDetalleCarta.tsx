import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Layers, Zap } from 'lucide-react-native';
import { BotonApp } from '../components/BotonApp';
import { AvisoCatalogo } from '../components/AvisoCatalogo';
import { Icono } from '../components/Icono';
import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { iconoCategoria } from '../components/iconosCatalogo';
import { ControladorCartas } from '../controllers/ControladorCartas';
import { useCatalogo } from '../hooks/useCatalogo';
import { ui } from '../theme/styles';
import { colors, radius, spacing, typography } from '../theme/tokens';

const controller = new ControladorCartas();
const loadCards = (force: boolean) => controller.obtenerTodasLasCartas(force);

// Figma 04 · Detalle de carta. El catálogo no tiene ilustraciones ni duración: el recuadro de la
// ilustración muestra el emblema de la categoría y las estadísticas muestran el efecto por nivel.
export function PantallaDetalleCarta({ id }: { id: string }) {
  const { result, error, loading, reload } = useCatalogo(loadCards);
  const card = result?.datos.find((item) => item.id === id);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/cartas'));

  return (
    <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
      <EncabezadoPantalla title={card?.codigoJuego ? `Resultado / ${card.codigoJuego}` : 'Resultado'} fallback="/cartas" />
      <ScrollView contentContainerStyle={styles.content}>
        <AvisoCatalogo source={result?.origen ?? null} />
        {loading && !card && <ActivityIndicator style={ui.loading} color={colors.primary} accessibilityLabel="Cargando carta" />}
        {error && !card && (
          <View style={styles.message}>
            <Text style={ui.errorText} accessibilityRole="alert">{error}</Text>
            <BotonApp title="Reintentar" variant="secondary" onPress={() => void reload()} />
          </View>
        )}
        {!loading && !error && !card && <Text style={ui.emptyText}>Carta no encontrada en el catálogo.</Text>}

        {card && (
          <>
            <View style={styles.identity}>
              <View style={ui.spaceBetween}>
                <Text style={ui.label}>{card.codigoJuego ? `Código ${card.codigoJuego}` : card.id}</Text>
                <Text style={ui.label}>{card.categoria}{card.nivelMaximo ? ` / Máx. ${card.nivelMaximo}` : ''}</Text>
              </View>
              <Text style={ui.display} accessibilityRole="header">{card.nombre}</Text>
            </View>

            <View style={styles.illustration} accessible={false}>
              <View style={styles.watermark}>
                <Icono icon={iconoCategoria(card.categoria)} size={120} color={colors.border} />
              </View>
              <LinearGradient colors={['rgba(7, 15, 29, 0.13)', 'rgba(7, 15, 29, 0)', 'rgba(7, 15, 29, 0.9)']}
                locations={[0, 0.65, 1]} style={StyleSheet.absoluteFill} />
              <View style={styles.emblem}>
                <Icono icon={iconoCategoria(card.categoria)} />
              </View>
              <Text style={ui.label}>{card.id}</Text>
            </View>

            <View style={ui.highlight}>
              <View style={styles.statRow}>
                <Icono icon={Zap} />
                <Text style={styles.effect}>{card.efecto}</Text>
              </View>
              {card.nivelMaximo != null && (
                <View style={styles.statRow}>
                  <Icono icon={Layers} size={18} />
                  <Text style={styles.stat}>Nivel máximo: {card.nivelMaximo} · cada nivel se suma al anterior.</Text>
                </View>
              )}
            </View>

            {card.disponibilidad && (
              <View style={styles.lore}>
                <Text style={ui.label}>Disponibilidad</Text>
                <Text style={ui.copy}>{card.disponibilidad}</Text>
              </View>
            )}
          </>
        )}

        <BotonApp title="Volver" direction="back" onPress={back} />
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
