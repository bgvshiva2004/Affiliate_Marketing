"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Menu, X, Search, HomeIcon, Package, ListIcon, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import Link from "next/link"
import { useAnimation } from "framer-motion"
import { ListComponent } from "./ListComponent"
import { ModalComponent } from "./ModalComponent"
import { ShoppingSpot } from "./ShoppingSpotComponent"
import { Poppins } from "next/font/google"

interface ListItem {
  id: number
  title: string
  description: string
}

interface NavbarProps {
  token?: string | null
  initialLists: ListItem[]
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
})

export default function Navbar({ token, initialLists }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isListVisible, setIsListVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ListItem | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const fallbackSuggestions = ["Books", "Electronics", "Clothing", "Shoes", "Home Decor"]

  // Get product suggestions from localStorage
  const getProductSuggestions = (): string[] => {
    if (typeof window === "undefined") return fallbackSuggestions

    try {
      const storedSuggestions = localStorage.getItem("productSuggestions")
      if (storedSuggestions) {
        return JSON.parse(storedSuggestions)
      }
    } catch (error) {
      console.error("Error parsing product suggestions from localStorage:", error)
    }

    return fallbackSuggestions
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
      setIsSearchOpen(true)
    }
  }, [searchParams])

  // Monitor route changes to close suggestions dropdown
  useEffect(() => {
    setShowSuggestions(false)
  }, [pathname])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter suggestions based on input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const query = searchQuery.toLowerCase().trim()
    // Get product names from localStorage
    const availableProducts = getProductSuggestions()

    // Filter products based on search query
    const filtered = availableProducts.filter((item) => item.toLowerCase().includes(query)).slice(0, 14)

    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
    setSelectedIndex(-1)
  }, [searchQuery])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    }
    // Enter to select
    else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        e.preventDefault()
        setSearchQuery(suggestions[selectedIndex])
        setShowSuggestions(false)
        const encodedQuery = encodeURIComponent(suggestions[selectedIndex].trim())
        router.push(`/SearchPage/${encodedQuery}`)
      } else if (searchQuery.trim()) {
        e.preventDefault()
        setShowSuggestions(false)
        const encodedQuery = encodeURIComponent(searchQuery.trim())
        router.push(`/SearchPage/${encodedQuery}`)
      }
    }
    // Escape to close
    else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const isHomePage = pathname === "/"
  const navBackground =
    isHomePage && !scrolled ? "bg-transparent" : "bg-white/60 backdrop-blur-lg shadow-lg transition-shadow duration-300"

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      const encodedQuery = encodeURIComponent(searchQuery.trim())
      router.push(`/SearchPage/${encodedQuery}`)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (!value.trim()) {
      router.push(pathname)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    const encodedQuery = encodeURIComponent(suggestion.trim())
    router.push(`/SearchPage/${encodedQuery}`)
  }

  const handleEditItem = (item: ListItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleItemSaved = (item: ListItem) => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const controls = useAnimation()

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y < -50) {
      setIsOpen(true)
      controls.start({ height: "80vh" })
    } else if (info.offset.y > 50) {
      setIsOpen(false)
      controls.start({ height: "0px" })
    }
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
    controls.start({ height: isOpen ? "0px" : "80vh" })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !(
          event?.target instanceof Element &&
          (event?.target?.closest(".shopping-spot") || event?.target?.closest(".filters"))
        )
      ) {
        setIsOpen(false)
        controls.start({ height: "0px" })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, controls])

  // Focus handling for search input
  useEffect(() => {
    const handleBlur = () => {
      // Delayed hiding of suggestions to allow for clicks on suggestions
      setTimeout(() => {
        if (document.activeElement !== searchInputRef.current) {
          setShowSuggestions(false)
        }
      }, 200)
    }

    const searchInput = searchInputRef.current
    if (searchInput) {
      searchInput.addEventListener("blur", handleBlur)
      return () => {
        searchInput.removeEventListener("blur", handleBlur)
      }
    }
  }, [])

  // Suggestions dropdown component
  const SuggestionsDropdown = () =>
    showSuggestions && suggestions.length > 0 ? (
      <div
        ref={suggestionsRef}
        className="absolute mt-1 bg-white rounded-lg shadow-md z-50 border border-gray-200/30 overflow-hidden transition-all duration-200 max-h-60"
        style={{ width: isSearchOpen ? "100%" : "90%" }}
      >
        <ul className="py-1">
          {suggestions.map((suggestion, index) => {
            // Highlight the matching part of the suggestion
            const query = searchQuery.toLowerCase()
            const suggestionLower = suggestion.toLowerCase()
            const matchIndex = suggestionLower.indexOf(query)

            return (
              <li
                key={index}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100/50 transition-colors duration-150 ${
                  index === selectedIndex ? "bg-gray-100/80" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {matchIndex >= 0 ? (
                  <>
                    {suggestion.substring(0, matchIndex)}
                    <span className="font-medium text-[#0355bb]">
                      {suggestion.substring(matchIndex, matchIndex + query.length)}
                    </span>
                    {suggestion.substring(matchIndex + query.length)}
                  </>
                ) : (
                  suggestion
                )}
              </li>
            )
          })}
        </ul>
      </div>
    ) : null

  return (
    <div className={`${poppins.className}`}>
      <nav
        className={`fixed w-full top-0 transition-all duration-500 ease-in-out !z-[100000] ${navBackground} ${
          scrolled ? "border-b border-gray-200/20" : ""
        }`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo - Modified for mobile view */}
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/" className="flex items-center space-x-2 transition-colors duration-300">
                <img
                  src="/images/temp_logo2.png"
                  alt="Logo"
                  className="h-10 md:h-10 w-auto object-contain transform hover:scale-105 transition-transform duration-300"
                  style={{ height: "40px" }}
                />
                <span className="hidden md:inline text-xl font-bold text-[#0355bb] hover:text-black transition-colors duration-300">
                  OuraGen
                </span>
              </Link>
            </div>

            {/* Mobile Search Bar - Increased width */}
            <div className="flex md:hidden flex-1 mx-1">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search"
                    className="w-full pr-8 bg-white/80 backdrop-blur-sm border border-gray-200/30 rounded-full shadow-sm 
                    focus:ring-2 focus:ring-[#0355bb]/20 focus:border-[#0355bb]/30 transition-all duration-300"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
                  >
                    <Search className="h-4 w-4 text-[#0355bb]" />
                  </Button>
                </div>
                <div className="absolute left-0 right-0 mx-4 z-[100001]">{SuggestionsDropdown()}</div>
              </form>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden relative z-[999999]">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#0355bb] hover:text-black transition-colors duration-300"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] z-[10000000] bg-white/95 backdrop-blur-lg">
                  <SheetHeader>
                    <SheetTitle className="text-[#0355bb]">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col space-y-4">
                    <SheetClose asChild>
                      <Link
                        href="/"
                        className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black 
                        transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100/50"
                      >
                        <HomeIcon className="h-5 w-5" />
                        <span>Home</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => toggleDrawer()}
                        className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black 
                          transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100/50 w-full text-left"
                      >
                        <Package className="h-5 w-5" />
                        <span>Products</span>
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => {
                          if (!token) {
                            window.location.href = "/profile"
                          } else {
                            setIsListVisible(true)
                          }
                        }}
                        className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black 
                          transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100/50 w-full text-left"
                      >
                        <ListIcon className="h-5 w-5" />
                        <span>List</span>
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black 
                        transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100/50"
                      >
                        <User className="h-5 w-5" />
                        <span>Account</span>
                      </Link>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black 
                transition-colors duration-300"
              >
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <button
                onClick={() => toggleDrawer()}
                className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black 
                  transition-colors duration-300"
              >
                <Package className="h-5 w-5" />
                <span>Products</span>
              </button>
              <button
                onClick={() => {
                  if (!token) {
                    window.location.href = "/profile"
                  } else {
                    setIsListVisible(true)
                  }
                }}
                className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black 
                  transition-colors duration-300"
              >
                <ListIcon className="h-5 w-5" />
                <span>List</span>
              </button>
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center justify-end space-x-4 lg:flex-1">
              <div className="relative flex items-center">
                <div
                  className={`absolute right-0 flex items-center transition-all duration-500 ${
                    isSearchOpen ? "w-64 opacity-100 -translate-x-10" : "w-0 opacity-0"
                  }`}
                >
                  <form onSubmit={handleSearch} className="flex w-full items-center">
                    <Input
                      ref={searchInputRef}
                      type="search"
                      placeholder="Search"
                      className={`border-0 focus-visible:ring-2 focus-visible:ring-[#0355bb]/20 
                        bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-all duration-300 
                        ${isSearchOpen ? "w-full pl-4" : "w-0"}`}
                      disabled={!isSearchOpen}
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-10 rounded-full hover:bg-transparent"
                    >
                      <Search className="h-4 w-4 text-[#0355bb]" />
                    </Button>

                    {/* Desktop Search Suggestions */}
                    <div className="absolute top-12 right-0 w-64">{isSearchOpen && SuggestionsDropdown()}</div>
                  </form>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#0355bb] hover:text-black relative z-10 transition-colors duration-300"
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen)
                    if (isSearchOpen) {
                      setShowSuggestions(false)
                    }
                  }}
                >
                  {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
                </Button>
              </div>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#0355bb] hover:text-black transition-colors duration-300"
                >
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Component Renders */}
      {isListVisible && (
        <ListComponent
          isVisible={isListVisible}
          token={token}
          initialLists={initialLists}
          onClose={() => setIsListVisible(false)}
          onEditItem={handleEditItem}
          isModalOpen={isModalOpen}
        />
      )}

      {pathname === "/" && (
        <ShoppingSpot
          controls={controls}
          handleDragEnd={handleDragEnd}
          toggleDrawer={toggleDrawer}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          className="shopping-spot"
        />
      )}

      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={token}
        editingItem={editingItem}
        onItemSaved={handleItemSaved}
      />
    </div>
  )
}

