'use client'

import { useState, useMemo , useEffect } from "react"
import { CategorySection } from "@/components/Products/CatgeorySection"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import { getAllProducts } from "@/api"
import { platform } from "os"

export default function ProductsPage() {
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedCategories, setSelectedCategories] = useState([])
	const [selectedCountries, setSelectedCountries] = useState([])
    const [selectedPlatforms, setSelectedPlatforms] = useState([])
	const [minPrice, setMinPrice] = useState("")
	const [maxPrice, setMaxPrice] = useState("")
	const [products , setProducts] = useState([])
	const [loading , setLoading] = useState(true)
	const [error , setError] = useState(null)

	const loadProducts = async (filters = {}) => {
		try {
			// const data = await getAllProducts()
			// setProducts(data)

			setLoading(true)
			const data = await getAllProducts(null,{
				searchTerm: searchTerm,
				categories: selectedCategories,
				countries: selectedCountries,
				platforms: selectedPlatforms,
				min_price: minPrice || undefined,
				max_price: maxPrice || undefined,
				...filters
			})

			setProducts(data)
		} catch (error) {
			console.error("Error loading products:", error)
			setError('Failed to load products')
		} finally {
			setLoading(false)
		}
	}


	useEffect(() => {
        loadProducts()
    }, [])

	const uniqueCountries = useMemo(() => 
        [...new Set(products.map(product => product.product_country))],
        [products]
    )

    const uniquePlatforms = useMemo(() => 
        [...new Set(products.map(product => product.product_platform))],
        [products]
    )

	const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(product => product.product_category))]
        return uniqueCategories.map(name => ({
            name,
            products: products
                .filter(p => p.product_category === name)
                .map(p => ({
                    id: p.id,
                    title: p.product_name,
                    price: p.product_price,
                    imageUrl: p.product_image,
                    companyName: p.product_country,
                    platform: p.product_platform,
					product_link: p.product_link
                }))
        }))
    }, [products])

    
    const filteredCategories = useMemo(() => {
        return categories.map(category => ({
            ...category,
            products: category.products.filter(product => {
                const matchesSearch = !searchTerm || 
                    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.platform.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category.name)
                const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(product.companyName)
                const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.includes(product.platform)
                const matchesPrice = (minPrice === "" || product.price >= parseFloat(minPrice)) &&
                    (maxPrice === "" || product.price <= parseFloat(maxPrice))
                return matchesSearch && matchesCategory && matchesCountry && matchesPlatform && matchesPrice
            })
        })).filter(category => category.products.length > 0)
    }, [searchTerm, selectedCategories, selectedCountries, selectedPlatforms, minPrice, maxPrice, categories])



	const handleCategoryChange = (categoryName) => {
		setSelectedCategories(prev =>
			prev.includes(categoryName)
				? prev.filter(c => c !== categoryName)
				: [...prev, categoryName]
		)
	}

	const handleCountryChange = (country) => {
		setSelectedCountries(prev =>
			prev.includes(country)
				? prev.filter(c => c !== country)
				: [...prev, country]
		)
	}

	const handlePlatformChange = (platform) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        )
    }

	const applyFilters = () => {
		loadProducts()
	}

	const clearFilters = () => {
		setSelectedCategories([])
        setSelectedCountries([])
        setSelectedPlatforms([])
        setMinPrice("")
        setMaxPrice("")
        setSearchTerm("")
        loadProducts()
	}

	if (loading) {
        return <div className="text-center py-8">Loading products...</div>
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>
    }

	return (
		<div className="">
			
			<div id="ProductsPage" className=" h-[70vh] mx-auto  px-4 py-8 border-0 border-red-500 ">
				<div className="flex flex-col  mb-8 ">
					<h1 className="text-3xl font-bold">Our Products</h1>
					<div className="flex items-center space-x-4 ">
						<Input
							type="text"
							placeholder="Search products..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex-grow"
						/>
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline">
									<SlidersHorizontal className="mr-2 h-4 w-4" />
									Filters
								</Button>
							</SheetTrigger>
							<SheetContent className="z-[10000000]">
								<SheetHeader>
									<SheetTitle>Filters</SheetTitle>
								</SheetHeader>
								<div className="mt-4 space-y-4">
									<div className="space-y-2">
										<Label>Categories</Label>
										{categories.map((category) => (
											<div key={category.name} className="flex items-center space-x-2">
												<Checkbox
													// id={category.name}
													id = {`category-${category.name}`}
													checked={selectedCategories.includes(category.name)}
													onCheckedChange={() => handleCategoryChange(category.name)}
												/>
												<Label htmlFor={`category-${category.name}`}>{category.name}</Label>
											</div>
										))}
									</div>
									<div className="space-y-2">
                                        <Label>Countries</Label>
                                        {uniqueCountries.map((country) => (
                                            <div key={country} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`country-${country}`}
                                                    checked={selectedCountries.includes(country)}
                                                    onCheckedChange={() => handleCountryChange(country)}
                                                />
                                                <Label htmlFor={`country-${country}`}>{country}</Label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Platforms</Label>
                                        {uniquePlatforms.map((platform) => (
                                            <div key={platform} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`platform-${platform}`}
                                                    checked={selectedPlatforms.includes(platform)}
                                                    onCheckedChange={() => handlePlatformChange(platform)}
                                                />
                                                <Label htmlFor={`platform-${platform}`}>{platform}</Label>
                                            </div>
                                        ))}
                                    </div>

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
									{/* <Button onClick={clearFilters}>Clear Filters</Button> */}
									<div className="space-y-2">
                                        <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
                                        <Button onClick={clearFilters} variant="outline" className="w-full">Clear Filters</Button>
                                    </div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
				<ScrollArea className="h-[calc(100vh-12rem)] bg-white" >
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
						<p className="text-center text-gray-500">No products found matching your criteria.</p>
					)}
				</ScrollArea>
			</div>
		</div>
	)
}