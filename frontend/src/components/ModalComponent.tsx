
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import ContentEditable from 'react-contenteditable'
import { toast } from 'react-toastify'
import { useState  } from "react"

interface ListItem {
  id?: number;
  title: string;
  description: string;
}

interface ModalComponentProps {
    isOpen : boolean;
    onClose: () => void;
    token : string | null | undefined;
    editingItem: ListItem | null;
    onItemSaved: (item: ListItem) => void;
}

export const ModalComponent = ({ isOpen , onClose , token , editingItem ,onItemSaved }: ModalComponentProps) => {
    const [newItem, setNewItem] = useState<ListItem>({ 
        title: editingItem?.title || 'Sample Title', 
        description: editingItem?.description || 'Sample Description' 
    })

    const saveListItem = async (item : ListItem) : Promise<ListItem> => {
        try{
          // console.log("item : ",item)
          const response = await fetch('http://127.0.0.1:8000/api/v1/lists/',{
            method : 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
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

    const handleAddItem = async () => {
        const title = newItem.title.trim();
        const description = newItem.description.trim() || 'No description provided';
    
        if (!title) {
          toast.error('Title is required');
          return;
        }
    
        try {
          const savedItem = await saveListItem({ title, description });
          onItemSaved(savedItem);
          toast.success(editingItem ? 'Item updated successfully' : 'Item added successfully');
          onClose();
        } catch (error) {
          toast.error('Failed to save item');
        }
    }

    const handleNewItemChange = (field: keyof ListItem, value: string) => {
        setNewItem(prev => ({ ...prev, [field]: value }))
    }

    return(
        <Dialog open={isOpen} onOpenChange={onClose}>
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
    )

}