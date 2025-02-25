import { motion, useAnimation } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import ProductsPage from '@/app/@products/ProductsPage'
import { AnimationControls } from "framer-motion";
import { Poppins } from 'next/font/google';

interface DragEventInfo {
    offset: {
      y: number;
    };
}

interface ShoppingSpotProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    controls: AnimationControls;
    handleDragEnd: (event: any, info: DragEventInfo) => void;
    toggleDrawer: () => void;
    className: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight:"400",
  })

export const ShoppingSpot = ({ isOpen, setIsOpen, controls, handleDragEnd, toggleDrawer, className }: ShoppingSpotProps) => {
    
    return (
        <motion.div
            className={`fixed bottom-0 left-0 right-0 shadow-lg z-[1000000] ${className}`}
            initial={{ height: '0px' }}
            animate={{ height: isOpen ? '83vh' : '0px' }}
            // animate={controls}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0}
                onDragEnd={handleDragEnd}
                onClick={toggleDrawer}
                className="cursor-pointer active:cursor-grabbing relative z-[10000000]"
            >
                <svg
                    className="w-full h-12 absolute bottom-0 z-[10000000]"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 12"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="custom-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#3596d0' }} />
                            <stop offset="100%" style={{ stopColor: '#bce3f4' }} />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0 12 C20 12, 30 0, 50 0 C70 0, 80 12, 100 12 L100 12 L0 12 Z"
                        fill="url(#custom-gradient)"
                    />
                </svg>
                <div className='absolute top-[-30px] flex justify-center items-center w-full z-[10000000]'>
                    <div className="h-2 w-[50px] sm:w-[100px] rounded-full bg-white" />
                </div>
                {/* <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white">
                    {isOpen ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
                </div> */}
            </motion.div>
            <div className='bg-white w-full h-full overflow-y-auto'>
                <ProductsPage />
            </div>
        </motion.div>
    )
}
