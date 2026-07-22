import { apiService } from './apiService';
import { shouldClearAuthSessionForError, toUserFacingAuthMessage } from './authErrors';
import { authLogger } from './authLogger';
import { authService, ResolvedAuthSession } from './authService';
import {
  clearPersistedAuthSession,
  loadPersistedAuthSession,
  savePersistedAuthSession,
} from './authSessionStore';

export type BootstrapAuthResult =
  | { status: 'anonymous'; message?: string }
  | { status: 'authenticated'; session: ResolvedAuthSession };

export const bootstrapAuthSession = async (): Promise<BootstrapAuthResult> => {
  authLogger.info('Starting auth bootstrap');

  try {
    const persistedSession = await loadPersistedAuthSession();

    if (!persistedSession?.token) {
      apiService.setToken(null);
      authLogger.info('No persisted auth session found during bootstrap');
      return { status: 'anonymous' };
    }

    apiService.setToken(persistedSession.token);
    const session = await authService.resolveCurrentUserSession({
      ...persistedSession,
      token: persistedSession.token,
      type: persistedSession.type ?? 'Bearer',
    });

    try {
      await savePersistedAuthSession(session.user);
      authLogger.info('Persisted normalized auth session after bootstrap', {
        userId: session.user.id,
      });
    } catch (error) {
      authLogger.warn('Bootstrap completed but session persistence refresh failed', error);
    }

    return {
      status: 'authenticated',
      session,
    };
  } catch (error) {
    authLogger.error('Auth bootstrap failed', error);

    if (shouldClearAuthSessionForError(error)) {
      await clearPersistedAuthSession();
      apiService.setToken(null);
      return {
        status: 'anonymous',
        message: toUserFacingAuthMessage(
          error,
          'We could not restore your saved session. Please sign in again.',
        ),
      };
    }

    apiService.setToken(null);
    return {
      status: 'anonymous',
      message: toUserFacingAuthMessage(
        error,
        'We could not verify your saved session right now. Please sign in again.',
      ),
    };
  }
};
