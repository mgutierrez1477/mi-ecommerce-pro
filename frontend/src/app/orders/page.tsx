"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  ShoppingBagIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ArchiveBoxIcon,
  UserIcon
} from "@heroicons/react/24/outline";

// Interfaces para TypeScript
interface User {
  pk?: number;
  username: string;
  is_staff?: boolean; 
}

interface OrderItem {
  id: number;
  product_name: string; // Si el backend no lo envía, saldrá vacío
  price: string;
  quantity: number;
}

interface Order {
  id: number;
  created_at: string;
  paid: boolean;
  total_cost: number;
  customer_name?: string; 
  items: OrderItem[];
}

export default function OrdersPage() {
  const user = useAuthStore((state) => state.user) as User | null;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LÓGICA DE DEPURACIÓN ---
  // Abre la consola (F12) para ver si is_staff llega como true
  useEffect(() => {
    console.log("Usuario en OrdersPage:", user);
  }, [user]);

  // Verificamos si es administrador (Asegúrate que coincida con el Navbar)
  const isStaff = user?.is_staff === true || user?.pk === 1;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/");
        
        const rawData = response.data.results || response.data;
        
        if (Array.isArray(rawData)) {
          setOrders(rawData);
        } else {
          setOrders([]);
        }
      } catch (err: any) {
        console.error("Error al obtener órdenes:", err);
        setError("No se pudieron cargar los datos. Verifica tu conexión.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium font-mono">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex items-center mb-10">
        <div className="bg-indigo-100 p-3 rounded-2xl mr-4">
          <ArchiveBoxIcon className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isStaff ? "Gestión de Ventas Globales" : "Mis Pedidos"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isStaff 
              ? `Bienvenido Admin ${user?.username}. Estás viendo todas las ventas.` 
              : "Aquí puedes ver el detalle de tus compras."}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No hay órdenes para mostrar.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300">
              
              <div className="bg-gray-50/50 p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6 sm:gap-10">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Fecha</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Total</p>
                    <p className="text-sm font-bold text-gray-900">${order.total_cost}</p>
                  </div>
                  {isStaff && (
                    <div className="hidden sm:block">
                      <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">Cliente</p>
                      <p className="text-sm font-bold text-indigo-700 flex items-center">
                        <UserIcon className="w-4 h-4 mr-1" />
                        {order.customer_name || "Usuario Desconocido"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-gray-400">#ORD-{order.id}</span>
                  {order.paid ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Pagado</span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Pendiente</span>
                  )}
                </div>
              </div>

              <div className="p-5 divide-y divide-gray-50">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3">
                    <div className="flex items-center">
                      <span className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-black mr-4">
                        {item.quantity}
                      </span>
                      {/* Si product_name es undefined, mostramos un mensaje de error */}
                      <p className="text-sm font-medium text-gray-800">
                        {item.product_name || `Producto ID: ${item.id} (Error: No name)`}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-500">${item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}