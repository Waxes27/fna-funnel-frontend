export type AuthErrorCode =
  | 'AUTH_CALLBACK_FAILED'
  | 'DISCOVERY_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'SESSION_PERSIST_FAILED'
  | 'SESSION_RESTORE_FAILED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'TOKEN_MISSING'
  | 'UNAUTHORIZED';

type AuthErrorOptions = {
  cause?: unknown;
  shouldClearSession?: boolean;
  userMessage?: string;
};

export class AuthError extends Error {
  code: AuthErrorCode;
  cause?: unknown;
  shouldClearSession: boolean;
  userMessage?: string;

  constructor(code: AuthErrorCode, message: string, options: AuthErrorOptions = {}) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.cause = options.cause;
    this.shouldClearSession = options.shouldClearSession ?? false;
    this.userMessage = options.userMessage;
  }
}

export const isAuthError = (error: unknown): error is AuthError => error instanceof AuthError;

const getErrorStatus = (error: unknown): number | undefined => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const candidate = error as {
    response?: { status?: number };
    status?: number;
  };

  return candidate.response?.status ?? candidate.status;
};

export const shouldClearAuthSessionForError = (error: unknown): boolean => {
  if (isAuthError(error) && error.shouldClearSession) {
    return true;
  }

  const status = getErrorStatus(error);
  return status === 401;
};

export const toUserFacingAuthMessage = (
  error: unknown,
  fallback = 'We could not complete secure sign-in. Please try again.',
): string => {
  if (isAuthError(error) && error.userMessage) {
    return error.userMessage;
  }

  const status = getErrorStatus(error);

  if (status === 401) {
    return 'Your Keycloak session ended. Please sign in again.';
  }

  if (status === 403) {
    return 'You no longer have access to this session. Please sign in again.';
  }

  if (status !== undefined && status >= 500) {
    return 'The sign-in service is unavailable right now. Please try again in a moment.';
  }

  if (error instanceof Error) {
    if (error.message.toLowerCase().includes('network')) {
      return 'We could not reach the sign-in service. Check your connection and try again.';
    }
  }

  return fallback;
};
