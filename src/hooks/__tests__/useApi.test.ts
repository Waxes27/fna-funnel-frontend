import { renderHook, act } from '@testing-library/react-native';
import { useApi } from '../useApi';
import { ApiError } from '../../services/apiError';

describe('useApi Hook', () => {
  it('should handle successful API calls', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockApiCall = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(mockApiCall));

    // Initial state
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    // Execute call
    await act(async () => {
      const response = await result.current.execute('arg1', 'arg2');
      expect(response).toEqual(mockData);
    });

    // State after success
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockApiCall).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should handle failed API calls', async () => {
    const mockError = new ApiError('Failed', 400);
    const mockApiCall = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useApi(mockApiCall));

    // Execute call
    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // Expected error
      }
    });

    // State after failure
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });

  it('should reset state correctly', async () => {
    const mockData = 'data';
    const mockApiCall = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(mockApiCall, 'initial'));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe(mockData);

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBe('initial');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
