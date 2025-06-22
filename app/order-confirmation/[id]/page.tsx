"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Truck, CyellowitCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderConfirmationPage() {
  const params = useParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    // In a real app, you would fetch order details from your API
    // For now, we'll simulate order details
    setOrderDetails({
      id: params.id,
      number: `#${params.id}`,
      status: "processing",
      total: "299.00",
      date: new Date().toLocaleDateString(),
      items: [
        { name: "Fitness Jump Rope", quantity: 1, price: "49.00" },
        { name: "Exercise Ball", quantity: 1, price: "89.00" },
        { name: "Protein Shaker", quantity: 2, price: "80.50" },
      ],
      billing: {
        name: "John Doe",
        email: "john@example.com",
        address: "123 Main St, Riyadh, Saudi Arabia",
      },
      shipping: {
        method: "Standard Delivery",
        estimated: "3-5 business days",
      },
    })
  }, [params.id])

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading order details...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We've received your order and will process it shortly.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order {orderDetails.number}</span>
              <span className="text-sm font-normal text-gray-600">{orderDetails.date}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderDetails.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">SAR {item.price}</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t font-semibold text-lg">
                <span>Total</span>
                <span>SAR {orderDetails.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <CyellowitCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Payment</h3>
              <p className="text-sm text-gray-600">Cash on Delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Processing</h3>
              <p className="text-sm text-gray-600">Order is being prepayellow</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Delivery</h3>
              <p className="text-sm text-gray-600">{orderDetails.shipping.estimated}</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{orderDetails.billing.name}</p>
              <p className="text-gray-600">{orderDetails.billing.email}</p>
              <p className="text-gray-600 mt-2">{orderDetails.billing.address}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{orderDetails.shipping.method}</p>
              <p className="text-gray-600">Estimated delivery: {orderDetails.shipping.estimated}</p>
              <p className="text-gray-600 mt-2">{orderDetails.billing.address}</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            We'll send you a confirmation email with tracking information once your order ships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
