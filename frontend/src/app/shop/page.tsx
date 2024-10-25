import {getAllProducts} from '@/api'
import { headers } from 'next/headers'
export default async function shop() {
  
  const products = await getAllProducts()
  console.log(products)

  return (
    <div>
        <div className='flex flex-row justify-around mt-10'>
            <div className='w-1/3 h-[50%] border border-[red] text-center'>
            
              {products.map((ele:any,ind:any)=>{

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
