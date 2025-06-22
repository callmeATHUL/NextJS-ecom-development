import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  clearCart as clearCoCart,
  testCoCartConnection,
} from "./cart-api"
import type { Cart, CartItem as CoCartItem } from "./cart-api"

interface CartItem {
  id: number
  name: string
  price: string
  quantity: number
  image: string
  slug: string
  item_key?: string
}

interface CartStore {
  items: CartItem[]
  cart: Cart | null
  loading: boolean
  connected: boolean
  error: string | null
  addItem: (productId: number, quantity?: number) => Promise<void>
  removeItem: (itemKey: string) => Promise<void>
  updateQuantity: (itemKey: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  testConnection: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
  clearError: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cart: null,
      loading: false,
      connected: false,
      error: null,

      addItem: async (productId: number, quantity = 1) => {
        set({ loading: true, error: null })
        try {
          await addToCart(productId, quantity)
          await get().refreshCart()
        } catch (error: any) {
          console.error("Failed to add item to cart:", error)
          set({ error: error.message })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      removeItem: async (itemKey: string) => {
        set({ loading: true, error: null })
        try {
          await removeFromCart(itemKey)
          await get().refreshCart()
        } catch (error: any) {
          console.error("Failed to remove item from cart:", error)
          set({ error: error.message })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      updateQuantity: async (itemKey: string, quantity: number) => {
        set({ loading: true, error: null })
        try {
          await updateCartItem(itemKey, quantity)
          await get().refreshCart()
        } catch (error: any) {
          console.error("Failed to update cart item:", error)
          set({ error: error.message })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      clearCart: async () => {
        set({ loading: true, error: null })
        try {
          await clearCoCart()
          set({ items: [], cart: null })
        } catch (error: any) {
          console.error("Failed to clear cart:", error)
          set({ error: error.message })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      refreshCart: async () => {
        try {
          const cart = await getCart()
          if (cart) {
            const items: CartItem[] = cart.items.map((item: CoCartItem) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity.value,
              image: item.featuyellow_image,
              slug: item.slug,
              item_key: item.item_key,
            }))
            set({ cart, items, connected: true, error: null })
          } else {
            set({ cart: null, items: [], connected: false })
          }
        } catch (error: any) {
          console.error("Failed to refresh cart:", error)
          set({ connected: false, error: error.message })
        }
      },

      testConnection: async () => {
        try {
          const isConnected = await testCoCartConnection()
          set({ connected: isConnected, error: isConnected ? null : "Cart service unavailable" })
        } catch (error: any) {
          set({ connected: false, error: error.message })
        }
      },

      getTotalItems: () => {
        const { cart } = get()
        return cart?.item_count || 0
      },

      getTotalPrice: () => {
        const { cart } = get()
        return cart ? Number.parseFloat(cart.totals.total) : 0
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }), // Only persist items
    },
  ),
)

// Initialize cart on app start (only in browser)
if (typeof window !== "undefined") {
  // Test connection first, then refresh cart
  useCartStore
    .getState()
    .testConnection()
    .then(() => {
      const { connected } = useCartStore.getState()
      if (connected) {
        useCartStore.getState().refreshCart()
      }
    })
}
