export type MinimalUser = {
  id?: string | null;
  role?: string | null;
};

// Keep route-level access checks centralized so admin and ownership rules do
// not drift between pages, API handlers, and account dashboards.
export function isAdmin(user: MinimalUser | null | undefined) {
  return user?.role === "ADMIN";
}

export function canAccessAdmin(user: MinimalUser | null | undefined) {
  return isAdmin(user);
}

export function canAccessOwnedResource(user: MinimalUser | null | undefined, ownerId: string | null | undefined) {
  return Boolean(user?.id && ownerId && (user.id === ownerId || isAdmin(user)));
}

export function canUseAuthenticatedSession(
  user: { accountStatus?: string | null } | null | undefined
) {
  return user?.accountStatus !== "SUSPENDED";
}
