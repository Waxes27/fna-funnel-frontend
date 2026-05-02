import { apiClient, apiService } from './apiService';
import { LoginRequest, SignupRequest, JwtResponse, MessageResponse } from '../../clients/fNAPlatformAPIClient/models';

export const authService = {
  login: async (data: LoginRequest): Promise<JwtResponse> => {
    return apiService.execute<JwtResponse>(() => apiClient.authenticateUser(data));
  },
  
  register: async (data: SignupRequest): Promise<MessageResponse> => {
    return apiService.execute<MessageResponse>(() => apiClient.registerUser(data));
  },
};
