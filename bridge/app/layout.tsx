import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/component/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="mb-[75px]">
          <Navbar/>
        </div>
        {children}
      </body>
    </html>
  )
}