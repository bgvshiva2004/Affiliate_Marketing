'use client'

import { useState, useEffect , useMemo , useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SlidersHorizontal, X } from "lucide-react"
import { useParams } from 'next/navigation'
import { getSearchProducts } from '@/api';
import Image from 'next/image';

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
    <div className="container mx-auto p-4 py-20">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Catalog</h1>
        <Button onClick={() => setIsFilterOpen(true)}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 px-10">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden shadow-[0px_0px_10px_0px] shadow-gray-400">
            <div className="flex flex-col sm:flex-row h-64 sm:h-52">
              <div
               className="sm:w-1/3 h-full cursor-pointer relative overflow-hidden"
               onClick={() => handleProductClick(product.product_link)}
               onMouseEnter={() => setHoveredImageId(product.id)}
               onMouseLeave={() => setHoveredImageId(null)}
               >
                <Image
                  src={product.product_image}
                  alt={product.product_name}
                  width={300}
                  height={300}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    hoveredImageId === product.id ? 'scale-110' : 'scale-100'
                  }`}
                />
              </div>
              <div className="sm:w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1">{product.product_name}</h2>
                  <p className="text-green-600 font-bold mb-1">${product.product_price}</p>
                  <p className="text-xs text-gray-600 mb-1 line-clamp-2">{product.product_description}</p>
                  <p className="text-xs text-gray-600">Country: {product.product_country}</p>
                  <p className="text-xs text-gray-600">Category: {product.product_category}</p>
                  <p className="text-xs text-gray-600">Platform: {product.product_platform}</p>
                </div>
                <div className="mt-2">
                  <Button
                   className="w-full sm:w-auto text-sm py-1"
                   onClick={() => handleProductClick(product.product_link)}
                   >Buy Now</Button>
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
              {uniqueCategories.map((category) => (
                <div key={category} className="flex items-center">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
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
              {uniquePlatforms.map((platform) => (
                <div key={platform} className="flex items-center">
                  <Checkbox
                   id={`platform-${platform}`} 
                   checked={selectedPlatforms.includes(platform)}
                   onCheckedChange={()=> handlePlatformChange(platform)}
                   />
                  <Label htmlFor={`platform-${platform}`} className="ml-2">
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Countries</h3>
            <div className="space-y-2">
              {uniqueCountries.map((country) => (
                <div key={country} className="flex items-center">
                  <Checkbox
                   id={`country-${country}`} 
                   checked={selectedCountries.includes(country)}
                   onCheckedChange={()=> handleCountryChange(country)}
                   />
                  <Label htmlFor={`country-${country}`} className="ml-2">
                    {country}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
            <div>
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        

        <div className="space-y-2 mt-6">
          <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
          <Button className="w-full" variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </div>
      </div>
    </div>
  )
}