import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface CartItem extends Omit<Product, 'price'> {
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product | CartItem) => void;
  decreaseQuantity: (productId: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        const numericPrice = typeof product.price === 'string' 
          ? parseFloat(product.price) 
          : product.price;

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ 
            items: [...currentItems, { ...product, price: numericPrice, quantity: 1 } as CartItem] 
          });
        }
      },

      decreaseQuantity: (productId) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === productId);

        if (existingItem && existingItem.quantity > 1) {
          set({
            items: currentItems.map(item =>
              item.id === productId 
                ? { ...item, quantity: item.quantity - 1 } 
                : item
            )
          });
        } else {
          set({
            items: currentItems.filter(item => item.id !== productId)
          });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      // Limpia el array de items por completo
      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    { name: 'cart-storage' }
  )
);