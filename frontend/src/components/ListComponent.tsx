import { useEffect, useState } from "react";
import { X, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  username?: string;
}

interface ListItem {
  id: number;
  title: string;
  description: string;
}

interface ListComponentProps {
  isVisible: boolean;
  token: string | null | undefined;
  initialLists: ListItem[];
  onClose: () => void;
  onEditItem: (item: ListItem) => void;
  isModalOpen: boolean;
}

const htmlToPlainText = (html: string) => {
  // Create a temporary div
  const temp = document.createElement("div");
  
  // Replace common HTML line break elements with newline character
  let content = html
    .replace(/<br\s*\/?>/gi, '\n') // Replace <br> tags
    .replace(/<p>/gi, '') // Remove opening <p> tags
    .replace(/<\/p>/gi, '\n') // Replace closing </p> tags with newline
    .replace(/<div>/gi, '') // Remove opening <div> tags
    .replace(/<\/div>/gi, '\n') // Replace closing </div> tags with newline
    .replace(/<li>/gi, '') // Remove opening <li> tags
    .replace(/<\/li>/gi, '\n') // Replace closing </li> tags with newline;
  
  // Set the processed content
  temp.innerHTML = content;
  
  // Get plain text
  let text = temp.textContent || temp.innerText || "";
  
  // Clean up excessive line breaks while preserving intended ones
  text = text
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace triple line breaks with double
    .replace(/^\s+|\s+$/g, ''); // Trim leading/trailing whitespace
  
  return text;
};

const getUsernameFromToken = (token: string | null | undefined): string => {
  if (!token) return "Your";
  try {
    const decoded: TokenPayload = jwtDecode(token);
    return decoded.username || "Your";
  } catch (error) {
    console.error("Error decoding token:", error);
    return "Your";
  }
};

export const ListComponent = ({
  isVisible,
  token,
  initialLists,
  onClose,
  onEditItem,
  isModalOpen,
}: ListComponentProps) => {
  const [listItems, setListItems] = useState<ListItem[]>(initialLists);
  const [itemToDelete, setItemToDelete] = useState<ListItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);
  const isBackgroundBlurred = isLocalModalOpen || isModalOpen || !!selectedItem;

  const username = getUsernameFromToken(token); 

  const handleRemoveItem = async (id: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/lists/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete the list");

      setListItems(listItems.filter((item) => item.id !== id));
      setItemToDelete(null);
      setIsLocalModalOpen(false);
    } catch (error) {
      console.error("Error deleting list item:", error);
      toast.error("Failed to remove the item");
    }
  };

  const handleEditClick = (item: ListItem) => {
    onEditItem(item);
  }

  const handleCardClick = (item: ListItem) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    setListItems(initialLists);
  }, [initialLists]);

  return (
    <div className="relative">
      <div className={`fixed top-0 left-0 w-full h-full !z-[100000] overflow-auto bg-white/80 backdrop-blur-sm p-2 sm:p-6 transition-opacity duration-300 ease-in-out ${isBackgroundBlurred ? 'blur-sm brightness-75' : ''}`}>
        <div className="flex justify-between items-center mb-2 sm:mb-4 px-2">
          <h2 className="text-lg sm:text-2xl font-bold text-[#0355bb]">{username}'s lists</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[#0355bb] hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 pb-4 px-2 p-4">
            {listItems.map((item) => (
              <Card
                key={item.id}
                className="relative group hover:shadow-lg transition-shadow hover:ring-1 ring-[#0355bb] ring-opacity-100 grid grid-rows-[auto_1fr_auto] cursor-pointer"
                onClick={() => handleCardClick(item)}
              >
                <CardHeader className="p-3 sm:p-4">
                  <div className="text-sm sm:text-base font-semibold text-[#0355bb] line-clamp-2 whitespace-pre-wrap break-words">
                    {htmlToPlainText(item.title)}
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-[#0355bb] text-xs sm:text-sm line-clamp-5 whitespace-pre-wrap break-words">
                    {htmlToPlainText(item.description)}
                  </div>
                </CardContent>
                <CardContent className="p-2 sm:p-4">
                  <div className="flex justify-end space-x-1 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(item);
                      }}
                      className="h-7 w-7 sm:h-8 sm:w-8 border-gray-300 text-[#0355bb] hover:bg-gray-50"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Edit item</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLocalModalOpen(true);
                        setItemToDelete(item);
                      }}
                      className="h-7 w-7 sm:h-8 sm:w-8 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Full Content Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[#0355bb] pr-8 whitespace-pre-wrap break-words">
                  {htmlToPlainText(selectedItem.title)}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="max-h-[60vh]">
                <div className="text-sm sm:text-base text-[#0355bb] whitespace-pre-wrap break-words">
                  {htmlToPlainText(selectedItem.description)}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}

      {isBackgroundBlurred && !selectedItem && (
        <div className="fixed inset-0 bg-[#0355bb]/20 backdrop-blur-sm z-[150]" />
      )}

      {/* Responsive Delete Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => {
        setItemToDelete(null);
        setIsLocalModalOpen(open);
      }}>
        <AlertDialogContent className="fixed z-[200000] w-[90%] max-w-md mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              Do you wish to delete the list{" "}
              {itemToDelete?.title && (
                <span className="font-medium">
                  {htmlToPlainText(itemToDelete.title)}
                </span>
              )}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              This action cant be undone. Your list will be permanently deleted
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel className="sm:mr-2 text-sm sm:text-base">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && handleRemoveItem(itemToDelete.id)}
              className="bg-red-500 hover:bg-red-600 text-sm sm:text-base"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}