import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getProducts, testApiConnection } from "@/lib/woocommerce"
import ProductCard from "@/components/product-card"
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Truck, 
  Users, 
  Award,
  ChevronRight,
  Play,
  Zap,
  Target,
  Heart,
  TrendingUp
} from "lucide-react"

export default async function HomePage() {
  let FeaturedProducts: any[] = []
  let apiConnected = false

  try {
    // Test API connection first
    apiConnected = (await testApiConnection()).success

    if (apiConnected) {
      FeaturedProducts = await getProducts({ per_page: 8 })
    }
  } catch (error) {
    console.error("Failed to fetch products:", error)
  }

  const stats = [
    { icon: Users, label: "Happy Customers", value: "10,000+" },
    { icon: Award, label: "Products Sold", value: "50,000+" },
    { icon: Star, label: "Average Rating", value: "4.9/5" },
    { icon: Shield, label: "Years Experience", value: "15+" }
  ]

  const categories = [
    {
      name: "Cardio Equipment",
      image: "/pexe4.jpg?height=300&width=300",
      href: "/shop?category=cardio-equipment",
      description: "Treadmills, bikes, ellipticals",
      icon: "🏃‍♂️",
      gradient: "from-red-500 to-pink-500"
    },
    {
      name: "Weight Training",
      image: "/pexe4.jpg?height=300&width=300",
      href: "/shop?category=weight-training",
      description: "Dumbbells, barbells, plates",
      icon: "🏋️‍♂️",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Strength Building",
      image: "/pexe2.jpg?height=300&width=300",
      href: "/shop?category=strength-building",
      description: "Power racks, benches, cables",
      icon: "💪",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Sports & Fun",
      image: "/pexe4.jpg?height=300&width=300",
      href: "/shop?category=sports-indoor-fun",
      description: "Yoga, accessories, games",
      icon: "⚽",
      gradient: "from-purple-500 to-violet-500"
    }
  ]

  const features = [
    {
      icon: Shield,
      title: "Premium Quality",
      description: "We source only the highest quality fitness equipment from trusted brands worldwide.",
      color: "text-blue-500"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery across Saudi Arabia with professional installation service.",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Our fitness experts are here to help you choose the right equipment for your goals.",
      color: "text-purple-500"
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-left-8 duration-1000">
              {/* Floating badge */}
              <div className="inline-flex items-center space-x-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 text-sm">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-300">Transform Your Body Today</span>
                <TrendingUp className="h-4 w-4 text-yellow-400" />
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
                  Fitness
                </span>{" "}
                Journey
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Discover premium fitness equipment and accessories to achieve your health goals. From cardio machines to
                strength training gear, we have everything you need.
              </p>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-6 px-10 rounded-xl text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105"
                >
                  <Link href="/shop" className="flex items-center">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-bold py-6 px-10 rounded-xl text-lg transition-all duration-300 bg-white/5 backdrop-blur-sm hover:shadow-xl"
                >
                  <Link href="/about" className="flex items-center">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="text-center group animate-in slide-in-from-bottom-4 duration-1000"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-yellow-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Hero Image */}
            <div className="relative animate-in slide-in-from-right-8 duration-1000 delay-300">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                
                {/* Main image */}
                <div className="relative">
                  <Image
                    src="/placehold1.jpg?height=600&width=700"
                    alt="Fitness Equipment"
                    width={700}
                    height={600}
                    className="rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-700"
                  />
                  
                  {/* Floating elements */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-bounce">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-gray-800">100k+ Lives Changed</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-gray-800">Achieve Your Goals</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="inline-flex items-center space-x-2 bg-yellow-100 rounded-full px-4 py-2 mb-4">
              <span className="text-sm font-medium text-yellow-800">Explore Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by <span className="text-yellow-500">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect equipment for your fitness journey across our specialized categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="group animate-in slide-in-from-bottom-8 duration-1000"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Link href={category.href}>
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    {/* Category image */}
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={category.image || "/pexels-willpicturethis-1954524.jpg"}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                      
                      {/* Icon overlay */}
                      <div className="absolute top-4 right-4 text-3xl transform group-hover:scale-125 transition-transform duration-300">
                        {category.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-yellow-600 transition-colors mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                      
                      <div className="flex items-center text-yellow-600 font-medium">
                        <span>Explore</span>
                        <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 animate-in slide-in-from-bottom-6 duration-1000">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured <span className="text-yellow-500">Products</span>
              </h2>
              <p className="text-xl text-gray-600">Hand-picked equipment for maximum results</p>
            </div>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="group mt-4 md:mt-0 border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300"
            >
              <Link href="/shop" className="flex items-center">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {!apiConnected && (
            <div className="text-center py-16 animate-in slide-in-from-bottom-8 duration-1000">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-12 max-w-lg mx-auto shadow-lg">
                <div className="text-yellow-500 mb-6">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-800">API Connection Issue</h3>
                <p className="text-yellow-700 mb-6 text-lg">
                  Unable to connect to the WooCommerce API. Please check your API credentials and try again.
                </p>
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl"
                >
                  <Link href="/shop">Browse Products</Link>
                </Button>
              </div>
            </div>
          )}

          {apiConnected && FeaturedProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {FeaturedProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-in slide-in-from-bottom-8 duration-1000"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {apiConnected && FeaturedProducts.length === 0 && (
            <div className="text-center py-16 animate-in slide-in-from-bottom-8 duration-1000">
              <div className="bg-gray-50 rounded-2xl p-12 max-w-lg mx-auto shadow-lg">
                <div className="text-gray-400 mb-6">
                  <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">No Products Found</h3>
                <p className="text-gray-600 mb-6 text-lg">No products are currently available. Please check back later.</p>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold px-8 py-4 rounded-xl"
                >
                  <Link href="/shop">Browse All Products</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-yellow-500">Sultana Fitness</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing you with the best fitness equipment and service experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group text-center animate-in slide-in-from-bottom-8 duration-1000"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 w-20 h-20 mx-auto"></div>
                  
                  {/* Icon container */}
                  <div className="relative bg-gradient-to-br from-white to-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                    <feature.icon className={`w-10 h-10 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-yellow-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
          <div className="absolute top-20 left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Start Your{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Fitness Journey
              </span>?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Join thousands of satisfied customers who have transformed their lives with our premium fitness equipment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                asChild 
                size="lg"
                className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-6 px-12 rounded-xl text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105"
              >
                <Link href="/shop" className="flex items-center">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-bold py-6 px-12 rounded-xl text-lg transition-all duration-300 bg-white/5 backdrop-blur-sm"
              >
                <Link href="/contact">Get Expert Advice</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}