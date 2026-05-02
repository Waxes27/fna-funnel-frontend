import { Api } from '../../clients/fNAPlatformAPIClient/apis';
import { handleApiError } from './apiError';

// Constants
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.231.178.143:8080';
const DEFAULT_TIMEOUT = 10000;
const MAX_RETRIES = 2;

// Utility for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Custom fetch implementation with timeout and retry logic
const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  let attempt = 0;
  
  while (attempt <= MAX_RETRIES) {
    const controller = new AbortController();
    
    // Create timeout using AbortSignal.any if available, or just fallback to our own abort
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    try {
      // Merge external signal with our timeout signal
      const signal = init?.signal ? 
        (AbortSignal as any).any?.([init.signal, controller.signal]) || controller.signal : 
        controller.signal;

      const response = await fetch(input, {
        ...init,
        signal,
      });
      clearTimeout(timeoutId);

      // Retry on 5xx errors
      if (response.status >= 500 && response.status < 600 && attempt < MAX_RETRIES) {
        attempt++;
        await delay(1000 * attempt); // Exponential backoff
        continue;
      }

      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Retry on network errors or timeouts
      const isTransientError = error.name === 'AbortError' || 
                              error.message?.includes('Network request failed') ||
                              error.message?.includes('fetch failed');

      if (isTransientError && attempt < MAX_RETRIES) {
        attempt++;
        await delay(1000 * attempt);
        continue;
      }

      throw error;
    }
  }

  throw new Error('Max retries exceeded');
};

// Initialize the API client
export const apiClient = new Api({
  baseUrl: API_BASE_URL,
  customFetch,
  securityWorker: async (token: string | null) => {
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  },
});

// A helper class to manage global token, etc.
class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    apiClient.setSecurityData(token);
  }

  getToken() {
    return this.token;
  }

  /**
   * Helper to execute API calls with standardized error handling
   */
  async execute<T>(apiCall: () => Promise<any>): Promise<T> {
    try {
      const response = await apiCall();
      return response.data || response;
    } catch (error: any) {
      // Use our custom error handler
      throw handleApiError(error);
    }
  }
}

export const apiService = new ApiService();
