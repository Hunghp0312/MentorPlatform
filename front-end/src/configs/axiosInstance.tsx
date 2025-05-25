/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/handlerError";
import { authService } from "../services/login.service";

const defaultToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAzZWE4MjNkLWQ2MjUtNDQ4ZC05MDFkLTQxMWM1MDI4Yjc2OSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ik1lbnRvciIsImV4cCI6MTc0ODE4MDExOSwiaXNzIjoibG9jYWxob3N0IiwiYXVkIjoibG9jYWxob3N0In0.Grj_lWZmBaPY9370MQR0CCmgNRQxlNrGIBRbVvGnU6k";

// Lưu token vào localStorage nếu chưa có
if (!localStorage.getItem("accessToken")) {
  localStorage.setItem("accessToken", defaultToken);
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("No access token found in localStorage");
  }

  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
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
      localStorage.getItem("refreshToken")
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
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      try {
        if (!refreshToken || !accessToken) return;

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await authService.refreshToken({ accessToken, refreshToken });

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = "Bearer " + accessToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 400) {
      handleAxiosError(error);
    }
    if (error.response?.status === 404 || error.response?.status === 409) {
      toast.error(error.response?.data.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
