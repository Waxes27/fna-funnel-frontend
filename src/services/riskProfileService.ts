import { apiClient, apiService } from './apiService';
import { RiskProfileDTO } from '../../clients/fNAPlatformAPIClient/models';

export const riskProfileService = {
  getRiskProfile: async (profileId: string): Promise<RiskProfileDTO> => {
    return apiService.execute<RiskProfileDTO>(() => apiClient.getRiskProfile(profileId));
  },
  
  submitRiskProfile: async (profileId: string, data: Record<string, number>): Promise<RiskProfileDTO> => {
    return apiService.execute<RiskProfileDTO>(() => apiClient.submitRiskProfile(profileId, data));
  },
};
