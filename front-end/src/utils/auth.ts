export function isTokenValid(): boolean {
  const localToken = localStorage.getItem("accessToken");
  const sessionToken = sessionStorage.getItem("accessToken");

  if (!localToken && !sessionToken) return false;

  return true;
}

export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
}
