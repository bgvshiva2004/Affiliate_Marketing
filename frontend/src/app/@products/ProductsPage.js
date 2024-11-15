'use client'
import { motion } from "framer-motion"
import { useState, useMemo } from "react"
import { CategorySection } from "@/components/Products/CatgeorySection"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import { Plus, X, List, Home, Edit, Search,ChevronUp } from 'lucide-react'
const categories = [
	{
		name: "Electronics",
		products: [
			{ id: 1, title: "Smartphone X1", price: 699.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "TechCo", platform: "TechStore" },
			{ id: 2, title: "Laptop Pro", price: 1299.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "CompuTech", platform: "CompuMart" },
			{ id: 3, title: "Wireless Noise-Canceling Headphones", price: 199.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "AudioPhile", platform: "SoundWave" },
			{ id: 4, title: "Smartwatch Series 5", price: 249.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "WearableTech", platform: "GadgetWorld" },
			{ id: 5, title: "Tablet Ultra", price: 399.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "TechCo", platform: "TechStore" },
			{ id: 1, title: "Smartphone X1", price: 699.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "TechCo", platform: "TechStore" },
			{ id: 2, title: "Laptop Pro", price: 1299.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "CompuTech", platform: "CompuMart" },
			{ id: 3, title: "Wireless Noise-Canceling Headphones", price: 199.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "AudioPhile", platform: "SoundWave" },
			{ id: 4, title: "Smartwatch Series 5", price: 249.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "WearableTech", platform: "GadgetWorld" },
			{ id: 5, title: "Tablet Ultra", price: 399.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "TechCo", platform: "TechStore" },
			{ id: 1, title: "Smartphone X1", price: 699.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "TechCo", platform: "TechStore" },
			{ id: 2, title: "Laptop Pro", price: 1299.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "CompuTech", platform: "CompuMart" },
			{ id: 3, title: "Wireless Noise-Canceling Headphones", price: 199.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "AudioPhile", platform: "SoundWave" },
			{ id: 4, title: "Smartwatch Series 5", price: 249.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "WearableTech", platform: "GadgetWorld" },
			{ id: 5, title: "Tablet Ultra", price: 399.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "TechCo", platform: "TechStore" },
			{ id: 1, title: "Smartphone X1", price: 699.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "TechCo", platform: "TechStore" },
			{ id: 2, title: "Laptop Pro", price: 1299.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "CompuTech", platform: "CompuMart" },
			{ id: 3, title: "Wireless Noise-Canceling Headphones", price: 199.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "AudioPhile", platform: "SoundWave" },
			{ id: 4, title: "Smartwatch Series 5", price: 249.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "WearableTech", platform: "GadgetWorld" },
			{ id: 5, title: "Tablet Ultra", price: 399.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "TechCo", platform: "TechStore" },
		],
	},
	{
		name: "Clothing",
		products: [
			{ id: 6, title: "Classic Cotton T-Shirt", price: 19.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "ComfyWear", platform: "FashionHub" },
			{ id: 7, title: "Slim Fit Jeans", price: 49.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "DenimCo", platform: "JeanScene" },
			{ id: 8, title: "Running Sneakers", price: 79.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "SportyFeet", platform: "AthleticZone" },
			{ id: 9, title: "Cozy Hoodie", price: 39.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "ComfyWear", platform: "FashionHub" },
			{ id: 10, title: "Summer Floral Dress", price: 89.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "ChicStyles", platform: "TrendyThreads" },
		],
	},
	{
		name: "Home & Garden",
		products: [
			{ id: 11, title: "Programmable Coffee Maker", price: 89.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "BrewMaster", platform: "KitchenKing" },
			{ id: 12, title: "High-Speed Blender", price: 59.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "KitchenPro", platform: "CookCentral" },
			{ id: 13, title: "Ceramic Plant Pot Set", price: 24.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "GreenThumb", platform: "GardenGalore" },
			{ id: 14, title: "Decorative Throw Pillow", price: 29.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "CozyHome", platform: "HomeHaven" },
			{ id: 15, title: "Modern Table Lamp", price: 49.99, imageUrl: "/placeholder.svg?height=150&width=200", companyName: "LightItUp", platform: "IlluminateMe" },
		],
	},
]

export default function ProductsPage() {
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedCategories, setSelectedCategories] = useState([])
	const [minPrice, setMinPrice] = useState("")
	const [maxPrice, setMaxPrice] = useState("")

	const filteredCategories = useMemo(() => {
		return categories.map(category => ({
			...category,
			products: category.products.filter(product => {
				const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.platform.toLowerCase().includes(searchTerm.toLowerCase())
				const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category.name)
				const matchesPrice = (minPrice === "" || product.price >= parseFloat(minPrice)) &&
					(maxPrice === "" || product.price <= parseFloat(maxPrice))
				return matchesSearch && matchesCategory && matchesPrice
			})
		})).filter(category => category.products.length > 0)
	}, [searchTerm, selectedCategories, minPrice, maxPrice])

	const handleCategoryChange = (categoryName) => {
		setSelectedCategories(prev =>
			prev.includes(categoryName)
				? prev.filter(c => c !== categoryName)
				: [...prev, categoryName]
		)
	}

	const clearFilters = () => {
		setSelectedCategories([])
		setMinPrice("")
		setMaxPrice("")
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
							<SheetContent>
								<SheetHeader>
									<SheetTitle>Filters</SheetTitle>
								</SheetHeader>
								<div className="mt-4 space-y-4">
									<div className="space-y-2">
										<Label>Categories</Label>
										{categories.map((category) => (
											<div key={category.name} className="flex items-center space-x-2">
												<Checkbox
													id={category.name}
													checked={selectedCategories.includes(category.name)}
													onCheckedChange={() => handleCategoryChange(category.name)}
												/>
												<Label htmlFor={category.name}>{category.name}</Label>
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
									<Button onClick={clearFilters}>Clear Filters</Button>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
				<ScrollArea className="h-[calc(100vh-12rem)] bg-white" >
					{filteredCategories.map((category, index) => (
						<CategorySection
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