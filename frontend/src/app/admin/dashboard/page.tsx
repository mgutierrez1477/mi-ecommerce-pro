"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  ExclamationTriangleIcon, 
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]); // Estado para las órdenes
  const [loading, setLoading] = useState(true);
  
  // Estados para Paginación y Búsqueda
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // 1. Cargar Estadísticas (Solo una vez)
  useEffect(() => {
    api.get("/orders/stats/")
      .then(res => setStats(res.data))
      .catch(err => console.error("Error en stats:", err));
  }, []);

  // 2. Cargar Órdenes (Cada vez que cambie la página o la búsqueda)
 useEffect(() => {
  // 1. Creamos un temporizador
  const delayDebounceFn = setTimeout(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders/?page=${page}&search=${search}`);
        setOrders(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 5));
      } catch (err) {
        console.error("Error cargando órdenes:", err);
      }
    };

    fetchOrders();
  }, 700); // <--- 500ms es el tiempo de espera ideal

  // 2. Limpiamos el temporizador si el usuario vuelve a escribir antes de los 500ms
  return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

  if (loading && !stats) return <div className="p-10 text-center font-mono text-indigo-600 animate-pulse">Cargando ecosistema de datos...</div>;
  if (!stats) return <div className="p-10 text-red-500 text-center font-bold">Error: No se pudo verificar el rol de administrador.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black text-gray-800 mb-8 tracking-tight italic">E-COMMERCE <span className="text-indigo-600">ADMIN</span></h1>

      {/* --- GRID DE TARJETAS (Tus stats originales) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Ventas Totales</p>
              <h3 className="text-2xl font-bold text-gray-900">${stats.total_revenue?.toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Pedidos</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total_orders}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Pendientes</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pending_orders}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <ArrowTrendingUpIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Bajo Stock</p>
              <h3 className="text-2xl font-bold text-red-600">{stats.low_stock_count}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- SECCIÓN DE ÓRDENES (IZQUIERDA - 2 COLUMNAS) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-black text-gray-800">Gestión de Pedidos</h2>
              
              {/* Buscador */}
              <div className="relative group">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="Buscar por ID o Cliente..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64 transition-all"
                  value={search}
                  onChange={(e) => {setSearch(e.target.value); setPage(1);}}
                />
              </div>
            </div>

            {/* Tabla de Órdenes */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-tighter border-b border-gray-50">
                    <th className="pb-4 font-black">ID</th>
                    <th className="pb-4 font-black">Cliente</th>
                    <th className="pb-4 font-black">Total</th>
                    <th className="pb-4 font-black">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-sm font-bold text-indigo-600">#{order.id}</td>
                      <td className="py-4 text-sm font-medium text-gray-700">{order.customer_name || 'Cliente'}</td>
                      <td className="py-4 text-sm font-black text-gray-900">${order.total_cost}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.paid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {order.paid ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-6">
              <p className="text-xs text-gray-400 font-medium">Página {page} de {totalPages}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-30 transition"
                >
                  <ChevronRightIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- ALERTAS DE STOCK (DERECHA - 1 COLUMNA) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-50 bg-red-50/30">
              <h2 className="text-lg font-black text-red-800 flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                Alertas de Stock
              </h2>
            </div>
            <div className="p-6">
              {stats.low_stock_list.length > 0 ? (
                <ul className="space-y-4">
                  {stats.low_stock_list.map((prod: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 transition-colors">
                      <span className="text-gray-700 text-sm font-bold">{prod.name}</span>
                      <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black">
                        STOCK: {prod.stock}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">✅</span>
                  </div>
                  <p className="text-green-600 text-sm font-black">Inventario impecable</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}