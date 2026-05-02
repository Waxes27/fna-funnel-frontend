import { apiClient, apiService } from '../apiService';
import { ApiError } from '../apiError';

// Mock the delay utility if needed, though we can also just use fake timers
jest.useFakeTimers();

describe('ApiService', () => {
  const mockFetch = jest.fn();
  
  beforeAll(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    mockFetch.mockClear();
    apiService.setToken(null);
  });

  it('should successfully execute an API call', async () => {
    const mockData = { id: '123', name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
      clone: function() { return this; }
    });

    const response = await apiService.execute(() => apiClient.ping());
    // Note: ping endpoint returns string but for generic test we just check if it resolves
    expect(response).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should include Authorization header when token is set', async () => {
    apiService.setToken('test-token-123');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ message: 'ok' }),
      clone: function() { return this; }
    });

    await apiClient.ping();
    
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchArgs = mockFetch.mock.calls[0];
    expect(fetchArgs[1].headers).toHaveProperty('Authorization', 'Bearer test-token-123');
  });

  it('should throw ApiError for network failures', async () => {
    const networkError = new Error('Network request failed');
    networkError.name = 'TypeError';
    
    // Will fail on first try, then retry twice
    mockFetch.mockRejectedValue(networkError);

    const promise = apiService.execute(() => apiClient.ping()).catch(e => e);
    
    // Fast-forward timers for the exponential backoff retries
    await jest.runAllTimersAsync();

    const err = await promise;
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({
      isNetworkError: true,
      message: 'Network connection failed. Please check your internet connection.'
    });

    // Should have tried 3 times (1 initial + 2 retries)
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should throw ApiError for 401 Unauthorized', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
      clone: function() { return this; }
    });

    const promise = apiService.execute(() => apiClient.ping());

    await expect(promise).rejects.toThrow(ApiError);
    await expect(promise).rejects.toMatchObject({
      status: 401,
      message: 'Unauthorized. Please log in again.'
    });
    
    // 401 should not trigger retries
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on 500 Server Error and succeed if subsequent call works', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server Error' }),
        clone: function() { return this; }
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: 'pong',
        json: async () => 'pong',
        clone: function() { return this; }
      });

    const promise = apiService.execute(() => apiClient.ping());
    
    await jest.runAllTimersAsync();

    const response = await promise;
    expect(response).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should throw ApiError for AbortError (timeout)', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    
    mockFetch.mockRejectedValue(abortError);

    const promise = apiService.execute(() => apiClient.ping()).catch(e => e);
    
    await jest.runAllTimersAsync();

    const err = await promise;
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({
      isTimeout: true,
      message: 'The request timed out. Please try again later.'
    });
  });
});
