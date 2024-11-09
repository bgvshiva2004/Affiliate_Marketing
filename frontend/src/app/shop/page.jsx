import {getAllProducts} from '@/api'
import { cookies } from 'next/headers'


export default async function shop() {
  const cookieStore = await cookies()
  const token = cookieStore?.get('access').value
  const products = await getAllProducts(token)
  console.log(products)

  return (
    <div>
        <div className='flex flex-row justify-around mt-10'>
            <div className='w-1/3 h-[50%] border border-[red] text-center'>
            
              {products.map((ele,ind)=>{

                return (
                  
                    <div key={ind}>
                      {ele.product_name}
                      <br></br>
                      {ele.product_platform}
                      <br></br>
                      {ele.product_link}
                    </div>

                )

              })}

            </div>
            <div className='w-1/3 h-[50%] border border-[red] text-center'>hi</div>
        </div>
    </div>
  )
}
