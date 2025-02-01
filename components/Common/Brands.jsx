import React from 'react'
import ViewAll from './ViewAll'
import Image from 'next/image'

const Brands = ({customCss=""}) => {


    const brandsData = [
        {
            "logo" : "/Home/brands/image (5).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (6).png",
            "no_of_product" : 200,
            "cate" :"Category"
        },
        {
            "logo" : "/Home/brands/image (7).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (8).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (9).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (10).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (11).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (12).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (13).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (14).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (15).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (16).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (17).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (18).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (19).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (20).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (21).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
        {
            "logo" : "/Home/brands/image (22).png",
            "no_of_product" : 200,
            "cate" :"Product"
        },
    ]
  return (
    <div className={`main-width md:px-[10px] ${customCss}`}>
        <div className='py-5'>
          <ViewAll data={{ title: "Shop By Brands" }} viewAll={true} />

          <div className='py-3 '>
              <div className='grid grid-cols-3 lg:grid-cols-6 gap-3'>
                {
                    brandsData.map((item,i)=>(
                        <div key={i} className='border border-[#E9E9E9] rounded-xl cursor-pointer'>
                           <div className='py-4 px-5'>
                           <Image src={item.logo} width={100} height={50} className='w-full' />
                           </div>

                           <div className='bg-[#F0F0F0] py-1 px-3'>
                               <p className='text-[#565656] text-xs lg:text-sm'>{item.no_of_product} + {item.cate}</p>
                           </div>
                        </div>
                    ))
                }
              </div>
          </div>
        </div>
    </div>
  )
}

export default Brands