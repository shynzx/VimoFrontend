import type { LucideIcon } from 'lucide-react-native';
import type { LoreKind } from '../models/LoreEntry';
import { BatteryCharging, Crosshair, Flashlight, Footprints, HeartPulse, MapPin, Skull, User, Wrench, Zap } from 'lucide-react-native';

// Las cartas no tienen ilustración en el catálogo: el emblema identifica su categoría.
const categoryIcons: Record<string, LucideIcon> = {
  supervivencia: HeartPulse,
  'batería': BatteryCharging,
  linterna: Flashlight,
  combate: Crosshair,
  movimiento: Footprints,
  'interacción': Wrench,
};

export function categoryIcon(category: string): LucideIcon {
  return categoryIcons[category.toLowerCase()] ?? Zap;
}

export const loreIcons: Record<LoreKind, LucideIcon> = { characters: User, enemies: Skull, infrastructure: MapPin };
