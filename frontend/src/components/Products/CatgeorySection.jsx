"use client"

import { useEffect, useRef } from "react"
import ProductCard from "./ProductCard"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
})

export function CategorySection({ id, name, products }) {
  const sliderRef = useRef(null)

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    let isDown = false
    let startX
    let scrollLeft
    let startY
    let isScrollingHorizontally = false
    let isScrollDetected = false

    // Mouse events
    const mouseDown = (e) => {
      isDown = true
      slider.classList.add("active")
      startX = e.pageX - slider.offsetLeft
      scrollLeft = slider.scrollLeft
    }

    const mouseLeave = () => {
      isDown = false
      slider.classList.remove("active")
    }

    const mouseUp = () => {
      isDown = false
      slider.classList.remove("active")
    }

    const mouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - slider.offsetLeft
      const walk = (x - startX) * 1
      slider.scrollLeft = scrollLeft - walk
    }

    // Touch events
    const touchStart = (e) => {
      isDown = true
      isScrollDetected = false
      isScrollingHorizontally = false
      slider.classList.add("active")
      const touch = e.touches[0]
      startX = touch.pageX - slider.offsetLeft
      startY = touch.pageY
      scrollLeft = slider.scrollLeft
    }

    const touchEnd = () => {
      isDown = false
      isScrollDetected = false
      slider.classList.remove("active")
    }

    const touchMove = (e) => {
      if (!isDown) return

      const touch = e.touches[0]
      const x = touch.pageX - slider.offsetLeft
      const y = touch.pageY

      // Calculate horizontal and vertical movement
      const deltaX = Math.abs(x - startX)
      const deltaY = Math.abs(y - startY)

      // If we haven't determined scroll direction yet
      if (!isScrollDetected && (deltaX > 5 || deltaY > 5)) {
        isScrollDetected = true
        // If horizontal movement is greater than vertical, handle horizontal scrolling
        isScrollingHorizontally = deltaX > deltaY
      }

      // Only handle horizontal scrolling and prevent default if we're scrolling horizontally
      if (isScrollingHorizontally) {
        e.preventDefault()
        const walk = (x - startX) * 1
        slider.scrollLeft = scrollLeft - walk
      }
      // Otherwise, let the default vertical scroll happen
    }

    // Add event listeners for mouse and touch events
    slider.addEventListener("mousedown", mouseDown)
    slider.addEventListener("mouseleave", mouseLeave)
    slider.addEventListener("mouseup", mouseUp)
    slider.addEventListener("mousemove", mouseMove)

    slider.addEventListener("touchstart", touchStart)
    slider.addEventListener("touchend", touchEnd)
    slider.addEventListener("touchmove", touchMove, { passive: false })

    // Cleanup event listeners
    return () => {
      slider.removeEventListener("mousedown", mouseDown)
      slider.removeEventListener("mouseleave", mouseLeave)
      slider.removeEventListener("mouseup", mouseUp)
      slider.removeEventListener("mousemove", mouseMove)

      slider.removeEventListener("touchstart", touchStart)
      slider.removeEventListener("touchend", touchEnd)
      slider.removeEventListener("touchmove", touchMove)
    }
  }, [id])

  return (
    <div className={`w-full ${poppins.className}`}>
      <h1 className="text-xl font-bold text-[#0355bb]">{name}</h1>
      <div className="grid-container w-full mb-3">
        <main className="grid-item main w-full">
          <div ref={sliderRef} className={`items${id} items flex gap-4 overflow-x-auto`}>
            {products.map((product) => (
              <div key={product.id} className="item flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </main>
      </div>

      <style jsx>{`
        .items${id} {
          overflow-x: auto;
          cursor: grab;
          -webkit-overflow-scrolling: touch;
        }
        
        .items${id}.active {
          cursor: grabbing;
        }

        .grid-container {
          overflow-x: hidden;
        }

        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        *::-webkit-scrollbar {
          display: none;
        }
        
        /* Prevent image dragging and selection */
        .items${id} img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -o-user-select: none;
          user-select: none;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

