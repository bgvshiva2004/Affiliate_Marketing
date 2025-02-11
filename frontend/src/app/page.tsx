import Homepage from '@/components/homePage'
import { cookies } from 'next/headers'

interface ListItem {
    id : number;
    title : string;
    description : string;
}


async function fetchUserLists(token: string): Promise<ListItem[]> {
    try{
        const response = await fetch('https://affiliatemarketing-production.up.railway.app/backend/api/v1/lists/' , {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Response status: ${response.status} ${response.statusText}`);
            throw new Error('Failed to fetch the lists');
        }

        const data = await response.json();
        // console.log('Fetched data:', data);
        return data;

    }catch(error){
        console.error('Error Fetching the User Lists : ' , error);
        throw error;
    }
}


export default async function Page(){
    const cookieStore = cookies()
    const token = cookieStore.get('access')?.value
    // console.log("token : ",token)
    let initialLists: ListItem[] = [];

    if(token){
        try{
            initialLists = await fetchUserLists(token);
        }catch(error){
            console.error('Error fetching initial lists : ', error);
        }
    }
    
    return <Homepage initialToken = {token} initialLists = {initialLists}/>    
}