import axios from "axios";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/handlerError";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer your-jwt-token-here",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
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
