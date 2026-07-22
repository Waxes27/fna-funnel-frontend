const AUTH_LOG_PREFIX = '[auth]';
const REDACTED_KEYS = ['accessToken', 'codeVerifier', 'idToken', 'refreshToken', 'token'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const sanitizeAuthDetails = (value: unknown, depth = 0): unknown => {
  if (depth > 3) {
    return '[truncated]';
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeAuthDetails(entry, depth + 1));
  }

  if (isRecord(value)) {
    return Object.entries(value).reduce<Record<string, unknown>>((result, [key, entry]) => {
      result[key] = REDACTED_KEYS.includes(key)
        ? '[redacted]'
        : sanitizeAuthDetails(entry, depth + 1);
      return result;
    }, {});
  }

  return value;
};

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    const errorWithStatus = error as Error & {
      code?: string;
      response?: { status?: number };
      status?: number;
    };

    return sanitizeAuthDetails({
      code: errorWithStatus.code,
      message: error.message,
      name: error.name,
      status: errorWithStatus.response?.status ?? errorWithStatus.status,
    });
  }

  return sanitizeAuthDetails(error);
};

export const authLogger = {
  error: (event: string, error: unknown, details?: unknown) => {
    console.error(AUTH_LOG_PREFIX, event, {
      details: sanitizeAuthDetails(details),
      error: serializeError(error),
    });
  },
  info: (event: string, details?: unknown) => {
    console.log(AUTH_LOG_PREFIX, event, sanitizeAuthDetails(details));
  },
  warn: (event: string, details?: unknown) => {
    console.warn(AUTH_LOG_PREFIX, event, sanitizeAuthDetails(details));
  },
};
