import type { TextStyle } from 'react-native';

// Figma AFTER-LIGHT · CsKcKS3qtpDfb43BoK5x95. Adaptación de las pantallas PC a consulta móvil.
export const colors = {
  background: '#000000',
  surface: '#0B0B0B',
  surfaceRaised: '#1A1A1A',
  primary: '#FF5964',
  primarySoft: '#281015',
  onPrimary: '#ECEAE4',
  text: '#ECEAE4',
  textSecondary: '#C9C9C9',
  border: '#343331',
  badge: '#241013',
  danger: '#FF5964',
  dangerSoft: '#281015',
  selected: '#FFD9DC',
  institutional: '#B52D3A',
  muted: '#8A8A8A',
  warning: '#FFC857',
  warningSoft: '#33290F',
  overlay: 'rgba(0, 0, 0, 0.8)',
} as const;

// Familias cargadas con @expo-google-fonts en src/app/_layout.tsx.
export const fonts = {
  display: 'KellySlab_400Regular',
  displaySemiBold: 'KellySlab_400Regular',
  mono: 'Inter_600SemiBold',
  monoRegular: 'Inter_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

export const spacing = { xxs: 4, xs: 6, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 3, md: 3, lg: 3, pill: 999 } as const;
export const sizes = { touchTarget: 48, action: 56, icon: 22, tabIcon: 20, contentMaxWidth: 720 } as const;

// Sin alturas fijas para que el texto pueda crecer con la configuración del dispositivo.
export const typography = {
  hero: { fontFamily: fonts.display, fontSize: 54, lineHeight: 51 },
  title: { fontFamily: fonts.display, fontSize: 36, lineHeight: 38 },
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 34 },
  heading: { fontFamily: fonts.display, fontSize: 25, lineHeight: 27 },
  navigation: { fontFamily: fonts.displaySemiBold, fontSize: 19, lineHeight: 24 },
  button: { fontFamily: fonts.bodySemiBold, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 14 },
  code: { fontFamily: fonts.display, fontSize: 33, lineHeight: 43 },
  key: { fontFamily: fonts.bodyMedium, fontSize: 26, lineHeight: 31 },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
  bodySmall: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19.5 },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18 },
  fine: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16.5 },
  tab: { fontFamily: fonts.bodySemiBold, fontSize: 10, lineHeight: 12 },
} satisfies Record<string, TextStyle>;
