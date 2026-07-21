import { apiService } from '../apiService';
import {
  clearPersistedAuthSession,
  loadPersistedAuthSession,
} from '../authSessionStore';
import { authService } from '../authService';
import { bootstrapAuthSession } from '../authBootstrap';

jest.mock('../authSessionStore', () => ({
  clearPersistedAuthSession: jest.fn(),
  loadPersistedAuthSession: jest.fn(),
}));

jest.mock('../authService', () => ({
  authService: {
    resolveCurrentUserSession: jest.fn(),
  },
}));

const mockedLoadPersistedAuthSession = loadPersistedAuthSession as jest.Mock;
const mockedClearPersistedAuthSession = clearPersistedAuthSession as jest.Mock;
const mockedResolveCurrentUserSession = authService.resolveCurrentUserSession as jest.Mock;

describe('bootstrapAuthSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiService.setToken(null);
  });

  it('returns an authenticated session when the persisted session is valid', async () => {
    mockedLoadPersistedAuthSession.mockResolvedValue({
      email: 'client@example.com',
      id: 'user-1',
      role: 'ROLE_CLIENT',
      token: 'persisted-token',
      type: 'Bearer',
    });
    mockedResolveCurrentUserSession.mockResolvedValue({
      user: {
        email: 'client@example.com',
        id: 'user-1',
        role: 'CLIENT',
        token: 'persisted-token',
        type: 'Bearer',
      },
      profile: {
        id: 'profile-1',
        userId: 'user-1',
      },
      isOnboardingComplete: true,
    });

    await expect(bootstrapAuthSession()).resolves.toEqual({
      status: 'authenticated',
      session: {
        user: {
          email: 'client@example.com',
          id: 'user-1',
          role: 'CLIENT',
          token: 'persisted-token',
          type: 'Bearer',
        },
        profile: {
          id: 'profile-1',
          userId: 'user-1',
        },
        isOnboardingComplete: true,
      },
    });

    expect(apiService.getToken()).toBe('persisted-token');
    expect(mockedResolveCurrentUserSession).toHaveBeenCalledWith({
      email: 'client@example.com',
      id: 'user-1',
      role: 'ROLE_CLIENT',
      token: 'persisted-token',
      type: 'Bearer',
    });
  });

  it('returns anonymous when there is no persisted session token', async () => {
    mockedLoadPersistedAuthSession.mockResolvedValue(null);

    await expect(bootstrapAuthSession()).resolves.toEqual({
      status: 'anonymous',
    });

    expect(mockedResolveCurrentUserSession).not.toHaveBeenCalled();
    expect(apiService.getToken()).toBeNull();
  });

  it('clears persisted auth when auth/me rejects with 401', async () => {
    mockedLoadPersistedAuthSession.mockResolvedValue({
      email: 'client@example.com',
      id: 'user-1',
      role: 'CLIENT',
      token: 'expired-token',
      type: 'Bearer',
    });
    mockedResolveCurrentUserSession.mockRejectedValue({
      response: { status: 401 },
    });

    await expect(bootstrapAuthSession()).resolves.toEqual({
      status: 'anonymous',
    });

    expect(mockedClearPersistedAuthSession).toHaveBeenCalled();
    expect(apiService.getToken()).toBeNull();
  });
});
