import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { useTheme } from '../theme';
import { Typography } from './Typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'consent';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors, radii, layout, typography } = useTheme();

  const variantStyle: ViewStyle = (() => {
    switch (variant) {
      case 'consent':
        return {
          backgroundColor: colors.signalOrange,
          borderColor: colors.signalOrange,
          borderRadius: radii.consent,
          paddingHorizontal: 30,
        };
      case 'secondary':
        return {
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.ink,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.ink,
        };
      default:
        return {
          backgroundColor: colors.ink,
          borderColor: colors.ink,
        };
    }
  })();

  const labelColor =
    variant === 'primary' ? colors.canvas : variant === 'consent' ? colors.surfaceRaised : colors.ink;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { borderRadius: radii.primary, minHeight: layout.touchTarget },
        variantStyle,
        (disabled || isLoading) && styles.disabled,
        pressed && !disabled && !isLoading ? styles.pressed : null,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'consent' ? colors.canvas : colors.ink} />
      ) : (
        <Typography
          variant={variant === 'consent' ? 'consentLabel' : 'buttonLabel'}
          style={[
            styles.text,
            { color: labelColor, fontFamily: typography.families.primary ?? typography.families.fallback },
            textStyle,
          ]}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  text: {
    includeFontPadding: false,
  },
});

export default CustomButton;
