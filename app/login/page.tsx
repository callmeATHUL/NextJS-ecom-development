"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface LoginForm {
  username: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setHasError(null)
    try {
      const res = await fetch("https://www.sultanafitness.site/wp-json/jwt-auth/v1/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.token) {
        throw new Error(data.message || "Login failed")
      }
      // Store token (for demo: localStorage, for prod: use httpOnly cookie)
      localStorage.setItem("jwtToken", data.token)
      router.push("/account")
    } catch (err: any) {
      setHasError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6 border">
        <div>
          <Label htmlFor="username">Email or Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={form.username}
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
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        {hasError && <div className="text-red-600 text-sm">{hasError}</div>}
        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-700" size="lg" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <div className="text-center text-sm text-gray-600">
          Don&apos;t have an account? <a href="/register" className="text-yellow-600 hover:underline">Register</a>
        </div>
      </form>
    </div>
  )
} 