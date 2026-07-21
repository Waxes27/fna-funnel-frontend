import { apiService } from './apiService';
import { authService, ResolvedAuthSession } from './authService';
import {
  clearPersistedAuthSession,
  loadPersistedAuthSession,
} from './authSessionStore';

export type BootstrapAuthResult =
  | { status: 'anonymous' }
  | { status: 'authenticated'; session: ResolvedAuthSession };

export const bootstrapAuthSession = async (): Promise<BootstrapAuthResult> => {
  const persistedSession = await loadPersistedAuthSession();

  if (!persistedSession?.token) {
    apiService.setToken(null);
    return { status: 'anonymous' };
  }

  try {
    apiService.setToken(persistedSession.token);

    return {
      status: 'authenticated',
      session: await authService.resolveCurrentUserSession({
        ...persistedSession,
        token: persistedSession.token,
        type: persistedSession.type ?? 'Bearer',
      }),
    };
  } catch (error: any) {
    if (error?.status === 401 || error?.response?.status === 401) {
      await clearPersistedAuthSession();
      apiService.setToken(null);
      return { status: 'anonymous' };
    }

    throw error;
  }
};
