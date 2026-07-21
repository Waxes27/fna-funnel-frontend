import React from 'react';
import { Alert, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as AuthSession from 'expo-auth-session';

import CustomButton from '../components/Button';
import { Surface } from '../components/Surface';
import { Typography } from '../components/Typography';
import {
  createKeycloakAuthRequestConfig,
  createKeycloakRedirectUri,
  exchangeKeycloakCode,
  keycloakIssuer,
  mapKeycloakTokenResponseToUser,
} from '../services/keycloakAuth';
import { authService } from '../services/authService';
import { savePersistedAuthSession } from '../services/authSessionStore';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme';

const LoginScreen = () => {
  const login = useAppStore((state) => state.login);
  const { colors, layout, spacing } = useTheme();
  const discovery = AuthSession.useAutoDiscovery(keycloakIssuer);
  const redirectUri = React.useMemo(() => createKeycloakRedirectUri(), []);
  const [isLoading, setIsLoading] = React.useState(false);
  const isPromptInFlightRef = React.useRef(false);
  const isCompletionInFlightRef = React.useRef(false);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    createKeycloakAuthRequestConfig(redirectUri),
    discovery,
  );

  React.useEffect(() => {
    if (isCompletionInFlightRef.current) {
      return;
    }

    if (
      response?.type !== 'success' ||
      !response.params.code ||
      !request?.codeVerifier ||
      !discovery
    ) {
      if (response?.type === 'error') {
        setIsLoading(false);
        Alert.alert(
          'Keycloak sign-in failed',
          response.error?.message || 'Unable to complete Keycloak sign-in.',
        );
      }

      if (response?.type === 'cancel' || response?.type === 'dismiss') {
        setIsLoading(false);
      }

      return;
    }

    let isMounted = true;

    const completeKeycloakLogin = async () => {
      isCompletionInFlightRef.current = true;

      try {
        const tokenResponse = await exchangeKeycloakCode({
          code: response.params.code,
          codeVerifier: request.codeVerifier!,
          discovery,
          redirectUri,
        });

        const tokenUser = mapKeycloakTokenResponseToUser(tokenResponse);
        const resolvedSession = await authService.resolveCurrentUserSession(tokenUser);
        await savePersistedAuthSession(resolvedSession.user);
        login(resolvedSession.user, {
          profile: resolvedSession.profile,
          isOnboardingComplete: resolvedSession.isOnboardingComplete,
        });
      } catch (error: any) {
        if (isMounted) {
          Alert.alert(
            'Keycloak sign-in failed',
            error?.message || 'Unable to exchange the authorization code with Keycloak.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
        isCompletionInFlightRef.current = false;
      }
    };

    completeKeycloakLogin();

    return () => {
      isMounted = false;
    };
  }, [discovery, login, redirectUri, request?.codeVerifier, response]);

  const handleKeycloakPress = async () => {
    if (isPromptInFlightRef.current || isCompletionInFlightRef.current || isLoading) {
      return;
    }

    if (!request) {
      Alert.alert(
        'Keycloak not ready',
        'The Keycloak configuration is still loading. Please try again in a moment.',
      );
      return;
    }

    setIsLoading(true);
    isPromptInFlightRef.current = true;

    try {
      const result = await promptAsync();

      if (result.type !== 'success') {
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(
        'Keycloak sign-in failed',
        error?.message || 'Unable to open the Keycloak login screen.',
      );
    } finally {
      isPromptInFlightRef.current = false;
    }
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
            <Typography variant="body" style={[styles.subtitle, { color: colors.textSecondary }]}>
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
              <CustomButton
                title="Continue With Keycloak"
                onPress={handleKeycloakPress}
                isLoading={isLoading}
                disabled={!request || !discovery}
                style={styles.primaryButton}
              />
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
  subtitle: {
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
  },
  primaryButton: {
    width: '100%',
  },
});

export default LoginScreen;
