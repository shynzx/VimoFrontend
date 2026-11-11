import { useAssets } from 'expo-asset';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';

// Exportaciones originales de Figma. Los SVG conservan su tamaño de raíz de 96 × 96.
const assets: Record<string, number> = {
  'CAR-001': require('../../assets/figma/cartas/CAR-001.svg'),
  'CAR-002': require('../../assets/figma/cartas/CAR-002.svg'),
  'CAR-003': require('../../assets/figma/cartas/CAR-003.svg'),
  'CAR-004': require('../../assets/figma/cartas/CAR-004.svg'),
  'CAR-005': require('../../assets/figma/cartas/CAR-005.svg'),
  'CAR-006': require('../../assets/figma/cartas/CAR-006.svg'),
  'CAR-007': require('../../assets/figma/cartas/CAR-007.svg'),
  'CAR-008': require('../../assets/figma/cartas/CAR-008.svg'),
  'CAR-009': require('../../assets/figma/cartas/CAR-009.svg'),
  'CAR-010': require('../../assets/figma/cartas/CAR-010.svg'),
  'CAR-011': require('../../assets/figma/cartas/CAR-011.svg'),
  'CAR-012': require('../../assets/figma/cartas/CAR-012.svg'),
  'CAR-013': require('../../assets/figma/cartas/CAR-013.svg'),
  'CAR-014': require('../../assets/figma/cartas/CAR-014.svg'),
  'CAR-015': require('../../assets/figma/cartas/CAR-015.svg'),
  'CAR-016': require('../../assets/figma/cartas/CAR-016.svg'),
  'CAR-017': require('../../assets/figma/cartas/CAR-017.svg'),
  'CAR-018': require('../../assets/figma/cartas/CAR-018.svg'),
  'CAR-019': require('../../assets/figma/cartas/CAR-019.svg'),
  'CAR-020': require('../../assets/figma/cartas/CAR-020.svg'),
  'CAR-021': require('../../assets/figma/cartas/CAR-021.svg'),
};

export function IconoCarta({ id }: { id: string }) {
  // La clave fuerza una carga nueva si una pantalla de detalle cambia de carta.
  return assets[id] ? <RecursoCarta key={id} modulo={assets[id]} /> : null;
}
function RecursoCarta({ modulo }: { modulo: number }) {
  const [loaded] = useAssets(modulo);
  const asset = loaded?.[0];
  return <View style={{ width: 96, height: 96, flexShrink: 0 }} accessible={false}>
    {asset && <SvgUri uri={asset.localUri ?? asset.uri} />}
  </View>;
}
