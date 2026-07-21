import { apiClient, apiService } from '../apiService';
import {
  clearPersistedAuthSession,
  loadPersistedAuthSession,
} from '../authSessionStore';
import { bootstrapAuthSession } from '../authBootstrap';

jest.mock('../authSessionStore', () => ({
  clearPersistedAuthSession: jest.fn(),
  loadPersistedAuthSession: jest.fn(),
}));

const mockedLoadPersistedAuthSession = loadPersistedAuthSession as jest.Mock;
const mockedClearPersistedAuthSession = clearPersistedAuthSession as jest.Mock;

describe('bootstrapAuthSession', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    apiService.setToken(null);
  });

  it('returns an authenticated user when persisted session is valid', async () => {
    mockedLoadPersistedAuthSession.mockResolvedValue({
      email: 'client@example.com',
      id: 'user-1',
      role: 'ROLE_CLIENT',
      token: 'persisted-token',
      type: 'Bearer',
    });

    jest.spyOn(apiClient.api, 'currentUser').mockResolvedValue({
      data: {
        email: 'client@example.com',
        id: 'user-1',
        role: 'ROLE_CLIENT',
      },
    } as any);

    await expect(bootstrapAuthSession()).resolves.toEqual({
      status: 'authenticated',
      user: {
        email: 'client@example.com',
        id: 'user-1',
        role: 'CLIENT',
        token: 'persisted-token',
        type: 'Bearer',
      },
    });

    expect(apiService.getToken()).toBe('persisted-token');
  });

  it('returns anonymous when there is no persisted session token', async () => {
    mockedLoadPersistedAuthSession.mockResolvedValue(null);

    const currentUserSpy = jest
      .spyOn(apiClient.api, 'currentUser')
      .mockResolvedValue({ data: {} } as any);

    await expect(bootstrapAuthSession()).resolves.toEqual({
      status: 'anonymous',
    });

    expect(currentUserSpy).not.toHaveBeenCalled();
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

    jest.spyOn(apiClient.api, 'currentUser').mockRejectedValue({
      response: { status: 401 },
    });

    await expect(bootstrapAuthSession()).resolves.toEqual({
      status: 'anonymous',
    });

    expect(mockedClearPersistedAuthSession).toHaveBeenCalled();
    expect(apiService.getToken()).toBeNull();
  });
});
