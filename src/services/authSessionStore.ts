import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { JwtResponse } from '../../clients/fNAPlatformAPIClient/models';
import { AuthError, isAuthError } from './authErrors';
import { authLogger } from './authLogger';
import { validateKeycloakTokenUser } from './keycloakAuth';

const AUTH_SESSION_KEY = 'auth.session';

const hasWebStorage = () => Platform.OS === 'web' && typeof globalThis.localStorage !== 'undefined';

export type PersistedAuthSession = Pick<JwtResponse, 'email' | 'id' | 'role' | 'token' | 'type'>;

const readStoredValue = async (): Promise<string | null> => {
  if (hasWebStorage()) {
    return globalThis.localStorage.getItem(AUTH_SESSION_KEY);
  }

  return SecureStore.getItemAsync(AUTH_SESSION_KEY);
};

const clearStoredValue = async () => {
  if (hasWebStorage()) {
    globalThis.localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
};

export const savePersistedAuthSession = async (session: PersistedAuthSession) => {
  const validatedSession = validateKeycloakTokenUser(session);
  const serializedSession = JSON.stringify({
    email: validatedSession.email,
    id: validatedSession.id,
    role: validatedSession.role,
    token: validatedSession.token,
    type: validatedSession.type,
  } satisfies PersistedAuthSession);

  try {
    if (hasWebStorage()) {
      globalThis.localStorage.setItem(AUTH_SESSION_KEY, serializedSession);
      return;
    }

    await SecureStore.setItemAsync(AUTH_SESSION_KEY, serializedSession);
  } catch (error) {
    authLogger.error('Failed to persist auth session', error);
    throw new AuthError('SESSION_PERSIST_FAILED', 'Unable to persist auth session.', {
      cause: error,
      userMessage: "You're signed in, but we could not securely save your session on this device.",
    });
  }
};

export const loadPersistedAuthSession = async (): Promise<PersistedAuthSession | null> => {
  const value = await readStoredValue();

  if (!value) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(value) as PersistedAuthSession;
    const validatedSession = validateKeycloakTokenUser(parsedValue);

    return {
      email: validatedSession.email,
      id: validatedSession.id,
      role: validatedSession.role,
      token: validatedSession.token,
      type: validatedSession.type,
    };
  } catch (error) {
    await clearStoredValue();

    if (isAuthError(error)) {
      authLogger.warn('Discarded invalid persisted auth session', {
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    authLogger.error('Stored auth session could not be restored', error);
    throw new AuthError('SESSION_RESTORE_FAILED', 'Stored auth session is invalid JSON.', {
      cause: error,
      shouldClearSession: true,
      userMessage: 'We could not restore your saved session. Please sign in again.',
    });
  }
};

export const clearPersistedAuthSession = async () => {
  await clearStoredValue();
};
