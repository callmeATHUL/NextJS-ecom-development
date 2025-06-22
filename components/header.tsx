"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Menu, X, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/lib/cart-store"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { getTotalItems, refreshCart, connected, error, testConnection } = useCartStore()
  const totalItems = getTotalItems()

  useEffect(() => {
    // Test connection and refresh cart on component mount
    const initializeCart = async () => {
      await testConnection()
      if (connected) {
        await refreshCart()
      }
    }

    initializeCart()
  }, [testConnection, refreshCart, connected])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top bar */}
      <div className="bg-red-600 text-white text-sm py-2">
        <div className="container mx-auto px-4 text-center">
          ESCAPE THE HEAT - Enjoy 5% Extra Discount - Check Whatsapp for Coupon Code
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-red-600 text-white px-3 py-2 rounded font-bold text-xl">SULTANA FITNESS</div>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button type="submit" className="rounded-l-none bg-red-600 hover:bg-red-700">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                {!connected && <AlertCircle className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Cart status indicator */}
        {error && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Cart service temporarily unavailable
            </div>
          </div>
        )}

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 mt-4">
          <Link href="/" className="text-gray-700 hover:text-red-600 font-medium">
            Home
          </Link>
          <Link href="/shop" className="text-gray-700 hover:text-red-600 font-medium">
            Shop
          </Link>
          <Link href="/shop?category=cardio-equipment" className="text-gray-700 hover:text-red-600 font-medium">
            Cardio Equipment
          </Link>
          <Link href="/shop?category=weight-training" className="text-gray-700 hover:text-red-600 font-medium">
            Weight Training
          </Link>
          <Link href="/shop?category=strength-building" className="text-gray-700 hover:text-red-600 font-medium">
            Strength Building
          </Link>
          <Link href="/shop?category=sports-indoor-fun" className="text-gray-700 hover:text-red-600 font-medium">
            Sports & Fun
          </Link>
        </nav>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="flex">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none"
            />
            <Button type="submit" className="rounded-l-none bg-red-600 hover:bg-red-700">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link href="/" className="block text-gray-700 hover:text-red-600 font-medium">
              Home
            </Link>
            <Link href="/shop" className="block text-gray-700 hover:text-red-600 font-medium">
              Shop
            </Link>
            <Link href="/shop?category=cardio-equipment" className="block text-gray-700 hover:text-red-600 font-medium">
              Cardio Equipment
            </Link>
            <Link href="/shop?category=weight-training" className="block text-gray-700 hover:text-red-600 font-medium">
              Weight Training
            </Link>
            <Link
              href="/shop?category=strength-building"
              className="block text-gray-700 hover:text-red-600 font-medium"
            >
              Strength Building
            </Link>
            <Link
              href="/shop?category=sports-indoor-fun"
              className="block text-gray-700 hover:text-red-600 font-medium"
            >
              Sports & Fun
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
