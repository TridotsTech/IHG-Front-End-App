import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { check_Image } from '@/libs/api';
import Image from 'next/image'
// import { MyContext } from '@/pages/_app';

export default function Myprofile({ profileInfo, navigateToProfile }) {

  // const{cartDemo}=useContext(MyContext)
  

  const router = useRouter();

  const handleEvent=()=>{
 let dashboard=document.getElementById("dashboard")
if(dashboard){
  let dashboardElement=dashboard.innerText
  navigateToProfile(dashboardElement)
}
  }

  const clickTogo = (res,index) =>{
    navigateToProfile(res)
  }

  return (
    <div>
      
      {profileInfo.map((res, index) => {
        return (
          <div onClick={()=>{clickTogo(res,index)}} className={`${res.selected == 1 ? 'lg:bg-[#faf2f1] lg:text-black' : null} flex items-center rounded-[10px] p-[10px] cursor-pointer gap-[10px] lg:hover:bg-[#faf2f1] lg:hover:text-black first:mt-[10px] m-[12px_15px] justify-between`} key={index} >
            
            <div className='flex items-center gap-[13px]'>
             <div className='flex items-center justify-center h-[18px] w-[18px]'><Image className="object-contain h-[18px]" height={20} priority width={20} alt='search' src={res.icon}></Image></div>
             <h6 className={'text-[14px] font-medium'}>{res.title}</h6>
            </div>

            <div className='lg:hidden flex items-center justify-center h-[18px]'><Image className='h-[11px] w-[5px] object-contain' src={'/forwardIcon.svg'} height={5} width={5} alt='View All' /></div>
          </div>
        )
      })}
    </div>
  )
}