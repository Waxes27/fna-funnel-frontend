import MockAdapter from 'axios-mock-adapter';
import apiClient from '../services/apiClient';
import { mockUsers, mockProfiles, mockFinancialData } from './mockData';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(apiClient, { delayResponse: 500 });

export const setupMocks = () => {
  console.log('Mock API initialized');

  // Auth endpoints
  mock.onPost('/auth/login').reply((config) => {
    const { email, password } = JSON.parse(config.data);
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      return [200, {
        token: 'mock-jwt-token-12345',
        user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }
      }];
    }
    return [401, { message: 'Invalid credentials' }];
  });

  mock.onPost('/auth/register').reply((config) => {
    const newUser = JSON.parse(config.data);
    return [201, { message: 'User registered successfully', userId: 'new-user-id' }];
  });

  // Profile endpoints
  mock.onGet(/\/profile\/.+/).reply((config) => {
    // Extract the clientId robustly, ignoring query params and trailing slashes
    const urlParts = config.url?.split('?')[0].split('/').filter(Boolean) || [];
    const clientId = urlParts.pop();
    
    let profile = mockProfiles.find(p => p.userId === clientId);
    
    // If not found in mock data, auto-generate a fallback profile to prevent 404s in development
    if (!profile && clientId) {
      const user = mockUsers.find(u => u.id === clientId);
      profile = {
        id: `profile-${clientId}`,
        userId: clientId,
        dob: '1990-01-01',
        idNumber: '9001015009087',
        maritalStatus: 'Single',
        dependants: 0,
        employmentStatus: 'Employed',
        occupation: user?.role === 'ADVISER' ? 'Financial Adviser' : (user?.role === 'ADMIN' ? 'System Administrator' : 'Consultant'),
        employer: 'Self',
        annualIncome: 450000
      };
    }

    if (profile) return [200, profile];
    return [404, { message: 'Profile not found' }];
  });

  // Financial Data endpoints
  mock.onGet(/\/financial-data\/.+/).reply((config) => {
    const urlParts = config.url?.split('?')[0].split('/').filter(Boolean) || [];
    const profileId = urlParts.pop();
    
    let data = mockFinancialData.find(d => d.profileId === profileId);
    
    // Auto-generate fallback financial data to prevent 404s
    if (!data && profileId) {
      data = {
        id: `fin-data-${profileId}`,
        profileId: profileId,
        monthlyIncome: 35000,
        monthlyExpenses: 25000,
        assets: [],
        liabilities: []
      };
    }

    if (data) return [200, data];
    return [404, { message: 'Data not found' }];
  });

  mock.onPost('/fna/calculate').reply((config) => {
    const data = JSON.parse(config.data);
    
    // Ensure safe defaults for calculation mock
    const monthlyExpenses = data.monthlyExpenses || 0;
    const monthlyIncome = data.monthlyIncome || 0;
    const assets = data.assets || [];
    const liabilities = data.liabilities || [];
    
    const savingsAssets = assets.filter((a: any) => a.type === 'savings').reduce((acc: number, a: any) => acc + (a.value || 0), 0);
    const totalLiabilities = liabilities.reduce((acc: number, l: any) => acc + (l.value || 0), 0);

    // Return mock calculation results
    return [200, {
      emergencyFund: {
        recommended: monthlyExpenses * 6,
        current: savingsAssets,
        gap: Math.max(0, (monthlyExpenses * 6) - savingsAssets)
      },
      lifeCover: {
        recommended: (monthlyIncome * 12 * 20) + totalLiabilities,
        current: 0,
        gap: (monthlyIncome * 12 * 20) + totalLiabilities
      }
    }];
  });

  mock.onPost('/ai/chat').reply((config) => {
    const { message } = JSON.parse(config.data);
    return [200, {
      response: `This is a mock AI response to: "${message}". Please consult with a licensed adviser for specific product recommendations.`,
      timestamp: new Date().toISOString()
    }];
  });

  // Pass through any other requests
  mock.onAny().passThrough();
};
