import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({ label, error, containerStyle, style, ...props }) => {
  const { colors, radii, typography } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Typography
          variant="h4"
          style={[styles.label, { color: colors.text, fontFamily: typography.families.primary ?? typography.families.fallback }]}
        >
          {label}
        </Typography>
      ) : null}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderRadius: radii.primary, color: colors.text },
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error ? (
        <Typography variant="footerLink" style={[styles.errorText, { color: colors.signalOrange }]}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'rgba(207, 69, 0, 0.65)',
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
