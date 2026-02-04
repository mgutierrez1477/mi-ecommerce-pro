"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore"; // Importado para limpiar el carrito
import CartDrawer from "./CartDrawer"; 
import { 
  ShoppingCartIcon, 
  UserCircleIcon, 
  ArrowLeftStartOnRectangleIcon, 
  ShieldCheckIcon,          
  ShoppingBagIcon           
} from "@heroicons/react/24/outline";

interface User {
  pk?: number;
  username: string;
  is_staff?: boolean; 
  is_superuser?: boolean;
}

export default function Navbar() {
  const user = useAuthStore((state) => state.user) as User | null;
  const logout = useAuthStore((state) => state.logout);
  const clearCart = useCartStore((state) => state.clearCart); // 1. Extraemos la función clearCart
  const router = useRouter();
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    clearCart(); // 2. Limpiamos el carrito local antes de cerrar sesión
    logout();
    router.push("/login");
  };

  const isAdmin = Boolean(user?.is_staff || user?.is_superuser);

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
                TECH<span className="text-gray-900">STORE</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-5">
              
              {/* Carrito */}
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative group p-2 outline-none"
              >
                <ShoppingCartIcon className="w-6 h-6 text-gray-700 group-hover:text-indigo-600 transition" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1"></div>

              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  
                  {isAdmin ? (
                    <Link 
                      href="/admin/dashboard" 
                      className="flex items-center bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold hover:bg-red-100 transition"
                    >
                      <ShieldCheckIcon className="w-4 h-4 mr-1" />
                      Panel Admin
                    </Link>
                  ) : (
                    <Link 
                      href="/orders" 
                      className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold hover:bg-indigo-100 transition"
                    >
                      <ShoppingBagIcon className="w-4 h-4 mr-1" />
                      Mis Pedidos
                    </Link>
                  )}

                  {/* Perfil */}
                  <div className="hidden md:flex items-center space-x-1 text-gray-700 border-l border-gray-100 pl-4">
                    <UserCircleIcon className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-semibold max-w-[100px] truncate">{user.username}</span>
                  </div>

                  {/* Logout */}
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Cerrar Sesión"
                  >
                    <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">
                    Login
                  </Link>
                  <Link href="/register" className="hidden sm:block bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition">
                    Registro
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}