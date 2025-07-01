import axios from 'axios'

// WooCommerce Store Configuration
// Note: APIs are only accessible from sultanafitness.store domain
const STORE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL || 'https://sultanafitness.store'
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || 'ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec'
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || 'cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7'

// Validate configuration
if (typeof window === 'undefined') { // Server-side only
  if (!STORE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error('❌ Missing WooCommerce API configuration');
    console.error('Required environment variables:');
    console.error('- NEXT_PUBLIC_WOOCOMMERCE_STORE_URL');
    console.error('- WOOCOMMERCE_CONSUMER_KEY');
    console.error('- WOOCOMMERCE_CONSUMER_SECRET');
  } else {
    console.log('✅ WooCommerce configuration loaded:', {
      storeUrl: STORE_URL,
      consumerKeyPrefix: CONSUMER_KEY.substring(0, 10) + '...',
      hasSecret: !!CONSUMER_SECRET
    });
  }
}

// Base API URL
const API_BASE_URL = `${STORE_URL}/wp-json/wc/v3`

// Domain validation helper
export function validateApiDomain(): { isValid: boolean; message: string } {
  if (!STORE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    return {
      isValid: false,
      message: 'Missing required API configuration. Check environment variables.'
    }
  }
  
  if (!STORE_URL.includes('sultanafitness.store')) {
    return {
      isValid: false,
      message: 'API domain must be sultanafitness.store for proper functionality.'
    }
  }
  
  return {
    isValid: true,
    message: 'API configuration is valid.'
  }
}

// Create axios instance with authentication
const wooCommerceApi = axios.create({
  baseURL: API_BASE_URL,
  params: {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
  },
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add request interceptor for logging
wooCommerceApi.interceptors.request.use(
  (config) => {
    console.log(`🔄 WooCommerce API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ WooCommerce API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging
wooCommerceApi.interceptors.response.use(
  (response) => {
    console.log(`✅ WooCommerce API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ WooCommerce API Response Error:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// TypeScript Interfaces
export interface ProductImage {
  id: number
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  src: string
  name: string
  alt: string
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export interface ProductAttribute {
  id: number
  name: string
  position: number
  visible: boolean
  variation: boolean
  options: string[]
}

export interface Product {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  type: string
  status: string
  featured: boolean
  catalog_visibility: string
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  date_on_sale_from: string | null
  date_on_sale_from_gmt: string | null
  date_on_sale_to: string | null
  date_on_sale_to_gmt: string | null
  price_html: string
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  downloads: any[]
  download_limit: number
  download_expiry: number
  external_url: string
  button_text: string
  tax_status: string
  tax_class: string
  manage_stock: boolean
  stock_quantity: number | null
  stock_status: string
  backorders: string
  backorders_allowed: boolean
  backordered: boolean
  sold_individually: boolean
  weight: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  related_ids: number[]
  upsell_ids: number[]
  cross_sell_ids: number[]
  parent_id: number
  purchase_note: string
  categories: ProductCategory[]
  tags: any[]
  images: ProductImage[]
  attributes: ProductAttribute[]
  default_attributes: any[]
  variations: number[]
  grouped_products: number[]
  menu_order: number
  meta_data: any[]
}

export interface Category {
  id: number
  name: string
  slug: string
  parent: number
  description: string
  display: string
  image: {
    id: number
    date_created: string
    date_created_gmt: string
    date_modified: string
    date_modified_gmt: string
    src: string
    name: string
    alt: string
  } | null
  menu_order: number
  count: number
}

export interface GetProductsParams {
  page?: number
  per_page?: number
  search?: string
  category?: string
  slug?: string
  include?: number[]
  exclude?: number[]
  status?: string
  type?: string
  sku?: string
  featured?: boolean
  on_sale?: boolean
  min_price?: string
  max_price?: string
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'price' | 'popularity' | 'rating'
  order?: 'asc' | 'desc'
}

export interface Order {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note: string;
  date_completed: string | null;
  date_paid: string | null;
  cart_hash: string;
  number: string;
  meta_data: any[];
  line_items: LineItem[];
  tax_lines: any[];
  shipping_lines: any[];
  fee_lines: any[];
  coupon_lines: any[];
  refunds: any[];
}

export interface LineItem {
  product_id: number;
  quantity: number;
}

// API Functions

/**
 * Test WooCommerce API connection
 */
export async function testApiConnection(): Promise<{ success: boolean, message: string, data?: any }> {
  try {
    console.log('🔍 Testing WooCommerce API connection...')
    console.log(`📍 Store URL: ${STORE_URL}`)
    console.log(`🔑 Consumer Key: ${CONSUMER_KEY.substring(0, 10)}...`)
    
    const response = await wooCommerceApi.get('/products', {
      params: { per_page: 1 }
    })
    
    const message = `✅ WooCommerce API connection successful! (Status: ${response.status})`
    console.log(message)
    return { success: true, message }
  } catch (error: any) {
    let message = '❌ WooCommerce API connection failed!';
    let data = null;

    if (error.code === 'ECONNABORTED') {
      message += ' Request timeout - API is taking too long to respond.'
    } else if (error.code === 'ENOTFOUND' || error.code === 'ERR_NETWORK') {
      message += ` Network error - Cannot reach the store at ${STORE_URL}.`
    } else if (error.response) {
      message += ` HTTP Error: ${error.response.status} ${error.response.statusText}.`
      data = error.response.data;
      if (error.response.status === 401) {
        message += ' Authentication failed - Check your consumer key and secret.'
      } else if (error.response.status === 404) {
        message += ' API endpoint not found - Check if WooCommerce REST API is enabled.'
      }
    } else {
      message += ` Unknown error: ${error.message}.`
    }
    
    console.error(message, data ? { data } : '');
    return { success: false, message, data }
  }
}

/**
 * Get products with optional filtering
 */
export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  try {
    console.log('🛍️ Fetching products with params:', params)
    
    // Handle category filtering by slug
    let categoryId: number | undefined
    if (params.category) {
      try {
        const categories = await getCategories()
        const category = categories.find(cat => cat.slug === params.category)
        if (category) {
          categoryId = category.id
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch categories for filtering, skipping category filter')
      }
    }

    const queryParams: any = {
      page: params.page || 1,
      per_page: params.per_page || 12,
      status: params.status || 'publish',
      orderby: params.orderby || 'date',
      order: params.order || 'desc',
    }

    // Add optional parameters
    if (params.search) queryParams.search = params.search
    if (categoryId) queryParams.category = categoryId
    if (params.include) queryParams.include = params.include.join(',')
    if (params.exclude) queryParams.exclude = params.exclude.join(',')
    if (params.type) queryParams.type = params.type
    if (params.sku) queryParams.sku = params.sku
    if (params.featured) queryParams.featured = params.featured
    if (params.on_sale) queryParams.on_sale = params.on_sale
    if (params.min_price) queryParams.min_price = params.min_price
    if (params.max_price) queryParams.max_price = params.max_price

    const response = await wooCommerceApi.get('/products', { params: queryParams })
    
    console.log(`✅ Successfully fetched ${response.data.length} products`)
    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching products:', error.message)
    
    if (error.response?.status === 400) {
      console.error('⚠️ Bad request - Check your parameters')
    }
    
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
}

/**
 * Get a single product by slug
 */
export async function getProduct(slug: string): Promise<Product | null> {
  try {
    console.log(`🔍 Fetching product with slug: ${slug}`)
    
    const response = await wooCommerceApi.get('/products', {
      params: { slug, per_page: 1 }
    })

    if (response.data.length === 0) {
      console.log(`📭 No product found with slug: ${slug}`)
      return null
    }

    console.log(`✅ Successfully fetched product: ${response.data[0].name}`)
    return response.data[0]
  } catch (error: any) {
    console.error(`❌ Error fetching product ${slug}:`, error.message)
    throw new Error(`Failed to fetch product: ${error.message}`)
  }
}

/**
 * Get product categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    console.log('📂 Fetching product categories...')
    
    const response = await wooCommerceApi.get('/products/categories', {
      params: {
        per_page: 100,
        orderby: 'count',
        order: 'desc'
      }
    })

    console.log(`✅ Successfully fetched ${response.data.length} categories`)
    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching categories:', error.message)
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
}

/**
 * Get a single category by slug
 */
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    console.log(`🔍 Fetching category with slug: ${slug}`)
    
    const response = await wooCommerceApi.get('/products/categories', {
      params: { slug, per_page: 1 }
    })

    if (response.data.length === 0) {
      console.log(`📭 No category found with slug: ${slug}`)
      return null
    }

    console.log(`✅ Successfully fetched category: ${response.data[0].name}`)
    return response.data[0]
  } catch (error: any) {
    console.error(`❌ Error fetching category ${slug}:`, error.message)
    throw new Error(`Failed to fetch category: ${error.message}`)
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string, params: Omit<GetProductsParams, 'search'> = {}): Promise<Product[]> {
  return getProducts({ ...params, search: query })
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  return getProducts({ featured: true, per_page: limit })
}

/**
 * Get products on sale
 */
export async function getSaleProducts(limit: number = 12): Promise<Product[]> {
  return getProducts({ on_sale: true, per_page: limit })
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categorySlug: string, params: Omit<GetProductsParams, 'category'> = {}): Promise<Product[]> {
  return getProducts({ ...params, category: categorySlug })
}

/**
 * Get related products
 */
export async function getRelatedProducts(productId: number, limit: number = 4): Promise<Product[]> {
  try {
    const product = await wooCommerceApi.get(`/products/${productId}`)
    const relatedIds = product.data.related_ids.slice(0, limit)
    
    if (relatedIds.length === 0) {
      return []
    }
    
    return getProducts({ include: relatedIds, per_page: limit })
  } catch (error: any) {
    console.error('❌ Error fetching related products:', error.message)
    return []
  }
}

/**
 * Create an order
 */
export async function createOrder(orderData: any): Promise<Order> {
  try {
    console.log('📦 Creating order with data:', orderData)
    const response = await wooCommerceApi.post<Order>('/orders', orderData)
    console.log(`✅ Successfully created order: ${response.data.id}`)
    return response.data
  } catch (error: any) {
    console.error('❌ Error creating order:', error.message)
    if (error.response) {
      console.error('📄 Response data:', error.response.data)
    }
    throw new Error(`Failed to create order: ${error.message}`)
  }
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: number): Promise<Order | null> {
  try {
    console.log(`🔍 Fetching order with ID: ${orderId}`)
    const response = await wooCommerceApi.get<Order>(`/orders/${orderId}`)
    console.log(`✅ Successfully fetched order: ${response.data.id}`)
    return response.data
  } catch (error: any) {
    console.error(`❌ Error fetching order ${orderId}:`, error.message)
    if (error.response?.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch order: ${error.message}`)
  }
}

// Export configuration for debugging
export const config = {
  storeUrl: STORE_URL,
  apiBaseUrl: API_BASE_URL,
  hasCredentials: !!(CONSUMER_KEY && CONSUMER_SECRET),
}

// Export default for convenience
export default {
  testApiConnection,
  getProducts,
  getProduct,
  getCategories,
  getCategory,
  searchProducts,
  getFeaturedProducts,
  getSaleProducts,
  getProductsByCategory,
  getRelatedProducts,
  createOrder,
  getOrder,
  config,
}