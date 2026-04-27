import axios from 'axios';

// Ensure the baseURL matches your backend endpoint
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    // You can inject token here from SecureStore or AsyncStorage
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = \`Bearer ${token}\`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Handle 401 unauthorized errors (e.g., refresh token or redirect to login)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Handle token refresh logic here
    }
    return Promise.reject(error);
  },
);

export default apiClient;
