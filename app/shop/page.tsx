import { Suspense } from "react"
import { getProducts, getCategories } from "@/lib/woocommerce"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ShopPageProps {
  searchParams: {
    category?: string
    search?: string
    page?: string
    sort?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const currentPage = Number.parseInt(searchParams.page || "1")
  const perPage = 12

  let products: any[] = []
  let categories: any[] = []

  try {
    const [productsData, categoriesData] = await Promise.allSettled([
      getProducts({
        page: currentPage,
        per_page: perPage,
        category: searchParams.category,
        search: searchParams.search,
      }),
      getCategories(),
    ])

    if (productsData.status === "fulfilled") {
      products = productsData.value
    }

    if (categoriesData.status === "fulfilled") {
      categories = categoriesData.value
    }
  } catch (error) {
    console.error("Failed to fetch shop data:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="font-bold text-lg mb-4">Categories</h2>
            <div className="space-y-2">
              <Button variant={!searchParams.category ? "default" : "ghost"} className="w-full justify-start" asChild>
                <a href="/shop">All Products</a>
              </Button>
              {categories.map((category: any) => (
                <Button
                  key={category.id}
                  variant={searchParams.category === category.slug ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <a href={`/shop?category=${category.slug}`}>
                    {category.name} ({category.count})
                  </a>
                </Button>
              ))}
            </div>

            {/* Price Filter */}
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/shop?price=0-100">Under SAR 100</a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/shop?price=100-500">SAR 100 - 500</a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/shop?price=500-1000">SAR 500 - 1000</a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/shop?price=1000+">Above SAR 1000</a>
                </Button>
              </div>
            </div>

            {/* Brands */}
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Brands</h3>
              <div className="space-y-2">
                {["Nike", "Adidas", "Reebok", "Puma", "Under Armour"].map((brand) => (
                  <Button key={brand} variant="ghost" className="w-full justify-start" asChild>
                    <a href={`/shop?brand=${brand.toLowerCase()}`}>{brand}</a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:w-3/4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {searchParams.category ? "Category Products" : "All Products"}
              </h1>
              <p className="text-gray-600">
                Showing {products.length} products
                {searchParams.search && ` for "${searchParams.search}"`}
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Select defaultValue="default">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default sorting</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <Suspense fallback={<div className="text-center py-8">Loading products...</div>}>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchParams.search || searchParams.category
                    ? "No products found matching your criteria."
                    : "Products will appear here once the WooCommerce API is configuyellow."}
                </p>
                <Button asChild className="mt-4">
                  <a href="/shop">View All Products</a>
                </Button>
              </div>
            )}
          </Suspense>

          {/* Pagination */}
          {products.length === perPage && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                {currentPage > 1 && (
                  <Button variant="outline" asChild>
                    <a
                      href={`/shop?page=${currentPage - 1}${searchParams.category ? `&category=${searchParams.category}` : ""}`}
                    >
                      Previous
                    </a>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <a
                    href={`/shop?page=${currentPage + 1}${searchParams.category ? `&category=${searchParams.category}` : ""}`}
                  >
                    Next
                  </a>
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
