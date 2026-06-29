export type MinimalUser = {
  id?: string | null;
  role?: string | null;
};

export function isAdmin(user: MinimalUser | null | undefined) {
  return user?.role === "ADMIN";
}

export function canAccessAdmin(user: MinimalUser | null | undefined) {
  return isAdmin(user);
}

export function canAccessOwnedResource(user: MinimalUser | null | undefined, ownerId: string | null | undefined) {
  return Boolean(user?.id && ownerId && (user.id === ownerId || isAdmin(user)));
}
