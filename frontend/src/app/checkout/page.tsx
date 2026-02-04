'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { CreditCard, MapPin, PackageCheck, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    postal_code: '',
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validaciones previas
    if (!user) {
      router.push('/login');
      return;
    }

    if (!shippingData.address || !shippingData.city || !shippingData.postal_code) {
      alert("Por favor, completa todos los datos de envío.");
      return;
    }

    setLoading(true);

    try {
      // 2. PASO A: Crear la Orden en la base de datos (Django)
      // Adaptamos el carrito al formato que espera el Serializer de Django
      const orderData = {
        address: shippingData.address,
        city: shippingData.city,
        postal_code: shippingData.postal_code,
        items: items.map(item => ({
          product: item.id,      // ID numérico del producto
          price: item.price,    // Precio unitario
          quantity: item.quantity
        }))
      };

      const orderResponse = await api.post('/orders/', orderData);
      const orderId = orderResponse.data.id; // Obtenemos el ID de la orden recién creada

      // 3. PASO B: Crear el Intento de Pago en Stripe (Django -> Stripe)
      // Enviamos el order_id para que el backend sepa cuánto cobrar
      const stripeResponse = await api.post('/create-payment-intent/', {
        order_id: orderId
      });

      const clientSecret = stripeResponse.data.clientSecret;

      // 4. PASO C: Redirigir a la página de pago con el secreto de Stripe
      router.push(`/checkout/pay?secret=${clientSecret}`);

    } catch (err: any) {
      console.error("Error completo en el proceso de orden:", err.response?.data);
      const errorMsg = err.response?.data?.error || "Error al procesar el pedido.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Pantalla si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <PackageCheck size={80} className="text-gray-200" />
        <h2 className="text-2xl font-bold text-gray-800">Tu carrito está vacío</h2>
        <Link href="/" className="text-indigo-600 font-bold hover:underline">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-black text-gray-900">Finalizar Compra</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* COLUMNA IZQUIERDA: Formulario de Envío */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <MapPin size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Información de Envío</h2>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Dirección de entrega</label>
                <input
                  type="text"
                  placeholder="Calle, número, colonia..."
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Ciudad</label>
                  <input
                    type="text"
                    placeholder="Ej. Ciudad de México"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                  />
                </div>
                <div className="group">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Cód. Postal</label>
                  <input
                    type="text"
                    placeholder="00000"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700"
                    value={shippingData.postal_code}
                    onChange={(e) => setShippingData({...shippingData, postal_code: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Resumen de Compra */}
        <div className="bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-2xl h-fit sticky top-10">
          <h2 className="text-2xl font-bold mb-8 text-indigo-400">Resumen del Pedido</h2>
          
          <div className="space-y-6 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-800 pb-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-100">{item.name}</span>
                  <span className="text-sm text-gray-500 font-medium">Cant: {item.quantity}</span>
                </div>
                <span className="font-bold text-gray-100">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between text-gray-400 font-medium">
              <span>Subtotal</span>
              <span>${totalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400 font-medium">
              <span>Envío</span>
              <span className="text-green-400 font-bold uppercase text-xs pt-1">Gratis</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-white pt-4 border-t border-gray-800">
              <span>Total</span>
              <span className="text-indigo-400">${totalPrice().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full mt-10 bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-900/40 disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <CreditCard size={24} />
                PROCEDER AL PAGO
              </>
            )}
          </button>
          
          <p className="text-center text-gray-500 text-[10px] mt-6 font-bold uppercase tracking-[0.2em]">
            Seguridad Garantizada por Stripe 🔒
          </p>
        </div>
      </div>
    </div>
  );
}