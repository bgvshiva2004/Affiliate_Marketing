import axios from 'axios'

export default async function shop() {

  

  const products = await axios.get('http://127.0.0.1:8000/product_links_api/')
  console.log(products)

  return (
    <div>
        <div className='flex flex-row justify-around mt-10'>
            <div className='w-1/3 h-[50%] border border-[red] text-center'>
            
              {products.data.map((ele:any,ind:any)=>{

                return (

                    <div key={ind}>
                      {ele.product_name}
                      <br></br>
                      {ele.product_platform}
                    </div>

                )

              })}

            </div>
            <div className='w-1/3 h-[50%] border border-[red] text-center'>hi</div>
        </div>
    </div>
  )
}
