import * as SecureStore from 'expo-secure-store';

import { JwtResponse } from '../../clients/fNAPlatformAPIClient/models';

const AUTH_SESSION_KEY = 'auth.session';

export type PersistedAuthSession = Pick<
  JwtResponse,
  'email' | 'id' | 'role' | 'token' | 'type'
>;

export const savePersistedAuthSession = async (
  session: PersistedAuthSession,
) => {
  await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const loadPersistedAuthSession = async (): Promise<PersistedAuthSession | null> => {
  const value = await SecureStore.getItemAsync(AUTH_SESSION_KEY);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as PersistedAuthSession;
};

export const clearPersistedAuthSession = async () => {
  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
};
