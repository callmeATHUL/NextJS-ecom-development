import { NextResponse } from "next/server"
import { testApiConnection as testWooCommerceApi } from "@/lib/woocommerce"
import { testStoreApiConnection } from "@/lib/cart-api"

export async function GET() {
  console.log("🩺 Running API health checks...")

  const wooCommerceResult = await testWooCommerceApi()
  const storeApiResult = await testStoreApiConnection()

  const results = {
    woocommerceApi: wooCommerceResult,
    storeApi: storeApiResult,
  }

  const isHealthy = wooCommerceResult.success && storeApiResult

  console.log(`API Health Check Results: ${isHealthy ? "✅ Healthy" : "❌ Unhealthy"}`)

  return NextResponse.json(results, {
    status: isHealthy ? 200 : 503,
  })
}
