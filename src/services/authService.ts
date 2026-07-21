import { apiClient, apiService } from './apiService';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '../../clients/fNAPlatformAPIClient/models';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiService.execute<LoginResponse>(() => apiClient.api.login(data));
  },
  
  register: async (data: SignupRequest): Promise<SignupResponse> => {
    return apiService.execute<SignupResponse>(() => apiClient.api.register(data));
  },
};
