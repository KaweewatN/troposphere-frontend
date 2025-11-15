export function signIn(): void {
  // Redirect to backend OAuth endpoint
  // Backend will handle Google OAuth flow and redirect to callback
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const redirectUrl =
    import.meta.env.VITE_REDIRECT_URL || "http://localhost:5173";
  window.location.href = `${apiBaseUrl}/auth?redirect=${redirectUrl}`;
}

export function signOut(): void {
  // Clear tokens from local storage
  localStorage.removeItem("auth_token");
  // Redirect to sign-in page
  window.location.href = "/signin";
}
