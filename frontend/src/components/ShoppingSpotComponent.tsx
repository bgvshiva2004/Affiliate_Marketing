import { motion, useAnimation } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import ProductsPage from '@/app/@products/ProductsPage'

interface ShoppingSpotProps { 
    isOpen : boolean;
    setIsOpen : (isOpen: boolean) => void;
}

export const ShoppingSpot = ({isOpen , setIsOpen} : ShoppingSpotProps) => {
    const controls = useAnimation()

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

    return (
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
    )
}