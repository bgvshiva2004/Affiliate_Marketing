'use client'

import { useState, useEffect } from "react"
import { usePathname , useRouter , useSearchParams } from "next/navigation"
import { Menu, X, ShoppingCart, List, User, Search } from "lucide-react"
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

import Cookies from 'js-cookie'
import { ListComponent } from "./ListComponent"
import { ModalComponent } from "./ModalComponent"

interface ListItem {
  id : number;
  title : string;
  description : string;
}

interface NavbarProps{
  token? : string | null;
  initialLists : ListItem[];
}

export default function Navbar({token , initialLists} : NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery , setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isListVisible , setIsListVisible] = useState(false)

  const [isModalOpen , setIsModalOpen] = useState(false)
  const [editingItem , setEditingItem] = useState<ListItem | null>(null)

  // const token = Cookies.get('access')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const query = searchParams.get('q')
    if(query){
      setSearchQuery(query)
      setIsSearchOpen(true)
    }
  } , [searchParams])

  const isHomePage = pathname === "/"
  const navBackground = isHomePage && !scrolled
    ? 'bg-transparent'
    : 'bg-white/80 backdrop-blur-md shadow-md'

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Add your search logic here
    // if(searchQuery.trim()){
    //   router.push(`${pathname}?q=${encodeURIComponent(searchQuery.trim())}`)
    // }else{
    //   router.push(pathname)
    // }
    if(searchQuery.trim()){
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      router.push(`/SearchPage/${encodedQuery}`);
    }
  }

  const handleSearchInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if(!value.trim()){
      router.push(pathname)
    }
  }

  const handleEditItem = (item : ListItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  const handleItemSaved = (item : ListItem) => {
    setIsModalOpen(false);
    setEditingItem(null);
  }

  return (
  <>
    <nav
      className={`fixed w-full  top-0 transition-all duration-300 !z-[100000] ${navBackground}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                />
              </svg>
              <span className="text-xl font-bold text-primary">Aone</span>
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden !z-[100000]">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] !z-[100000]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4">
                  <form onSubmit={handleSearch} className="flex w-full items-center">
                    <Input
                      type="search"
                      placeholder="Search Products ..."
                      className="flex-grow"
                      value = {searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                    >
                      <Search className="h-4 w-4" />
                      <span className="sr-only">Submit search</span>
                    </Button>
                  </form>
                  <SheetClose asChild>
                    <Link href="/" className="text-base font-medium text-gray-900 hover:text-primary">
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/shop" className="text-base font-medium text-gray-900 hover:text-primary">
                      Products
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    {/* <Link href="/list" className="text-base font-medium text-gray-900 hover:text-primary">
                      List
                    </Link> */}
                    <button
                      onClick={()=>{
                        if(!token){
                          window.location.href = '/profile';
                        }else{
                          setIsListVisible(true);
                        }
                      }}
                      className="text-base font-medium text-gray-500 hover:text-primary"
                    >
                      List
                    </button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/profile" className="text-base font-medium text-gray-900 hover:text-primary">
                      Account
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-base font-medium text-gray-500 hover:text-primary">
              Home
            </Link>
            <Link href="/shop" className="text-base font-medium text-gray-500 hover:text-primary">
              Products
            </Link>
            {/* <Link href="/list" className="text-base font-medium text-gray-500 hover:text-primary">
              List
            </Link> */}
            <button
                onClick={()=>{
                  if(!token){
                    window.location.href = '/profile';
                  }else{
                    setIsListVisible(true);
                  }
                }}
                className="text-base font-medium text-gray-500 hover:text-primary"
              >
                List
            </button>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <div className="relative flex items-center">
              <div className={`absolute right-0 flex items-center transition-all duration-300 ${isSearchOpen
                ? 'w-64 opacity-100 -translate-x-10'
                : 'w-0 opacity-0'
                }`}>
                <form onSubmit={handleSearch} className="flex w-full items-center rounded-l-full rounded-r-full bg-[#E9E9E9]">
                  <Input
                    type="search"
                    placeholder="Search Products ..."
                    className={`border-0 focus-visible:ring-0 rounded-l-md ${isSearchOpen ? 'w-full pl-4' : 'w-0'}`}
                    disabled={!isSearchOpen}
                    value = {searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="h-10 rounded-r-full"
                  >
                    <Search className="h-4 w-4 rounded-full" />
                    <span className="sr-only">Submit search</span>
                  </Button>
                </form>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary relative z-10"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              >
                {isSearchOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Search className="h-6 w-6" />
                )}
              </Button>
            </div>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-primary ml-4">
                  <User className="h-6 w-6" />
                  <span className="sr-only">User profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>

    {isListVisible && (
      <ListComponent 
          isVisible = {isListVisible}
          token = {token}
          initialLists={initialLists}
          onClose={() => setIsListVisible(false)}
          // onEditItem={(item) => console.log("Edit item : ", item)}
          onEditItem={handleEditItem}
          isModalOpen = {isModalOpen}
      />
    )}

    <ModalComponent
      isOpen = {isModalOpen}
      onClose={() => setIsModalOpen(false)}
      token = {token}
      editingItem={editingItem}
      onItemSaved={handleItemSaved}
    />

  </>
  )
}