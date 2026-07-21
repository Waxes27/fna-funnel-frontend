import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

import * as AuthSession from 'expo-auth-session';

import LoginScreen from '../LoginScreen';
import { savePersistedAuthSession } from '../../services/authSessionStore';
import {
  createKeycloakRedirectUri,
  exchangeKeycloakCode,
  mapKeycloakTokenResponseToUser,
} from '../../services/keycloakAuth';
import { useAppStore } from '../../store/appStore';

jest.mock('expo-auth-session', () => ({
  useAutoDiscovery: jest.fn(),
  useAuthRequest: jest.fn(),
}));

jest.mock('../../store/appStore', () => ({
  useAppStore: jest.fn(),
}));

jest.mock('../../services/authSessionStore', () => ({
  savePersistedAuthSession: jest.fn(),
}));

jest.mock('../../services/keycloakAuth', () => ({
  createKeycloakAuthRequestConfig: jest.fn(() => ({
    clientId: 'web',
    redirectUri: 'fna-app://auth/callback',
    scopes: ['openid'],
  })),
  createKeycloakRedirectUri: jest.fn(() => 'fna-app://auth/callback'),
  exchangeKeycloakCode: jest.fn(),
  keycloakIssuer: 'https://issuer.example/realms/fna-momentum',
  mapKeycloakTokenResponseToUser: jest.fn(),
}));

jest.mock('../../components/Button', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return ({ disabled, onPress, title }: { disabled?: boolean; onPress: () => void; title: string }) => (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}>
      <Text>{title}</Text>
    </Pressable>
  );
});

jest.mock('../../components/Surface', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Surface: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

jest.mock('../../components/Typography', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Typography: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text>,
  };
});

const mockUseAutoDiscovery = AuthSession.useAutoDiscovery as jest.Mock;
const mockUseAuthRequest = AuthSession.useAuthRequest as jest.Mock;
const mockUseAppStore = useAppStore as unknown as jest.Mock;
const mockSavePersistedAuthSession = savePersistedAuthSession as jest.Mock;
const mockExchangeKeycloakCode = exchangeKeycloakCode as jest.Mock;
const mockMapKeycloakTokenResponseToUser = mapKeycloakTokenResponseToUser as jest.Mock;

describe('LoginScreen', () => {
  const mockLogin = jest.fn();
  const discovery = { tokenEndpoint: 'https://issuer.example/token' };
  const tokenResponse = { accessToken: 'access-token', idToken: 'id-token', tokenType: 'Bearer' };
  const mappedUser = {
    email: 'client@example.com',
    id: 'user-1',
    role: 'CLIENT',
    token: 'access-token',
    type: 'Bearer',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAppStore.mockImplementation((selector: (state: { login: typeof mockLogin }) => unknown) =>
      selector({ login: mockLogin }),
    );
    mockUseAutoDiscovery.mockReturnValue(discovery);
    mockUseAuthRequest.mockReturnValue([
      { codeVerifier: 'code-verifier' },
      { type: 'success', params: { code: 'auth-code' } },
      jest.fn(),
    ]);
    mockExchangeKeycloakCode.mockResolvedValue(tokenResponse);
    mockMapKeycloakTokenResponseToUser.mockReturnValue(mappedUser);
    mockSavePersistedAuthSession.mockResolvedValue(undefined);
  });

  it('persists the auth session before completing login', async () => {
    render(<LoginScreen />);

    await waitFor(() => {
      expect(mockExchangeKeycloakCode).toHaveBeenCalledWith({
        code: 'auth-code',
        codeVerifier: 'code-verifier',
        discovery,
        redirectUri: createKeycloakRedirectUri(),
      });
      expect(mockSavePersistedAuthSession).toHaveBeenCalledWith(mappedUser);
      expect(mockLogin).toHaveBeenCalledWith(mappedUser);
    });

    expect(mockSavePersistedAuthSession.mock.invocationCallOrder[0]).toBeLessThan(
      mockLogin.mock.invocationCallOrder[0],
    );
  });
});
