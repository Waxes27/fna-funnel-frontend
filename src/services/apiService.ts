import type { AxiosError, AxiosRequestConfig } from 'axios';

import { Api } from '../../clients/fNAPlatformAPIClient/apis';
import { handleApiError } from './apiError';
import { getAuthToken, setAuthToken } from './authTokenStore';

type RetryableAxiosRequestConfig = AxiosRequestConfig & {
  _retryCount?: number;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const DEFAULT_TIMEOUT = 10000;
const MAX_RETRIES = 2;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiClient = new Api({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
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

const isRetryableError = (error: AxiosError) => {
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
    return true;
  }

  if (!error.response) {
    return true;
  }

  return error.response.status >= 500 && error.response.status < 600;
};

apiClient.instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableAxiosRequestConfig | undefined;

    if (!config || !isRetryableError(error)) {
      return Promise.reject(error);
    }

    const retryCount = config._retryCount ?? 0;

    if (retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config._retryCount = retryCount + 1;
    await delay(1000 * config._retryCount);

    return apiClient.instance.request(config);
  },
);

class ApiService {
  setToken(token: string | null) {
    setAuthToken(token);
    apiClient.setSecurityData(token);
  }

  getToken() {
    return getAuthToken();
  }

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
