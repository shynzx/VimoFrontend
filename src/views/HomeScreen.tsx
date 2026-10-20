import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight, Zap } from 'lucide-react-native';
import { Icon } from '../components/Icon';
import { ui } from '../theme/styles';
import { colors, radius, spacing, typography } from '../theme/tokens';

const helmet = require('../../assets/images/helmet-hologram.jpg');

// Figma 02 · Panel principal. El nombre del jugador y el estado de partida se omiten:
// la app no tiene conexión con la partida en curso.
export function HomeScreen() {
  return (
    <SafeAreaView style={ui.screen} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={ui.title} accessibilityRole="header">Centro táctico</Text>
          <Text style={ui.description}>Consulta lo que necesitas. El combate sigue en tu PC o consola.</Text>
        </View>

        <Link href="/cards" asChild>
          <TouchableOpacity style={styles.entry} accessibilityRole="link"
            accessibilityLabel="Base de datos de cartas. Efectos, estadísticas y mejoras de combate.">
            <View style={ui.spaceBetween}>
              <View style={styles.deck}>
                <View style={styles.cardBack} />
                <View style={styles.cardFront}>
                  <Icon icon={Zap} size={28} />
                  <View style={styles.detailLong} />
                  <View style={styles.detailShort} />
                </View>
              </View>
              <Metadata label="Código / 4 díg." />
            </View>
            <View style={styles.copy}>
              <Text style={styles.entryTitle}>Base de datos de cartas</Text>
              <Text style={ui.caption}>Efectos, estadísticas y mejoras de combate.</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/guide" asChild>
          <TouchableOpacity style={styles.entry} accessibilityRole="link"
            accessibilityLabel="Archivo de lore. Personajes, enemigos y lugares de Terra.">
            <View style={ui.spaceBetween}>
              <Image source={helmet} style={styles.hologram} accessible={false} />
              <Metadata label="Universo Terra" />
            </View>
            <View style={styles.copy}>
              <Text style={styles.entryTitle}>Archivo de lore</Text>
              <Text style={ui.caption}>Personajes, enemigos y lugares de Terra.</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metadata({ label }: { label: string }) {
  return (
    <View style={styles.metadata}>
      <Text style={ui.label}>{label}</Text>
      <Icon icon={ArrowUpRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 22, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: 22 },
  heading: { gap: 7 },
  // Link asChild requiere un estilo plano, no un arreglo.
  entry: { ...ui.panel, minHeight: 205, justifyContent: 'space-between' },
  copy: { gap: spacing.xxs },
  entryTitle: { ...typography.heading, color: colors.text, textTransform: 'uppercase' },
  metadata: { alignItems: 'flex-end', gap: spacing.sm },
  deck: { width: 106, height: 104 },
  cardBack: {
    position: 'absolute', left: 20, top: 2, width: 65, height: 82, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft, transform: [{ rotate: '-12deg' }],
  },
  cardFront: {
    position: 'absolute', left: 32, top: 7, width: 66, height: 88, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center', gap: spacing.md,
  },
  detailLong: { width: 34, height: 2, backgroundColor: colors.primary },
  detailShort: { width: 22, height: 2, backgroundColor: colors.border },
  hologram: { width: 112, height: 105, borderRadius: radius.sm },
});
