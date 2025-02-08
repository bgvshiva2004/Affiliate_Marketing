'use client'

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { 
  Menu, 
  X, 
  Search, 
  Home as HomeIcon, 
  Package, 
  List as ListIcon, 
  User,
  BookOpen
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import Link from "next/link"
import { motion, useAnimation } from 'framer-motion'

import Cookies from 'js-cookie'
import { ListComponent } from "./ListComponent"
import { ModalComponent } from "./ModalComponent"
import { ShoppingSpot } from "./ShoppingSpotComponent"

interface ListItem {
  id: number;
  title: string;
  description: string;
}

interface NavbarProps {
  token?: string | null;
  initialLists: ListItem[];
}

export default function Navbar({ token, initialLists }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isListVisible, setIsListVisible] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ListItem | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      setIsSearchOpen(true)
    }
  }, [searchParams])

  const isHomePage = pathname === "/"
  const navBackground = isHomePage && !scrolled
    ? 'bg-transparent'
    : 'bg-white/80 backdrop-blur-md shadow-md'

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      router.push(`/SearchPage/${encodedQuery}`);
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (!value.trim()) {
      router.push(pathname)
    }
  }

  const handleEditItem = (item: ListItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  const handleItemSaved = (item: ListItem) => {
    setIsModalOpen(false);
    setEditingItem(null);
  }

  const controls = useAnimation()

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y < -50) {
      setIsOpen(true)
      controls.start({ height: '80vh' })
    } else if (info.offset.y > 50) {
      setIsOpen(false)
      controls.start({ height: '0px' })
    }
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
    controls.start({ height: isOpen ? '0px' : '80vh' })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !(event?.target instanceof Element && event?.target?.closest('.shopping-spot'))
      ) {
        setIsOpen(false);
        controls.start({ height: '0px' });
      }
    };
    

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, controls]);

  return (
    <>
      <nav
        className={`fixed w-full top-0 transition-all duration-300 !z-[999999] ${navBackground}`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-[#0355bb]" />
                <span className="text-xl font-bold text-[#0355bb] hover:text-black">AuraGen</span>
              </Link>
            </div>

            {/* Mobile Search Bar */}
            <div className="flex md:hidden flex-1 mx-4">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search"
                    className="w-full pr-8"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                  >
                    <Search className="h-4 w-4 text-[#0355bb]" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden relative z-[999999]">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-[#0355bb] hover:text-black">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] z-[999999]">
                  <SheetHeader>
                    <SheetTitle className="text-[#0355bb]">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col space-y-4">
                    <SheetClose asChild>
                      <Link href="/" className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black">
                        <HomeIcon className="h-5 w-5" />
                        <span>Home</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button 
                        onClick={() => toggleDrawer()}
                        className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black"
                      >
                        <Package className="h-5 w-5" />
                        <span>Products</span>
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => {
                          if (!token) {
                            window.location.href = '/profile';
                          } else {
                            setIsListVisible(true);
                          }
                        }}
                        className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black"
                      >
                        <ListIcon className="h-5 w-5" />
                        <span>List</span>
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/profile" className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black">
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
              <Link href="/" className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black">
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <button 
                onClick={() => toggleDrawer()}
                className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black"
              >
                <Package className="h-5 w-5" />
                <span>Products</span>
              </button>
              <button
                onClick={() => {
                  if (!token) {
                    window.location.href = '/profile';
                  } else {
                    setIsListVisible(true);
                  }
                }}
                className="flex items-center space-x-2 text-base font-medium text-[#0355bb] hover:text-black"
              >
                <ListIcon className="h-5 w-5" />
                <span>List</span>
              </button>
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center justify-end space-x-4 lg:flex-1">
              <div className="relative flex items-center">
                <div className={`absolute right-0 flex items-center transition-all duration-300 ${
                  isSearchOpen ? 'w-64 opacity-100 -translate-x-10' : 'w-0 opacity-0'
                }`}>
                  <form onSubmit={handleSearch} className="flex w-full items-center rounded-l-full rounded-r-full bg-gray-100">
                    <Input
                      type="search"
                      placeholder="Search"
                      className={`border-0 focus-visible:ring-0 rounded-l-md ${isSearchOpen ? 'w-full pl-4' : 'w-0'}`}
                      disabled={!isSearchOpen}
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-10 rounded-r-full"
                    >
                      <Search className="h-4 w-4 text-[#0355bb]" />
                    </Button>
                  </form>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#0355bb] hover:text-black relative z-10"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  {isSearchOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Search className="h-6 w-6" />
                  )}
                </Button>
              </div>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-[#0355bb] hover:text-black">
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Rest of the components remain the same */}
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
    </>
  )
}
