"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useCartStore } from "@/lib/cart-store"
import { createOrder } from "@/lib/woocommerce"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const [formData, setFormData] = useState({
    billing: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      country: "SA",
    },
    shipping: {
      first_name: "",
      last_name: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      country: "SA",
    },
    payment_method: "cod",
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal > 200 ? 0 : 25
  const total = subtotal + shipping

  const handleInputChange = (section: "billing" | "shipping", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        ...formData,
        shipping: sameAsShipping
          ? {
              first_name: formData.billing.first_name,
              last_name: formData.billing.last_name,
              address_1: formData.billing.address_1,
              address_2: formData.billing.address_2,
              city: formData.billing.city,
              state: formData.billing.state,
              postcode: formData.billing.postcode,
              country: formData.billing.country,
            }
          : formData.shipping,
        line_items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        payment_method_title: formData.payment_method === "cod" ? "Cash on Delivery" : "Bank Transfer",
      }

      const order = await createOrder(orderData)

      if (order.id) {
        clearCart()
        router.push(`/order-confirmation/${order.id}`)
      }
    } catch (error) {
      console.error("Order creation failed:", error)
      alert("Failed to create order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button asChild>
          <a href="/shop">Continue Shopping</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing & Shipping */}
          <div className="space-y-8">
            {/* Billing Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billing_first_name">First Name *</Label>
                  <Input
                    id="billing_first_name"
                    required
                    value={formData.billing.first_name}
                    onChange={(e) => handleInputChange("billing", "first_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="billing_last_name">Last Name *</Label>
                  <Input
                    id="billing_last_name"
                    required
                    value={formData.billing.last_name}
                    onChange={(e) => handleInputChange("billing", "last_name", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="billing_email">Email Address *</Label>
                  <Input
                    id="billing_email"
                    type="email"
                    required
                    value={formData.billing.email}
                    onChange={(e) => handleInputChange("billing", "email", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="billing_phone">Phone Number *</Label>
                  <Input
                    id="billing_phone"
                    type="tel"
                    required
                    value={formData.billing.phone}
                    onChange={(e) => handleInputChange("billing", "phone", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="billing_address_1">Street Address *</Label>
                  <Input
                    id="billing_address_1"
                    required
                    value={formData.billing.address_1}
                    onChange={(e) => handleInputChange("billing", "address_1", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="billing_address_2">Apartment, suite, etc. (optional)</Label>
                  <Input
                    id="billing_address_2"
                    value={formData.billing.address_2}
                    onChange={(e) => handleInputChange("billing", "address_2", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="billing_city">City *</Label>
                  <Input
                    id="billing_city"
                    required
                    value={formData.billing.city}
                    onChange={(e) => handleInputChange("billing", "city", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="billing_postcode">Postal Code *</Label>
                  <Input
                    id="billing_postcode"
                    required
                    value={formData.billing.postcode}
                    onChange={(e) => handleInputChange("billing", "postcode", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="same-as-billing" checked={sameAsShipping} onCheckedChange={setSameAsShipping} />
                <Label htmlFor="same-as-billing">Ship to the same address</Label>
              </div>

              {!sameAsShipping && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shipping_first_name">First Name *</Label>
                      <Input
                        id="shipping_first_name"
                        required
                        value={formData.shipping.first_name}
                        onChange={(e) => handleInputChange("shipping", "first_name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_last_name">Last Name *</Label>
                      <Input
                        id="shipping_last_name"
                        required
                        value={formData.shipping.last_name}
                        onChange={(e) => handleInputChange("shipping", "last_name", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="shipping_address_1">Street Address *</Label>
                      <Input
                        id="shipping_address_1"
                        required
                        value={formData.shipping.address_1}
                        onChange={(e) => handleInputChange("shipping", "address_1", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="shipping_address_2">Apartment, suite, etc. (optional)</Label>
                      <Input
                        id="shipping_address_2"
                        value={formData.shipping.address_2}
                        onChange={(e) => handleInputChange("shipping", "address_2", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_city">City *</Label>
                      <Input
                        id="shipping_city"
                        required
                        value={formData.shipping.city}
                        onChange={(e) => handleInputChange("shipping", "city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_postcode">Postal Code *</Label>
                      <Input
                        id="shipping_postcode"
                        required
                        value={formData.shipping.postcode}
                        onChange={(e) => handleInputChange("shipping", "postcode", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <RadioGroup
                value={formData.payment_method}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, payment_method: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bacs" id="bacs" />
                  <Label htmlFor="bacs">Bank Transfer</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">SAR {(Number.parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>SAR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `SAR ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>SAR {total.toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700" size="lg">
                {loading ? "Processing..." : "Place Order"}
              </Button>

              <p className="text-sm text-gray-600 text-center mt-4">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
