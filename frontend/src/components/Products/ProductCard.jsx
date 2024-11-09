import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"


export function ProductCard({ title, price, imageUrl, companyName, platform }) {
  return (
    <Card className="w-[200px] h-[320px] flex flex-col">
      <div className="relative w-full h-[150px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardContent className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{companyName}</p>
          <p className="text-xs text-muted-foreground">{platform}</p>
        </div>
        <p className="text-lg font-bold mt-2">${price.toFixed(2)}</p>
      </CardContent>
    </Card>
  )
}