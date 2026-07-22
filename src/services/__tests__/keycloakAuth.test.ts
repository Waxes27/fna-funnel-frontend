import type { TokenResponse } from 'expo-auth-session';

import { AuthError } from '../authErrors';
import {
  keycloakIssuer,
  mapKeycloakTokenResponseToUser,
  validateKeycloakTokenUser,
} from '../keycloakAuth';

const createJwt = (claims: Record<string, unknown> = {}) => {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');

  return [
    encode({ alg: 'none', typ: 'JWT' }),
    encode({
      email: 'client@example.com',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iss: keycloakIssuer,
      realm_access: { roles: ['ROLE_CLIENT'] },
      sub: 'user-1',
      ...claims,
    }),
    'signature',
  ].join('.');
};

describe('keycloakAuth', () => {
  it('maps a Keycloak token response into a normalized authenticated user', () => {
    const token = createJwt();

    expect(
      mapKeycloakTokenResponseToUser({
        accessToken: token,
        idToken: createJwt({ sub: 'user-1' }),
        tokenType: 'Bearer',
      } as TokenResponse),
    ).toEqual({
      email: 'client@example.com',
      id: 'user-1',
      role: 'CLIENT',
      token,
      type: 'Bearer',
    });
  });

  it('rejects expired persisted sessions', () => {
    expect(() =>
      validateKeycloakTokenUser({
        email: 'client@example.com',
        token: createJwt({ exp: Math.floor(Date.now() / 1000) - 60 }),
      }),
    ).toThrow(AuthError);
  });
});
