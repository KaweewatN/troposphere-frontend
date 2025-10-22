/**
 * Secure token storage utility
 *
 * Uses localStorage for persistent storage across sessions
 * and provides a memory cache for optimal performance
 */

interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_at?: number;
}

// In-memory cache for performance (avoids repeated storage access)
let tokenCache: AuthTokens | null = null;

const TOKEN_KEY = "auth_token";

/**
 * Check if we're in a browser environment
 */
const isBrowser =
  typeof window !== "undefined" && typeof localStorage !== "undefined";

/**
 * Store authentication tokens securely
 */
export function setAuthTokens(tokens: AuthTokens): void {
  const tokensWithExpiry = {
    ...tokens,
    expires_at: tokens.expires_at || Date.now() + 3600000, // Default 1 hour
  };

  // Store in localStorage (persists across sessions) - only in browser
  if (isBrowser) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokensWithExpiry));
  }

  // Update memory cache for performance
  tokenCache = tokensWithExpiry;
}

/**
 * Get authentication tokens
 * Returns from memory cache first for better performance
 */
export function getAuthTokens(): AuthTokens | null {
  // Check memory cache first (fastest)
  if (tokenCache) {
    // Verify token hasn't expired
    if (tokenCache.expires_at && tokenCache.expires_at > Date.now()) {
      return tokenCache;
    } else {
      // Token expired, clear it
      clearAuthTokens();
      return null;
    }
  }

  // Only access localStorage in browser
  if (!isBrowser) {
    return null;
  }

  // Fallback to localStorage
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored) {
    try {
      const tokens = JSON.parse(stored) as AuthTokens;

      // Verify token hasn't expired
      if (tokens.expires_at && tokens.expires_at > Date.now()) {
        tokenCache = tokens;
        return tokens;
      } else {
        clearAuthTokens();
        return null;
      }
    } catch {
      clearAuthTokens();
      return null;
    }
  }

  return null;
}

/**
 * Get access token only (most common use case)
 */
export function getAccessToken(): string | null {
  const tokens = getAuthTokens();
  return tokens?.access_token || null;
}

/**
 * Clear authentication tokens
 */
export function clearAuthTokens(): void {
  if (isBrowser) {
    localStorage.removeItem(TOKEN_KEY);
  }
  tokenCache = null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
