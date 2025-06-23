"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/woocommerce"
import { useCartStore } from "@/lib/cart-store"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, connected, error } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!connected) {
      setAddError("Cart service is currently unavailable")
      return
    }

    setIsAdding(true)
    setAddError(null)

    try {
      await addItem(product.id, 1)
    } catch (error: any) {
      console.error("Failed to add to cart:", error)
      setAddError(error.message || "Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  const isOnSale =
    product.sale_price && Number.parseFloat(product.sale_price) < Number.parseFloat(product.regular_price)
  const displayPrice = product.sale_price || product.price

  return (
    <div className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <Image
            src={product.images[0]?.src || "/placeholder.jpg?height=400&width=400"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isOnSale && <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">Sale</Badge>}
          {product.stock_status === "outofstock" && (
            <Badge className="absolute top-2 right-2 bg-gray-600 text-white">Out of Stock</Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-yellow-500">{product.name}</h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">SAR {displayPrice}</span>
            {isOnSale && <span className="text-sm text-gray-500 line-through">SAR {product.regular_price}</span>}
          </div>
        </div>

        {addError && (
          <div className="mb-2 text-xs text-yellow-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {addError}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock_status === "outofstock" || isAdding || !connected}
            className="flex-1 bg-yellow-500 hover:bg-yellow-700 text-white disabled:bg-gray-400"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : !connected ? "Cart Unavailable" : "Add to Cart"}
          </Button>
          <Button variant="outline" size="sm" className="p-2">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
