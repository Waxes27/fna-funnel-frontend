import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { JwtResponse } from '../../clients/fNAPlatformAPIClient/models';

const AUTH_SESSION_KEY = 'auth.session';

const hasWebStorage = () =>
  Platform.OS === 'web' && typeof globalThis.localStorage !== 'undefined';

export type PersistedAuthSession = Pick<
  JwtResponse,
  'email' | 'id' | 'role' | 'token' | 'type'
>;

export const savePersistedAuthSession = async (
  session: PersistedAuthSession,
) => {
  if (hasWebStorage()) {
    globalThis.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    return;
  }

  await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const loadPersistedAuthSession = async (): Promise<PersistedAuthSession | null> => {
  if (hasWebStorage()) {
    const value = globalThis.localStorage.getItem(AUTH_SESSION_KEY);
    return value ? (JSON.parse(value) as PersistedAuthSession) : null;
  }

  const value = await SecureStore.getItemAsync(AUTH_SESSION_KEY);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as PersistedAuthSession;
};

export const clearPersistedAuthSession = async () => {
  if (hasWebStorage()) {
    globalThis.localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
};
