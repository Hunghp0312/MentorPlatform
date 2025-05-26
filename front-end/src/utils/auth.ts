export function isTokenValid(): boolean {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  return true;
}

export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
