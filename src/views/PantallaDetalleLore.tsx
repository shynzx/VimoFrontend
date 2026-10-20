import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight } from 'lucide-react-native';
import { BotonApp } from '../components/BotonApp';
import { AvisoCatalogo } from '../components/AvisoCatalogo';
import { Icono } from '../components/Icono';
import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { iconosLore } from '../components/iconosCatalogo';
import { ControladorCartas } from '../controllers/ControladorCartas';
import { ControladorGuia } from '../controllers/ControladorGuia';
import { useCatalogo } from '../hooks/useCatalogo';
import { esTipoLore, TipoLore } from '../models/EntradaLore';
import { ui } from '../theme/styles';
import { colors, radius, spacing, typography } from '../theme/tokens';

const controller = new ControladorGuia();
const cardsController = new ControladorCartas();
const loadCards = (force: boolean) => cardsController.obtenerTodasLasCartas(force);

// Figma 05 · Perfil del archivo de lore. Sin retratos ni "poder táctico" en el catálogo:
// el recuadro del retrato muestra un icono del tipo de registro y se omite el medidor.
export function PantallaDetalleLore({ tipo, id }: { tipo: string; id: string }) {
  const tipoValido: TipoLore = esTipoLore(tipo) ? tipo : 'personajes';
  const load = useCallback((force: boolean) => controller.obtenerEntradas(tipoValido, force), [tipoValido]);
  const { result, error, loading, reload } = useCatalogo(load);
  const entry = esTipoLore(tipo) ? result?.datos.find((item) => item.id === id) : undefined;
  // Solo para mostrar el nombre de las cartas relacionadas; si falla, se muestra su ID.
  const cards = useCatalogo(loadCards).result?.datos ?? [];
  const cardName = (cardId: string) => cards.find((card) => card.id === cardId)?.nombre;

  return (
    <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
      <EncabezadoPantalla title="Archivo de lore" fallback="/guia" />
      <ScrollView contentContainerStyle={styles.content}>
        <AvisoCatalogo source={result?.origen ?? null} />
        {loading && !entry && <ActivityIndicator style={ui.loading} color={colors.primary} accessibilityLabel="Cargando registro" />}
        {error && !entry && (
          <View style={styles.message}>
            <Text style={ui.errorText} accessibilityRole="alert">{error}</Text>
            <BotonApp title="Reintentar" variant="secondary" onPress={() => void reload()} />
          </View>
        )}
        {!loading && !error && !entry && <Text style={ui.emptyText}>Registro no encontrado en el archivo.</Text>}

        {entry && (
          <>
            <View style={styles.portrait}>
              <View style={styles.watermark} accessible={false}>
                <Icono icon={iconosLore[entry.tipo]} size={140} color={colors.border} />
              </View>
              <LinearGradient colors={['rgba(7, 15, 29, 0)', 'rgba(7, 15, 29, 0)', 'rgba(7, 15, 29, 0.96)']}
                locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
              <View style={ui.badge}>
                <Text style={ui.label}>{entry.insignia}</Text>
              </View>
              <View style={styles.name}>
                <Text style={styles.title} accessibilityRole="header">{entry.nombre}</Text>
                <Text style={styles.subtitle}>{entry.subtitulo}</Text>
              </View>
            </View>

            {entry.secciones.map((section) => (
              <View key={section.etiqueta} style={ui.section}>
                <Text style={ui.label}>{section.etiqueta}</Text>
                <Text style={ui.copy}>{section.texto}</Text>
              </View>
            ))}

            {entry.cartasRelacionadas.length > 0 && (
              <View style={ui.section}>
                <Text style={ui.label}>{entry.etiquetaRelacionadas}</Text>
                {entry.cartasRelacionadas.map((cardId) => (
                  <TouchableOpacity key={cardId} style={styles.related} accessibilityRole="link"
                    accessibilityLabel={`Abrir carta ${cardName(cardId) ?? cardId}`}
                    onPress={() => router.navigate({ pathname: '/cartas/[id]', params: { id: cardId } })}>
                    <View style={styles.relatedText}>
                      <Text style={ui.body}>{cardName(cardId) ?? cardId}</Text>
                      {cardName(cardId) && <Text style={ui.label}>{cardId}</Text>}
                    </View>
                    <Icono icon={ArrowUpRight} />
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
