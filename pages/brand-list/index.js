import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { check_Image, get_brands_list } from '@/libs/api';
import Image from 'next/image';
import MobileHeader from '@/components/Headers/mobileHeader/MobileHeader';
import IsMobile from '@/libs/hooks/resize';
import { useDispatch } from 'react-redux'
import { setBrand, setFilter } from '@/redux/slice/filtersList';

export default function index({ details }) {

  const router = useRouter();
  const isMobile = IsMobile()

  useEffect(() => {
    console.log(details, "details")
  }, [details])

  const dispatch = useDispatch()

  const changeBrand = (item) => {
    router.push('/list')
    // console.log("log", item)
    dispatch(setBrand([item]))
    dispatch(setFilter([]))
}

  return (
    <>
      {isMobile && <MobileHeader back_btn={true} title={'Brands'} empty_div={false} search={true} share={false} />}
      <div className='py-10 md:py-3 main-width lg:max-w-[1350px]'>
        <div className='grid grid-cols-3 lg:grid-cols-6 gap-3'>
          {
            details.map((item, i) => (
              <div key={i} className='border border-[#E9E9E9] rounded-xl cursor-pointer' onClick={() => changeBrand(item.name)}>
                <div className='py-4 px-5'>
                  {item.image && <Image src={check_Image(item.image)} alt={item.name} width={100} height={50} className='w-full h-[50px] object-contain' />}
                  {!item.image && <h1 className='text-center min-h-[50px] flex justify-center items-center text-[20px] font-medium'>{item.name}</h1>}
                  {/* <Image src={check_Image(item.image)} alt={item.name} width={100} height={50} className='w-full h-[50px] object-contain' /> */}
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



export async function getServerSideProps({ req }) {
  const apikey = req.cookies.api_key;
  const apisecret = req.cookies.api_secret;
  const token = (apikey && apisecret) ? `token ${apikey}:${apisecret}` : null

  const data = await get_brands_list(token);
  const details = await data.message || []

  return {
    props: { details },
  }
}
