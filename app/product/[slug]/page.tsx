import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, Heart, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProduct, type Product } from "@/lib/woocommerce"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const isOnSale = product.sale_price && product.sale_price !== product.regular_price
  const displayPrice = isOnSale ? product.sale_price : product.price

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            {product.images.length > 0 ? (
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={image.id} className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src={image.src}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover cursor-pointer hover:opacity-75 transition-opacity"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(24 reviews)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-yellow-500">SAR {displayPrice}</span>
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

          {/* Add to Cart */}
          <Suspense fallback={<div>Loading cart...</div>}>
            <AddToCartButton product={product} />
          </Suspense>

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
      <Tabs defaultValue="description" className="w-full mt-12">
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
          <div className="text-center py-8">
            <p className="text-gray-500">Reviews functionality coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
