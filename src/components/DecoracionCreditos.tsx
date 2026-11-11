import { useAssets } from 'expo-asset';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { router } from 'expo-router';
import { colors, fonts } from '../theme/tokens';
const markModule = require('../../assets/figma/marca.svg');
const particleModule = require('../../assets/figma/particula.svg');

export function ParticulasCreditos() {
  const [assets] = useAssets(particleModule);
  const particle = assets?.[0];
  return <View pointerEvents="none" style={StyleSheet.absoluteFill} accessible={false}>
    {positions.map((p, i) => <View key={i} style={[styles.particle, p]}>{particle && <SvgUri uri={particle.localUri ?? particle.uri} />}</View>)}
  </View>;
}
export function VolverCreditos() {
  const [assets] = useAssets(markModule);
  const mark = assets?.[0];
  return <TouchableOpacity style={styles.back} accessibilityRole="button" accessibilityLabel="Volver al Centro táctico" onPress={() => router.navigate('/inicio')}>
    <View style={styles.mark} accessible={false}>{mark && <SvgUri uri={mark.localUri ?? mark.uri} />}</View>
    <Text style={styles.text}>VOLVER</Text>
    <View style={styles.mark} accessible={false}>{mark && <SvgUri uri={mark.localUri ?? mark.uri} />}</View>
  </TouchableOpacity>;
}
const positions = [{ left: '20%', top: '23%' }, { left: '78%', top: '28%' }, { left: '13%', top: '87%' }, { left: '85%', top: '89%' }, { left: '63%', top: '67%' }] as const;
const styles = StyleSheet.create({
  particle: { position: 'absolute', width: 3, height: 3 },
  mark: { width: 90, height: 8 },
  back: { minHeight: 48, gap: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  text: { fontFamily: fonts.bodySemiBold, color: colors.selected, fontSize: 14 },
});
