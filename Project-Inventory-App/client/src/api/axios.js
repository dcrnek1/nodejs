import axios from "axios";
import { getDefaultStore } from "jotai";
import { accessTokenAtom } from "@/state/authAtom";

const store = getDefaultStore();

// INSTANCE A: For Auth (No interceptors)
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// INSTANCE B: For Data (With interceptors)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.get(accessTokenAtom);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // IMPORTANT: If the error is 401 and it's NOT the refresh call itself
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // USE THE CLEAN INSTANCE HERE to avoid the loop
        const res = await authApi.get("/auth/refresh"); 
        const newAccessToken = res.data.accessToken;

        store.set(accessTokenAtom, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.set(accessTokenAtom, null);
        // Optional: window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;