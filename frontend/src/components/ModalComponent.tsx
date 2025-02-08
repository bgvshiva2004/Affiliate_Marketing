import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContentEditable from "react-contenteditable";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ListItem {
  id: number;
  title: string;
  description: string;
}

interface NewListItem {
  title: string;
  description: string;
}

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null | undefined;
  editingItem: ListItem | null;
  onItemSaved: (item: ListItem) => void;
}

// Function to process content before saving
const processContent = (content: string) => {
  // Replace newlines with <br> tags
  return content
    .replace(/\n/g, '<br>')
    // Handle consecutive <br> tags (preserve double line breaks)
    .replace(/(<br\s*\/?>(\s*)){3,}/g, '<br><br>')
    // Ensure consistent spacing around <br> tags
    .replace(/\s*<br\s*\/?>\s*/g, '<br>')
    // Clean up any empty paragraphs
    .replace(/<p>\s*<\/p>/g, '<br>');
};

export const ModalComponent = ({
  isOpen,
  onClose,
  token,
  editingItem,
  onItemSaved,
}: ModalComponentProps) => {
  const [newItem, setNewItem] = useState<NewListItem>({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (editingItem) {
      setNewItem({
        title: editingItem.title,
        description: editingItem.description,
      });
    } else {
      setNewItem({
        title: "",
        description: "",
      });
    }
  }, [editingItem, isOpen]);

  const saveListItem = async (item: NewListItem): Promise<ListItem> => {
    try {
      const url = editingItem
        ? `http://127.0.0.1:8000/api/v1/lists/${editingItem.id}/`
        : "http://127.0.0.1:8000/api/v1/lists/";

      const method = editingItem ? "PUT" : "POST";

      // Process the content before saving
      const processedItem = {
        title: processContent(item.title),
        description: processContent(item.description),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(processedItem),
      });

      if (!response.ok) throw new Error("Failed to save the list");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saving list item:", error);
      throw error;
    }
  };

  const handleAddItem = async () => {
    const title = newItem.title.trim();
    const description = newItem.description.trim();

    if (!title && !description) {
      toast.error("Please enter a title or description");
      return;
    }

    try {
      const savedItem = await saveListItem({ title, description });
      onItemSaved(savedItem);
      if (!editingItem) {
        toast.success("List added successfully");
      } else {
        toast.success("List updated successfully");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save item");
    }
  };

  const handleNewItemChange = (field: keyof ListItem, value: string) => {
    // Normalize line breaks in the content as it's being entered
    const normalizedValue = value
      .replace(/<div>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n');  // Normalize multiple line breaks

    setNewItem((prev) => ({ ...prev, [field]: normalizedValue }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-[95%] mx-auto max-h-[90vh] !z-[1000000] bg-white rounded-lg shadow-lg">
        <DialogHeader className="relative border-b pb-4">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-[#0355bb] pl-1">
            {editingItem ? "Edit the List" : "Add New List"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="px-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Title
            </label>
            <ContentEditable
              html={newItem.title}
              onChange={(e) => handleNewItemChange("title", e.target.value)}
              tagName="div"
              className="text-base sm:text-lg outline-none border rounded-md p-2 focus:ring-2 focus:ring-[#0355bb] focus:border-transparent transition-all min-h-[40px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300"
              data-placeholder="Enter title..."
            />
          </div>
          
          <div className="px-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Description
            </label>
            <ScrollArea className="h-[200px] sm:h-[250px] border rounded-md focus-within:ring-2 focus-within:ring-[#0355bb] focus-within:border-transparent">
              <ContentEditable
                html={newItem.description}
                onChange={(e) => handleNewItemChange("description", e.target.value)}
                tagName="div"
                className="text-sm sm:text-base text-gray-800 outline-none p-3 min-h-full empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 whitespace-pre-wrap break-words [text-rendering:optimizeLegibility] antialiased"
                data-placeholder="Enter description..."
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}
              />
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 text-sm sm:text-base border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddItem}
              className="flex-1 text-sm sm:text-base bg-[#0355bb] hover:bg-[#0243a3] text-white transition-colors"
            >
              {editingItem ? "Update" : "Add"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}