'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal, X } from "lucide-react"
import { useParams } from 'next/navigation'
import { getSearchProducts } from '@/api';
import Image from 'next/image';
import { Url } from 'next/dist/shared/lib/router/router'

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

  const [products , setProducts] = useState<Product[]>([]);
  const [loading , setLoading] = useState(true);
  const [error ,setError] = useState<string | null>(null);

  const params = useParams();
  const searchQuery = params.query as string;

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchSearchResults = async () => {
      try{
        setLoading(true);
        const results = await getSearchProducts(decodeURIComponent(searchQuery));
        setProducts(results);

        // console.log("results : ",results)
      }catch(err){
        setError('Failed to fetch search results');
        console.error(err);
      }finally{
        setLoading(false);
      }
    };

    if(searchQuery){
      fetchSearchResults();
    }
  } , [searchQuery]);

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
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden shadow-[0px_0px_10px_0px] shadow-gray-400">
            <div className="flex flex-col sm:flex-row h-64 sm:h-52">
              <div className="sm:w-1/3 h-full">
                <Image
                  src={product.product_image}
                  alt={product.product_name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
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
                   onClick={() => window.open(product.product_link, '_blank')}
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

          <div>
            <h3 className="font-semibold mb-2">Countries</h3>
            <div className="space-y-2">
              {['India', 'USA', 'UK', 'Canada'].map((country) => (
                <div key={country} className="flex items-center">
                  <Checkbox id={`country-${country}`} />
                  <Label htmlFor={`country-${country}`} className="ml-2">
                    {country}
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