// src/services/authService.ts
import axiosInstance from "../configs/axiosInstance";
import {
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  CodeThirdParty,
  AppTokenResponse,
} from "../types/login";

export const authService = {
  async login(credentials: LoginRequest): Promise<unknown> {
    try {
      const response = await axiosInstance.post("/Auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<unknown> {
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

  async resetPassword(payload: ResetPasswordRequest): Promise<unknown> {
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

  async refreshToken(payload: RefreshTokenRequest): Promise<unknown> {
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
      const response = await axiosInstance.post(
        "/Auth/github/callback",
        payload
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error during GitHub backend callback:", error);
      throw error;
    }
  },
};
