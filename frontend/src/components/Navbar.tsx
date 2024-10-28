'use client'

import { useState, useEffect } from "react"
import { Menu, X, ShoppingCart, List, User,Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300  ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="#" className="flex items-center space-x-2">
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
            </a>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4">
                  <a href="#" className="text-base font-medium text-gray-900 hover:text-primary">
                    Shop
                  </a>
                  <a href="#" className="text-base font-medium text-gray-900 hover:text-primary">
                    List
                  </a>
                  <a href="#" className="text-base font-medium text-gray-900 hover:text-primary">
                    Account
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <nav className="hidden md:flex space-x-10">
          <a href="#" className="text-base font-medium text-gray-500 hover:text-primary">
              Home
            </a>
            <a href="#" className="text-base font-medium text-gray-500 hover:text-primary">
              Shop
            </a>
            <a href="#" className="text-base font-medium text-gray-500 hover:text-primary">
              List
            </a>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Button variant="ghost" size="icon" className="text-primary">
              <Search  className="h-6 w-6" />
              <span className="sr-only">Shopping cart</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-primary ml-4">
              <User className="h-6 w-6" />
              <span className="sr-only">User account</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}