import { Text, TouchableOpacity } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { ui } from '../theme/styles';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const variants = { primary: ui.primaryButton, secondary: ui.secondaryButton, danger: ui.dangerButton };

export function AppButton({ title, onPress, disabled = false, variant = 'primary', style, accessibilityLabel }: AppButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title} accessibilityState={{ disabled }}
      style={[ui.button, variants[variant], style, disabled && ui.disabled]}>
      <Text style={variant === 'secondary' ? ui.secondaryButtonText : ui.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
