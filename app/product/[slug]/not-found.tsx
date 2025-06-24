import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, ArrowLeft } from "lucide-react"

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <Package className="h-24 w-24 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, the product you're looking for doesn't exist or has been removed.
        </p>
        <div className="space-y-4">
          <Button asChild size="lg">
            <Link href="/shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
          <div>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 