import type { AllUser, SubscribedUser } from '../types/admin';

export function areSubscribedUsersEqual(a: SubscribedUser[], b: SubscribedUser[]) {
  if (a.length !== b.length) return false;
  const mapA = new Map(a.map(u => [u.userId, u]));
  for (const user of b) {
    const corresponding = mapA.get(user.userId);
    if (!corresponding) return false;
    if (
      corresponding.email !== user.email ||
      corresponding.subscribed !== user.subscribed ||
      corresponding.endpoint !== user.endpoint
    ) return false;
  }
  return true;
}

export function areAllUsersEqual(a: AllUser[], b: AllUser[]) {
  if (a.length !== b.length) return false;
  const mapA = new Map(a.map(u => [u.id, u]));
  for (const user of b) {
    const corresponding = mapA.get(user.id);
    if (!corresponding) return false;
    if (
      corresponding.email !== user.email ||
      corresponding.role !== user.role
    ) return false;
  }
  return true;
}
