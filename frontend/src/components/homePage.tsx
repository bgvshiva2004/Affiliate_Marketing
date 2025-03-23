"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  List,
  Home,
  Edit,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductsPage from "@/app/@products/ProductsPage";
import { motion, useAnimation } from "framer-motion";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ListComponent } from "./ListComponent";
import { ModalComponent } from "./ModalComponent";
import { ShoppingSpot } from "./ShoppingSpotComponent";

import { Poppins } from "next/font/google";

interface ListItem {
  id: number;
  title: string;
  description: string;
}

interface HomePageProps {
  initialToken?: string | null;
  initialLists: ListItem[];
}


const poppins = Poppins({
  subsets: ['latin'],
  weight:"400",
})

export default function HomePage({
  initialToken,
  initialLists,
}: HomePageProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ListItem | null>(null);
  const controls = useAnimation();
  const [lists, setLists] = useState<ListItem[]>(initialLists);
  const router = useRouter();

  useEffect(() => {
    if (initialToken) {
      Cookies.set("access", initialToken, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      setIsLoggedIn(true);
    }

    async function checkUserStatus() {
      const currentToken = Cookies.get("access");
      try {
        if (!currentToken) {
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        setIsLoggedIn(false);
      }
    }

    checkUserStatus();
  }, [initialToken]);

  const handleEditItem = (item: ListItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const refreshLists = useCallback(async () => {
    if (!initialToken) return;

    try {
      const response = await fetch("https://affiliatemarketing-production.up.railway.app/backend/api/v1/lists/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${initialToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch lists");
      const newLists = await response.json();
      newLists.sort((a: ListItem , b: ListItem) => b.id - a.id);
      setLists(newLists);
    } catch (error) {
      console.error("Error refreshing lists:", error);
      toast.error("Failed to refresh lists");
    }
  }, [initialToken]);

  const handleItemSaved = async (newItem: ListItem) => {
    setLists((currentLists) => {
      const exists = currentLists.some((item) => item.id === newItem.id);
      if (exists) {
        return currentLists.map((item) =>
          item.id === newItem.id ? newItem : item
        );
      }
      return [...currentLists, newItem];
    });

    await refreshLists();
    handleCloseModal();
  };

  const toggleListVisibility = async () => {
    if (!isLoggedIn) {
      router.push("/profile");
      return;
    }
    setIsListVisible(!isListVisible);
  };

  const handleCloseModal = useCallback(async () => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  return (
    <div className={`${poppins.className}`}>
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(circle, #027cc4, #FFFFFF)',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        style={{ 
          top: '20px',
          zIndex: 1000000000
        }}
        toastStyle={{
          backgroundColor: '#2e93ce',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(3, 85, 187, 0.15)',
          fontSize: '14px',
          padding: '12px 24px',
          fontWeight: '500'
        }}
      />

      <div
        className={`h-full w-full border-0 border-red-500`}
        style={{ backdropFilter: "blur(5px)" }}
      ></div>
      
      <div className="relative">
        <div
          className={`flex flex-col z-[10] min-h-screen ${
            isListVisible ? "blur-sm" : ""
          } transition-all duration-300`}
        >
          <div className="flex flex-col lg:flex-row flex-grow w-full h-full items-center justify-center">
            <div className="w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center">
              <div className="p-3 sm:p-4 lg:p-6 rounded-2xl transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.2)] max-w-lg w-full relative z-[100] flex flex-col items-center">
                <div
                  id="background"
                  className="!z-[-100] !brightness-100 !left-0 !top-0 items-center"
                  style={{ backdropFilter: "blur(20px)" }}
                ></div>

                <span className="text-transparent text-3xl sm:text-4xl lg:text-5xl font-bold aura-text">
                  OuraGen
                </span>

                <img
                  src="/images/temp_logo2.png"
                  alt="Logo"
                  className="max-w-[75%] max-h-[75%] object-contain transform hover:scale-105 transition-transform duration-300"
                />

                <span className="text-white text-sm sm:text-base lg:text-lg text-center font-medium tracking-wide">
                  Discover the ultimate ease in Shopping
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-0 overflow-hidden">
          <svg
            className="absolute z-0 top-0 left-0 w-[200%] h-[200%] pointer-events-none opacity-90"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
            <g className="wave-group">
              <path
                className="wave"
                fill="url(#waveGradient)"
                fillOpacity="0.8"
                d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </g>
          </svg>
        </div>

        {isListVisible && (
          <ListComponent
            isVisible={isListVisible}
            token={initialToken}
            initialLists={lists}
            onClose={() => setIsListVisible(false)}
            onEditItem={handleEditItem}
            isModalOpen={isModalOpen}
          />
        )}

        <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-[100000] flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-7">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full w-12 h-12 p-0 shadow-[0_4px_14px_rgba(3,85,187,0.25)] hover:shadow-[0_6px_20px_rgba(3,85,187,0.35)] transition-all duration-300 bg-[#0355bb] hover:bg-white text-white hover:text-[#0355bb] transform hover:scale-105"
                  onClick={() => {
                    if (isLoggedIn) {
                      setEditingItem(null);
                      setIsModalOpen(true);
                    } else {
                      router.push("/profile");
                    }
                  }}
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="z-[1001] bg-[#027cc4] text-white px-4 py-2 rounded-lg shadow-lg border border-white/10 backdrop-blur-sm"
              >
                <p>Add new List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full w-12 h-12 p-0 shadow-[0_4px_14px_rgba(3,85,187,0.25)] hover:shadow-[0_6px_20px_rgba(3,85,187,0.35)] transition-all duration-300 bg-[#0355bb] hover:bg-white text-white hover:text-[#0355bb] transform hover:scale-105"
                  onClick={toggleListVisibility}
                >
                  {isListVisible ? (
                    <Home className="w-6 h-6" />
                  ) : (
                    <List className="w-6 h-6" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="z-[1001] bg-[#027cc4] text-white px-4 py-2 rounded-lg shadow-lg border border-white/10 backdrop-blur-sm"
              >
                <p>{isListVisible ? "Return to Home" : "View List"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div 
          className={`fixed inset-0 bg-gray-200 transition-opacity duration-300 ${
            isModalOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`} 
          style={{ zIndex: 1000 }}
        />
        
        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          token={initialToken}
          editingItem={editingItem}
          onItemSaved={handleItemSaved}
        />

        <style jsx>{`
          @keyframes waveAnimation {
            0% {
              d: path(
                "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              );
            }
            50% {
              d: path(
                "M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,213.3C672,213,768,171,864,160C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              );
            }
            100% {
              d: path(
                "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              );
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

        <style jsx>{`
          .aura-text {
            color: white;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3),
                         0 4px 8px rgba(0, 0, 0, 0.2),
                         0 8px 16px rgba(0, 0, 0, 0.1);
            font-size: 1.5rem;
            font-weight: bold;
            letter-spacing: 0.5px;
          }

          @media (min-width: 640px) {
            .aura-text {
              font-size: 2rem;
            }
          }

          @media (min-width: 1024px) {
            .aura-text {
              font-size: 3rem;
            }
          }
        `}</style>

<style jsx global>{`
  .DialogOverlay {
    background-color: rgba(0, 0, 0, 0.2) !important;
    backdrop-filter: blur(4px);
  }
`}</style>

      </div>
    </div>
    </div>
  );
}