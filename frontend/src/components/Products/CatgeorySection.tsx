'use client'

import { useRef, useEffect, useState } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
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
}

export function CategorySection({ name, products }: CategorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)
  const x = useMotionValue(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      setContainerWidth(containerRect.width)
      
      const contentRect = containerRef.current.children[0].getBoundingClientRect()
      setContentWidth(contentRect.width)
    }
  }, [products])

  const dragConstraints = {
    left: -(contentWidth - containerWidth),
    right: 0
  }

  const handleDrag = () => {
    const currentX = x.get()
    setCanScrollLeft(currentX < 0)
    setCanScrollRight(currentX > dragConstraints.left)
  }

  const scroll = (direction: 'left' | 'right') => {
    const scrollAmount = direction === 'left' ? 400 : -400
    const newX = x.get() + scrollAmount
    const clampedX = Math.max(dragConstraints.left, Math.min(0, newX))
    animate(x, clampedX, { type: "spring", stiffness: 300, damping: 30 })
    handleDrag()
  }

  const opacity = useTransform(
    x,
    [dragConstraints.left, 0],
    [0, 1]
  )

  return (
    <div className="mb-12 relative" aria-label={`${name} product category`}>
      <h2 className="text-2xl font-semibold mb-4">{name}</h2>
      <div className="overflow-hidden">
        <motion.div
          ref={containerRef}
          className="cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={dragConstraints}
          style={{ x }}
          onDrag={handleDrag}
        >
          <div className="flex">
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[200px] mr-4">
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
        </motion.div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface ProductCardProps {
  title: string
  price: number
  imageUrl: string
  companyName: string
  platform: string
}

function ProductCard({ title, price, imageUrl, companyName, platform }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
        <p className="text-gray-600 mb-2">${price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">{companyName}</p>
        <p className="text-sm text-gray-500">{platform}</p>
      </div>
    </div>
  )
}