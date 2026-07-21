export class ApiError extends Error {
  public status?: number;
  public data?: any;
  public isNetworkError?: boolean;
  public isTimeout?: boolean;

  constructor(message: string, status?: number, data?: any, isNetworkError = false, isTimeout = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (
    error?.code === 'ERR_NETWORK' ||
    (error.name === 'TypeError' && error.message?.includes('Network request failed')) ||
    error.message?.includes('Network Error')
  ) {
    return new ApiError('Network connection failed. Please check your internet connection.', undefined, undefined, true);
  }

  if (error?.code === 'ECONNABORTED' || error.name === 'AbortError') {
    return new ApiError('The request timed out. Please try again later.', undefined, undefined, false, true);
  }

  const status = error?.response?.status ?? error?.status;

  if (status) {
    let errorMessage = 'An unexpected error occurred.';

    switch (status) {
      case 400:
        errorMessage = 'Invalid request. Please check your data.';
        break;
      case 401:
        errorMessage = 'Unauthorized. Please log in again.';
        break;
      case 403:
        errorMessage = 'Forbidden. You do not have permission to access this resource.';
        break;
      case 404:
        errorMessage = 'Resource not found.';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = 'Server error. Please try again later.';
        break;
      default:
        errorMessage = `HTTP Error ${status}.`;
    }

    return new ApiError(errorMessage, status, error?.response?.data || error.data || error);
  }

  return new ApiError(error.message || 'An unknown error occurred.');
};
