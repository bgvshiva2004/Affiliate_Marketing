import Homepage from '@/components/homePage'
import { cookies } from 'next/headers'

export default async function Page(){
    const cookieStore = cookies()
    const token = cookieStore.get('access')?.value
    // console.log("token : ",token)
    return <Homepage initialToken = {token}/>    
}