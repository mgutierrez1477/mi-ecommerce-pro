'use client';

import { useState, Suspense } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
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
      // 1️⃣ LOGIN → Obtener Tokens
      const response = await api.post('/token/', {
        email,
        password,
      });

      const { access, refresh } = response.data;
      setTokens(access, refresh);

      // 2️⃣ OBTENER USUARIO (Asegúrate de tener esta ruta en Django)
      try {
        const meResponse = await api.get('/me/');
        setUser(meResponse.data);
      } catch (meErr) {
        console.warn('Login exitoso, pero fallo al obtener perfil (/me/):', meErr);
      }

      router.push('/');
      router.refresh();

    } catch (err: any) {
      console.error('Error en login:', err.response?.data);
      setError('Credenciales incorrectas o error de servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-gray-100 shadow-2xl">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-2xl mb-6">
          <LogIn className="h-10 w-10 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900">Bienvenido</h2>
        <p className="mt-3 text-sm text-gray-500 font-medium">
          Ingresa para gestionar tus compras
        </p>
      </div>

      {registered && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-xs font-bold text-center">
          ¡Cuenta creada! Ya puedes iniciar sesión.
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin mx-auto h-6 w-6" />
          ) : (
            'INICIAR SESIÓN'
          )}
        </button>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-bold text-indigo-600 hover:underline">
              Regístrate ahora
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <Suspense fallback={<div className="text-indigo-600 font-bold">Cargando formulario...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}