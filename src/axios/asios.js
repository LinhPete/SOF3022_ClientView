import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
// Tạo một instance của axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
// Thêm interceptor để xử lý request hoặc reponse
axiosInstance.interceptors.request.use(
  (config) => {
    // thêm token vào header nếu cần
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
