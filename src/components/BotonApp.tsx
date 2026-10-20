import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Icono } from './Icono';
import { ui } from '../theme/styles';
import { colors } from '../theme/tokens';

interface PropsBotonApp {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  /** Flecha a la derecha: hacia adelante o de regreso. */
  direction?: 'forward' | 'back';
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const variants = { primary: ui.primaryButton, secondary: ui.secondaryButton };

export function BotonApp({
  title, onPress, disabled = false, loading = false, variant = 'primary', direction = 'forward', style, accessibilityLabel,
}: PropsBotonApp) {
  const inactive = disabled || loading;
  return (
    <TouchableOpacity onPress={onPress} disabled={inactive} accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title} accessibilityState={{ disabled: inactive, busy: loading }}
      style={[ui.button, variants[variant], style, disabled && ui.disabled]}>
      <Text style={ui.buttonText}>{title}</Text>
      {loading
        ? <ActivityIndicator color={colors.onPrimary} />
        : <Icono icon={direction === 'back' ? ArrowLeft : ArrowRight} color={colors.onPrimary} />}
    </TouchableOpacity>
  );
}
