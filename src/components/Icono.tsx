import type { LucideIcon } from 'lucide-react-native';
import { colors, sizes } from '../theme/tokens';

interface PropsIcono {
  icon: LucideIcon;
  size?: number;
  color?: string;
}

// Los iconos del Figma son de Lucide con trazo de 1 px a su tamaño final.
export function Icono({ icon: Glyph, size = sizes.icon, color = colors.primary }: PropsIcono) {
  return <Glyph size={size} color={color} strokeWidth={1} absoluteStrokeWidth />;
}
