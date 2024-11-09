'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal, X } from "lucide-react"

// Mock product data
const products = [
  { id: 1, name: "Gaming Laptop", price: 1299.99, company: "TechCorp", category: "Electronics", platform: "PC", image: "/placeholder.svg", description: "High-performance gaming laptop with the latest graphics card and processor for immersive gaming experiences." },
  { id: 2, name: "Smartphone", price: 799.99, company: "MobileTech", category: "Electronics", platform: "Mobile", image: "/placeholder.svg", description: "Feature-packed smartphone with a stunning display, powerful camera system, and long-lasting battery life." },
  { id: 3, name: "Fitness Tracker", price: 99.99, company: "FitGear", category: "Wearables", platform: "Mobile", image: "/placeholder.svg", description: "Sleek and comfortable fitness tracker that monitors your activity, sleep, and health metrics 24/7." },
  { id: 4, name: "Wireless Earbuds", price: 149.99, company: "AudioPro", category: "Audio", platform: "Mobile", image: "/placeholder.svg", description: "True wireless earbuds with exceptional sound quality, active noise cancellation, and long battery life." },
  { id: 5, name: "4K Smart TV", price: 899.99, company: "VisualTech", category: "Electronics", platform: "TV", image: "/placeholder.svg", description: "Immersive 4K Smart TV with vibrant colors, HDR support, and built-in streaming apps for endless entertainment." },
  { id: 6, name: "Gaming Console", price: 499.99, company: "GameZone", category: "Gaming", platform: "Console", image: "/placeholder.svg", description: "Next-gen gaming console offering stunning graphics, fast load times, and a vast library of games." },
]

export default function ProductCatalog() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="container mx-auto p-4 py-20">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Catalog</h1>
        <Button onClick={() => setIsFilterOpen(true)}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 px-10">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden shadow-[0px_0px_10px_0px] shadow-gray-400">
            <div className="flex flex-col sm:flex-row h-64 sm:h-52">
              <div className="sm:w-1/3 h-full">
                <Image
                  src="data:image/jpeg;base64,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"
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                  <p className="text-green-600 font-bold mb-1">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-600 mb-1 line-clamp-2">{product.description}</p>
                  <p className="text-xs text-gray-600">Company: {product.company}</p>
                  <p className="text-xs text-gray-600">Category: {product.category}</p>
                  <p className="text-xs text-gray-600">Platform: {product.platform}</p>
                </div>
                <div className="mt-2">
                  <Button className="w-full sm:w-auto text-sm py-1">Add to Cart</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Floating Filter Button */}
      <Button
        variant="default"
        size="icon"
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
          showFloatingButton 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterOpen(true)}
      >
        <SlidersHorizontal className="h-6 w-6" />
        <span className="sr-only">Open filters</span>
      </Button>

      {/* Off-canvas filter section */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-background p-6 shadow-lg transform transition-transform z-[100000] duration-300 ease-in-out ${
          isFilterOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Categories</h3>
            <div className="space-y-2">
              {['Electronics', 'Wearables', 'Audio', 'Gaming'].map((category) => (
                <div key={category} className="flex items-center">
                  <Checkbox id={`category-${category}`} />
                  <Label htmlFor={`category-${category}`} className="ml-2">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Platforms</h3>
            <div className="space-y-2">
              {['PC', 'Mobile', 'TV', 'Console'].map((platform) => (
                <div key={platform} className="flex items-center">
                  <Checkbox id={`platform-${platform}`} />
                  <Label htmlFor={`platform-${platform}`} className="ml-2">
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button className="w-full mt-6">Apply Filters</Button>
      </div>
    </div>
  )
}