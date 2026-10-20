import type { TextStyle } from 'react-native';

// Paleta del Figma "Wireframes - After Light".
export const colors = {
  background: '#070F1D',
  surface: '#0E1C2E',
  surfaceRaised: '#14263B',
  primary: '#FF4659',
  primarySoft: '#351B2A',
  onPrimary: '#F1F6FC',
  text: '#F1F6FC',
  textSecondary: '#9AACBF',
  border: '#263D54',
  badge: '#123D51',
  danger: '#FF4659',
  dangerSoft: '#351B2A',
  warning: '#FFC857',
  warningSoft: '#33290F',
  overlay: 'rgba(7, 15, 29, 0.8)',
} as const;

// Familias cargadas con @expo-google-fonts en src/app/_layout.tsx.
export const fonts = {
  display: 'Rajdhani_700Bold',
  displaySemiBold: 'Rajdhani_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
  monoRegular: 'IBMPlexMono_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

export const spacing = { xxs: 4, xs: 6, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 6, md: 10, lg: 14, pill: 999 } as const;
export const sizes = { touchTarget: 48, action: 56, icon: 22, tabIcon: 20, contentMaxWidth: 720 } as const;

// Sin alturas fijas para que el texto pueda crecer con la configuración del dispositivo.
export const typography = {
  hero: { fontFamily: fonts.display, fontSize: 54, lineHeight: 51 },
  title: { fontFamily: fonts.display, fontSize: 36, lineHeight: 38 },
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 34 },
  heading: { fontFamily: fonts.display, fontSize: 25, lineHeight: 27 },
  navigation: { fontFamily: fonts.displaySemiBold, fontSize: 19, lineHeight: 24 },
  button: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26 },
  label: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 14 },
  code: { fontFamily: fonts.mono, fontSize: 33, lineHeight: 43 },
  key: { fontFamily: fonts.bodyMedium, fontSize: 26, lineHeight: 31 },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
  bodySmall: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19.5 },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18 },
  fine: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16.5 },
  tab: { fontFamily: fonts.bodySemiBold, fontSize: 10, lineHeight: 12 },
} satisfies Record<string, TextStyle>;
