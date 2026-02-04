'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Añadido useRouter
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuthStore } from '@/store/useAuthStore'; // Importamos el store de auth

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      setMessage(error.message || "Ocurrió un error inesperado.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button 
        type="submit"
        disabled={isLoading || !stripe || !elements} 
        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Procesando..." : "Pagar con Tarjeta"}
      </button>
      {message && <div className="text-red-500 text-sm mt-4 text-center">{message}</div>}
    </form>
  );
}

function PayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore(); // Verificamos usuario
  const clientSecret = searchParams.get('secret');

  // EFECTO DE PROTECCIÓN: Si no hay usuario, fuera.
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/pay'); // Ajusta según tu ruta
    }
  }, [user, authLoading, router]);

  if (authLoading) return <div className="text-center p-20 font-bold">Verificando sesión...</div>;
  if (!user) return null;

  if (!clientSecret) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500 font-bold">Error: No se encontró el secreto de pago.</p>
        <p className="text-sm text-gray-500">Asegúrate de venir desde la página de checkout.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-black mb-6 text-gray-800 text-center">Finalizar Pago</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-indigo-600">Cargando pasarela de pago...</div>}>
      <PayContent />
    </Suspense>
  );
}