import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  clearCart as clearStoreCart,
  testStoreApiConnection,
  applyCoupon,
  removeCoupon,
} from "./cart-api"
import type { Cart, CartItem } from "./cart-api"

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
  applyCoupon: (couponCode: string) => Promise<void>
  removeCoupon: (couponCode: string) => Promise<void>
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
          console.log(`🛒 Adding item ${productId} with quantity ${quantity}`)
          const updatedCart = await addToCart(productId, quantity)
          set({ cart: updatedCart, items: updatedCart.items })
          console.log(`✅ Successfully added item ${productId} to cart`)
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
          console.log(`🗑️ Removing item ${itemKey}`)
          const updatedCart = await removeFromCart(itemKey)
          set({ cart: updatedCart, items: updatedCart.items })
          console.log(`✅ Successfully removed item ${itemKey}`)
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
          console.log(`📝 Updating item ${itemKey} quantity to ${quantity}`)
          const updatedCart = await updateCartItem(itemKey, quantity)
          set({ cart: updatedCart, items: updatedCart.items })
          console.log(`✅ Successfully updated item ${itemKey} quantity`)
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
          console.log(`🧹 Clearing cart`)
          const updatedCart = await clearStoreCart()
          set({ cart: updatedCart, items: updatedCart.items })
          console.log(`✅ Successfully cleared cart`)
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
          console.log(`🔄 Refreshing cart`)
          const cart = await getCart()
          if (cart) {
            set({ cart, items: cart.items, connected: true, error: null })
            console.log(`✅ Cart refreshed with ${cart.items.length} items`)
          } else {
            set({ cart: null, items: [], connected: false })
            console.log(`📭 Cart is empty or unavailable`)
          }
        } catch (error: any) {
          console.error("Failed to refresh cart:", error)
          set({ connected: false, error: error.message })
        }
      },

      testConnection: async () => {
        try {
          console.log(`🔍 Testing cart API connection`)
          const isConnected = await testStoreApiConnection()
          set({ connected: isConnected, error: isConnected ? null : "Cart service unavailable" })
          console.log(`${isConnected ? '✅' : '❌'} Cart API connection ${isConnected ? 'successful' : 'failed'}`)
        } catch (error: any) {
          set({ connected: false, error: error.message })
          console.error(`❌ Cart API connection test failed:`, error)
        }
      },

      applyCoupon: async (couponCode: string) => {
        set({ loading: true, error: null })
        try {
          console.log(`🎫 Applying coupon: ${couponCode}`)
          await applyCoupon(couponCode)
          await get().refreshCart()
          console.log(`✅ Successfully applied coupon: ${couponCode}`)
        } catch (error: any) {
          console.error("Failed to apply coupon:", error)
          set({ error: error.message })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      removeCoupon: async (couponCode: string) => {
        set({ loading: true, error: null })
        try {
          console.log(`🎫 Removing coupon: ${couponCode}`)
          await removeCoupon(couponCode)
          await get().refreshCart()
          console.log(`✅ Successfully removed coupon: ${couponCode}`)
        } catch (error: any) {
          console.error("Failed to remove coupon:", error)
          set({ error: error.message })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      getTotalItems: () => {
        const { cart } = get()
        return cart?.items_count || 0
      },

      getTotalPrice: () => {
        const { cart } = get()
        return cart ? Number.parseFloat(cart.totals.total_price) : 0
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "cart-storage",
      partialize: (state: CartStore) => ({
        items: state.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.prices.price,
          quantity: item.quantity,
          key: item.key,
        })),
      }),
    }
  )
);

// Initialize cart on app start (only in browser)
if (typeof window !== "undefined") {
  // Test connection first, then refresh cart
  console.log("🚀 Initializing cart store...")
  useCartStore
    .getState()
    .testConnection()
    .then(() => {
      const { connected } = useCartStore.getState()
      if (connected) {
        console.log("🔄 Cart connected, refreshing cart data...")
        useCartStore.getState().refreshCart()
      } else {
        console.log("❌ Cart not connected, will use local storage only")
      }
    })
    .catch((error) => {
      console.error("❌ Cart initialization failed:", error)
    })
}
