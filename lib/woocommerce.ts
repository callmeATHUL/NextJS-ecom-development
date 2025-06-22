import axios from "axios"

// WooCommerce API configuration using your existing cyellowentials
const WOO_API_BASE = "https://sultanafitness.store/wp-json/wc/v3"
const CONSUMER_KEY = "Ck_32a816668fd43781081e65a7e6af5492ecdef07b"
const CONSUMER_SECRET = "Cs_f3de9e7afb5393afe8691eba7e8a662f1c011e2c"

const wooApi = axios.create({
  baseURL: WOO_API_BASE,
  auth: {
    username: CONSUMER_KEY,
    password: CONSUMER_SECRET,
  },
})

export interface Product {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  sale_price: string
  description: string
  short_description: string
  images: Array<{
    id: number
    src: string
    alt: string
  }>
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  stock_status: string
  stock_quantity: number
  sku: string
  attributes: Array<{
    id: number
    name: string
    options: string[]
  }>
}

export interface CartItem {
  id: number
  name: string
  price: string
  quantity: number
  image: string
  slug: string
}

export interface Order {
  billing: {
    first_name: string
    last_name: string
    email: string
    phone: string
    address_1: string
    address_2: string
    city: string
    state: string
    postcode: string
    country: string
  }
  shipping: {
    first_name: string
    last_name: string
    address_1: string
    address_2: string
    city: string
    state: string
    postcode: string
    country: string
  }
  line_items: Array<{
    product_id: number
    quantity: number
  }>
  payment_method: string
  payment_method_title: string
}

// Convert WooCommerce product to our Product interface
function transformWooProduct(wooProduct: any): Product {
  return {
    id: wooProduct.id,
    name: wooProduct.name,
    slug: wooProduct.slug,
    price: wooProduct.price,
    regular_price: wooProduct.regular_price,
    sale_price: wooProduct.sale_price,
    description: wooProduct.description || "",
    short_description: wooProduct.short_description || "",
    images: (wooProduct.images || []).map((img: any) => ({
      id: img.id,
      src: img.src,
      alt: img.alt || wooProduct.name,
    })),
    categories: wooProduct.categories || [],
    stock_status: wooProduct.stock_status || "instock",
    stock_quantity: wooProduct.stock_quantity || 0,
    sku: wooProduct.sku || "",
    attributes: wooProduct.attributes || [],
  }
}

export async function getProducts(
  params: {
    page?: number
    per_page?: number
    category?: string
    search?: string
  } = {},
): Promise<Product[]> {
  try {
    console.log("🔍 Fetching products with params:", params)

    const apiParams: any = {
      per_page: params.per_page || 20,
      page: params.page || 1,
      status: "publish",
    }

    if (params.search) {
      apiParams.search = params.search
    }

    if (params.category) {
      // Get category ID by slug first
      try {
        const categoriesResponse = await wooApi.get("/products/categories", {
          params: { slug: params.category },
        })

        if (categoriesResponse.data && Array.isArray(categoriesResponse.data) && categoriesResponse.data.length > 0) {
          apiParams.category = categoriesResponse.data[0].id
        }
      } catch (categoryError) {
        console.warn("Failed to fetch category, proceeding without category filter:", categoryError)
      }
    }

    const response = await wooApi.get("/products", { params: apiParams })

    // Check if response.data is an array
    if (!response.data || !Array.isArray(response.data)) {
      console.error("❌ API response is not an array:", response.data)
      return []
    }

    const products = response.data.map(transformWooProduct)

    console.log(`✅ Fetched ${products.length} products`)
    return products
  } catch (error: any) {
    console.error("❌ Error fetching products:", error.response?.data || error.message)

    // Log more details about the error
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response headers:", error.response.headers)
      console.error("Response data:", error.response.data)
    }

    return []
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    console.log(`🔍 Fetching product: ${slug}`)

    const response = await wooApi.get("/products", {
      params: { slug },
    })

    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      console.warn(`Product with slug "${slug}" not found`)
      return null
    }

    const product = transformWooProduct(response.data[0])
    console.log(`✅ Fetched product: ${product.name}`)
    return product
  } catch (error: any) {
    console.error(`❌ Error fetching product ${slug}:`, error.response?.data || error.message)
    return null
  }
}

export async function getCategories() {
  try {
    console.log("🔍 Fetching categories")

    const response = await wooApi.get("/products/categories", {
      params: {
        per_page: 100,
        hide_empty: true,
      },
    })

    if (!response.data || !Array.isArray(response.data)) {
      console.error("❌ Categories response is not an array:", response.data)
      return []
    }

    console.log(`✅ Fetched ${response.data.length} categories`)
    return response.data
  } catch (error: any) {
    console.error("❌ Error fetching categories:", error.response?.data || error.message)
    return []
  }
}

export async function createOrder(orderData: Order) {
  try {
    console.log("🔍 Creating order")

    const response = await wooApi.post("/orders", orderData)

    console.log(`✅ Order created: ${response.data.id}`)
    return response.data
  } catch (error: any) {
    console.error("❌ Error creating order:", error.response?.data || error.message)
    throw error
  }
}

// Test API connection
export async function testApiConnection(): Promise<boolean> {
  try {
    console.log("🔍 Testing WooCommerce API connection...")

    const response = await wooApi.get("/products", {
      params: { per_page: 1 },
    })

    console.log("✅ API connection successful")
    console.log("Response status:", response.status)
    console.log("Response data type:", typeof response.data)
    console.log("Is array:", Array.isArray(response.data))

    return true
  } catch (error: any) {
    console.error("❌ API connection failed:", error.response?.data || error.message)
    return false
  }
}
