import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
  // Si existe la variable de Vercel, la usa con /api, si no, usa localhost
  baseURL: process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
    : "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para pegar el Token en cada petición automáticamente
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;