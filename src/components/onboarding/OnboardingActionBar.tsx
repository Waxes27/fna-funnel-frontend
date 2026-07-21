import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import CustomButton from '../Button';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'consent';

type OnboardingActionBarProps = {
  primaryTitle: string;
  onPrimaryPress: () => void;
  secondaryTitle?: string;
  onSecondaryPress?: () => void;
  primaryVariant?: ButtonVariant;
  secondaryVariant?: ButtonVariant;
  primaryDisabled?: boolean;
  secondaryDisabled?: boolean;
  primaryLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const OnboardingActionBar: React.FC<OnboardingActionBarProps> = ({
  primaryTitle,
  onPrimaryPress,
  secondaryTitle,
  onSecondaryPress,
  primaryVariant = 'primary',
  secondaryVariant = 'secondary',
  primaryDisabled = false,
  secondaryDisabled = false,
  primaryLoading = false,
  style,
}) => {
  const { spacing } = useTheme();

  return (
    <View style={[styles.container, { marginTop: spacing.sm, gap: spacing.sm }, style]}>
      <CustomButton
        title={primaryTitle}
        onPress={onPrimaryPress}
        variant={primaryVariant}
        disabled={primaryDisabled}
        isLoading={primaryLoading}
        style={styles.fullWidth}
      />

      {secondaryTitle && onSecondaryPress ? (
        <CustomButton
          title={secondaryTitle}
          onPress={onSecondaryPress}
          variant={secondaryVariant}
          disabled={secondaryDisabled}
          style={styles.fullWidth}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
});
