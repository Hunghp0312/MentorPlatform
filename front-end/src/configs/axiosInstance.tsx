// import axios from "axios";
// import { toast } from "react-toastify";
// import { handleAxiosError } from "../utils/handlerError";

// const defaultToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAzZWE4MjNkLWQ2MjUtNDQ4ZC05MDFkLTQxMWM1MDI4Yjc2OSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ik1lbnRvciIsImV4cCI6MTc0ODE2Nzg2MiwiaXNzIjoibG9jYWxob3N0IiwiYXVkIjoibG9jYWxob3N0In0.hshfL7uVTRRpv-yN9_uhIXOHAH_wmTlRxUfT1QlrUw4";

// // Lưu token vào localStorage nếu chưa có
// if (!localStorage.getItem("accessToken")) {
//   localStorage.setItem("accessToken", defaultToken);
// }

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("accessToken");
//       window.location.href = "/login";
//     }
//     if (error.response?.status === 400) {
//       handleAxiosError(error);
//     }
//     if (error.response?.status === 404 || error.response?.status === 409) {
//       toast.error(error.response?.data.message);
//     }
//     return Promise.reject(error);
//   }
// );
// export default axiosInstance;

import axios from "axios";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/handlerError";

const defaultToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAzZWE4MjNkLWQ2MjUtNDQ4ZC05MDFkLTQxMWM1MDI4Yjc2OSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ik1lbnRvciIsImV4cCI6MTc0ODE3NDU1MCwiaXNzIjoibG9jYWxob3N0IiwiYXVkIjoibG9jYWxob3N0In0._uCy5KVLfcVUsIywC26NkN8vW-z_Ert7PyF5LqtikrM";

// Lưu token vào localStorage nếu chưa có
if (!localStorage.getItem("accessToken")) {
  localStorage.setItem("accessToken", defaultToken);
}

const axiosInstance = axios.create({
  baseURL: "https://localhost:7102/api/", // import.meta.env.VITE_BACKEND_BASE_URL
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

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("accessToken");
//       window.location.href = "/login";
//     }
//     if (error.response?.status === 400) {
//       handleAxiosError(error);
//     }
//     if (error.response?.status === 404 || error.response?.status === 409) {
//       toast.error(error.response?.data.message);
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
