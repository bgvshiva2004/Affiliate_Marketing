'use client'

import { useState } from 'react'
import { Plus, X, Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ContentEditable from 'react-contenteditable'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newItem, setNewItem] = useState({ title: 'Sample Title', description: 'Sample Description' })
  const [listItems, setListItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)

  const handleAddItem = () => {
    const title = newItem.title.trim()
    const description = newItem.description.trim() || 'No description provided'

    if (!title) {
      toast.error('Title is required')
      return
    }

    if (editingItem) {
      setListItems(listItems.map(item => 
        item.id === editingItem.id ? { ...item, title, description } : item
      ))
      setEditingItem(null)
      toast.success('Item updated successfully')
    } else {
      setListItems([...listItems, { id: Date.now(), title, description }])
      toast.success('Item added successfully')
    }

    setNewItem({ title: 'Sample Title', description: 'Sample Description' })
    setIsModalOpen(false)
  }

  const handleRemoveItem = (id) => {
    setListItems(listItems.filter(item => item.id !== id))
    toast.info('Item removed')
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setNewItem({ title: item.title, description: item.description })
    setIsModalOpen(true)
  }

  const handleNewItemChange = (field, value) => {
    setNewItem(prev => ({ ...prev, [field]: value }))
  }

  const handleContentChange = (id, field, value) => {
    setListItems(listItems.map(item => 
      item.id === id 
        ? { ...item, [field]: value }
        : item
    ))
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      {/* Main content */}
      <div className={`flex flex-col min-h-screen ${listItems.length > 0 ? 'blur-sm' : ''} transition-all duration-300`}>
        <div className="flex flex-col lg:flex-row flex-grow">
          {/* Right side - Text */}
          <div className="w-full p-12 flex flex-col justify-center">
            <div className="p-8 rounded-lg backdrop-blur-md bg-white/70 shadow-xl">
              <h1 className="text-4xl font-bold mb-6 text-black">Welcome to Our Professional Landing Page</h1>
              <p className="text-xl text-black">
                Discover our cutting-edge solutions designed to elevate your business. 
                Our innovative approach combines state-of-the-art technology with unparalleled expertise.
              </p>
              <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white" size="lg" onClick={() => setIsModalOpen(true)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative SVG */}
      <svg
        className="absolute z-0 top-0 left-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C40,20 60,80 100,100 L100,0 Z"
          fill="url(#greenGradient)"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>

      {/* List items at the top of the screen */}
      {listItems.length > 0 && (
        <div className="absolute py-20 top-0 left-0 w-full h-full z-10 overflow-auto bg-white/80 backdrop-blur-sm p-6">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {listItems.map((item) => (
                <Card key={item.id} className="relative group hover:shadow-lg transition-shadow border-green-200">
                  <CardHeader>
                    <ContentEditable
                      html={item.title}
                      onChange={(e) => handleContentChange(item.id, 'title', e.target.value)}
                      tagName='div'
                      className="text-lg font-semibold outline-none border-b-2 border-transparent focus:border-green-500 transition-colors min-h-[24px] text-black"
                    />
                  </CardHeader>
                  <CardContent>
                    <ContentEditable
                      html={item.description}
                      onChange={(e) => handleContentChange(item.id, 'description', e.target.value)}
                      tagName='div'
                      className="text-black text-sm outline-none border-2 border-gray-300 rounded-md focus:border-blue-500 transition-colors min-h-[100px] max-h-[150px] overflow-y-auto p-2"
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditItem(item)}
                        className="border-green-300 text-green-600 hover:bg-green-50"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit item</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Add button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          className="rounded-full w-16 h-16 p-0 shadow-lg hover:shadow-xl transition-shadow bg-green-600 hover:bg-green-700 text-white"
          onClick={() => {
            setEditingItem(null)
            setIsModalOpen(true)
          }}
        >
          <Plus className="w-8 h-8" />
          <span className="sr-only">Add new item</span>
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="space-y-4">
            <div>
              <ContentEditable
                html={newItem.title}
                onChange={(e) => handleNewItemChange('title', e.target.value)}
                tagName='div'
                className="text-lg font-semibold outline-none border-b-2 border-transparent focus:border-green-500 transition-colors min-h-[24px] empty:before:content-[attr(data-placeholder)] empty:before:text-green-300"
                data-placeholder="Enter title..."
              />
            </div>
            <div>
              <ContentEditable
                html={newItem.description}
                onChange={(e) => handleNewItemChange('description', e.target.value)}
                tagName='div'
                className="text-black text-sm outline-none border-2 border-gray-300 rounded-md focus:border-blue-500 transition-colors min-h-[100px] max-h-[150px] overflow-y-auto p-2"
                data-placeholder="Enter description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700 text-white">
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}