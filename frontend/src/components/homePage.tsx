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

interface ListItem {
  id: number;
  title: string;
  description: string;
}

interface HomePageProps {
  initialToken?: string | null;
  initialLists: ListItem[];
}

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

  // const token = Cookies.get('access');
  // console.log("token : ",token)
  // console.log("initialToken : ",initialToken)
  // if(!token) throw new Error('No token found');

  useEffect(() => {
    if (initialToken) {
      // console.log("initialToken : ", initialToken);
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
    // console.log("edit item : ",item)
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const refreshLists = useCallback(async () => {
    if (!initialToken) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/lists/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${initialToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch lists");
      const newLists = await response.json();
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
    // console.log("logged in : ",isLoggedIn)

    if (!isLoggedIn) {
      router.push("/profile");
      return;
    }
    setIsListVisible(!isListVisible);
  };

  const handleCloseModal = useCallback(async () => {
    setIsModalOpen(false);
    setEditingItem(null);
  },[]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        
        className={`h-full w-full border-0 border-red-500`}
        style={{ backdropFilter: "blur(5px)" }}
      ></div>
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
        <ToastContainer position="bottom-right" autoClose={3000} />

        {/* Main content */}
        <div
          className={`flex flex-col z-[10] min-h-screen ${
            isListVisible ? "blur-sm" : ""
          } transition-all duration-300 z-[10]`}
        >
          <div className="flex flex-col lg:flex-row flex-grow w-full h-full items-center justify-center">
            {/* Right side - Text */}
            <div className="w-full p-4 sm:p-8 lg:p-12 flex flex-col justify-center items-center py-auto ">
              <div className="p-4 sm:p-6 lg:p-8 rounded-lg transition-all fade-in-out shadow-2xl max-w-xl w-full relative z-[100]">
                <div
                  id="background"
                  className="!z-[-100] !brightness-100 !left-0 !top-0 items-center"
                  style={{ backdropFilter: "blur(20px)" }}
                ></div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-black z-[100] text-center">
                  Affiliate Marketing
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-black z-[100] text-center">
                  Discover the ultimate ease in shopping through multiple
                  platforms on this single webpage exclusively built for you !!
                </p>
                <div className="items-center text-center">
                  <Button
                    className="mt-4 sm:mt-6 lg:mt-8 bg-black hover:bg-gray-800 text-white w-full sm:w-auto text-center"
                    size="lg"
                    onClick={() => setIsModalOpen(true)}
                  >
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
              <linearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
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
            isVisible={isListVisible}
            token={initialToken}
            initialLists={lists}
            onClose={() => setIsListVisible(false)}
            onEditItem={handleEditItem}
            isModalOpen = {isModalOpen}
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
                  {isListVisible ? (
                    <Home className="w-6 h-6" />
                  ) : (
                    <List className="w-6 h-6" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isListVisible ? "Return to Home" : "View List"}</p>
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
      </div>
    </div>
  );
}
