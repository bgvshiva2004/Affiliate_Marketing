import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


export default function ProductCard({ product }){

  const handleClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card className="group w-64 transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg" onClick={() => handleClick(product.product_link)}>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {product.platform && (
          <Badge variant="secondary" className="absolute right-3 top-3">
            {product.platform}
          </Badge>
        )}
      </div>
      
      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="line-clamp-1 font-semibold leading-snug tracking-tight">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {product.companyName}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-bold">
            {/* ${product.price.toFixed(2)} */}
            ${product.price}
          </p>
          <Button 
            variant="ghost" 
            className="rounded-md px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            onClick={() => handleClick(product.product_link)}
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};