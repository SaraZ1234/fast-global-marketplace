/**
 * lib/auth.ts
 * Session storage + role-based routing helpers for the FAST Global Marketplace.
 *
 * NOTE: Adjust ROLE_ROUTES / roleId numbers to match your backend's actual
 * role scheme if it differs from the Buyer=1 / Vendor=2 / Admin=3 default below.
 */

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  roleId: number;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export const ROLE = {
  ADMIN: 1,
  VENDOR: 2,
  BUYER: 3,
  SELLER: 4,
} as const;

const ROLE_ROUTES: Record<number, string> = {
  [ROLE.BUYER]: "/buyer-dashboard",
  [ROLE.VENDOR]: "/dashboard/vendor",
  [ROLE.ADMIN]: "/admin/dashboard",
  [ROLE.SELLER]: "/seller/dashboard",
};

const DEFAULT_ROUTE = "/dashboard/buyer";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

/** Returns the dashboard path a user should land on after login, by roleId. */
export function getDashboardPath(roleId: number): string {
  return ROLE_ROUTES[roleId] ?? DEFAULT_ROUTE;
}

/** Persists the auth token + user profile client-side after a successful login. */
export function saveSession(token: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // localStorage may be unavailable (private browsing, storage quota, etc).
    // We fail silently here — the user stays logged in for the current tab
    // via app state, they just won't persist across a hard refresh.
  }
}

/** Clears the stored session (use on logout or a 401 from the API). */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/** Best-effort extraction of a human-readable message from an apiRequest error. */
export function getErrorMessage(err: unknown, fallback: string): string {
  const anyErr = err as any;
  const raw =
    anyErr?.response?.data?.message ??
    anyErr?.data?.message ??
    anyErr?.message ??
    null;

  if (!raw) return fallback;
  return Array.isArray(raw) ? raw.join(" ") : String(raw);
}
