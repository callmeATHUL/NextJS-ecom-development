"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import type { Product } from "@/lib/woocommerce"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async () => {
    if (product.stock_status === "outofstock") return

    setIsLoading(true)
    try {
      await addItem(product.id, quantity)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
          disabled={product.stock_status === "outofstock" || isLoading}
          className="flex-1 bg-yellow-500 hover:bg-yellow-700"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
        <Button variant="outline" size="lg">
          <Heart className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="lg">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
} 