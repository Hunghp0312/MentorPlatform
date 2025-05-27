// src/services/authService.ts
import axiosInstance from "../configs/axiosInstance";
import {
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  CodeThirdParty,
  AppTokenResponse,
  MessageResponse,
} from "../types/login";

export const authService = {
  async login(credentials: LoginRequest): Promise<AppTokenResponse> {
    try {
      const response = await axiosInstance.post("/Auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  async forgotPassword(
    payload: ForgotPasswordRequest
  ): Promise<MessageResponse> {
    try {
      const response = await axiosInstance.post(
        "/Auth/forgot-password",
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error during forgot password:", error);
      throw error;
    }
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<MessageResponse> {
    try {
      const response = await axiosInstance.post(
        "/Auth/reset-password",
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error during reset password:", error);
      throw error;
    }
  },

  async refreshToken(payload: RefreshTokenRequest): Promise<AppTokenResponse> {
    try {
      const response = await axiosInstance.post("/Auth/refresh-token", payload);
      return response.data;
    } catch (error) {
      console.error("Error during refresh token:", error);
      throw error;
    }
  },

  async githubCallback(payload: CodeThirdParty): Promise<AppTokenResponse> {
    try {
      console.log("Send data", payload);
      const response = await axiosInstance.get(`/Auth/github/callback`, {
        params: { code: payload.code },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error during GitHub backend callback:", error);
      throw error;
    }
  },

  async githubLogin(): Promise<void> {
    try {
      window.location.href = `${
        import.meta.env.VITE_BACKEND_BASE_URL
      }/Auth/github/login`;
    } catch (error) {
      console.error("Error during GitHub login redirect:", error);
      throw error;
    }
  },

  async googleLogin(): Promise<void> {
    try {
      window.location.href = `${
        import.meta.env.VITE_BACKEND_BASE_URL
      }/Auth/google/login`;
    } catch (error) {
      console.error("Error during Google login redirect:", error);
      throw error;
    }
  },
};
