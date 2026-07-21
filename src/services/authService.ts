import { apiClient, apiService } from './apiService';
import {
  JwtResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '../../clients/fNAPlatformAPIClient/models';
import { normalizeAuthenticatedUser } from './authUser';

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

  resolveCurrentUserSession: async (tokenUser: JwtResponse): Promise<JwtResponse> => {
    apiService.setToken(tokenUser.token ?? null);

    try {
      const backendUser = await authService.currentUser();
      return mergeAuthenticatedUser(tokenUser, backendUser);
    } catch (error) {
      apiService.setToken(null);
      throw error;
    }
  },
};
