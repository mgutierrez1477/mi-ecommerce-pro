'use client';

import { useState, Suspense } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1️⃣ Obtener Tokens (Llamada a /api/token/)
      const response = await api.post('/token/', {
        email,
        password,
      });

      const { access, refresh } = response.data;
      setTokens(access, refresh);

      // 2️⃣ Obtener datos del usuario (Llamada a /api/me/)
      try {
        const meResponse = await api.get('/me/');
        setUser(meResponse.data);
      } catch (meErr) {
        console.warn("Token obtenido, pero la ruta /me/ no respondió correctamente.", meErr);
        // Si /me/ falla, podrías asignar un usuario temporal o redirigir igual
      }

      router.push('/');
      router.refresh();

    } catch (err: any) {
      console.error('Error en login:', err.response?.data || err.message);
      setError('Credenciales incorrectas o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (El resto de tu código de UI se mantiene igual)
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* Tu JSX actual */}
      <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black">
         {loading ? <Loader2 className="animate-spin mx-auto" /> : 'INICIAR SESIÓN'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense fallback={<div>Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}