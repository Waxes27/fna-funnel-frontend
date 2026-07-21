import { JwtResponse } from '../../clients/fNAPlatformAPIClient/models';
import { apiClient, apiService } from './apiService';
import { normalizeAuthenticatedUser } from './authUser';
import {
  clearPersistedAuthSession,
  loadPersistedAuthSession,
} from './authSessionStore';

export type BootstrapAuthResult =
  | { status: 'anonymous' }
  | { status: 'authenticated'; user: JwtResponse };

export const bootstrapAuthSession = async (): Promise<BootstrapAuthResult> => {
  const persistedSession = await loadPersistedAuthSession();

  if (!persistedSession?.token) {
    apiService.setToken(null);
    return { status: 'anonymous' };
  }

  try {
    apiService.setToken(persistedSession.token);

    const response = await apiClient.api.currentUser();

    return {
      status: 'authenticated',
      user: normalizeAuthenticatedUser({
        ...response.data,
        token: persistedSession.token,
        type: persistedSession.type ?? 'Bearer',
      }),
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      await clearPersistedAuthSession();
      apiService.setToken(null);
      return { status: 'anonymous' };
    }

    throw error;
  }
};
