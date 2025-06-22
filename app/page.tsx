import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getProducts, testApiConnection } from "@/lib/woocommerce"
import ProductCard from "@/components/product-card"

export default async function HomePage() {
  let featuredProducts: any[] = []
  let apiConnected = false

  try {
    // Test API connection first
    apiConnected = await testApiConnection()

    if (apiConnected) {
      featuredProducts = await getProducts({ per_page: 8 })
    }
  } catch (error) {
    console.error("Failed to fetch products:", error)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Transform Your Fitness Journey</h1>
              <p className="text-xl mb-8 text-red-100">
                Discover premium fitness equipment and accessories to achieve your health goals. From cardio machines to
                strength training gear, we have everything you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                  <Link href="/shop">Shop Now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-red-600"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/pexels-willpicturethis-1954524.jpg?height=500&width=600"
                alt="Fitness Equipment"
                width={600}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Cardio Equipment",
                image: "/pexels-willpicturethis-1954524.jpg?height=200&width=200",
                href: "/shop?category=cardio-equipment",
              },
              {
                name: "Weight Training",
                image: "/pexels-willpicturethis-1954524.jpg?height=200&width=200",
                href: "/shop?category=weight-training",
              },
              {
                name: "Strength Building",
                image: "/pexels-willpicturethis-1954524.jpg?height=200&width=200",
                href: "/shop?category=strength-building",
              },
              {
                name: "Sports & Fun",
                image: "/pexels-willpicturethis-1954524.jpg?height=200&width=200",
                href: "/shop?category=sports-indoor-fun",
              },
            ].map((category) => (
              <Link key={category.name} href={category.href} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <Image
                      src={category.image || "/pexels-willpicturethis-1954524.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg group-hover:text-red-600">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button asChild variant="outline">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>

          {!apiConnected && (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-yellow-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-yellow-800">API Connection Issue</h3>
                <p className="text-yellow-700 mb-4">
                  Unable to connect to the WooCommerce API. Please check your API credentials and try again.
                </p>
                <Button asChild variant="outline">
                  <Link href="/shop">Browse Products</Link>
                </Button>
              </div>
            </div>
          )}

          {apiConnected && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {apiConnected && featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-4">No products are currently available. Please check back later.</p>
                <Button asChild>
                  <Link href="/shop">Browse All Products</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Sultana Fitness?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                We source only the highest quality fitness equipment from trusted brands worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery across Saudi Arabia with professional installation service.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Our fitness experts are here to help you choose the right equipment for your goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
