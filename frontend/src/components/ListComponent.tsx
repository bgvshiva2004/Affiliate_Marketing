import { useEffect, useState } from 'react'
import { X, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ContentEditable from 'react-contenteditable'
import { toast } from 'react-toastify'

interface ListItem {
    id : number;
    title : string;
    description : string;
}

interface ListComponentProps {
    isVisible : boolean;
    token : string | null | undefined;
    onClose: () => void;
    onEditItem: (item: ListItem) => void;
}

export const ListComponent = ({isVisible , token , onClose , onEditItem} : ListComponentProps) => {
    const [listItems, setListItems] = useState<ListItem[]>([])

    // console.log("token in list : ", token)

    const fetchUserLists = async () : Promise<ListItem[]> => {
        try{

            const response = await fetch('http://127.0.0.1:8000/api/v1/lists/',{
            method : 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
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


    const handleRemoveItem = async (id : number) => {
        try{
          // const token = Cookies.get('access');
          // if(!token) throw new Error('No token found');
    
          const response = await fetch(`http://127.0.0.1:8000/api/v1/lists/${id}/` , {
            method : 'DELETE',
            headers : {
              'Authorization' : `Bearer ${token}`,
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

    const handleContentChange = (id : number, field : keyof ListItem, value : string) => {
        setListItems(listItems.map(item =>
          item.id === id
            ? { ...item, [field]: value }
            : item
        ))
    }

    useEffect(() => {
        if(isVisible){
            const fetchLists = async () => {
                try {
                    const data = await fetchUserLists();
                    setListItems(data);
                }catch(error){
                    toast.error('Failed to fetch lists');
                    console.error('Error fetching lists : ',error);
                }
            };

            fetchLists();
        }
    } , [isVisible, token])

    return (
        <div className="fixed top-0 left-0 w-full h-full z-[100000] overflow-auto bg-white/80 backdrop-blur-sm p-4 sm:p-6 transition-opacity duration-300 ease-in-out">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-black">Your Lists</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        // onClick={toggleListVisibility}
                        onClick={onClose}
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
                                //   onClick={() => handleEditItem(item)}
                                onClick={() => onEditItem(item)}
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
    )

}