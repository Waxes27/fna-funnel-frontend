import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Screen } from '../components/Screen';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme';

const AuthBootstrapScreen = () => {
  const { colors, spacing } = useTheme();

  return (
    <Screen>
      <View style={[styles.container, { paddingHorizontal: spacing.lg }]}>
        <ActivityIndicator size="large" color={colors.ink} />
        <View style={{ height: spacing.md }} />
        <Typography variant="h3">Restoring your session</Typography>
        <View style={{ height: spacing.xs }} />
        <Typography
          variant="body"
          style={[styles.message, { color: colors.textSecondary }]}
        >
          Checking your secure sign-in before loading the app.
        </Typography>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
  },
});

export default AuthBootstrapScreen;
