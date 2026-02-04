'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Llamada al endpoint definido en tu urls.py: /api/register/
      await api.post('register/', formData);
      
      // Redirigir al login con un parámetro de éxito
      router.push('/login?registered=true');
    } catch (err: any) {
      console.error("Error en registro:", err.response?.data);
      const backendError = err.response?.data;
      // Intenta capturar errores específicos de Django (ej: usuario ya existe)
      setError(
        backendError?.email?.[0] || 
        backendError?.username?.[0] || 
        backendError?.password?.[0] ||
        'Error al crear la cuenta. Verifica tus datos.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50/50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-gray-100 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-2xl mb-6">
            <UserPlus className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Únete a TechNova</h2>
          <p className="mt-3 text-sm text-gray-500 font-medium">Crea tu cuenta para empezar a comprar</p>
        </div>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold text-center border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="group">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Nombre de Usuario</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                  placeholder="usuario123"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="group">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="group">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:bg-gray-300 shadow-xl shadow-indigo-100"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'REGISTRARME'}
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500 font-medium">
              ¿Ya eres cliente?{' '}
              <Link href="/login" className="font-bold text-indigo-600 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}