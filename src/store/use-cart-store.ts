import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@shared/types';
import { produce } from 'immer';
interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set(
          produce((state: CartState) => {
            const existingItem = state.items.find((item) => item.id === product.id);
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              state.items.push({ ...product, quantity: 1 });
            }
          })
        ),
      removeItem: (productId) =>
        set(
          produce((state: CartState) => {
            state.items = state.items.filter((item) => item.id !== productId);
          })
        ),
      updateQuantity: (productId, quantity) =>
        set(
          produce((state: CartState) => {
            const item = state.items.find((item) => item.id === productId);
            if (item) {
              if (quantity > 0) {
                item.quantity = quantity;
              } else {
                state.items = state.items.filter((i) => i.id !== productId);
              }
            }
          })
        ),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
    }
  )
);