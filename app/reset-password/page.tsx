"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setHasError(null)
    setIsSuccess(false)
    try {
      const res = await fetch("https://www.sultanafitness.site/wp-json/wp/v2/users/lostpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_login: email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to request password reset")
      setIsSuccess(true)
    } catch (err: any) {
      setHasError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Reset Password</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6 border">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>
        {hasError && <div className="text-red-600 text-sm">{hasError}</div>}
        {isSuccess && <div className="text-green-600 text-sm">Password reset email sent! Check your inbox.</div>}
        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-700" size="lg" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
        <div className="text-center text-sm text-gray-600">
          Remembered your password? <a href="/login" className="text-yellow-600 hover:underline">Login</a>
        </div>
      </form>
    </div>
  )
} 