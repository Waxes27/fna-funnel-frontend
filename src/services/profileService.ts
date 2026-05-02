import { apiClient, apiService } from './apiService';
import { ClientProfileDTO } from '../../clients/fNAPlatformAPIClient/models';

export const profileService = {
  getProfile: async (userId: string): Promise<ClientProfileDTO> => {
    return apiService.execute<ClientProfileDTO>(() => apiClient.getProfile(userId));
  },
  
  createOrUpdateProfile: async (userId: string, data: ClientProfileDTO): Promise<ClientProfileDTO> => {
    return apiService.execute<ClientProfileDTO>(() => apiClient.createOrUpdateProfile(userId, data));
  },
};
