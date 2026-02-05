"use client";

import { useEffect, Suspense } from "react"; // Añadido Suspense
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, ShoppingBagIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

// 1. Movemos la lógica a un componente interno
function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");

  useEffect(() => {
    // Aquí puedes limpiar el carrito si descomentas tu store
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3 animate-bounce">
            <CheckCircleIcon className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          ¡Pago Confirmado!
        </h1>
        <p className="text-gray-600 mb-8">
          Tu pedido ha sido procesado con éxito. Pronto recibirás un correo con los detalles de tu envío.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">ID de Transacción:</span>
            <span className="text-sm font-mono font-medium text-gray-800 truncate ml-4">
              {paymentIntent ? `${paymentIntent.slice(0, 20)}...` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Estado:</span>
            <span className="text-sm font-semibold text-green-600 uppercase">
              Completado
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/orders"
            className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200"
          >
            <ShoppingBagIcon className="w-5 h-5 mr-2" />
            Ver mis pedidos
          </Link>
          
          <Link
            href="/"
            className="flex items-center justify-center w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition duration-200"
          >
            Continuar comprando
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400 italic">
          Si tienes alguna duda con tu pedido, contacta a soporte@tutienda.com
        </p>
      </div>
    </div>
  );
}

// 2. El export por defecto envuelve el contenido en Suspense para evitar el error de Vercel
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando confirmación...</div>}>
      <SuccessContent />
    </Suspense>
  );
}