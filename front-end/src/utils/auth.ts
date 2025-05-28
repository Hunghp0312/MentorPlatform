import { jwtDecode } from "jwt-decode";

export interface DecodedTokenRaw {
  id: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  isActive: string;
  exp: number;
  iss: string;
  aud: string;
}

export interface DecodedToken {
  id: string;
  role: string;
  isActive: string;
  exp: number;
  iss: string;
  aud: string;
}

export function mapDecodedToken(raw: DecodedTokenRaw): DecodedToken {
  return {
    id: raw.id,
    role: raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    isActive: raw.isActive,
    exp: raw.exp,
    iss: raw.iss,
    aud: raw.aud,
  };
}

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

export function getToken() {
  const localToken = localStorage.getItem("accessToken");
  const sessionToken = sessionStorage.getItem("accessToken");

  if (!localToken && !sessionToken) return false;

  return localToken ?? sessionToken;
}

export function getUserFromToken(): DecodedToken | null {
  try {
    const token = getToken();

    if (!token) return null;

    const decodedRaw = jwtDecode<DecodedTokenRaw>(token);

    const decoded = mapDecodedToken(decodedRaw);

    return decoded;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
