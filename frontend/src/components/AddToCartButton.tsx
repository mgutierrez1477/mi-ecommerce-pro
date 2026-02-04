'use client'; //Importante: esto corre en el navegador

import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton ({ product }: { product: Product}){
    const addItem = useCartStore((state) => state.addItem);

    return (
    <button
      onClick={() => addItem(product)}
      disabled={product.stock === 0}
      className="mt-10 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-white hover:bg-indigo-700 disabled:bg-gray-400 transition-all shadow-lg shadow-indigo-200"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Añadir al carrito
    </button>
  );
    
}