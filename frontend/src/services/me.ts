import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export const fetchMe = async () => {
  const res = await api.get("/me/");
  useAuthStore.getState().setUser(res.data);
  return res.data;
};
