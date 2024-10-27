'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    description: ''
  })
  const [listItems, setListItems] = useState([])

  const handleAddItem = () => {
    if (newItem.title.trim()) {
      setListItems([...listItems, {
        id: Date.now(),
        title: newItem.title.trim(),
        description: newItem.description.trim() || 'No description provided'
      }])
      setNewItem({ title: '', description: '' })
      setIsModalOpen(false)
    }
  }

  const handleRemoveItem = (id) => {
    setListItems(listItems.filter(item => item.id !== id))
  }

  return (
    <div className="relative m-20 min-h-screen overflow-hidden border-[20px] border-[#5badd2]">
      {/* Main content */}
      <div className={`flex min-h-screen ${listItems.length > 0 ? 'blur-sm' : ''}`}>
        {/* Left side - Photo */}
        <div className="w-1/2 bg-gray-200">
          <img
            src="/images/landing_page.jpeg"
            alt="Placeholder"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right side - Text */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div className="relative p-8 rounded-lg backdrop-blur-md bg-white/70">
            <h1 className="text-4xl font-bold mb-6">Welcome to Our Landing Page</h1>
            <p className="text-xl">
              This is where you can add some compelling text about your product or service.
              The curvy string adds a unique visual element to your page.
            </p>
          </div>
        </div>
      </div>

      {/* Curvy string SVG */}
      <svg
        className="absolute z-[-1] top-0 left-0 w-[140%] h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#5badd2', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#5badd2', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          d="M35,80 Q30,0 60,60 T60,-10"
          fill="none"
          stroke="url(#blueGradient)"
          strokeWidth="20"
          opacity="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Add button */}
      <div className="absolute bottom-8 right-8 z-50">
        <Button
          className="rounded-full w-12 h-12 p-0"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="z-50">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium mb-1 block">
                Title
              </label>
              <Input
                id="title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Enter title"
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium mb-1 block">
                Description
              </label>
              <Input
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddItem}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* List items overlay with cards */}
      {listItems.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <div className=" rounded-lg  p-6 w-full  max-h-[80vh]">
            <ScrollArea className="h-[calc(80vh-8rem)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {listItems.map((item) => (
                  <Card key={item.id} className="relative group hover:shadow-lg transition-shadow">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  )
}