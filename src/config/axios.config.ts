import axios from "axios";
import { container } from "../container";
import { TYPES } from "../types";
import { AuthRepository } from "../domain/repository/auth/auth.repository";
import { useAuthStore } from "../presentation/storage/auth.storage";

// Configuración para manejar intentos de refresh token
let retryCount = 0;
const MAX_RETRY_COUNT = 3;

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// set token in header for all requests
axiosInstance.interceptors.request.use((config) => {
  const { userData } = useAuthStore.getState();

  if (!userData) {
    return config;
  }

  config.headers = Object.assign({}, config.headers, {
    Authorization: `Bearer ${userData?.token}`,
  });
  return config;
});

// refresh token
axiosInstance.interceptors.response.use(
  (respose) => respose,
  async function (error) {
    const { isAuth, userData, setUserData, logOut } = useAuthStore.getState();
    const originalRequest = error.config;

    if (error.code === "ERR_NETWORK" && isAuth() && !originalRequest._retry) {
      if (retryCount >= MAX_RETRY_COUNT) {
        console.warn("Máximo número de intentos alcanzado. Cerrando sesión...");
        logOut();
        return Promise.reject(error);
      }

      retryCount += 1;
      
      originalRequest._retry = true;
      const authRepository = container.get<AuthRepository>(TYPES.AuthRepository);
      const data = await authRepository.refreshToken(userData?.refreshToken ?? "");

      setUserData(data);

      axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + data.token;
      originalRequest.headers["Authorization"] = "Bearer " + data.token;

      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
