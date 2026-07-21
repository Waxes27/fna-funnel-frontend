import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../theme';
import { Typography } from '../Typography';

type OnboardingHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: 'left' | 'center';
};

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  title,
  eyebrow,
  description,
  align = 'left',
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={styles.container}>
      {eyebrow ? (
        <Typography variant="eyebrow" style={{ color: colors.textSecondary, textAlign: align }}>
          {eyebrow}
        </Typography>
      ) : null}

      <Typography
        variant="h2"
        style={{
          marginTop: eyebrow ? spacing.xs : 0,
          textAlign: align,
        }}
      >
        {title}
      </Typography>

      {description ? (
        <Typography
          variant="body"
          style={{
            marginTop: spacing.sm,
            color: colors.textSecondary,
            textAlign: align,
          }}
        >
          {description}
        </Typography>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
