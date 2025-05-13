import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        if(error.response.status === 401) {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)
export default axiosInstance;