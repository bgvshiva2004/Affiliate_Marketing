"use client";

import { useState, useMemo, useEffect } from "react";
import { CategorySection } from "@/components/Products/CatgeorySection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, Tag, Globe, Monitor, DollarSign, X } from 'lucide-react';
import { getAllProducts } from "@/api";
import Footer from "@/components/footer";
import { Poppins } from "next/font/google";
import Cookies from "js-cookie";

const poppins = Poppins({
  subsets: ['latin'],
  weight:"400",
})

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Existing loadProducts function and other handlers remain the same
  const loadProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const token = Cookies.get("access")
      console.log("token : ", token)
      const data = await getAllProducts(token, {
        searchTerm: searchTerm,
        categories: selectedCategories,
        countries: selectedCountries,
        platforms: selectedPlatforms,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
        ...filters,
      });
      setProducts(data);
      console.log("data : ", data)
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const uniqueCountries = useMemo(
    () => [...new Set(products.map((product) => product.product_country))],
    [products]
  );

  const uniquePlatforms = useMemo(
    () => [...new Set(products.map((product) => product.product_platform))],
    [products]
  );

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.product_category)),
    ];
    return uniqueCategories.map((name) => ({
      name,
      products: products
        .filter((p) => p.product_category === name)
        .map((p) => ({
          id: p.id,
          title: p.product_name,
          price: p.product_price,
          imageUrl: p.product_image,
          companyName: p.product_country,
          platform: p.product_platform,
          product_link: p.product_link,
        })),
    }));
  }, [products]);

  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        products: category.products.filter((product) => {
          const matchesSearch =
            !searchTerm ||
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.companyName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            product.platform.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(category.name);
          const matchesCountry =
            selectedCountries.length === 0 ||
            selectedCountries.includes(product.companyName);
          const matchesPlatform =
            selectedPlatforms.length === 0 ||
            selectedPlatforms.includes(product.platform);
          const matchesPrice =
            (minPrice === "" || product.price >= parseFloat(minPrice)) &&
            (maxPrice === "" || product.price <= parseFloat(maxPrice));
          return (
            matchesSearch &&
            matchesCategory &&
            matchesCountry &&
            matchesPlatform &&
            matchesPrice
          );
        }),
      }))
      .filter((category) => category.products.length > 0);
  }, [
    searchTerm,
    selectedCategories,
    selectedCountries,
    selectedPlatforms,
    minPrice,
    maxPrice,
    categories,
  ]);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleCountryChange = (country) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const applyFilters = () => {
    loadProducts();
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCountries([]);
    setSelectedPlatforms([]);
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
    loadProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0355bb]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${poppins.className}`}
      style={{
        background: "radial-gradient(circle at center, #027cc4 0%, #ffffff 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex-1 overflow-hidden">
        <div id="ProductsPage" className="h-full flex flex-col px-4 py-6">
          {/* <div className="flex flex-col mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 h-11 bg-white border-[#0355bb] focus:ring-[#027cc4] focus:border-[#027cc4] rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                />
              </div> */}
              <div className="flex flex-col mb-8 max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0355bb] to-[#027cc4] rounded-xl opacity-20 group-hover:opacity-30 transition-opacity blur-lg"></div>
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="text-[#0355bb] h-5 w-5" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 pl-12 pr-4 py-6 md:py-6 w-full bg-transparent placeholder:text-gray-400 focus:ring-0 text-[#0355bb]"
                  />
                </div>
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    // variant="outline"
                    className="h-12 md:px-6 px-4 bg-[#0355bb] hover:bg-[#027cc4] text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl group flex-shrink-0"
                  >
                    <SlidersHorizontal className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium ml-2 hidden md:inline">Filters</span>
                  </Button>
                </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96 p-0 z-[1000000000]">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-lg font-semibold text-[#0355bb]">Filters</SheetTitle>
                </SheetHeader>
                
                <ScrollArea className="h-[calc(100vh-150px)]">
                  <div className="p-4 space-y-6">
                    {/* Categories */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#0355bb]">
                        <Tag className="h-4 w-4" />
                        <h3 className="font-semibold">Categories</h3>
                      </div>
                      <div className="space-y-1.5">
                        {categories.map((category) => (
                          <div
                            key={category.name}
                            className="flex items-center"
                          >
                            <Checkbox 
                              id={`category-${category.name}`} 
                              checked={selectedCategories.includes(category.name)}
                              onCheckedChange={() => handleCategoryChange(category.name)}
                              className="border-[#0355bb] text-[#0355bb]"
                            />
                            <Label 
                              htmlFor={`category-${category.name}`} 
                              className="ml-2 text-sm text-[#0355bb]/80 cursor-pointer"
                            >
                              {category.name}
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
                          <div
                            key={platform}
                            className="flex items-center"
                          >
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
                          <div
                            key={country}
                            className="flex items-center"
                          >
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
                <div className="p-4 bg-white">
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
              </SheetContent>
            </Sheet>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <div className="h-full rounded-xl border bg-white shadow-lg p-4 transform transition-all duration-300 hover:shadow-xl mx-2">
              <ScrollArea className="h-full">
                <div className="space-y-6">
                  {filteredCategories.map((category, index) => (
                    <CategorySection
                      id={index}
                      key={category.name}
                      name={category.name}
                      products={category.products}
                      index={index}
                    />
                  ))}
                  {filteredCategories.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-gray-500 text-lg">
                        No products found matching your criteria.
                      </p>
                      <Button
                        onClick={clearFilters}
                        variant="link"
                        className="mt-2 text-[#0355bb] hover:text-[#027cc4]"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
