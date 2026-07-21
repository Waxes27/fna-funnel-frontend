import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthBootstrapScreen from '../screens/AuthBootstrapScreen';
import { bootstrapAuthSession } from '../services/authBootstrap';
import { useAppStore } from '../store/appStore';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';

export const RootNavigator = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isAuthBootstrapping = useAppStore((state) => state.isAuthBootstrapping);
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);
  const applyAuthenticatedUser = useAppStore((state) => state.applyAuthenticatedUser);
  const finishAuthBootstrap = useAppStore((state) => state.finishAuthBootstrap);

  React.useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const result = await bootstrapAuthSession();

        if (!isMounted) {
          return;
        }

        if (result.status === 'authenticated') {
          applyAuthenticatedUser(result.user);
          return;
        }

        finishAuthBootstrap();
      } catch {
        if (isMounted) {
          finishAuthBootstrap();
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [applyAuthenticatedUser, finishAuthBootstrap]);

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
