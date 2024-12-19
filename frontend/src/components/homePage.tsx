'use client'

import { useState , useEffect } from 'react'
import { Plus, X, List, Home, Edit, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ContentEditable from 'react-contenteditable'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProductsPage from '@/app/@products/ProductsPage'
import { motion, useAnimation } from 'framer-motion'

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

// import dynamic from 'next/dynamic'

interface ListItem {
  id?: number;
  title : string ;
  description : string;
}

interface HomePageProps {
  initialToken?: string | null
}

export default function HomePage({initialToken} : HomePageProps){

  const [isLoggedIn , setIsLoggedIn ] = useState<boolean | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isListVisible, setIsListVisible] = useState<boolean>(false)
  const [newItem, setNewItem] = useState<ListItem>({ title: 'Sample Title', description: 'Sample Description' })
  const [listItems, setListItems] = useState<ListItem[]>([])
  const [editingItem, setEditingItem] = useState<ListItem | null>(null)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const controls = useAnimation()

  const router = useRouter()

  // const token = Cookies.get('access');
  // console.log("token : ",token)
  // console.log("initialToken : ",initialToken)
  // if(!token) throw new Error('No token found');

  useEffect(() => {

    if(initialToken){
      console.log("initialToken : ",initialToken) 
      Cookies.set('access' , initialToken, {
        path : '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' 
      })
      setIsLoggedIn(true)
    }

    async function checkUserStatus(){
      const currentToken = Cookies.get('access')
      try{
        if(!currentToken){
          setIsLoggedIn(false);
        }else{
          setIsLoggedIn(true);
        }
      }catch(error){
        console.error("Error checking user status:", error);
        setIsLoggedIn(false); 
      }
    }
    
    checkUserStatus();
  }, [initialToken])

  const handleDragEnd = (event : any, info : any) => {
    if (info.offset.y < -50) {
      setIsOpen(true)
      controls.start({ height: '80vh' })
    } else if (info.offset.y > 50) {
      setIsOpen(false)
      controls.start({ height: '0px' })
    }
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
    controls.start({ height: isOpen ? '0px' : '80vh' })
  }

  const saveListItem = async (item : ListItem) : Promise<ListItem> => {
    try{
      // console.log("item : ",item)
      const response = await fetch('http://127.0.0.1:8000/api/v1/lists/',{
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${initialToken}`,
        },
        body: JSON.stringify(item),
      });

      if(!response.ok) throw new Error('Failed to save the list');

      const data = await response.json();
      return data;
    }catch(error){
      console.error('Error saving list item:', error);
      throw error;
    }
  }

  const fetchUserLists = async () : Promise<ListItem[]> => {
    try{

      const response = await fetch('http://127.0.0.1:8000/api/v1/lists/',{
        method : 'GET',
        headers: {
          'Authorization': `Bearer ${initialToken}`,
        },
      });
      if(!response.ok) throw new Error('Failed to fetch lists');
      const data = await response.json();
      return data;
    }catch(error){
      console.error('Error fetching user lists:', error);
      throw error;
    }
  }

  const handleAddItem = async () => {
    const title = newItem.title.trim();
    const description = newItem.description.trim() || 'No description provided';
  
    if (!title) {
      toast.error('Title is required');
      return;
    }
  
    try {
      if (editingItem) {
        const updatedItem = { ...editingItem, title, description };
        await saveListItem(updatedItem);
        setListItems(listItems.map(item => item.id === editingItem.id ? updatedItem : item));
        setEditingItem(null);
        toast.success('Item updated successfully');
      } else {
        const newItemData = await saveListItem({ title, description });
        setListItems([...listItems, newItemData]);
        toast.success('Item added successfully');
      }
    } catch (error) {
      toast.error('Failed to save item');
    }
  
    setNewItem({ title: 'Sample Title', description: 'Sample Description' });
    setIsModalOpen(false);
  };
  

  const handleRemoveItem = async (id : number) => {
    try{
      // const token = Cookies.get('access');
      // if(!token) throw new Error('No token found');

      const response = await fetch(`http://127.0.0.1:8000/api/v1/lists/${id}/` , {
        method : 'DELETE',
        headers : {
          'Authorization' : `Bearer ${initialToken}`,
        },
      });

      if(!response.ok) throw new Error('Failed to delete the list');

      setListItems(listItems.filter(item => item.id !== id))
      toast.info('Item removed')

    }catch(error){
      console.error('Error deleting list item:', error);
      toast.error('Failed to remove the item');
    }
  }

  const handleEditItem = (item : ListItem) => {
    // console.log("edit item : ",item)
    setEditingItem(item)
    setNewItem({ title: item.title, description: item.description })
    setIsModalOpen(true)
  }

  const handleNewItemChange = (field : keyof ListItem, value : string) => {
    setNewItem(prev => ({ ...prev, [field]: value }))
  }

  const handleContentChange = (id : number, field : keyof ListItem, value : string) => {
    setListItems(listItems.map(item =>
      item.id === id
        ? { ...item, [field]: value }
        : item
    ))
  }

  const toggleListVisibility = async () => {
    console.log("logged in : ",isLoggedIn)  
    
    if(!isLoggedIn){
      router.push('/profile') 
      return
    }

    // console.log("list visible : ", isListVisible)
    
    if(!isListVisible){
      try{
        const data = await fetchUserLists();
        setListItems(data);
      }catch(error){
        toast.error('Failed to fetch the lists');
      }
    }
    setIsListVisible(!isListVisible);
    // console.log("list visible2 : ", isListVisible)
  }
  

  return (
    <div className='relative min-h-screen overflow-hidden'>
      <div id={isOpen ? "background" : ""} className={`h-full w-full border-0 border-red-500 ${isOpen ? "!z-[100]" : "!z-[-1]"}`} style={{ "backdropFilter": "blur(5px)" }}></div>
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
        <ToastContainer position="bottom-right" autoClose={3000} />

        {/* Main content */}
        <div className={`flex flex-col z-[10] min-h-screen ${isListVisible ? 'blur-sm' : ''} transition-all duration-300 z-[10]`}>
          <div className="flex flex-col lg:flex-row flex-grow w-full h-full items-center justify-center">
            {/* Right side - Text */}
            <div className="w-full p-4 sm:p-8 lg:p-12 flex flex-col justify-center items-center py-auto ">
              <div className="p-4 sm:p-6 lg:p-8 rounded-lg transition-all fade-in-out shadow-2xl max-w-xl w-full relative z-[100]">
                <div id='background' className='!z-[-100] !brightness-100 !left-0 !top-0 items-center' style={{ "backdropFilter": "blur(20px)" }}></div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-black z-[100] text-center">Affiliate Marketing</h1>
                <p className="text-base sm:text-lg lg:text-xl text-black z-[100] text-center">
                  Discover the ultimate ease in shopping through multiple platforms on this single webpage exclusively built for you !! 
                </p>
                <div className='items-center text-center'>
                <Button className="mt-4 sm:mt-6 lg:mt-8 bg-black hover:bg-gray-800 text-white w-full sm:w-auto text-center" size="lg" onClick={() => setIsModalOpen(true)}>
                  Get Started
                </Button>
                </div>
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
          <div className="fixed top-0 left-0 w-full h-full z-[100000] overflow-auto bg-white/80 backdrop-blur-sm p-4 sm:p-6 transition-opacity duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-black">Your Lists</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListVisibility}
                className="text-black hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-100px)] ">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 !z-[100000000]">
                {listItems.map((item) => (
                  <Card key={item.id} className="relative group hover:shadow-lg transition-shadow hover:ring-4 ring-black ring-opacity-100 m-2 sm:m-4">
                    <CardHeader>
                      <ContentEditable
                        html={item.title}
                        onChange={(e) => handleContentChange(item.id, 'title', e.target.value)}
                        tagName='div'
                        className="text-base sm:text-lg font-semibold outline-none border-b-2 border-transparent focus:border-black transition-colors min-h-[24px] text-black"
                      />
                    </CardHeader>
                    <CardContent>
                      <ContentEditable
                        html={item.description}
                        onChange={(e) => handleContentChange(item.id, 'description', e.target.value)}
                        tagName='div'
                        className="text-black text-xs sm:text-sm outline-none border-0 border-gray-300 rounded-md focus:border-black transition-colors min-h-[80px] sm:min-h-[100px] max-h-[120px] sm:max-h-[150px] overflow-y-auto p-2"
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
        <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-shadow bg-black hover:bg-gray-800 text-white"
                  onClick={() => {
                    if(isLoggedIn){
                      setEditingItem(null)
                      setIsModalOpen(true)
                    }else{
                      router.push('/profile');
                    }
                  }}
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-shadow bg-black hover:bg-gray-800 text-white"
                  onClick={toggleListVisibility}
                >
                  {isListVisible ? <Home className="w-6 h-6" /> : <List className="w-6 h-6" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isListVisible ? 'Return to Home' : 'View List'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] z-[1000000]">
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
                  className="text-black text-sm outline-none border-0 border-gray-300 rounded-md focus:border-black transition-colors min-h-[100px] p-2"
                  data-placeholder="Enter description..."
                />
              </ScrollArea>
            </div>

            <DialogFooter>
              <Button onClick={handleAddItem} className="bg-black hover:bg-gray-800 text-white">
                {editingItem ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ShoppingSpot Component */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 shadow-lg z-[10000]"
          initial={{ height: '0px' }}
          animate={controls}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            onDragEnd={handleDragEnd}
            onClick={toggleDrawer}
            className="cursor-pointer active:cursor-grabbing relative z-[10000]"
          >
            <svg
              className="w-full h-12 absolute bottom-0 z-[10000]"
              preserveAspectRatio="none"
              viewBox="0 0 100 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 12 C20 12, 30 0, 50 0 C70 0, 80 12, 100 12 L100 12 L0 12 Z"
                fill="black"
              />
            </svg>
            <div className='absolute top-[-30px] flex justify-center items-center w-full z-[10000]'>
              <div className="h-2 w-[50px] sm:w-[100px] rounded-full bg-gray-300" />
            </div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white">
              {isOpen ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
            </div>
          </motion.div>
          <div className='bg-white w-full h-full overflow-y-auto'>
            <ProductsPage />
          </div>
        </motion.div>

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
      `}</style>
      </div>
    </div>
  )
}