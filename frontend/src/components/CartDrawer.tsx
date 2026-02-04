'use client';

import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, addItem, decreaseQuantity, removeItem, totalPrice } = useCartStore();
  const { user } = useAuthStore(); // Obtenemos el usuario para la validación

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-all duration-500">
          <div className="flex h-full flex-col bg-white shadow-2xl rounded-l-[2rem]">
            
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">Tu Carrito</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="p-6 bg-gray-50 rounded-full">
                    <ShoppingBag className="h-12 w-12 text-gray-200" />
                  </div>
                  <p className="text-gray-500 font-medium text-lg">Tu carrito está vacío</p>
                  <button onClick={onClose} className="text-indigo-600 font-bold text-sm hover:underline">
                    Seguir comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                        <Image
                          src={item.image || '/placeholder-product.png'} 
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-bold text-gray-900">
                          <h3 className="line-clamp-1">{item.name}</h3>
                          <p className="ml-4 text-indigo-600">${Number(item.price).toFixed(2)}</p>
                        </div>
                        
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50 p-1">
                            <button onClick={() => decreaseQuantity(item.id)} className="p-1 hover:bg-white rounded-lg">
                              <Minus size={14} className="text-gray-600" />
                            </button>
                            <span className="px-3 font-bold text-gray-900">{item.quantity}</span>
                            <button onClick={() => addItem(item)} className="p-1 hover:bg-white rounded-lg">
                              <Plus size={14} className="text-gray-600" />
                            </button>
                          </div>

                          <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 font-bold text-red-400 hover:text-red-600">
                            <Trash2 size={16} />
                            <span className="text-xs">Quitar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-50 px-6 py-8 space-y-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p className="text-gray-500">Subtotal estimado</p>
                  <p className="text-2xl font-black">${totalPrice().toFixed(2)}</p>
                </div>
                
                <div className="mt-6">
                  {/* BOTÓN PROTEGIDO DINÁMICO */}
                  <Link
                    href={user ? "/checkout" : "/login?redirect=/checkout"}
                    onClick={onClose}
                    className={`flex items-center justify-center gap-3 w-full px-6 py-4 text-lg font-black text-white rounded-2xl shadow-xl transition-all active:scale-[0.98] ${
                      user ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-100'
                    }`}
                  >
                    {user ? 'PROCEDER AL PAGO' : 'INICIAR SESIÓN PARA PAGAR'}
                    <ArrowRight size={20} />
                  </Link>

                  {!user && (
                    <p className="mt-4 text-center text-xs text-amber-700 font-bold bg-amber-50 p-3 rounded-xl border border-amber-100">
                      ⚠️ Necesitas una cuenta para guardar tu pedido y procesar el pago.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}