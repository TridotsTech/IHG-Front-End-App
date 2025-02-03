import {  useEffect } from 'react';
import { useRouter } from 'next/router'
import { check_Image, get_brands_list } from '@/libs/api';
import Image from 'next/image';


export default function index({ details }) {

  const router = useRouter();

  useEffect(() => {
    console.log(details, "details")
  }, [details])

  return (
    <>
      <div className='py-10 md:py-3 main-width lg:max-w-[1350px]'>
        <div className='grid grid-cols-3 lg:grid-cols-6 gap-3'>
          {
            details.map((item, i) => (
              <div key={i} className='border border-[#E9E9E9] rounded-xl cursor-pointer' onClick={() => router.push(`/list?brand=${item.name}`)}>
                <div className='py-4 px-5'>
                  <Image src={check_Image(item.image)} alt={item.name} width={100} height={50} className='w-full h-[50px] object-contain' />
                </div>

                <div className='bg-[#F0F0F0] py-1 px-3'>
                  <p className='text-[#565656] text-xs lg:text-sm'>{item.item_count} + {"Products"}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )

}



export async function getServerSideProps({req}) {
  const apikey = req.cookies.api_key;
  const apisecret = req.cookies.api_secret;
  const token = (apikey && apisecret) ? `token ${apikey}:${apisecret}` : "token 0c7f0496a397762:199919c53cd169d"

  const data = await get_brands_list(token);
  const details = await data.message || []

  return {
    props: { details },
  }
}
