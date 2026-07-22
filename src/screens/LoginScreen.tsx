import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
import { AuthError, toUserFacingAuthMessage } from '../services/authErrors';
import { authLogger } from '../services/authLogger';
import { authService } from '../services/authService';
import { savePersistedAuthSession } from '../services/authSessionStore';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme';

const LoginScreen = () => {
  const login = useAppStore((state) => state.login);
  const authStatusMessage = useAppStore((state) => state.authStatusMessage);
  const clearAuthStatusMessage = useAppStore((state) => state.clearAuthStatusMessage);
  const { colors, layout, spacing } = useTheme();
  const discovery = AuthSession.useAutoDiscovery(keycloakIssuer);
  const redirectUri = React.useMemo(() => createKeycloakRedirectUri(), []);
  const [authErrorMessage, setAuthErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const isPromptInFlightRef = React.useRef(false);
  const isCompletionInFlightRef = React.useRef(false);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    createKeycloakAuthRequestConfig(redirectUri),
    discovery,
  );
  const feedbackMessage = authErrorMessage ?? authStatusMessage;

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
        authLogger.error('Keycloak auth session returned an error response', response.error);
        setAuthErrorMessage(
          toUserFacingAuthMessage(
            new AuthError('AUTH_CALLBACK_FAILED', 'Keycloak returned an auth session error.', {
              cause: response.error,
              userMessage:
                response.error?.message || 'Keycloak could not complete sign-in. Please try again.',
            }),
          ),
        );
        setIsLoading(false);
      }

      if (response?.type === 'cancel' || response?.type === 'dismiss') {
        authLogger.info('Keycloak auth session was dismissed by the user');
        setIsLoading(false);
        setAuthErrorMessage(null);
      }

      return;
    }

    let isMounted = true;

    const completeKeycloakLogin = async () => {
      isCompletionInFlightRef.current = true;
      authLogger.info('Completing Keycloak login after authorization code exchange');

      try {
        const tokenResponse = await exchangeKeycloakCode({
          code: response.params.code,
          codeVerifier: request.codeVerifier!,
          discovery,
          redirectUri,
        });

        const tokenUser = mapKeycloakTokenResponseToUser(tokenResponse);
        const resolvedSession = await authService.resolveCurrentUserSession(tokenUser);
        clearAuthStatusMessage();
        setAuthErrorMessage(null);
        login(resolvedSession.user, {
          profile: resolvedSession.profile,
          isOnboardingComplete: resolvedSession.isOnboardingComplete,
        });
        authLogger.info('Keycloak login completed successfully', {
          role: resolvedSession.user.role,
          userId: resolvedSession.user.id,
        });

        try {
          await savePersistedAuthSession(resolvedSession.user);
          authLogger.info('Persisted authenticated session after login', {
            userId: resolvedSession.user.id,
          });
        } catch (storageError) {
          authLogger.warn('Failed to persist auth session after successful login', storageError);
        }
      } catch (error) {
        authLogger.error('Keycloak login failed while resolving authenticated session', error);
        if (isMounted) {
          setAuthErrorMessage(
            toUserFacingAuthMessage(error, 'Unable to complete secure sign-in. Please try again.'),
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
  }, [clearAuthStatusMessage, discovery, login, redirectUri, request?.codeVerifier, response]);

  const handleKeycloakPress = async () => {
    if (isPromptInFlightRef.current || isCompletionInFlightRef.current || isLoading) {
      return;
    }

    clearAuthStatusMessage();
    setAuthErrorMessage(null);

    if (!request) {
      setAuthErrorMessage(
        toUserFacingAuthMessage(
          new AuthError('DISCOVERY_UNAVAILABLE', 'Keycloak discovery document is not ready.', {
            userMessage: 'Secure sign-in is still preparing. Please try again in a moment.',
          }),
        ),
      );
      return;
    }

    setIsLoading(true);
    isPromptInFlightRef.current = true;
    authLogger.info('Opening Keycloak sign-in');

    try {
      const result = await promptAsync();

      if (result.type !== 'success') {
        authLogger.info('Keycloak sign-in did not return a success result', {
          type: result.type,
        });
        setIsLoading(false);
      }
    } catch (error) {
      authLogger.error('Failed to open Keycloak sign-in screen', error);
      setIsLoading(false);
      setAuthErrorMessage(
        toUserFacingAuthMessage(
          error,
          'Unable to open the Keycloak sign-in screen. Please try again.',
        ),
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
              {!discovery ? (
                <Typography
                  variant="footerLink"
                  style={[styles.feedbackMessage, { color: colors.textSecondary }]}
                >
                  Preparing secure sign-in...
                </Typography>
              ) : null}
              {feedbackMessage ? (
                <Typography
                  variant="footerLink"
                  style={[styles.feedbackMessage, { color: colors.signalOrange }]}
                >
                  {feedbackMessage}
                </Typography>
              ) : null}
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
  feedbackMessage: {
    marginBottom: 12,
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
  },
});

export default LoginScreen;
