import axios from 'axios';
import { cookies } from 'next/headers'

export async function GET(request){
    try{
        const cookieStore = await cookies()
        const token = cookieStore?.get('access')?.value;

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };

        const response = await axios.get(`http://127.0.0.1:8000/api/v1/userDetails/`,{
            headers
        });
        console.log(response.data)
        return new Response(JSON.stringify({ isLoggedIn: true, user: response.data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }catch(error){
        console.error("Error fetching user details:", error);
        return new Response(JSON.stringify({ isLoggedIn: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        });
    }
}