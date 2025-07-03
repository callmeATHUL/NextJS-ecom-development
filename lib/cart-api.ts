// Mock CoCart API configuration (no actual API calls)
const MOCK_COCART_API_BASE = "/mock-cocart-api/v2" // A dummy base URL

// Cart interfaces (simplified for mock)
export interface CartItem {
  item_key: string;
  id: number;
  name: string;
  price: string;
  quantity: {
    value: number;
    min_purchase: number;
    max_purchase: number;
  };
  totals: {
    subtotal: number;
    subtotal_tax: number;
    total: number;
    tax: number;
  };
  slug: string;
  meta: {
    product_type: string;
    sku: string;
    dimensions: {
      length: string;
      width: string;
      height: string;
    };
    weight: number;
  };
  backorders: string;
  cart_item_data: any[];
  Featured_image: string;
}

export interface Cart {
  cart_hash: string;
  cart_key: string;
  currency: {
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  };
  customer: {
    billing_address: any;
    shipping_address: any;
  };
  items: CartItem[];
  item_count: number;
  items_weight: number;
  coupons: any[];
  needs_payment: boolean;
  needs_shipping: boolean;
  shipping: {
    total_packages: number;
    show_package_details: boolean;
    has_calculated_shipping: boolean;
    packages: any[];
  };
  fees: any[];
  taxes: any[];
  totals: {
    subtotal: string;
    subtotal_tax: string;
    fee_total: string;
    fee_tax: string;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    total: string;
    total_tax: string;
  };
}

// In-memory cart data
let mockCart: Cart = {
  cart_hash: "mock_cart_hash",
  cart_key: "mock_cart_key",
  currency: {
    currency_code: "SAR",
    currency_symbol: "SAR",
    currency_minor_unit: 2,
    currency_decimal_separator: ".",
    currency_thousand_separator: ",",
    currency_prefix: "",
    currency_suffix: "",
  },
  customer: {
    billing_address: {},
    shipping_address: {},
  },
  items: [],
  item_count: 0,
  items_weight: 0,
  coupons: [],
  needs_payment: true,
  needs_shipping: true,
  shipping: {
    total_packages: 0,
    show_package_details: false,
    has_calculated_shipping: false,
    packages: [],
  },
  fees: [],
  taxes: [],
  totals: {
    subtotal: "0.00",
    subtotal_tax: "0.00",
    fee_total: "0.00",
    fee_tax: "0.00",
    discount_total: "0.00",
    discount_tax: "0.00",
    shipping_total: "0.00",
    shipping_tax: "0.00",
    total: "0.00",
    total_tax: "0.00",
  },
};

// Helper to update totals
const updateMockCartTotals = () => {
  let subtotal = 0;
  let totalItems = 0;
  mockCart.items.forEach(item => {
    subtotal += parseFloat(item.price) * item.quantity.value;
    totalItems += item.quantity.value;
  });
  mockCart.totals.subtotal = subtotal.toFixed(2);
  mockCart.totals.total = subtotal.toFixed(2); // For simplicity, total equals subtotal in mock
  mockCart.item_count = totalItems;
};

// Mock API functions

export async function testCoCartConnection(): Promise<boolean> {
  console.log("🔍 Testing Mock CoCart API connection...")
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ Mock CoCart API connection successful")
      resolve(true)
    }, 100)
  })
}

export async function getCart(): Promise<Cart | null> {
  console.log("🛒 Fetching mock cart contents")
  return new Promise((resolve) => {
    setTimeout(() => {
      updateMockCartTotals();
      console.log("✅ Mock cart fetched successfully")
      resolve(mockCart)
    }, 100)
  })
}

export async function addToCart(productId: number, quantity = 1): Promise<CartItem | null> {
  console.log(`🛒 Adding mock product ${productId} (qty: ${quantity}) to cart`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate product data - in a real app, this would come from a product API
      const existingItem = mockCart.items.find(item => item.id === productId);

      if (existingItem) {
        existingItem.quantity.value += quantity;
        existingItem.totals.subtotal = parseFloat(existingItem.price) * existingItem.quantity.value;
        existingItem.totals.total = existingItem.totals.subtotal;
      } else {
        const newItem: CartItem = {
          item_key: `mock-item-${Date.now()}`,
          id: productId,
          name: `Mock Product ${productId}`,
          price: (100 + productId).toFixed(2), // Dummy price
          quantity: {
            value: quantity,
            min_purchase: 1,
            max_purchase: 99,
          },
          totals: {
            subtotal: parseFloat((100 + productId).toFixed(2)) * quantity,
            subtotal_tax: 0,
            total: parseFloat((100 + productId).toFixed(2)) * quantity,
            tax: 0,
          },
          slug: `mock-product-${productId}`,
          meta: {
            product_type: "simple",
            sku: `SKU-${productId}`,
            dimensions: { length: "10", width: "10", height: "10" },
            weight: 1,
          },
          backorders: "no",
          cart_item_data: [],
          Featured_image: `/placehold.jpg`, // Dummy image
        };
        mockCart.items.push(newItem);
      }
      updateMockCartTotals();
      console.log("✅ Mock product added to cart successfully")
      resolve(mockCart.items.find(item => item.id === productId) || null);
    }, 100)
  })
}

export async function updateCartItem(itemKey: string, quantity: number): Promise<CartItem | null> {
  console.log(`🛒 Updating mock cart item ${itemKey} to quantity ${quantity}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const itemIndex = mockCart.items.findIndex(item => item.item_key === itemKey);
      if (itemIndex > -1) {
        mockCart.items[itemIndex].quantity.value = quantity;
        mockCart.items[itemIndex].totals.subtotal = parseFloat(mockCart.items[itemIndex].price) * quantity;
        mockCart.items[itemIndex].totals.total = mockCart.items[itemIndex].totals.subtotal;
        updateMockCartTotals();
        console.log("✅ Mock cart item updated successfully")
        resolve(mockCart.items[itemIndex]);
      } else {
        reject(new Error("Mock item not found"));
      }
    }, 100)
  })
}

export async function removeFromCart(itemKey: string): Promise<boolean> {
  console.log(`🛒 Removing mock cart item ${itemKey}`)
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = mockCart.items.length;
      mockCart.items = mockCart.items.filter(item => item.item_key !== itemKey);
      updateMockCartTotals();
      console.log("✅ Mock cart item removed successfully")
      resolve(mockCart.items.length < initialLength);
    }, 100)
  })
}

export async function clearCart(): Promise<boolean> {
  console.log("🛒 Clearing entire mock cart")
  return new Promise((resolve) => {
    setTimeout(() => {
      mockCart.items = [];
      updateMockCartTotals();
      console.log("✅ Mock cart cleared successfully")
      resolve(true);
    }, 100)
  })
})
}

export async function getCartItemCount(): Promise<number> {
  console.log("🛒 Getting mock cart item count")
  return new Promise((resolve) => {
    setTimeout(() => {
      updateMockCartTotals();
      resolve(mockCart.item_count);
    }, 100)
  })
}

export async function applyCoupon(couponCode: string): Promise<boolean> {
  console.log(`🛒 Applying mock coupon: ${couponCode}`)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock coupon logic: always succeed for "SAVE10"
      if (couponCode === "SAVE10") {
        console.log("✅ Mock coupon applied successfully")
        resolve(true);
      } else {
        console.log("❌ Mock coupon failed")
        resolve(false);
      }
    }, 100)
  })
}

export async function removeCoupon(couponCode: string): Promise<boolean> {
  console.log(`🛒 Removing mock coupon: ${couponCode}`)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ Mock coupon removed successfully")
      resolve(true);
    }, 100)
  })
}