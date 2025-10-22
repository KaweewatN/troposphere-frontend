export function signIn(): void {
  // Redirect to backend OAuth endpoint
  // Backend will handle Google OAuth flow and redirect to callback
  window.location.href = `http://localhost:8000/auth`;
}
