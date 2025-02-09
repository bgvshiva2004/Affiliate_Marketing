import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function ProductCard({ product }) {
  const handleClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="group w-48 bg-white transition-all duration-300 hover:shadow-lg border border-[#0355bb]/10 overflow-hidden">
      <div className="relative">
        <div
          className="aspect-square overflow-hidden cursor-pointer"
          onClick={() => handleClick(product.product_link)}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      <CardContent className="space-y-1.5 p-3">
        <div className="flex items-center justify-between min-h-[40px]">
          <h3 
            className="line-clamp-2 text-sm font-semibold leading-tight tracking-tight text-[#0355bb] group-hover:text-[#027cc4] transition-colors duration-200"
            title={product.title}
          >
            {product.title}
          </h3>
          {product.platform && (
            <Badge 
              variant="secondary" 
              className="bg-[#0355bb] text-white text-[10px] font-medium px-2 py-0.5 shadow-sm"
            >
              {product.platform}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p 
            className="text-xs text-[#0355bb]/70 font-medium"
            title={product.companyName}
          >
            {product.companyName}
          </p>
          <p className="text-base font-bold text-[#0355bb]">
            ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="pt-1">
          <Button
            variant="ghost"
            className="w-full h-8 bg-[#0355bb]/5 hover:bg-[#0355bb]/10 text-[#0355bb] hover:text-[#0355bb] transition-colors duration-200 group/button"
            onClick={() => handleClick(product.product_link)}
          >
            <span className="text-xs font-semibold">Buy Now</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
