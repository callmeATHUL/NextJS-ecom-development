"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, Heart, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProduct, type Product } from "@/lib/woocommerce"
import { useCartStore } from "@/lib/cart-store"

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProduct(params.slug as string)
        setProduct(productData)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.src || "/placehold.jpg",
      slug: product.slug,
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button asChild>
          <a href="/shop">Back to Shop</a>
        </Button>
      </div>
    )
  }

  const isOnSale =
    product.sale_price && Number.parseFloat(product.sale_price) < Number.parseFloat(product.regular_price)
  const displayPrice = product.sale_price || product.price

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[selectedImage]?.src || "/placehold.jpg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {isOnSale && <Badge className="absolute top-4 left-4 bg-yellow-600 text-white">Sale</Badge>}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? "border-yellow-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image.src || "/placehold.jpg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(24 reviews)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-yellow-600">SAR {displayPrice}</span>
            {isOnSale && <span className="text-xl text-gray-500 line-through">SAR {product.regular_price}</span>}
          </div>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <span className="font-medium">Availability:</span>
            <Badge variant={product.stock_status === "instock" ? "default" : "destructive"}>
              {product.stock_status === "instock" ? "In Stock" : "Out of Stock"}
            </Badge>
            {product.stock_quantity && (
              <span className="text-sm text-gray-600">({product.stock_quantity} items available)</span>
            )}
          </div>

          {/* SKU */}
          {product.sku && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">SKU:</span>
              <span className="text-gray-600">{product.sku}</span>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stock_quantity ? quantity >= product.stock_quantity : false}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock_status === "outofstock"}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          {product.categories.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">Categories:</span>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    <a href={`/shop?category=${category.slug}`}>{category.name}</a>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <div className="space-y-4">
            {product.attributes.map((attribute) => (
              <div key={attribute.id} className="flex justify-between py-2 border-b">
                <span className="font-medium">{attribute.name}:</span>
                <span>{attribute.options.join(", ")}</span>
              </div>
            ))}
            {product.sku && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">SKU:</span>
                <span>{product.sku}</span>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              <Button className="mt-4">Write a Review</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
