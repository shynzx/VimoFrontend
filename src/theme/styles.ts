import { StyleSheet } from 'react-native';
import { colors, radius, sizes, spacing, typography } from './tokens';

export const ui = StyleSheet.create({
  // Estructura
  scene: { backgroundColor: colors.background },
  screen: { flex: 1, width: '100%', maxWidth: sizes.contentMaxWidth, alignSelf: 'center', backgroundColor: colors.background },
  scrollContent: { gap: spacing.lg, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  spaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },

  // Cabecera de navegación (Figma: "Navigation", 60 de alto)
  navigation: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingHorizontal: spacing.xl },
  backButton: {
    width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  // Área táctil de 48 alrededor del botón visual de 36.
  backHitSlop: { top: 6, bottom: 6, left: 6, right: 6 },
  navigationTitle: { ...typography.navigation, color: colors.text, flexShrink: 1, textTransform: 'uppercase' },

  // Texto
  hero: { ...typography.hero, color: colors.text },
  title: { ...typography.title, color: colors.text, textTransform: 'uppercase' },
  display: { ...typography.display, color: colors.text, textTransform: 'uppercase' },
  heading: { ...typography.heading, color: colors.text, textTransform: 'uppercase' },
  label: { ...typography.label, color: colors.primary, textTransform: 'uppercase' },
  body: { ...typography.body, color: colors.text },
  description: { ...typography.body, color: colors.textSecondary },
  copy: { ...typography.bodySmall, color: colors.textSecondary },
  caption: { ...typography.caption, color: colors.textSecondary },
  fine: { ...typography.fine, color: colors.textSecondary },

  // Superficies
  panel: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary,
    borderRadius: radius.lg, padding: 20, gap: spacing.md,
  },
  listItem: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs,
  },
  highlight: {
    backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primary,
    borderRadius: radius.md, padding: spacing.lg, gap: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start', backgroundColor: colors.badge, borderRadius: radius.sm,
    paddingHorizontal: spacing.sm, paddingVertical: 5,
  },
  section: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, gap: spacing.xs },

  // Acciones (Figma: "Action", 56 de alto)
  button: {
    minHeight: sizes.action, borderRadius: radius.md, borderWidth: 1, borderColor: colors.primary,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md,
  },
  primaryButton: { backgroundColor: colors.primary },
  secondaryButton: { backgroundColor: colors.surface },
  buttonText: { ...typography.button, color: colors.onPrimary, textTransform: 'uppercase', flexShrink: 1 },
  disabled: { opacity: 0.45 },

  // Pestañas internas (Archivo de lore)
  tabs: { flexDirection: 'row', gap: spacing.sm },
  tab: {
    flex: 1, minHeight: sizes.touchTarget, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xs,
  },
  activeTab: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  tabText: { ...typography.label, color: colors.textSecondary, textAlign: 'center', textTransform: 'uppercase' },
  activeTabText: { color: colors.primary },

  // Estados
  notice: {
    ...typography.caption, color: colors.warning, backgroundColor: colors.warningSoft,
    borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  errorText: { ...typography.caption, color: colors.danger },
  loading: { padding: spacing.xxl, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
