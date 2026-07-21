import { authService } from '../authService';
import { apiClient, apiService } from '../apiService';
import { profileService } from '../profileService';

jest.mock('../profileService', () => ({
  profileService: {
    getProfile: jest.fn(),
  },
}));

const mockGetProfile = profileService.getProfile as jest.Mock;

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
    jest.clearAllMocks();
    apiService.setToken(null);
  });

  it('calls auth/me, merges the backend user, and loads the client profile', async () => {
    jest.spyOn(apiClient.api, 'currentUser').mockResolvedValue({
      data: {
        email: 'client@example.com',
        id: 'backend-user-id',
        role: 'ROLE_CLIENT',
      },
    } as any);
    mockGetProfile.mockResolvedValue({
      id: 'profile-1',
      userId: 'backend-user-id',
      fullName: 'Client User',
    });

    await expect(authService.resolveCurrentUserSession(tokenUser)).resolves.toEqual({
      user: {
        email: 'client@example.com',
        id: 'backend-user-id',
        role: 'CLIENT',
        token: 'access-token',
        type: 'Bearer',
      },
      profile: {
        id: 'profile-1',
        userId: 'backend-user-id',
        fullName: 'Client User',
      },
      isOnboardingComplete: true,
    });

    expect(apiService.getToken()).toBe('access-token');
    expect(apiClient.api.currentUser).toHaveBeenCalledTimes(1);
    expect(mockGetProfile).toHaveBeenCalledWith('backend-user-id');
  });

  it('keeps the access token when auth/me returns a null token payload', async () => {
    jest.spyOn(apiClient.api, 'currentUser').mockResolvedValue({
      data: {
        email: 'client@example.com',
        id: 'backend-user-id',
        role: 'ROLE_CLIENT',
        token: null,
        type: 'Bearer',
      },
    } as any);
    mockGetProfile.mockResolvedValue({
      id: 'profile-2',
      userId: 'backend-user-id',
      email: 'client@example.com',
    });

    await expect(authService.resolveCurrentUserSession(tokenUser)).resolves.toEqual({
      user: {
        email: 'client@example.com',
        id: 'backend-user-id',
        role: 'CLIENT',
        token: 'access-token',
        type: 'Bearer',
      },
      profile: {
        id: 'profile-2',
        userId: 'backend-user-id',
        email: 'client@example.com',
      },
      isOnboardingComplete: true,
    });
  });

  it('marks a client as needing onboarding when the profile is missing', async () => {
    jest.spyOn(apiClient.api, 'currentUser').mockResolvedValue({
      data: {
        email: 'client@example.com',
        id: 'backend-user-id',
        role: 'ROLE_CLIENT',
      },
    } as any);
    mockGetProfile.mockRejectedValue({
      status: 404,
    });

    await expect(authService.resolveCurrentUserSession(tokenUser)).resolves.toEqual({
      user: {
        email: 'client@example.com',
        id: 'backend-user-id',
        role: 'CLIENT',
        token: 'access-token',
        type: 'Bearer',
      },
      profile: null,
      isOnboardingComplete: false,
    });
  });

  it('skips profile lookup for non-client roles', async () => {
    jest.spyOn(apiClient.api, 'currentUser').mockResolvedValue({
      data: {
        email: 'advisor@example.com',
        id: 'advisor-id',
        role: 'ROLE_ADVISER',
      },
    } as any);

    await expect(authService.resolveCurrentUserSession(tokenUser)).resolves.toEqual({
      user: {
        email: 'advisor@example.com',
        id: 'advisor-id',
        role: 'ADVISER',
        token: 'access-token',
        type: 'Bearer',
      },
      profile: null,
      isOnboardingComplete: true,
    });

    expect(mockGetProfile).not.toHaveBeenCalled();
  });

  it('clears the token when auth/me fails', async () => {
    jest.spyOn(apiClient.api, 'currentUser').mockRejectedValue(new Error('Unauthorized'));

    await expect(authService.resolveCurrentUserSession(tokenUser)).rejects.toThrow(
      'Unauthorized',
    );

    expect(apiService.getToken()).toBeNull();
  });
});
