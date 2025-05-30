/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/handlerError";
import { authService } from "../services/login.service";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

// Type for queueing failed requests
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (err: any) => void;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const localToken = localStorage.getItem("accessToken");
  const sessionToken = sessionStorage.getItem("accessToken");

  const token = localToken ?? sessionToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken"))
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      const isRemembered = Boolean(localStorage.getItem("accessToken"));
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

      if (!refreshToken || !accessToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await authService.refreshToken({ accessToken, refreshToken });

        if (isRemembered) {
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
        } else {
          sessionStorage.setItem("accessToken", newAccessToken);
          sessionStorage.setItem("refreshToken", newRefreshToken);
        }

        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = "Bearer " + newAccessToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        if (isRemembered) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } else {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
        }

        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response?.status === 400) {
      handleAxiosError(error);
    }

    if (error.response?.status === 404 || error.response?.status === 409) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
