import axios from "axios"

// WooCommerce Store API configuration (Official WooCommerce Cart API)
const STORE_API_BASE = "https://sultanafitness.store/wp-json/wc/store/v1"

const storeApi = axios.create({
  baseURL: STORE_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout
})

// Enhanced Cart interfaces for WooCommerce Store API
export interface StoreCartItem {
  key: string
  id: number
  quantity: number
  name: string
  short_description: string
  description: string
  sku: string
  low_stock_remaining: number | null
  backorders_allowed: boolean
  show_backorder_badge: boolean
  sold_individually: boolean
  permalink: string
  images: Array<{
    id: number
    src: string
    thumbnail: string
    srcset: string
    sizes: string
    name: string
    alt: string
  }>
  variation: any[]
  item_data: any[]
  prices: {
    price: string
    regular_price: string
    sale_price: string
    price_range: string | null
    currency_code: string
    currency_symbol: string
    currency_minor_unit: number
    currency_decimal_separator: string
    currency_thousand_separator: string
    currency_prefix: string
    currency_suffix: string
    raw_prices: {
      precision: number
      price: string
      regular_price: string
      sale_price: string
    }
  }
  totals: {
    line_subtotal: string
    line_subtotal_tax: string
    line_total: string
    line_total_tax: string
    currency_code: string
    currency_symbol: string
    currency_minor_unit: number
    currency_decimal_separator: string
    currency_thousand_separator: string
    currency_prefix: string
    currency_suffix: string
  }
  catalog_visibility: string
  extensions: any
}

export interface StoreCart {
  coupons: any[]
  shipping_rates: any[]
  shipping_address: {
    first_name: string
    last_name: string
    company: string
    address_1: string
    address_2: string
    city: string
    state: string
    postcode: string
    country: string
    phone: string
  }
  billing_address: {
    first_name: string
    last_name: string
    company: string
    address_1: string
    address_2: string
    city: string
    state: string
    postcode: string
    country: string
    email: string
    phone: string
  }
  items: StoreCartItem[]
  items_count: number
  items_weight: number
  cross_sells: any[]
  needs_payment: boolean
  needs_shipping: boolean
  has_calculated_shipping: boolean
  fees: any[]
  totals: {
    total_items: string
    total_items_tax: string
    total_fees: string
    total_fees_tax: string
    total_discount: string
    total_discount_tax: string
    total_shipping: string
    total_shipping_tax: string
    total_price: string
    total_tax: string
    tax_lines: any[]
    currency_code: string
    currency_symbol: string
    currency_minor_unit: number
    currency_decimal_separator: string
    currency_thousand_separator: string
    currency_prefix: string
    currency_suffix: string
  }
  errors: any[]
  payment_methods: string[]
  payment_requirements: string[]
  extensions: any
}

// Type aliases for clarity
export type CartItem = StoreCartItem
export type Cart = StoreCart

// Add request interceptor for logging
storeApi.interceptors.request.use(
  (config) => {
    console.log(`🔄 Store API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error("❌ Store API Request Error:", error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging
storeApi.interceptors.response.use(
  (response) => {
    console.log(`✅ Store API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error("❌ Store API Response Error:", error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Test Store API connection
export async function testStoreApiConnection(): Promise<boolean> {
  try {
    console.log("🔍 Testing WooCommerce Store API connection...")

    const response = await storeApi.get("/cart")
    console.log("✅ Store API connection successful")
    console.log("Response status:", response.status)
    return true
  } catch (error: any) {
    console.error("❌ Store API connection failed:", error.message)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    }
    return false
  }
}

// Get current cart using Store API
export async function getCart(): Promise<Cart | null> {
  try {
    console.log("🛒 Fetching cart contents via Store API")
    const response = await storeApi.get<Cart>("/cart")
    console.log("✅ Cart fetched successfully")
    return response.data
  } catch (error: any) {
    console.error("❌ Error fetching cart:", error.message)
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - Store API is taking too long to respond")
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error - Cannot reach Store API")
    } else if (error.response) {
      console.error("HTTP Error:", error.response.status, error.response.statusText)
      console.error("Response data:", error.response.data)
    }
    return null
  }
}

// Add item to cart using Store API
export async function addToCart(productId: number, quantity = 1): Promise<Cart> {
  try {
    console.log(`🛒 Adding product ${productId} (qty: ${quantity}) to cart via Store API`)
    const response = await storeApi.post<Cart>("/cart/add-item", {
      id: productId,
      quantity: quantity,
    })
    console.log("✅ Product added to cart successfully")
    return response.data
  } catch (error: any) {
    console.error("❌ Error adding product to cart:", error.message)
    if (error.response?.status === 404) {
      throw new Error("Product not found")
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid product or quantity")
    } else if (error.code === "ERR_NETWORK") {
      throw new Error("Network error - Cannot reach cart service")
    } else {
      throw new Error(error.response?.data?.message || "Failed to add product to cart")
    }
  }
}

// Update cart item quantity using Store API
export async function updateCartItem(itemKey: string, quantity: number): Promise<Cart> {
  try {
    console.log(`🛒 Updating cart item ${itemKey} to quantity ${quantity}`)
    const response = await storeApi.post<Cart>("/cart/update-item", {
      key: itemKey,
      quantity: quantity,
    })
    console.log("✅ Cart item updated successfully")
    return response.data
  } catch (error: any) {
    console.error("❌ Error updating cart item:", error.message)
    throw new Error(error.response?.data?.message || "Failed to update cart item")
  }
}

// Remove item from cart using Store API
export async function removeFromCart(itemKey: string): Promise<Cart> {
  try {
    console.log(`🛒 Removing cart item ${itemKey}`)
    const response = await storeApi.post<Cart>("/cart/remove-item", {
      key: itemKey,
    })
    console.log("✅ Cart item removed successfully")
    return response.data
  } catch (error: any) {
    console.error("❌ Error removing cart item:", error.message)
    throw new Error(error.response?.data?.message || "Failed to remove cart item")
  }
}

// Clear entire cart using Store API
export async function clearCart(): Promise<Cart> {
  try {
    console.log("🛒 Clearing entire cart")
    const response = await storeApi.post<Cart>("/cart/clear")
    console.log("✅ Cart cleared successfully")
    return response.data
  } catch (error: any) {
    console.error("❌ Error clearing cart:", error.message)
    throw new Error(error.response?.data?.message || "Failed to clear cart")
  }
}

// Get cart item count
export async function getCartItemCount(): Promise<number> {
  try {
    const cart = await getCart()
    return cart?.items_count || 0
  } catch (error: any) {
    console.error("❌ Error getting cart item count:", error)
    return 0
  }
}

// Apply coupon using Store API
export async function applyCoupon(couponCode: string): Promise<boolean> {
  try {
    console.log(`🛒 Applying coupon: ${couponCode}`)

    await storeApi.post("/cart/apply-coupon", {
      code: couponCode,
    })

    console.log("✅ Coupon applied successfully")
    return true
  } catch (error: any) {
    console.error("❌ Error applying coupon:", error.message)
    throw new Error(error.response?.data?.message || "Failed to apply coupon")
  }
}

// Remove coupon using Store API
export async function removeCoupon(couponCode: string): Promise<boolean> {
  try {
    console.log(`🛒 Removing coupon: ${couponCode}`)

    await storeApi.post("/cart/remove-coupon", {
      code: couponCode,
    })

    console.log("✅ Coupon removed successfully")
    return true
  } catch (error: any) {
    console.error("❌ Error removing coupon:", error.message)
    throw new Error(error.response?.data?.message || "Failed to remove coupon")
  }
}

// Backward compatibility aliases
export const testCoCartConnection = testStoreApiConnection