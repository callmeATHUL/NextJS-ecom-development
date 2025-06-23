"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Order {
  id: number
  number: string
  date_created: string
  status: string
  total: string
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true)
      setHasError(null)
      try {
        const token = localStorage.getItem("jwtToken")
        if (!token) throw new Error("Not authenticated. Please login.")
        const res = await fetch("https://www.sultanafitness.site/wp-json/wc/v3/orders?customer=me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to fetch orders")
        setOrders(data)
      } catch (err: any) {
        setHasError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (isLoading) {
    return <div className="container mx-auto max-w-2xl py-16 text-center">Loading orders...</div>
  }

  if (hasError) {
    return (
      <div className="container mx-auto max-w-2xl py-16 text-center">
        <div className="text-red-600 mb-4">{hasError}</div>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">No orders found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 border">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Order #</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Total</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-2 font-semibold">{order.number}</td>
                  <td className="py-2">{new Date(order.date_created).toLocaleDateString()}</td>
                  <td className="py-2 capitalize">{order.status}</td>
                  <td className="py-2">SAR {order.total}</td>
                  <td className="py-2">
                    <Link href={`/order-confirmation/${order.id}`} className="text-yellow-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 