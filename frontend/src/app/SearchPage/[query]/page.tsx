'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  SlidersHorizontal, 
  X, 
  ExternalLink, 
  Search,
  Tag,
  Globe,
  Monitor,
  DollarSign,
  ChevronUp
} from "lucide-react"
import { useParams } from 'next/navigation'
import { getSearchProducts } from '@/api'
import Image from 'next/image'
import { Poppins } from 'next/font/google'

interface Product{
  id : number
  product_name : string
  product_link : string
  product_platform : string
  product_image : string
  product_price : number
  product_description : string
  product_country : string
  product_category : string
}

const poppins = Poppins({
  subsets: ['latin'],
  weight:"400",
})

export default function SearchPage(){

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading , setLoading] = useState(true);
  const [error ,setError] = useState<string | null>(null);
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null)

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")

  const params = useParams();
  const searchQuery = params.query as string;

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  const uniqueCategories = useMemo(() => 
    Array.from(new Set(allProducts.map(product => product.product_category))),
    [allProducts]
  )

  const uniquePlatforms = useMemo(() => 
    Array.from(new Set(allProducts.map(product => product.product_platform))),
    [allProducts]
  )

  const uniqueCountries = useMemo(() => 
    Array.from(new Set(allProducts.map(product => product.product_country))),
    [allProducts]
  )

  const loadProducts = async () => {
    try {
      setLoading(true)
      const results = await getSearchProducts(decodeURIComponent(searchQuery), null, {})
      setAllProducts(results)
      setFilteredProducts(results)
    } catch (err) {
      setError('Failed to fetch search results')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchQuery) {
      loadProducts()
    }
  }, [searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    )
  }

  const handleProductClick = (link: string) => {
    window.open(link, '_blank')
  }

  const applyFilters = () => {
    const filtered = allProducts.filter(product => {
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.product_category)
      const matchesPlatform = selectedPlatforms.length === 0 || 
        selectedPlatforms.includes(product.product_platform)
      const matchesCountry = selectedCountries.length === 0 || 
        selectedCountries.includes(product.product_country)
      const matchesPrice = (!minPrice || product.product_price >= parseFloat(minPrice)) &&
        (!maxPrice || product.product_price <= parseFloat(maxPrice))

      return matchesCategory && matchesPlatform && matchesCountry && matchesPrice
    })
    
    setFilteredProducts(filtered)
    setIsFilterOpen(false)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedPlatforms([])
    setSelectedCountries([])
    setMinPrice("")
    setMaxPrice("")
    setFilteredProducts(allProducts)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div 
      className={`min-h-screen w-full py-10 ${poppins.className}`}
      style={{
        background: 'radial-gradient(circle at center, #027cc4 0%, #ffffff 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Header */}
        <header className="flex flex-row justify-between items-center mb-6 gap-4">
          <div className="flex-1">
            <p className="text-lg sm:text-base text-[#0355bb] font-bold">
              {decodeURIComponent(searchQuery)}
            </p>
          </div>
          <Button 
            onClick={() => setIsFilterOpen(true)}
            className="w-auto bg-[#0355bb] hover:bg-[#027cc4] text-white shadow-md flex items-center"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </header>

        {/* Product Grid */}
        <div className="grid gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden border-[#0355bb]/10 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:h-64">
                <div
                  className="w-full sm:w-64 h-48 sm:h-full relative cursor-pointer overflow-hidden"
                  onClick={() => handleProductClick(product.product_link)}
                  onMouseEnter={() => setHoveredImageId(product.id)}
                  onMouseLeave={() => setHoveredImageId(null)}
                >
                  <Image
                    src={product.product_image}
                    alt={product.product_name}
                    fill
                    className={`object-cover transition-transform duration-300 ${
                      hoveredImageId === product.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>

                <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h2 
                        className="text-lg sm:text-xl font-semibold text-[#0355bb] line-clamp-2"
                        title={product.product_name}
                      >
                        {product.product_name}
                      </h2>
                      <Badge variant="secondary" className="bg-[#0355bb]/10 text-[#0355bb] text-xs whitespace-nowrap">
                        {product.product_platform}
                      </Badge>
                    </div>

                    <p className="text-xl sm:text-2xl font-bold text-[#0355bb]">
                      ${product.product_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>

                    <p className="text-sm sm:text-base text-[#0355bb]/70 line-clamp-2">
                      {product.product_description}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-[#0355bb]/70">
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-4 w-4" />
                        {product.product_country}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-4 w-4" />
                        {product.product_category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      className="w-full sm:w-auto bg-[#0355bb] hover:bg-[#027cc4] text-white px-6 py-2 rounded shadow-sm hover:shadow transition-all duration-200"
                      onClick={() => handleProductClick(product.product_link)}
                    >
                      Buy Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[#0355bb]/70">No products found matching your criteria.</p>
              <Button
                variant="link"
                onClick={clearFilters}
                className="text-[#0355bb] hover:text-[#027cc4] mt-2"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Floating Filter Button */}
        <Button
          variant="default"
          size="icon"
          className={`fixed bottom-4 right-4 h-12 w-12 rounded-full bg-[#0355bb] hover:bg-[#027cc4] text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
            showFloatingButton 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-16 opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsFilterOpen(true)}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>

        {/* Filter Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-lg transform transition-transform z-[100000] duration-300 ease-in-out ${
            isFilterOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-[#0355bb]">Filters</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsFilterOpen(false)}
                className="text-[#0355bb] hover:text-[#027cc4] hover:bg-[#0355bb]/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Categories */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#0355bb]">
                    <Tag className="h-4 w-4" />
                    <h3 className="font-semibold">Categories</h3>
                  </div>
                  <div className="space-y-1.5">
                    {uniqueCategories.map((category) => (
                      <div key={category} className="flex items-center">
                        <Checkbox 
                          id={`category-${category}`} 
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                          className="border-[#0355bb] text-[#0355bb]"
                        />
                        <Label 
                          htmlFor={`category-${category}`} 
                          className="ml-2 text-sm text-[#0355bb]/80 cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#0355bb]">
                    <Monitor className="h-4 w-4" />
                    <h3 className="font-semibold">Platforms</h3>
                  </div>
                  <div className="space-y-1.5">
                    {uniquePlatforms.map((platform) => (
                      <div key={platform} className="flex items-center">
                        <Checkbox
                          id={`platform-${platform}`} 
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={() => handlePlatformChange(platform)}
                          className="border-[#0355bb] text-[#0355bb]"
                        />
                        <Label 
                          htmlFor={`platform-${platform}`} 
                          className="ml-2 text-sm text-[#0355bb]/80 cursor-pointer"
                        >
                          {platform}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Countries */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#0355bb]">
                    <Globe className="h-4 w-4" />
                    <h3 className="font-semibold">Countries</h3>
                  </div>
                  <div className="space-y-1.5">
                    {uniqueCountries.map((country) => (
                      <div key={country} className="flex items-center">
                        <Checkbox
                          id={`country-${country}`} 
                          checked={selectedCountries.includes(country)}
                          onCheckedChange={() => handleCountryChange(country)}
                          className="border-[#0355bb] text-[#0355bb]"
                        />
                        <Label 
                          htmlFor={`country-${country}`} 
                          className="ml-2 text-sm text-[#0355bb]/80 cursor-pointer"
                        >
                          {country}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#0355bb]">
                    <DollarSign className="h-4 w-4" />
                    <h3 className="font-semibold">Price Range</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label 
                        htmlFor="minPrice" 
                        className="text-xs text-[#0355bb]/70"
                      >
                        Min Price
                      </Label>
                      <Input
                        id="minPrice"
                        type="number"
                        placeholder=""
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="h-9 border-[#0355bb]/20 focus:border-[#0355bb] focus:ring-[#0355bb]"
                      />
                    </div>
                    <div>
                      <Label 
                        htmlFor="maxPrice" 
                        className="text-xs text-[#0355bb]/70"
                      >
                        Max Price
                      </Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        placeholder=""
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="h-9 border-[#0355bb]/20 focus:border-[#0355bb] focus:ring-[#0355bb]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Filter Actions */}
            <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-[#0355bb] text-[#0355bb] hover:bg-[#0355bb]/10"
                >
                  Clear All
                </Button>
                <Button
                  onClick={applyFilters}
                  className="bg-[#0355bb] hover:bg-[#027cc4] text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to top button */}
        <Button
          variant="default"
          size="icon"
          className={`fixed bottom-4 left-4 h-12 w-12 rounded-full bg-[#0355bb] hover:bg-[#027cc4] text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
            showFloatingButton 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-16 opacity-0 pointer-events-none'
          }`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}