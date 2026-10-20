import { ui } from '../theme/styles';
import { Link } from 'expo-router';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand} accessibilityRole="header">VIMO</Text>
        <Text style={styles.intro}>Tu partida en PC. La información que necesitas, en tu celular.</Text>
        <Link href="/cards" asChild>
          <TouchableOpacity style={styles.section} accessibilityRole="link">
            <Text style={styles.title}>Base de datos de cartas</Text>
            <Text style={styles.description}>Introduce el ID de 4 dígitos que aparece en el juego para consultar el efecto y las estadísticas de una carta.</Text>
            <Text style={styles.action}>Consultar una carta →</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/guide" asChild>
          <TouchableOpacity style={styles.section} accessibilityRole="link">
            <Text style={styles.title}>Archivos lore</Text>
            <Text style={styles.description}>Explora personajes, enemigos e instalaciones. Descubre la historia del mundo del juego fuera del combate.</Text>
            <Text style={styles.action}>Explorar la historia →</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: ui.screen,
  content: ui.scrollContent,
  brand: ui.brand,
  intro: ui.lead,
  section: ui.homeCard,
  title: ui.heading,
  description: ui.description,
  action: ui.actionText,
};
