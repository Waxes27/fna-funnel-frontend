import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';

import { JwtResponse } from '../../clients/fNAPlatformAPIClient/models';

WebBrowser.maybeCompleteAuthSession();

type KeycloakAccessTokenClaims = {
  sub: string;
  email?: string;
  preferred_username?: string;
  realm_access?: {
    roles?: string[];
  };
};

type KeycloakIdTokenClaims = {
  sub: string;
  email?: string;
};

const KEYCLOAK_BASE_URL = (
  process.env.EXPO_PUBLIC_KEYCLOAK_BASE_URL || 'http://localhost:8081'
).replace(/\/+$/, '');
export const KEYCLOAK_REALM = process.env.EXPO_PUBLIC_KEYCLOAK_REALM || 'fna-momentum';
export const KEYCLOAK_CLIENT_ID = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID || 'web';
const KEYCLOAK_SCOPE_STRING =
  process.env.EXPO_PUBLIC_KEYCLOAK_SCOPES || 'openid profile email roles';

export const KEYCLOAK_SCOPES = KEYCLOAK_SCOPE_STRING.split(/\s+/).filter(Boolean);
export const keycloakIssuer = `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}`;

const rolePriority = ['ROLE_CLIENT', 'ROLE_ADVISER', 'ROLE_ADMIN'];

const normalizeRole = (roles: string[] = []) => {
  const matchedRole =
    rolePriority.find((role) => roles.includes(role)) ||
    roles.find((role) => role.startsWith('ROLE_'));

  return matchedRole ? matchedRole.replace(/^ROLE_/, '') : 'CLIENT';
};

export const createKeycloakRedirectUri = () =>
  AuthSession.makeRedirectUri({
    scheme: 'fna-app',
    path: 'auth/callback',
    preferLocalhost: true,
  });

export const createKeycloakAuthRequestConfig = (
  redirectUri: string,
): AuthSession.AuthRequestConfig => ({
  clientId: KEYCLOAK_CLIENT_ID,
  redirectUri,
  scopes: KEYCLOAK_SCOPES,
  responseType: AuthSession.ResponseType.Code,
  usePKCE: true,
});

export const exchangeKeycloakCode = async ({
  code,
  codeVerifier,
  discovery,
  redirectUri,
}: {
  code: string;
  codeVerifier: string;
  discovery: AuthSession.DiscoveryDocument;
  redirectUri: string;
}) =>
  AuthSession.exchangeCodeAsync(
    {
      clientId: KEYCLOAK_CLIENT_ID,
      code,
      redirectUri,
      extraParams: {
        code_verifier: codeVerifier,
      },
    },
    discovery,
  );

export const mapKeycloakTokenResponseToUser = (
  tokenResponse: AuthSession.TokenResponse,
): JwtResponse => {
  if (!tokenResponse.accessToken) {
    throw new Error('Keycloak did not return an access token.');
  }

  const accessClaims = jwtDecode<KeycloakAccessTokenClaims>(tokenResponse.accessToken);
  const idClaims = tokenResponse.idToken
    ? jwtDecode<KeycloakIdTokenClaims>(tokenResponse.idToken)
    : undefined;

  return {
    token: tokenResponse.accessToken,
    type: tokenResponse.tokenType || 'Bearer',
    id: idClaims?.sub || accessClaims.sub,
    email: idClaims?.email || accessClaims.email || accessClaims.preferred_username || '',
    role: normalizeRole(accessClaims.realm_access?.roles),
  };
};
