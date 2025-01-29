import React, { useEffect, useState } from 'react'
import { cancelReasonlist, cancel_order } from '@/libs/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image'

export default function WebHeader({order_id, hide}) {

  const [reasonList,setReasonList] = useState([]);  
  const [reasonIndex,setIndex] = useState(-1);
  const [loadSpinner,setLoadSpinner] = useState(false);

  useEffect(()=>{
   getReasons()
  },[])


  
  async function getReasons() {
    let res = await cancelReasonlist();
    // console.log(res)
    if(res && res.message && res.message.status && res.message.status == 'Success'){
      setReasonList(res.message.data)
    }
  }

  const selectReasons = (res,i) =>{
    setLoadSpinner(true)
    res.isActive =! res.isActive;
    reasonList.map((r,index)=>{
      if(i != index){
        r.isActive = false;
      }
    })
    setReasonList(reasonList)
    setIndex(i)
    cancel_orders()
  }

  async function cancel_orders() {
     let reason = reasonList.find(r=>{ return r.isActive })
     if(reason){
       let data = {"order_id": order_id,"cancel_reason": reason.value}
       try {
        let res = await cancel_order(data);
        setLoadSpinner(false)
        if(res && res.message && res.message.status && res.message.status == 'Success'){
         hide(res)
        }
       } catch (error) {
         setLoadSpinner(false)
         throw error
       }
    
     }else{
      setLoadSpinner(false)
      toast.error('Please select any one of cancel reason');
     }
  }

  return (
    <>
      {loadSpinner && <Backdrop />}
      <ToastContainer position={'bottom-right'} autoClose={2000}  />

      <div className={`flex flex-col w-full h-full `}>

        <h6 className='flex items-center text-[15x] font-semibold h-[55px] border-b-[1px] border-b-slate-100 p-[10px]'>Choose Your Reason</h6>

        <div className='body_sec h-[100%] overflow-auto scrollbar-hide'>
         {reasonList.map((res,index)=>{
            return(
              <div onClick={()=>selectReasons(res,index)} key={index} className='flex items-center justify-between gap-[6px] min-h-[30px] cursor-pointer p-[10px] border-b-[1px] border-b-slate-100'>
                {/* <input type="checkbox" checked={index == reasonIndex} className="custom-checkbox w-[16px] h-[16px] rounded-[5px] cursor-pointer"></input> */}
                <span className='text-[14px] font-normal'>{res.label}</span>
                <Image className='h-[10px] object-contain opacity-30' height={14} width={14} alt='logo' src={'/Arrow/arrowBlack.svg'}></Image>
              </div>     
            )
          })
         }
        </div>

        {/* <div className='flex items-center gap-[10px] p-[10px] footer border-t-[1px] border-t-slate-100'>
          <button onClick={()=>{hide()}} className='flex-[0_0_calc(50%_-_5px)] h-[40px] primaryTxt_btn'>Cancel</button>
          <button onClick={()=>{cancel_orders()}} className='flex-[0_0_calc(50%_-_5px)] h-[40px] primary_btn'>Submit</button>
        </div> */}

      </div>
    </>
  )

}

const Backdrop = () => {
  return (
    <div className='backdrop'>
      <div className="h-[100%] flex flex-col gap-[10px] items-center  justify-center">
        <div class="animate-spin rounded-full h-[40px] w-[40px] border-l-2 border-t-2 border-black"></div>
        <span className='text-[15px]'>Loading...</span>
      </div>
    </div>
  )
}
