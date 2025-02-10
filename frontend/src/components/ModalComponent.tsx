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
import { X, Type, AlignLeft } from "lucide-react";

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

const processContent = (content: string) => {
  return content
    .replace(/\n/g, '<br>')
    .replace(/(<br\s*\/?>(\s*)){3,}/g, '<br><br>')
    .replace(/\s*<br\s*\/?>\s*/g, '<br>')
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
    const normalizedValue = value
      .replace(/<div>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n');

    setNewItem((prev) => ({ ...prev, [field]: normalizedValue }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-[95%] mx-auto max-h-[90vh] !z-[1000000] bg-white/95 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20">
        <DialogHeader className="relative border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-[#0355bb] pl-1">
            <div className="p-1.5 rounded-lg bg-[#0355bb]/10">
              {editingItem ? (
                <Type className="w-5 h-5 text-[#0355bb]" />
              ) : (
                <AlignLeft className="w-5 h-5 text-[#0355bb]" />
              )}
            </div>
            {editingItem ? "Edit the List" : "Add New List"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-5">
          <div className="px-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              Title
            </label>
            <ScrollArea className="h-[50px] border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#0355bb]/20 focus-within:border-[#0355bb] transition-all duration-200">
              <div className="relative w-full">
                <ContentEditable
                  html={newItem.title}
                  onChange={(e) => handleNewItemChange("title", e.target.value)}
                  tagName="div"
                  className="text-base sm:text-lg outline-none p-3 min-h-[40px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 whitespace-pre-wrap overflow-wrap-break-word"
                  data-placeholder="Give the title..."
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    width: '100%'
                  }}
                />
              </div>
            </ScrollArea>
          </div>
          
          <div className="px-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              Description
            </label>
            <ScrollArea className="h-[200px] sm:h-[250px] border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#0355bb]/20 focus-within:border-[#0355bb] transition-all duration-200">
              <div className="relative w-full">
                <ContentEditable
                  html={newItem.description}
                  onChange={(e) => handleNewItemChange("description", e.target.value)}
                  tagName="div"
                  className="text-sm sm:text-base text-gray-800 outline-none p-4 min-h-full empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 whitespace-pre-wrap overflow-wrap-break-word [text-rendering:optimizeLegibility] antialiased"
                  data-placeholder="Give the Description..."
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    width: '100%'
                  }}
                />
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 pt-4">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 text-sm sm:text-base border-gray-200 hover:bg-gray-50 rounded-lg font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddItem}
              className="flex-1 text-sm sm:text-base bg-[#0355bb] hover:bg-[#0243a3] text-white transition-colors rounded-lg font-medium shadow-sm"
            >
              {editingItem ? "Update" : "Add"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};