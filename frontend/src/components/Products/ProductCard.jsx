import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProductCard({ product }) {
  const handleClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="group w-48 transition-all duration-300 hover:shadow-lg text-[#0355bb] border-[#0355bb]/20">
      <div className="relative">
        <div
          className="aspect-square overflow-hidden rounded-t-lg cursor-pointer"
          onClick={() => handleClick(product.product_link)}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      <CardContent className="space-y-2 p-3">
        <div className="flex items-center justify-between">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight tracking-tight text-[#0355bb]">
            {product.title}
          </h3>
          {product.platform && (
            <Badge variant="secondary" className="bg-[#0355bb] text-white text-xs">
              {product.platform}
            </Badge>
          )}
        </div>
        <p className="text-xs text-[#0355bb]/70">{product.companyName}</p>

        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-[#0355bb]">${product.price}</p>
          <Button
            variant="ghost"
            className="h-8 rounded-md px-3 py-1 text-xs font-medium text-[#0355bb] hover:bg-[#0355bb]/10 transition-colors"
            onClick={() => handleClick(product.product_link)}
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
