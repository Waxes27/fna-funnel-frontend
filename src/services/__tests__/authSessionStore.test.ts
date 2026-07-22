import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import {
  clearPersistedAuthSession,
  loadPersistedAuthSession,
  savePersistedAuthSession,
} from '../authSessionStore';

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

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
      token: 'access-token',
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
      token: 'access-token',
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
});
