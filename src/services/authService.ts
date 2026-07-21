import { ClientProfileDTO, JwtResponse, LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../../clients/fNAPlatformAPIClient/apis';
import { apiClient, apiService } from './apiService';
import {
  normalizeAuthenticatedUser,
  normalizeAuthRole,
} from './authUser';
import { profileService } from './profileService';

export type ResolvedAuthSession = {
  user: JwtResponse;
  profile: ClientProfileDTO | null;
  isOnboardingComplete: boolean;
};

const mergeAuthenticatedUser = (
  tokenUser: JwtResponse,
  backendUser: Partial<JwtResponse>,
): JwtResponse =>
  normalizeAuthenticatedUser({
    ...tokenUser,
    ...backendUser,
    id: backendUser.id ?? tokenUser.id,
    email: backendUser.email ?? tokenUser.email,
    role: backendUser.role ?? tokenUser.role,
    token: tokenUser.token,
    type: tokenUser.type || backendUser.type || 'Bearer',
  });

const hasMeaningfulProfileValue = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(hasMeaningfulProfileValue);
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some(hasMeaningfulProfileValue);
  }

  return false;
};

const hasClientProfile = (profile: ClientProfileDTO | null | undefined): profile is ClientProfileDTO =>
  Boolean(profile) && hasMeaningfulProfileValue(profile);

const resolveClientAuthSession = async (
  user: JwtResponse,
): Promise<ResolvedAuthSession> => {
  if (normalizeAuthRole(user.role) !== 'CLIENT') {
    return {
      user,
      profile: null,
      isOnboardingComplete: true,
    };
  }

  if (!user.id) {
    return {
      user,
      profile: null,
      isOnboardingComplete: false,
    };
  }

  try {
    const profile = await profileService.getProfile(user.id);
    const resolvedProfile = hasClientProfile(profile) ? profile : null;

    return {
      user,
      profile: resolvedProfile,
      isOnboardingComplete: Boolean(resolvedProfile),
    };
  } catch (error: any) {
    if (error?.status === 404) {
      return {
        user,
        profile: null,
        isOnboardingComplete: false,
      };
    }

    throw error;
  }
};

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiService.execute<LoginResponse>(() => apiClient.api.login(data));
  },

  register: async (data: SignupRequest): Promise<SignupResponse> => {
    return apiService.execute<SignupResponse>(() => apiClient.api.register(data));
  },

  currentUser: async (): Promise<JwtResponse> => {
    return apiService.execute<JwtResponse>(() => apiClient.api.currentUser());
  },

  resolveCurrentUserSession: async (tokenUser: JwtResponse): Promise<ResolvedAuthSession> => {
    apiService.setToken(tokenUser.token ?? null);

    try {
      const backendUser = await authService.currentUser();
      return resolveClientAuthSession(mergeAuthenticatedUser(tokenUser, backendUser));
    } catch (error) {
      apiService.setToken(null);
      throw error;
    }
  },
};
