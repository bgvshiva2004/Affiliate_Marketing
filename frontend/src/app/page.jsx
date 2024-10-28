'use client'

import { useState } from 'react'
import { Plus, X, List, Home, Edit, Search,ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import ContentEditable from 'react-contenteditable'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from "next/image"
import SearchPage from '@/app/@search/SearchPage'

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isListVisible, setIsListVisible] = useState(false)
  const [newItem, setNewItem] = useState({ title: 'Sample Title', description: 'Sample Description' })
  const [listItems, setListItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="bottom-right" autoClose={3000} />

      {/* Main content */}
      <div className={`flex flex-col min-h-screen ${isListVisible ? 'blur-sm' : ''} transition-all duration-300`}>
        <div className="flex flex-col lg:flex-row flex-grow ">
          {/* Right side - Text */}
          <div className="w-full p-12 flex flex-col justify-center items-center py-auto border-0 border-red-500 h-screen">
            <div className="p-8 border-0 border-red-500 rounded-lg backdrop-blur-xl hover:backdrop-blur-3xl transition-all fade-in-out shadow-2xl">
              <h1 className="text-4xl font-bold mb-6 text-black">Welcome to Our Professional Landing Page</h1>
              <p className="text-xl text-black">
                Discover our cutting-edge solutions designed to elevate your business.
                Our innovative approach combines state-of-the-art technology with unparalleled expertise.
              </p>
              <Button className="mt-8 bg-black hover:bg-gray-800 text-white" size="lg" onClick={() => setIsModalOpen(true)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated diagonal wave background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg
          className="absolute z-0 top-0 left-0 w-[200%] h-[200%] pointer-events-none opacity-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#333333" />
              <stop offset="100%" stopColor="#666666" />
            </linearGradient>
          </defs>
          <g className="wave-group">
            <path
              className="wave"
              fill="url(#waveGradient)"
              fillOpacity="1"
              d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </g>
        </svg>
      </div>

      {/* List items */}
      {isListVisible && (
        <div className="fixed top-0 left-0 w-full h-full z-10 overflow-auto bg-white/80 backdrop-blur-sm p-6 transition-opacity duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-black">Your Items</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleListVisibility}
              className="text-black hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {listItems.map((item) => (
                <Card key={item.id} className="relative group hover:shadow-lg transition-shadow hover:ring-4 ring-black ring-opacity-100 m-4">
                  <CardHeader>
                    <ContentEditable
                      html={item.title}
                      onChange={(e) => handleContentChange(item.id, 'title', e.target.value)}
                      tagName='div'
                      className="text-lg font-semibold outline-none border-b-2 border-transparent focus:border-black transition-colors min-h-[24px] text-black"
                    />
                  </CardHeader>
                  <CardContent>
                    <ContentEditable
                      html={item.description}
                      onChange={(e) => handleContentChange(item.id, 'description', e.target.value)}
                      tagName='div'
                      className="text-black text-sm outline-none border-2 border-gray-300 rounded-md focus:border-black transition-colors min-h-[100px] max-h-[150px] overflow-y-auto p-2"
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditItem(item)}
                        className="border-gray-300 text-black hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4" />
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

      {/* Add and View List/Home buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-shadow bg-black hover:bg-gray-800 text-white"
                onClick={() => {
                  setEditingItem(null)
                  setIsModalOpen(true)
                }}
              >
                <Plus className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add new item</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {!isListVisible && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-shadow bg-black hover:bg-gray-800 text-white"
                  onClick={toggleListVisibility}
                >
                  <List className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {isListVisible && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-shadow bg-black hover:bg-gray-800 text-white"
                  onClick={toggleListVisibility}
                >
                  <Home className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return to Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-black">{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <ContentEditable
                html={newItem.title}
                
                onChange={(e) => handleNewItemChange('title', e.target.value)}
                tagName='div'
                className="text-lg font-semibold outline-none border-b-2 border-transparent focus:border-black transition-colors min-h-[24px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300"
                data-placeholder="Enter title..."
              />
            </div>
            <ScrollArea className="h-[150px]">
              <ContentEditable
                html={newItem.description}
                onChange={(e) => handleNewItemChange('description', e.target.value)}
                tagName='div'
                className="text-black text-sm outline-none border-2 border-gray-300 rounded-md focus:border-black transition-colors min-h-[100px] p-2"
                data-placeholder="Enter description..."
              />
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button onClick={handleAddItem} className="bg-black  hover:bg-gray-800 text-white">
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ShoppingSpot Component */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center pb-6">
          
          <div className="relative w-5/6 max-w-lg">
            
            <div className="bg-white rounded-full shadow-lg cursor-pointer overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground opacity-10"></div>
                <div className="flex items-center p-3">
                  <Search className="text-primary w-6 h-6 ml-3" />
                  <input
                    type="text"
                    placeholder="Search your product"
                    className="flex-grow mx-3 bg-transparent outline-none text-base text-primary placeholder-primary/50"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerTrigger>
        <DrawerContent>
          <SearchPage />
        </DrawerContent>
      </Drawer>

      <style jsx>{`
        @keyframes waveAnimation {
          0% {
            d: path("M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z");
          }
          50% {
            d: path("M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,213.3C672,213,768,171,864,160C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z");
          }
          100% {
            d: path("M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z");
          }
        }

        @keyframes diagonalMove {
          0% {
            transform: translate(-50%, -50%) rotate(-10deg);
          }
          100% {
            transform: translate(0%, 0%) rotate(-10deg);
          }
        }

        .wave-group {
          animation: diagonalMove 20s linear infinite;
        }

        .wave {
          animation: waveAnimation 20s ease-in-out infinite;
        }

        .inner {
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, .4);
          width: 400px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          animation-name: move;
          animation-duration: 5s;
          animation-iteration-count: infinite;
          animation-direction: forward;
        }
      `}</style>
    </div>
  )
}