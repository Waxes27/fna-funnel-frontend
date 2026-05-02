import { apiClient, apiService } from './apiService';

export const healthService = {
  ping: async (): Promise<string> => {
    return apiService.execute<string>(() => apiClient.ping());
  },
};
