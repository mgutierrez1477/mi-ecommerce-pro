import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  pk: number;
  email: string;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean; // <-- Añadido para controlar el estado de carga
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void; // <-- Para actualizar el estado manualmente si fuera necesario
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: true, // Inicia en true para esperar a que Zustand cargue los datos

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),

      setUser: (user) => set({ user, loading: false }), // Al establecer usuario, ya no está cargando

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          loading: false,
        }),
      
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "auth-storage",
      // Esta función se ejecuta cuando Zustand termina de cargar los datos del localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false); // Una vez cargado todo, dejamos de mostrar "Cargando..."
        }
      },
    }
  )
);