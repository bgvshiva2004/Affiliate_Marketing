'use client'

import { useRef, useState, useEffect } from "react"
import { ProductCard } from "./ProductCard"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  title: string
  price: number
  imageUrl: string
  companyName: string
  platform: string
}

interface CategorySectionProps {
  name: string
  products: Product[]
  index: number
}

export function CategorySection({ name, products, index }: CategorySectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0))
    setScrollLeft(containerRef.current?.scrollLeft || 0)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsHovering(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (containerRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2 // Adjust dragging speed
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 200 // Adjust as needed
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault()
      }
    }

    container.addEventListener('dragstart', handleDragStart)

    return () => {
      container.removeEventListener('dragstart', handleDragStart)
    }
  }, [])

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">{name}</h2>
      <div className="relative overflow-hidden">
        <div 
          ref={containerRef}
          className="flex overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
        >
          <div 
            className={`flex transition-transform duration-[30s] ease-linear ${
              isDragging || isHovering ? '' : index % 2 === 0 ? 'animate-scroll-ltr' : 'animate-scroll-rtl'
            }`}
          >
            {[...products, ...products].map((product, productIndex) => (
              <div key={`${product.id}-${productIndex}`} className="flex-shrink-0 w-[200px] mr-4">
                <ProductCard
                  title={product.title}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  companyName={product.companyName}
                  platform={product.platform}
                />
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={() => scroll('left')}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={() => scroll('right')}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <style jsx>{`
        @keyframes scroll-ltr {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-200px * ${products.length} - 1rem * ${products.length}));
          }
        }

        @keyframes scroll-rtl {
          0% {
            transform: translateX(calc(-200px * ${products.length} - 1rem * ${products.length}));
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-ltr {
          animation: scroll-ltr 30s linear infinite;
        }

        .animate-scroll-rtl {
          animation: scroll-rtl 30s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-ltr,
          .animate-scroll-rtl {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}