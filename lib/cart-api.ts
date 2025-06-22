import axios from "axios"

// CoCart API configuration
const COCART_API_BASE = "https://sultanafitness.store/wp-json/cocart/v2"

const cartApi = axios.create({
  baseURL: COCART_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
})

// Cart interfaces
export interface CartItem {
  item_key: string
  id: number
  name: string
  title: string
  price: string
  quantity: {
    value: number
    min_purchase: number
    max_purchase: number
  }
  totals: {
    subtotal: number
    subtotal_tax: number
    total: number
    tax: number
  }
  slug: string
  meta: {
    product_type: string
    sku: string
    dimensions: {
      length: string
      width: string
      height: string
    }
    weight: number
  }
  backorders: string
  cart_item_data: any[]
  featured_image: string
}

export interface Cart {
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
  items: CartItem[]
  item_count: number
  items_weight: number
  coupons: any[]
  needs_payment: boolean
  needs_shipping: boolean
  shipping: {
    total_packages: number
    show_package_details: boolean
    has_calculated_shipping: boolean
    packages: any[]
  }
  fees: any[]
  taxes: any[]
  totals: {
    subtotal: string
    subtotal_tax: string
    fee_total: string
    fee_tax: string
    discount_total: string
    discount_tax: string
    shipping_total: string
    shipping_tax: string
    total: string
    total_tax: string
  }
}

// Test CoCart API connection
export async function testCoCartConnection(): Promise<boolean> {
  try {
    console.log("🔍 Testing CoCart API connection...")

    const response = await cartApi.get("/cart")
    console.log("✅ CoCart API connection successful")
    console.log("Response status:", response.status)
    return true
  } catch (error: any) {
    console.error("❌ CoCart API connection failed:", error.message)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    }
    return false
  }
}

// Get current cart
export async function getCart(): Promise<Cart | null> {
  try {
    console.log("🛒 Fetching cart contents")

    const response = await cartApi.get("/cart")
    console.log("✅ Cart fetched successfully")
    return response.data
  } catch (error: any) {
    console.error("❌ Error fetching cart:", error.message)

    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - CoCart API is taking too long to respond")
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error - Cannot reach CoCart API")
    } else if (error.response) {
      console.error("HTTP Error:", error.response.status, error.response.statusText)
      console.error("Response data:", error.response.data)
    }

    return null
  }
}

// Add item to cart
export async function addToCart(productId: number, quantity = 1): Promise<CartItem | null> {
  try {
    console.log(`🛒 Adding product ${productId} (qty: ${quantity}) to cart`)

    // Test connection first
    const isConnected = await testCoCartConnection()
    if (!isConnected) {
      throw new Error("CoCart API is not available")
    }

    const response = await cartApi.post("/cart/add-item", {
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

// Update cart item quantity
export async function updateCartItem(itemKey: string, quantity: number): Promise<CartItem | null> {
  try {
    console.log(`🛒 Updating cart item ${itemKey} to quantity ${quantity}`)

    const response = await cartApi.post("/cart/item", {
      cart_item_key: itemKey,
      quantity: quantity,
    })

    console.log("✅ Cart item updated successfully")
    return response.data
  } catch (error: any) {
    console.error("❌ Error updating cart item:", error.message)
    throw new Error(error.response?.data?.message || "Failed to update cart item")
  }
}

// Remove item from cart
export async function removeFromCart(itemKey: string): Promise<boolean> {
  try {
    console.log(`🛒 Removing cart item ${itemKey}`)

    await cartApi.delete(`/cart/item/${itemKey}`)

    console.log("✅ Cart item removed successfully")
    return true
  } catch (error: any) {
    console.error("❌ Error removing cart item:", error.message)
    throw new Error(error.response?.data?.message || "Failed to remove cart item")
  }
}

// Clear entire cart
export async function clearCart(): Promise<boolean> {
  try {
    console.log("🛒 Clearing entire cart")

    await cartApi.delete("/cart/clear")

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

// Apply coupon
export async function applyCoupon(couponCode: string): Promise<boolean> {
  try {
    console.log(`🛒 Applying coupon: ${couponCode}`)

    await cartApi.post("/cart/coupon", {
      coupon: couponCode,
    })

    console.log("✅ Coupon applied successfully")
    return true
  } catch (error: any) {
    console.error("❌ Error applying coupon:", error.message)
    throw new Error(error.response?.data?.message || "Failed to apply coupon")
  }
}

// Remove coupon
export async function removeCoupon(couponCode: string): Promise<boolean> {
  try {
    console.log(`🛒 Removing coupon: ${couponCode}`)

    await cartApi.delete(`/cart/coupon/${couponCode}`)

    console.log("✅ Coupon removed successfully")
    return true
  } catch (error: any) {
    console.error("❌ Error removing coupon:", error.message)
    throw new Error(error.response?.data?.message || "Failed to remove coupon")
  }
}
