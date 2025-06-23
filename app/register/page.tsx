"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface RegisterForm {
  first_name: string
  last_name: string
  email: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<RegisterForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setHasError(null)
    setIsSuccess(false)
    try {
      const res = await fetch("https://www.sultanafitness.site/wp-json/wc/v3/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          username: form.email,
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.code) {
        throw new Error(data.message || "Registration failed")
      }
      setIsSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch (err: any) {
      setHasError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Register</h1>
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
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        {hasError && <div className="text-red-600 text-sm">{hasError}</div>}
        {isSuccess && <div className="text-green-600 text-sm">Registration successful! Redirecting to login...</div>}
        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-700" size="lg" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
        <div className="text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-yellow-600 hover:underline">Login</a>
        </div>
      </form>
    </div>
  )
} 