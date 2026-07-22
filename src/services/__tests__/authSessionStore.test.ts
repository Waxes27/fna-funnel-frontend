import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { AuthError } from '../authErrors';
import {
  clearPersistedAuthSession,
  loadPersistedAuthSession,
  savePersistedAuthSession,
} from '../authSessionStore';
import { keycloakIssuer } from '../keycloakAuth';

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

const createJwt = (claims: Record<string, unknown> = {}) => {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');

  return [
    encode({ alg: 'none', typ: 'JWT' }),
    encode({
      email: 'client@example.com',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iss: keycloakIssuer,
      realm_access: { roles: ['ROLE_CLIENT'] },
      sub: 'user-1',
      ...claims,
    }),
    'signature',
  ].join('.');
};

describe('authSessionStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'ios',
    });
  });

  it('saves and loads the persisted auth session', async () => {
    const session = {
      email: 'client@example.com',
      id: 'user-1',
      role: 'CLIENT',
      token: createJwt(),
      type: 'Bearer',
    };

    mockSecureStore.getItemAsync.mockResolvedValueOnce(JSON.stringify(session));

    await savePersistedAuthSession(session);

    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      'auth.session',
      JSON.stringify(session),
    );

    await expect(loadPersistedAuthSession()).resolves.toEqual(session);
  });

  it('returns null when no session is stored', async () => {
    mockSecureStore.getItemAsync.mockResolvedValueOnce(null);

    await expect(loadPersistedAuthSession()).resolves.toBeNull();
  });

  it('clears the persisted auth session', async () => {
    await clearPersistedAuthSession();

    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth.session');
  });

  it('uses localStorage on web', async () => {
    const session = {
      email: 'client@example.com',
      id: 'user-1',
      role: 'CLIENT',
      token: createJwt(),
      type: 'Bearer',
    };

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'web',
    });
    const webStorage = {
      getItem: jest.fn(() => JSON.stringify(session)),
      removeItem: jest.fn(),
      setItem: jest.fn(),
    };

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: webStorage,
    });

    await savePersistedAuthSession(session);
    await expect(loadPersistedAuthSession()).resolves.toEqual(session);
    await clearPersistedAuthSession();

    expect(webStorage.setItem).toHaveBeenCalledWith('auth.session', JSON.stringify(session));
    expect(webStorage.getItem).toHaveBeenCalledWith('auth.session');
    expect(webStorage.removeItem).toHaveBeenCalledWith('auth.session');
    expect(mockSecureStore.setItemAsync).not.toHaveBeenCalled();
    expect(mockSecureStore.getItemAsync).not.toHaveBeenCalled();
    expect(mockSecureStore.deleteItemAsync).not.toHaveBeenCalled();
  });

  it('clears corrupted persisted auth sessions and surfaces a restore error', async () => {
    mockSecureStore.getItemAsync.mockResolvedValueOnce('{not-json');

    await expect(loadPersistedAuthSession()).rejects.toEqual(
      expect.objectContaining<AuthError>({
        code: 'SESSION_RESTORE_FAILED',
        name: 'AuthError',
      }),
    );

    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth.session');
  });
});
