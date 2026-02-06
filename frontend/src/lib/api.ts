import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// Usamos la variable de entorno. Si por alguna razón no existe, 
// ponemos el localhost como respaldo (fallback) para desarrollo local.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
    : "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;