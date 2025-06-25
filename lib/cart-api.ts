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

// Legacy interfaces for backward compatibility
export interface CartItem extends StoreCartItem {
  item_key: string
  Featured_image: string
  slug: string
  price: string
  quantity: {
    value: number
    min_purchase: number
    max_purchase: number
  }
}

export interface Cart extends StoreCart {
  cart_hash: string
  cart_key: string
  currency: {
    currency_code: string
    currency_symbol: string
    currency_minor_unit: number
    currency_decimal_separator: string
    currency_thousand_separator: string
    currency_prefix: string
    currency_suffix: string
  }
  customer: {
    billing_address: any
    shipping_address: any
  }
  item_count: number
}

// Convert Store API response to legacy format for backward compatibility
function convertStoreCartToLegacy(storeCart: StoreCart): Cart {
  return {
    ...storeCart,
    cart_hash: storeCart.items.length > 0 ? "cart_has_items" : "No items in cart so no hash",
    cart_key: `store_${Date.now()}`,
    currency: {
      currency_code: storeCart.totals.currency_code,
      currency_symbol: storeCart.totals.currency_symbol,
      currency_minor_unit: storeCart.totals.currency_minor_unit,
      currency_decimal_separator: storeCart.totals.currency_decimal_separator,
      currency_thousand_separator: storeCart.totals.currency_thousand_separator,
      currency_prefix: storeCart.totals.currency_prefix,
      currency_suffix: storeCart.totals.currency_suffix,
    },
    customer: {
      billing_address: storeCart.billing_address,
      shipping_address: storeCart.shipping_address,
    },
    item_count: storeCart.items_count,
    totals: {
      subtotal: storeCart.totals.total_items,
      subtotal_tax: storeCart.totals.total_items_tax,
      fee_total: storeCart.totals.total_fees,
      fee_tax: storeCart.totals.total_fees_tax,
      discount_total: storeCart.totals.total_discount,
      discount_tax: storeCart.totals.total_discount_tax,
      shipping_total: storeCart.totals.total_shipping,
      shipping_tax: storeCart.totals.total_shipping_tax,
      total: storeCart.totals.total_price,
      total_tax: storeCart.totals.total_tax,
    }
  }
}

// Convert Store API item to legacy format
function convertStoreItemToLegacy(storeItem: StoreCartItem): CartItem {
  return {
    ...storeItem,
    item_key: storeItem.key,
    Featured_image: storeItem.images[0]?.src || "",
    slug: storeItem.permalink.split('/').filter(Boolean).pop() || "",
    price: storeItem.prices.price,
    quantity: {
      value: storeItem.quantity,
      min_purchase: 1,
      max_purchase: 999,
    }
  }
}

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

    const response = await storeApi.get("/cart")
    console.log("✅ Cart fetched successfully")
    
    // Convert to legacy format for backward compatibility
    return convertStoreCartToLegacy(response.data)
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
export async function addToCart(productId: number, quantity = 1): Promise<CartItem | null> {
  try {
    console.log(`🛒 Adding product ${productId} (qty: ${quantity}) to cart via Store API`)

    // Test connection first
    const isConnected = await testStoreApiConnection()
    if (!isConnected) {
      throw new Error("Store API is not available")
    }

    const response = await storeApi.post("/cart/add-item", {
      id: productId,
      quantity: quantity,
    })

    console.log("✅ Product added to cart successfully")
    
    // Store API returns the updated cart, we need to find the added item
    const updatedCart = response.data as StoreCart
    const addedItem = updatedCart.items.find(item => item.id === productId)
    
    if (addedItem) {
      return convertStoreItemToLegacy(addedItem)
    }
    
    return null
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
export async function updateCartItem(itemKey: string, quantity: number): Promise<CartItem | null> {
  try {
    console.log(`🛒 Updating cart item ${itemKey} to quantity ${quantity}`)

    const response = await storeApi.post("/cart/update-item", {
      key: itemKey,
      quantity: quantity,
    })

    console.log("✅ Cart item updated successfully")
    
    // Find the updated item in the response
    const updatedCart = response.data as StoreCart
    const updatedItem = updatedCart.items.find(item => item.key === itemKey)
    
    if (updatedItem) {
      return convertStoreItemToLegacy(updatedItem)
    }
    
    return null
  } catch (error: any) {
    console.error("❌ Error updating cart item:", error.message)
    throw new Error(error.response?.data?.message || "Failed to update cart item")
  }
}

// Remove item from cart using Store API
export async function removeFromCart(itemKey: string): Promise<boolean> {
  try {
    console.log(`🛒 Removing cart item ${itemKey}`)

    await storeApi.post("/cart/remove-item", {
      key: itemKey,
    })

    console.log("✅ Cart item removed successfully")
    return true
  } catch (error: any) {
    console.error("❌ Error removing cart item:", error.message)
    throw new Error(error.response?.data?.message || "Failed to remove cart item")
  }
}

// Clear entire cart using Store API
export async function clearCart(): Promise<boolean> {
  try {
    console.log("🛒 Clearing entire cart")

    // Store API doesn't have a direct clear endpoint, so we remove all items
    const cart = await getCart()
    if (!cart || cart.items.length === 0) {
      console.log("✅ Cart is already empty")
      return true
    }

    // Remove each item individually
    for (const item of cart.items) {
      await removeFromCart(item.key || item.item_key)
    }

    console.log("✅ Cart cleared successfully")
    return true
  } catch (error: any) {
    console.error("❌ Error clearing cart:", error.message)
    throw new Error(error.response?.data?.message || "Failed to clear cart")
  }
}

// Get cart item count
export async function getCartItemCount(): Promise<number> {
  try {
    const cart = await getCart()
    return cart?.item_count || 0
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