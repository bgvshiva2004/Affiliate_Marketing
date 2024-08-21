"use client"

import * as React from "react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area";
 
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const BgWrapper = () => (
  <div className="relative flex items-center justify-center h-screen">
    <div className="w-[75%] h-[75%] border-[1px] border-[#e8e8e8] bg-[#0bc772] backdrop-blur-lg shadow-lg rounded-lg border-opacity-75 flex flex-col items-center justify-center">
      <Image src="/A.png" alt="logo" width={300} height={300}/>
      <div className='text-white-shadow'>All in one Shopping Partner !</div>
    </div>

    <div className="absolute inset-0 flex items-center justify-center">
      <ScrollArea className="w-[70%] h-[65%] m-1 bg-white rounded-lg border-2 border-[white] p-4">
        <div className="flex flex-col justify-center">
          <div className="flex flex-row items-center justify-center">
            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

          </div>
          <div className="flex flex-row items-center justify-center">
            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

          </div>
          <div className="flex flex-row items-center justify-center">
            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

            <Card className="border-2 border-[white] w-[25%] m-2">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

          </div>
        </div>

      </ScrollArea>
    </div>
  </div>
)

export default BgWrapper
