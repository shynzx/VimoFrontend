import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleAlert, CircleCheck, Delete, Search } from 'lucide-react-native';
import { BotonApp } from '../components/BotonApp';
import { AvisoCatalogo } from '../components/AvisoCatalogo';
import { Icono } from '../components/Icono';
import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { ControladorCartas } from '../controllers/ControladorCartas';
import { useCatalogo } from '../hooks/useCatalogo';
import { ui } from '../theme/styles';
import { colors, radius, spacing, typography } from '../theme/tokens';

const CODE_LENGTH = 4;
const controller = new ControladorCartas();
const loadCards = (force: boolean) => controller.obtenerTodasLasCartas(force);
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'] as const;

// Figma 03 · Búsqueda de cartas. El botón de cámara del diseño queda pendiente (requiere expo-camera).
export function PantallaCartas() {
  const [code, setCode] = useState('');
  const [notFound, setNotFound] = useState<string | null>(null);
  const [consulting, setConsulting] = useState(false);
  // Descarga el catálogo al abrir la pantalla para que la consulta sea inmediata.
  const catalog = useCatalogo(loadCards);
  const complete = code.length === CODE_LENGTH;

  const press = (key: (typeof KEYS)[number]) => {
    setNotFound(null);
    if (key === 'delete') setCode((value) => value.slice(0, -1));
    else if (key) setCode((value) => (value.length < CODE_LENGTH ? value + key : value));
  };

  const consult = async () => {
    if (!complete) return;
    setConsulting(true);
    try {
      const card = (await controller.buscarCartas(code)).datos[0];
      if (card) router.push({ pathname: '/cartas/[id]', params: { id: card.id } });
      else setNotFound(code);
    } catch {
      await catalog.reload();
    } finally {
      setConsulting(false);
    }
  };

  const status = notFound
    ? { icon: CircleAlert, color: colors.primary, text: `No hay ninguna carta con el código ${notFound}.` }
    : complete
      ? { icon: CircleCheck, color: colors.primary, text: 'Código completo · listo para consultar' }
      : { icon: null, color: colors.textSecondary, text: `Faltan ${CODE_LENGTH - code.length} dígitos.` };

  return (
    <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
      <EncabezadoPantalla title="Base de datos de cartas" fallback="/inicio" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.instructions}>
          <Text style={ui.label}>Consulta rápida / ID de carta</Text>
          <Text style={styles.heading} accessibilityRole="header">Ingresa el código de la carta (ej. 0013)</Text>
          <Text style={ui.description}>Escribe los 4 dígitos que aparecen en la carta.</Text>
        </View>

        <View style={styles.field} accessible accessibilityLabel={code ? `Código ${code.split('').join(' ')}` : 'Código vacío'}>
          <Icono icon={Search} size={24} />
          <View style={styles.codeInput}>
            <Text style={[styles.code, !code && styles.placeholder]}>{code || '0000'}</Text>
            <View style={styles.cursor} />
          </View>
        </View>

        <View style={ui.row} accessibilityLiveRegion="polite">
          {status.icon && <Icono icon={status.icon} size={16} color={status.color} />}
          <Text style={[ui.caption, { color: status.color }]}>{status.text}</Text>
        </View>

        <BotonApp title="Consultar carta" disabled={!complete} loading={consulting} onPress={() => void consult()} />

        <AvisoCatalogo source={catalog.result?.origen ?? null} />
        {catalog.error && !catalog.loading && (
          <View style={styles.error}>
            <Text style={ui.errorText} accessibilityRole="alert">{catalog.error}</Text>
            <BotonApp title="Reintentar" variant="secondary" onPress={() => void catalog.reload()} />
          </View>
        )}
        <Text style={ui.fine}>Solo consulta. No modifica tu partida.</Text>
      </ScrollView>

      <View style={styles.keyboard}>
        {[0, 1, 2, 3].map((row) => (
          <View key={row} style={styles.keyRow}>
            {KEYS.slice(row * 3, row * 3 + 3).map((key) => key === '' ? (
              <View key="blank" style={styles.keySpacer} />
            ) : (
              <TouchableOpacity key={key} style={styles.key} onPress={() => press(key)}
                onLongPress={key === 'delete' ? () => { setCode(''); setNotFound(null); } : undefined}
                accessibilityRole="button" accessibilityLabel={key === 'delete' ? 'Borrar dígito' : key}>
                {key === 'delete' ? <Icono icon={Delete} color={colors.text} /> : <Text style={styles.keyText}>{key}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { gap: 22, paddingHorizontal: spacing.xl, paddingTop: 20, paddingBottom: spacing.xl },
  instructions: { gap: spacing.md },
  heading: { ...typography.display, fontSize: 29, lineHeight: 30.5, color: colors.text, textTransform: 'uppercase' },
  field: {
    minHeight: 80, flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingHorizontal: 18,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.md,
  },
  codeInput: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  code: { ...typography.code, color: colors.text, letterSpacing: 2 },
  placeholder: { color: colors.border },
  cursor: { width: 2, height: 34, backgroundColor: colors.primary },
  error: { gap: spacing.md },
  keyboard: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingTop: 14, paddingBottom: spacing.md, gap: spacing.sm },
  keyRow: { flexDirection: 'row', gap: spacing.sm },
  key: { flex: 1, height: 60, borderRadius: radius.sm, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  keySpacer: { flex: 1, height: 60 },
  keyText: { ...typography.key, color: colors.text },
});
