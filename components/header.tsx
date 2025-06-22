"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  AlertCircle,
  ChevronDown,
  Heart,
  Bell,
  MapPin,
  Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/lib/cart-store"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { getTotalItems, refreshCart, connected, error, testConnection } = useCartStore()
  const totalItems = getTotalItems()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle cart initialization
  useEffect(() => {
    const initializeCart = async () => {
      await testConnection()
      if (connected) {
        await refreshCart()
      }
    }
    initializeCart()
  }, [testConnection, refreshCart, connected])

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const categories = [
    { name: "Cardio Equipment", href: "/shop?category=cardio-equipment", icon: "💪" },
    { name: "Weight Training", href: "/shop?category=weight-training", icon: "🏋️" },
    { name: "Strength Building", href: "/shop?category=strength-building", icon: "💪" },
    { name: "Sports & Fun", href: "/shop?category=sports-indoor-fun", icon: "⚽" },
  ]

  return (
    <>
      {/* Top notification bar */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-sm py-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>+966 123 456 789</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>Riyadh, Saudi Arabia</span>
            </div>
          </div>
          <div className="text-center flex-1">
            <div className="inline-flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-full">
              <span className="animate-pulse text-yellow-400">🔥</span>
              <span className="text-yellow-400 font-medium">ESCAPE THE HEAT - Enjoy 5% Extra Discount</span>
              <span className="animate-pulse text-yellow-400">🔥</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="h-3 w-3 text-yellow-400" />
            <span className="text-xs">Check WhatsApp for Coupon</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`bg-white shadow-sm border-b transition-all duration-300 sticky top-0 z-50 ${
        isScrolled ? 'shadow-lg backdrop-blur-sm bg-white/95' : ''
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-lg transform group-hover:scale-105 transition-transform duration-200">
                  <h1 className="text-xl font-bold">
                    SULTHANA <span className="text-yellow-400">FITNESS</span>
                  </h1>
                </div>
              </div>
            </Link>

            {/* Enhanced Search bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8" ref={searchRef}>
              <div className={`relative w-full transition-all duration-300 ${
                isSearchFocused || isSearchExpanded ? 'transform scale-105' : ''
              }`}>
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Search for fitness equipment, supplements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => {
                        setIsSearchFocused(true)
                        setIsSearchExpanded(true)
                      }}
                      onBlur={() => setIsSearchFocused(false)}
                      className="rounded-r-none pl-12 pr-4 h-12 border-2 border-gray-200 focus:border-yellow-400 transition-colors"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <Button 
                    type="submit" 
                    className="rounded-l-none bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 h-12 px-6 transition-all duration-200 hover:shadow-lg"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                {/* Search suggestions dropdown */}
                {isSearchExpanded && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-xl z-50 mt-1 animate-in slide-in-from-top-2">
                    <div className="p-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Popular Searches</div>
                      <div className="space-y-2">
                        {["Treadmill", "Dumbbells", "Protein Powder", "Yoga Mat"].map((item) => (
                          <button
                            key={item}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => {
                              setSearchQuery(item)
                              setIsSearchExpanded(false)
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2">
              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="hidden md:flex relative group">
                <Heart className="h-5 w-5 transition-colors group-hover:text-red-500" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </Button>

              {/* User Account */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden md:flex"
                  onMouseEnter={() => setActiveDropdown('user')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <User className="h-5 w-5" />
                </Button>
                
                {/* User dropdown */}
                {activeDropdown === 'user' && (
                  <div 
                    className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2 w-48 animate-in slide-in-from-top-2"
                    onMouseEnter={() => setActiveDropdown('user')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="p-2">
                      <Link href="/login" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                        Sign In
                      </Link>
                      <Link href="/register" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                        Create Account
                      </Link>
                      <div className="border-t my-2"></div>
                      <Link href="/orders" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                        My Orders
                      </Link>
                      <Link href="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                        Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative group">
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {totalItems}
                    </span>
                  )}
                  {!connected && (
                    <AlertCircle className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 animate-pulse" />
                  )}
                </Button>
              </Link>

              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="relative">
                  <Menu className={`h-5 w-5 transition-all duration-300 ${isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                  <X className={`h-5 w-5 absolute top-0 left-0 transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
                </div>
              </Button>
            </div>
          </div>

          {/* Cart status indicator */}
          {error && (
            <div className="mt-4">
              <div className="flex items-center justify-center animate-in slide-in-from-top-2">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
                  <AlertCircle className="h-4 w-4 mr-2 animate-pulse" />
                  Cart service temporarily unavailable
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Navigation - Desktop */}
          <nav className="hidden md:flex items-center justify-center space-x-1 mt-6">
            <Link 
              href="/" 
              className="px-4 py-2 text-gray-700 hover:text-yellow-600 font-medium transition-all duration-200 rounded-lg hover:bg-yellow-50"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="px-4 py-2 text-gray-700 hover:text-yellow-600 font-medium transition-all duration-200 rounded-lg hover:bg-yellow-50"
            >
              Shop All
            </Link>
            
            {/* Categories with dropdown */}
            <div className="relative group">
              <button className="flex items-center px-4 py-2 text-gray-700 hover:text-yellow-600 font-medium transition-all duration-200 rounded-lg hover:bg-yellow-50">
                Categories
                <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="flex items-center px-3 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-colors"
                    >
                      <span className="mr-3 text-lg">{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link 
              href="/deals" 
              className="px-4 py-2 text-gray-700 hover:text-yellow-600 font-medium transition-all duration-200 rounded-lg hover:bg-yellow-50"
            >
              Deals
            </Link>
            <Link 
              href="/contact" 
              className="px-4 py-2 text-gray-700 hover:text-yellow-600 font-medium transition-all duration-200 rounded-lg hover:bg-yellow-50"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile search */}
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-r-none pl-10 h-12 border-2 border-gray-200 focus:border-yellow-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Button 
                type="submit" 
                className="rounded-l-none bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 h-12 px-6"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        <div className={`md:hidden bg-white border-t transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="container mx-auto px-4 py-6 space-y-1">
            {[
              { name: "Home", href: "/" },
              { name: "Shop All", href: "/shop" },
              ...categories.map(cat => ({ name: cat.name, href: cat.href })),
              { name: "Deals", href: "/deals" },
              { name: "Contact", href: "/contact" }
            ].map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 font-medium transition-all duration-200 rounded-lg"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="border-t pt-4 mt-4">
              <Link
                href="/login"
                className="flex items-center px-4 py-3 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 font-medium transition-all duration-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="mr-3 h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center px-4 py-3 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 font-medium transition-all duration-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="mr-3 h-4 w-4" />
                Wishlist
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}