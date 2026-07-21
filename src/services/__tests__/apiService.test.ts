import MockAdapter from 'axios-mock-adapter';

import { apiClient, apiService } from '../apiService';
import { ApiError } from '../apiError';

jest.useFakeTimers();

describe('ApiService', () => {
  const mockApi = new MockAdapter(apiClient.instance);

  afterEach(() => {
    mockApi.reset();
    apiService.setToken(null);
  });

  it('should successfully execute an API call', async () => {
    mockApi.onGet('/api/v1/ping').reply(200, 'pong');

    const response = await apiService.execute(() => apiClient.api.ping());

    expect(response).toBe('pong');
    expect(mockApi.history.get).toHaveLength(1);
  });

  it('should include Authorization header when token is set', async () => {
    apiService.setToken('test-token-123');
    mockApi.onGet('/api/v1/ping').reply(200, 'pong');

    await apiClient.api.ping();

    expect(mockApi.history.get).toHaveLength(1);
    expect(mockApi.history.get[0].headers).toMatchObject({
      Authorization: 'Bearer test-token-123',
    });
  });

  it('should throw ApiError for network failures', async () => {
    mockApi.onGet('/api/v1/ping').networkError();

    const promise = apiService.execute(() => apiClient.api.ping()).catch((e) => e);

    await jest.runAllTimersAsync();

    const err = await promise;
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({
      isNetworkError: true,
      message: 'Network connection failed. Please check your internet connection.'
    });

    expect(mockApi.history.get).toHaveLength(3);
  });

  it('should throw ApiError for 401 Unauthorized', async () => {
    mockApi.onGet('/api/v1/ping').reply(401, { error: 'Unauthorized' });

    const promise = apiService.execute(() => apiClient.api.ping());

    await expect(promise).rejects.toThrow(ApiError);
    await expect(promise).rejects.toMatchObject({
      status: 401,
      message: 'Unauthorized. Please log in again.'
    });

    expect(mockApi.history.get).toHaveLength(1);
  });

  it('should retry on 500 Server Error and succeed if subsequent call works', async () => {
    mockApi
      .onGet('/api/v1/ping')
      .replyOnce(500, { error: 'Server Error' })
      .onGet('/api/v1/ping')
      .replyOnce(200, 'pong');

    const promise = apiService.execute(() => apiClient.api.ping());

    await jest.runAllTimersAsync();

    const response = await promise;
    expect(response).toBe('pong');
    expect(mockApi.history.get).toHaveLength(2);
  });

  it('should throw ApiError for AbortError (timeout)', async () => {
    mockApi.onGet('/api/v1/ping').timeout();

    const promise = apiService.execute(() => apiClient.api.ping()).catch((e) => e);

    await jest.runAllTimersAsync();

    const err = await promise;
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({
      isTimeout: true,
      message: 'The request timed out. Please try again later.'
    });
  });
});
