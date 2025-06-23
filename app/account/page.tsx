"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ProfileForm {
  first_name: string
  last_name: string
  email: string
  billing_address: string
  shipping_address: string
}

export default function AccountPage() {
  const router = useRouter()
  const [form, setForm] = useState<ProfileForm>({
    first_name: "",
    last_name: "",
    email: "",
    billing_address: "",
    shipping_address: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true)
      setHasError(null)
      try {
        const token = localStorage.getItem("jwtToken")
        if (!token) throw new Error("Not authenticated. Please login.")
        const res = await fetch("https://www.sultanafitness.site/wp-json/wc/v3/customers/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile")
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          billing_address: `${data.billing?.address_1 || ""}, ${data.billing?.city || ""}`.trim(),
          shipping_address: `${data.shipping?.address_1 || ""}, ${data.shipping?.city || ""}`.trim(),
        })
      } catch (err: any) {
        setHasError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setHasError(null)
    setIsSuccess(false)
    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) throw new Error("Not authenticated. Please login.")
      const res = await fetch("https://www.sultanafitness.site/wp-json/wc/v3/customers/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          billing: { address_1: form.billing_address },
          shipping: { address_1: form.shipping_address },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to update profile")
      setIsSuccess(true)
    } catch (err: any) {
      setHasError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto max-w-md py-16 text-center">Loading profile...</div>
  }

  if (hasError) {
    return (
      <div className="container mx-auto max-w-md py-16 text-center">
        <div className="text-red-600 mb-4">{hasError}</div>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">My Account</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              required
              value={form.first_name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              required
              value={form.last_name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="billing_address">Billing Address</Label>
          <Input
            id="billing_address"
            name="billing_address"
            type="text"
            value={form.billing_address}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="shipping_address">Shipping Address</Label>
          <Input
            id="shipping_address"
            name="shipping_address"
            type="text"
            value={form.shipping_address}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        {isSuccess && <div className="text-green-600 text-sm">Profile updated successfully!</div>}
        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-700" size="lg" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  )
} 