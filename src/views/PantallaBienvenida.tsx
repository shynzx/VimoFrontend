import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotonApp } from '../components/BotonApp';
import { ui } from '../theme/styles';
import { colors, spacing, typography } from '../theme/tokens';

const soldier = require('../../assets/images/welcome-soldier.png');

// Figma 01 · Portada / Bienvenida.
export function PantallaBienvenida() {
  return (
    <View style={styles.container}>
      <Image source={soldier} style={StyleSheet.absoluteFill} resizeMode="cover" accessible={false} />
      <LinearGradient
        colors={['rgba(7, 15, 29, 0.533)', 'rgba(7, 15, 29, 0)', 'rgba(7, 15, 29, 0.667)', colors.background, colors.background]}
        locations={[0, 0.4, 0.62, 0.83, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, styles.tint]} />
      <SafeAreaView style={styles.content}>
        <View style={ui.row}>
          <View style={styles.accent} />
          <Text style={ui.label}>Terminal táctico / Conexión 01</Text>
        </View>
        <View style={styles.introduction}>
          <Text style={ui.label}>Tu partida. Toda la inteligencia.</Text>
          <Text style={ui.hero} accessibilityRole="header">
            AFTER{'\n'}<Text style={styles.light}>LIGHT</Text>
          </Text>
          <Text style={styles.copy}>Tu enlace al frente de batalla. Cartas, personajes e historia en un solo lugar.</Text>
          <BotonApp title="Get started" style={styles.action} onPress={() => router.replace('/inicio')} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // overflow evita que la imagen amplíe el área visible en la versión web.
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  tint: { backgroundColor: 'rgba(255, 70, 89, 0.12)' },
  content: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 28, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  accent: { width: 20, height: 2, backgroundColor: colors.primary },
  introduction: { gap: 18 },
  light: { color: colors.primary },
  copy: { ...typography.body, color: colors.text },
  action: { marginTop: 10 },
});
