import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Service features */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-yellow-600 p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Delivery</h3>
                <p className="text-sm text-gray-600">On orders above SAR 200</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="bg-yellow-600 p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Installation</h3>
                <p className="text-sm text-gray-600">Professional setup included</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="bg-yellow-600 p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">After Sales Service</h3>
                <p className="text-sm text-gray-600">Dedicated customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company info */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-300 hover:text-white">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-300 hover:text-white">
                    Return Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Top Brands */}
            <div>
              <h3 className="font-bold text-lg mb-4">Top Brands</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/shop?brand=nike" className="text-gray-300 hover:text-white">
                    Nike
                  </Link>
                </li>
                <li>
                  <Link href="/shop?brand=adidas" className="text-gray-300 hover:text-white">
                    Adidas
                  </Link>
                </li>
                <li>
                  <Link href="/shop?brand=reebok" className="text-gray-300 hover:text-white">
                    Reebok
                  </Link>
                </li>
                <li>
                  <Link href="/shop?brand=puma" className="text-gray-300 hover:text-white">
                    Puma
                  </Link>
                </li>
                <li>
                  <Link href="/shop?brand=under-armour" className="text-gray-300 hover:text-white">
                    Under Armour
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/shop?category=cardio" className="text-gray-300 hover:text-white">
                    Cardio Equipment
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=strength" className="text-gray-300 hover:text-white">
                    Strength Training
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=accessories" className="text-gray-300 hover:text-white">
                    Fitness Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=supplements" className="text-gray-300 hover:text-white">
                    Supplements
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=apparel" className="text-gray-300 hover:text-white">
                    Fitness Apparel
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-300">
                <p>Riyadh, Saudi Arabia</p>
                <p>Phone: +966 XXX XXX XXX</p>
                <p>Email: info@activefitnessstore.com</p>
                <p>Working Hours: 9AM - 10PM</p>
              </div>

              {/* Social media */}
              <div className="flex space-x-4 mt-6">
                <Link href="#" className="text-gray-300 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white">
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Active Fitness Store. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img src="/placehold.jpg?height=30&width=50" alt="Visa" className="h-6" />
              <img src="/placehold.jpg?height=30&width=50" alt="Mastercard" className="h-6" />
              <img src="/placehold.jpg?height=30&width=50" alt="PayPal" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
