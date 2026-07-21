import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../theme';
import { Typography } from '../Typography';

type OnboardingProgressProps = {
  step: number;
  totalSteps: number;
};

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ step, totalSteps }) => {
  const { colors, radii, spacing } = useTheme();

  const safeTotalSteps = Math.max(totalSteps, 1);
  const currentStep = Math.min(Math.max(step, 1), safeTotalSteps);
  const progressWidth: `${number}%` = `${(currentStep / safeTotalSteps) * 100}%`;

  return (
    <View style={styles.container}>
      <Typography
        variant="eyebrow"
        style={{ color: colors.textSecondary, marginBottom: spacing.sm }}
      >
        Step {currentStep} of {safeTotalSteps}
      </Typography>

      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: safeTotalSteps, now: currentStep }}
        style={[styles.track, { backgroundColor: colors.border, borderRadius: radii.pill }]}
      >
        <View
          style={[
            styles.fill,
            {
              width: progressWidth,
              backgroundColor: colors.ink,
              borderRadius: radii.pill,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    width: '100%',
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    minWidth: 8,
  },
});
