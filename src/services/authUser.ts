import { JwtResponse } from '../../clients/fNAPlatformAPIClient/models';

const AUTH_ROLE_PREFIX = /^ROLE_/;

export const normalizeAuthRole = (role?: string | null): string | undefined => {
  const trimmedRole = role?.trim();

  if (!trimmedRole) {
    return undefined;
  }

  return trimmedRole.replace(AUTH_ROLE_PREFIX, '');
};

export const normalizeAuthenticatedUser = <T extends Partial<JwtResponse>>(user: T): T => ({
  ...user,
  role: normalizeAuthRole(user.role),
});
