import type { TextStyle } from 'react-native';

export const colors = {
  background: '#F6F4F9',
  surface: '#FFFFFF',
  primary: '#583883',
  primarySoft: '#EDE6F5',
  onPrimary: '#FFFFFF',
  text: '#292333',
  textSecondary: '#62596E',
  border: '#DCD5E5',
  danger: '#A72332',
  dangerSoft: '#FCECEF',
  warning: '#665016',
  warningSoft: '#FFF4CC',
  overlay: 'rgba(22, 16, 32, 0.6)',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
export const sizes = { touchTarget: 48, contentMaxWidth: 720, modalMaxWidth: 560 } as const;

// Sin alturas fijas para que el texto pueda crecer con la configuración del dispositivo.
export const typography = {
  brand: { fontSize: 40, lineHeight: 48, fontWeight: '800' },
  title: { fontSize: 26, lineHeight: 34, fontWeight: '700' },
  heading: { fontSize: 20, lineHeight: 28, fontWeight: '700' },
  lead: { fontSize: 18, lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  caption: { fontSize: 14, lineHeight: 20 },
} satisfies Record<string, TextStyle>;
