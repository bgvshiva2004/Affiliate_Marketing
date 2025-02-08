"use client";

import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";


function ProductCard({ product }) {
  return (
    <div className="flex-shrink-0 w-36 bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={product.image}
        alt={product.name}
        width={100}
        height={100}
        className="w-full h-36 object-cover"
      />
      <div className="p-2">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.price}</p>
        <a href="#" className="text-xs text-blue-500 hover:underline">
          View Product
        </a>
      </div>
    </div>
  );
}

export default function ShoppingSpot() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);
  const drawerThreshold = 100; // Minimum drag distance to open

  const handleDrag = (event) => {
    const { clientY } = event instanceof MouseEvent ? event : event.touches[0];
    const drawer = drawerRef.current;

    if (drawer && clientY <= window.innerHeight - drawerThreshold) {
      setIsOpen(true);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div
          ref={drawerRef}
          onMouseDown={handleDrag}
          onTouchStart={handleDrag}
          className="fixed bottom-0 left-0 right-0 bg-[#0BC772] p-4 rounded-t-3xl shadow-lg cursor-pointer"
        >
          <div className="flex items-center bg-white rounded-full p-2 shadow-inner">
            <Search className="text-gray-400 w-5 h-5 ml-2" />
            <input
              type="text"
              placeholder="Search your product"
              className="flex-grow mx-2 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              readOnly
            />
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="focus:outline-none"
              ></Button>
              <Button
                variant="ghost"
                size="icon"
                className="focus:outline-none"
              ></Button>
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <div className="p-4">
            <div className="flex items-center bg-white rounded-full p-2 shadow-inner mb-4">
              <Search className="text-gray-400 w-5 h-5 ml-2" />
              <input
                type="text"
                placeholder="All in one Shopping Partner"
                className="flex-grow mx-2 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              />
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="focus:outline-none"
                ></Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="focus:outline-none"
                ></Button>
              </div>
            </div>
            <ScrollArea className="h-[60vh] w-full">
              {categories.map((category, index) => (
                <div key={index} className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">
                    {category.name}
                  </h2>
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex space-x-4 flex-nowrap">
                      {category.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
