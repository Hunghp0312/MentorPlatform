export function isTokenValid(): boolean {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");
  if (!token || !expiry) return false;

  return Date.now() < parseInt(expiry, 10);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");
}
