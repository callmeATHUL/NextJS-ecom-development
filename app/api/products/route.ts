import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/woocommerce"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const per_page = Number.parseInt(searchParams.get("per_page") || "12")
    const category = searchParams.get("category") || undefined
    const search = searchParams.get("search") || undefined

    const products = await getProducts({
      page,
      per_page,
      category,
      search,
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
