'use client'

import { useState , useEffect } from 'react'
import { Plus, X, List, Home, Edit, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProductsPage from '@/app/@products/ProductsPage'
import { motion, useAnimation } from 'framer-motion'

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { ListComponent } from './ListComponent'
import { ModalComponent } from './ModalComponent'

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


  const handleEditItem = (item : ListItem) => {
    // console.log("edit item : ",item)
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleItemSaved = (item: ListItem) => {
    setEditingItem(null)
    setIsModalOpen(false)
    // Refresh list if visible
    if (isListVisible) {
      toggleListVisibility()
    }
  }

  const toggleListVisibility = async () => {
    console.log("logged in : ",isLoggedIn)  
    
    if(!isLoggedIn){
      router.push('/profile') 
      return
    }
  
    setIsListVisible(!isListVisible);
    
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
          <ListComponent
            isVisible = {isListVisible}
            token = {initialToken}
            onClose={() => setIsListVisible(false)}
            onEditItem={handleEditItem}
          />
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
        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          token={initialToken}
          editingItem={editingItem}
          onItemSaved={handleItemSaved}
        />

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