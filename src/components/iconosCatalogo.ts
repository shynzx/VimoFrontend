import type { LucideIcon } from 'lucide-react-native';
import type { TipoLore } from '../models/EntradaLore';
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

export function iconoCategoria(category: string): LucideIcon {
  return categoryIcons[category.toLowerCase()] ?? Zap;
}

export const iconosLore: Record<TipoLore, LucideIcon> = { personajes: User, enemigos: Skull, infraestructura: MapPin };
