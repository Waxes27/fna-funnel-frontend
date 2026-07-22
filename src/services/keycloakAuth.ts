import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';

import { JwtResponse } from '../../clients/fNAPlatformAPIClient/models';
import { AuthError } from './authErrors';
import { normalizeAuthenticatedUser } from './authUser';

WebBrowser.maybeCompleteAuthSession();

type KeycloakAccessTokenClaims = {
  aud?: string | string[];
  azp?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  sub: string;
  email?: string;
  preferred_username?: string;
  realm_access?: {
    roles?: string[];
  };
};

type KeycloakIdTokenClaims = {
  exp?: number;
  iss?: string;
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

const decodeJwtSafely = <T>(token: string, tokenName: string): T => {
  try {
    return jwtDecode<T>(token);
  } catch (error) {
    throw new AuthError('TOKEN_INVALID', `${tokenName} is not a valid JWT.`, {
      cause: error,
      shouldClearSession: true,
      userMessage: 'We could not verify your Keycloak token. Please sign in again.',
    });
  }
};

const validateClaims = (claims: KeycloakAccessTokenClaims | KeycloakIdTokenClaims) => {
  if (!claims.sub) {
    throw new AuthError('TOKEN_INVALID', 'Keycloak token is missing a subject claim.', {
      shouldClearSession: true,
      userMessage: 'We could not verify your Keycloak token. Please sign in again.',
    });
  }

  if (claims.iss && claims.iss !== keycloakIssuer) {
    throw new AuthError(
      'TOKEN_INVALID',
      'Keycloak token issuer does not match the configured realm.',
      {
        shouldClearSession: true,
        userMessage: 'We could not verify your Keycloak token. Please sign in again.',
      },
    );
  }

  if (claims.exp && claims.exp <= Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SKEW_SECONDS) {
    throw new AuthError('TOKEN_EXPIRED', 'Keycloak token has expired.', {
      shouldClearSession: true,
      userMessage: 'Your Keycloak session has expired. Please sign in again.',
    });
  }
};

const rolePriority = ['ROLE_CLIENT', 'ROLE_ADVISER', 'ROLE_ADMIN'];
const TOKEN_EXPIRY_SKEW_SECONDS = 30;

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
    throw new AuthError('TOKEN_MISSING', 'Keycloak did not return an access token.', {
      userMessage: 'Keycloak did not finish sign-in correctly. Please try again.',
    });
  }

  const accessClaims = decodeJwtSafely<KeycloakAccessTokenClaims>(
    tokenResponse.accessToken,
    'Keycloak access token',
  );
  validateClaims(accessClaims);

  const idClaims = tokenResponse.idToken
    ? decodeJwtSafely<KeycloakIdTokenClaims>(tokenResponse.idToken, 'Keycloak ID token')
    : undefined;

  if (idClaims) {
    validateClaims(idClaims);
  }

  return validateKeycloakTokenUser({
    token: tokenResponse.accessToken,
    type: tokenResponse.tokenType || 'Bearer',
    id: idClaims?.sub || accessClaims.sub,
    email: idClaims?.email || accessClaims.email || accessClaims.preferred_username || '',
    role: normalizeRole(accessClaims.realm_access?.roles),
  });
};

export const validateKeycloakTokenUser = (user: Partial<JwtResponse>): JwtResponse => {
  if (!user.token) {
    throw new AuthError('TOKEN_MISSING', 'The auth session is missing an access token.', {
      shouldClearSession: true,
      userMessage: 'Your saved session is incomplete. Please sign in again.',
    });
  }

  const accessClaims = decodeJwtSafely<KeycloakAccessTokenClaims>(
    user.token,
    'Keycloak access token',
  );

  validateClaims(accessClaims);

  return normalizeAuthenticatedUser({
    ...user,
    email: user.email ?? accessClaims.email ?? accessClaims.preferred_username ?? '',
    id: user.id ?? accessClaims.sub,
    role: user.role ?? normalizeRole(accessClaims.realm_access?.roles),
    token: user.token,
    type: user.type || 'Bearer',
  });
};
