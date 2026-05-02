import { apiClient, apiService } from './apiService';
import { FinancialDataDTO } from '../../clients/fNAPlatformAPIClient/models';

export const financialDataService = {
  getFinancialData: async (profileId: string): Promise<FinancialDataDTO> => {
    return apiService.execute<FinancialDataDTO>(() => apiClient.getFinancialData(profileId));
  },
  
  createOrUpdateFinancialData: async (profileId: string, data: FinancialDataDTO): Promise<FinancialDataDTO> => {
    return apiService.execute<FinancialDataDTO>(() => apiClient.createOrUpdateFinancialData(profileId, data));
  },
};
