import React from 'react';
import { Alert, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import CustomButton from '../components/Button';
import { Surface } from '../components/Surface';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme';

const LoginScreen = () => {
  const { colors, layout, spacing } = useTheme();

  const handleKeycloakPress = () => {
    Alert.alert(
      'Keycloak sign-in',
      'Connect the Keycloak authentication flow to enable sign-in from this screen.',
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.canvas }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={[styles.scrollContainer, { padding: spacing.lg }]}>
        <View style={[styles.inner, { maxWidth: layout.maxWidth }]}>
          <View style={[styles.headerContainer, { marginBottom: spacing.xl }]}>
            <Typography variant="h2">Welcome Back</Typography>
            <View style={{ height: spacing.xs }} />
            <Typography variant="body" style={{ color: colors.textSecondary, textAlign: 'center' }}>
              Continue securely with your organization identity provider.
            </Typography>
          </View>

          <Surface
            radius="frame"
            shadow="level2"
            bordered
            style={{ backgroundColor: colors.surfaceRaised, padding: spacing.lg }}
          >
            <View style={styles.actionContainer}>
              <CustomButton title="Continue With Keycloak" onPress={handleKeycloakPress} style={{ width: '100%' }} />
            </View>
          </Surface>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
  headerContainer: {
    alignItems: 'center',
  },
  actionContainer: {
    width: '100%',
  },
});

export default LoginScreen;
