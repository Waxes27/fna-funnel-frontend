import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthBootstrapScreen from '../screens/AuthBootstrapScreen';
import { apiService } from '../services/apiService';
import { bootstrapAuthSession } from '../services/authBootstrap';
import { toUserFacingAuthMessage } from '../services/authErrors';
import { authLogger } from '../services/authLogger';
import { useAppStore } from '../store/appStore';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';

export const RootNavigator = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isAuthBootstrapping = useAppStore((state) => state.isAuthBootstrapping);
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);
  const applyAuthenticatedUser = useAppStore((state) => state.applyAuthenticatedUser);
  const clearAuthStatusMessage = useAppStore((state) => state.clearAuthStatusMessage);
  const expireAuthSession = useAppStore((state) => state.expireAuthSession);
  const finishAuthBootstrap = useAppStore((state) => state.finishAuthBootstrap);
  const setAuthStatusMessage = useAppStore((state) => state.setAuthStatusMessage);

  React.useEffect(() => {
    apiService.setUnauthorizedHandler((error) => {
      authLogger.warn('Received unauthorized response from API', {
        status: error.response?.status,
      });
      expireAuthSession(toUserFacingAuthMessage(error)).catch((logoutError) => {
        authLogger.error(
          'Failed to expire auth session after unauthorized API response',
          logoutError,
        );
      });
    });

    return () => {
      apiService.setUnauthorizedHandler(null);
    };
  }, [expireAuthSession]);

  React.useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const result = await bootstrapAuthSession();

        if (!isMounted) {
          return;
        }

        if (result.status === 'authenticated') {
          applyAuthenticatedUser(result.session.user, {
            profile: result.session.profile,
            isOnboardingComplete: result.session.isOnboardingComplete,
          });
          return;
        }

        if (result.message) {
          setAuthStatusMessage(result.message);
        } else {
          clearAuthStatusMessage();
        }
        finishAuthBootstrap();
      } catch (error) {
        authLogger.error('Unhandled auth bootstrap failure', error);
        if (isMounted) {
          setAuthStatusMessage(
            toUserFacingAuthMessage(
              error,
              'We could not restore your secure sign-in state. Please sign in again.',
            ),
          );
          finishAuthBootstrap();
        }
      }
    };

    restoreSession().catch((error) => {
      authLogger.error('Auth bootstrap effect failed unexpectedly', error);
    });

    return () => {
      isMounted = false;
    };
  }, [applyAuthenticatedUser, clearAuthStatusMessage, finishAuthBootstrap, setAuthStatusMessage]);

  return (
    <NavigationContainer>
      {isAuthBootstrapping ? (
        <AuthBootstrapScreen />
      ) : !isAuthenticated ? (
        <AuthNavigator />
      ) : !isOnboardingComplete ? (
        <OnboardingNavigator />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  );
};
