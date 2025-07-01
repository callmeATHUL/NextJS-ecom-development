import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sulthana Fitness Store - Premium Fitness Equipment",
  description:
    "Transform your fitness journey with premium equipment and accessories from Sulthana Fitness Store. Shop cardio machines, strength training gear, and fitness accessories.",
  keywords: "fitness equipment, gym equipment, cardio machines, strength training, fitness accessories, Saudi Arabia",
    generator: 'v0.dev',
  icons: {
    icon: '/placeholder-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
