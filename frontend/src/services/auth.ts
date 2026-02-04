import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export const login = async (email: string, password: string) => {
  const res = await api.post("/token/", {
    email,
    password,
  });

  const { access, refresh } = res.data;

  useAuthStore.getState().setTokens(access, refresh);

  return res.data;
};

export const logout = () => {
  useAuthStore.getState().logout();
};