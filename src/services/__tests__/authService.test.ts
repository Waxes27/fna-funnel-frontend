import { authService } from '../authService';
import { apiClient, apiService } from '../apiService';

describe('authService.resolveCurrentUserSession', () => {
  const tokenUser = {
    email: 'token@example.com',
    id: 'token-user-id',
    role: 'CLIENT',
    token: 'access-token',
    type: 'Bearer',
  };

  afterEach(() => {
    jest.restoreAllMocks();
    apiService.setToken(null);
  });

  it('calls auth/me and merges the backend user with the access token', async () => {
    jest.spyOn(apiClient.api, 'currentUser').mockResolvedValue({
      data: {
        email: 'backend@example.com',
        id: 'backend-user-id',
        role: 'ADVISER',
      },
    } as any);

    await expect(authService.resolveCurrentUserSession(tokenUser)).resolves.toEqual({
      email: 'backend@example.com',
      id: 'backend-user-id',
      role: 'ADVISER',
      token: 'access-token',
      type: 'Bearer',
    });

    expect(apiService.getToken()).toBe('access-token');
    expect(apiClient.api.currentUser).toHaveBeenCalledTimes(1);
  });

  it('clears the token when auth/me fails', async () => {
    jest.spyOn(apiClient.api, 'currentUser').mockRejectedValue(new Error('Unauthorized'));

    await expect(authService.resolveCurrentUserSession(tokenUser)).rejects.toThrow(
      'Unauthorized',
    );

    expect(apiService.getToken()).toBeNull();
  });
});
