export function signIn(): void {
  // Redirect to backend OAuth endpoint
  // Backend will handle Google OAuth flow and redirect to callback
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth`;
}

export function signOut(): void {
  // Clear tokens from local storage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // Redirect to sign-in page
  window.location.href = "/signin";
}
