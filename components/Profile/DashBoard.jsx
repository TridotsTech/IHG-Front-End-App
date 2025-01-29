import { useEffect, useState } from "react"
import { getDashBoardData } from "@/libs/api"
import Orders from "./Orders"
import { useRouter } from 'next/router'

export default function Dashboard(){

    const [data,setData]=useState(null);
    const router = useRouter();
   
    useEffect(()=>{
        dashboardData()
    },[])

    const dashboardData=async()=>{
        const response=await getDashBoardData()
        const res =await response.message.data
        if(res && res.length !=0 ){
            setData(res)
        }
       
    }
    
    return (<>
   <div>
    {data &&( <div className="flex md:flex-wrap w-[100%] gap-2 items-center justify-center">
        <div className="md:flex-[0_0_calc(100%_-_5px)] lg:flex-[0_0_calc(25%_-_10px)] border text-center p-[10px] rounded-md ">
            <h1 className="text-[25px] text-[#090808] mt-[16px] mb-[10px] font-semibold">{data.today_orders_count}</h1>
            <p className="text-[14px] text-[#181b29] font-normal ">Today Orders</p>
        </div>
        <div className="md:flex-[0_0_calc(100%_-_5px)] lg:flex-[0_0_calc(25%_-_10px)] border text-center p-[10px] rounded-md ">
            <h1 className="text-[25px] text-[#090808] mt-[16px] mb-[10px] font-semibold">{data.week_orders_count}</h1>
            <p className="text-[14px] text-[#181b29] font-normal ">This Week Orders</p>
        </div>
        <div className="md:flex-[0_0_calc(100%_-_5px)] lg:flex-[0_0_calc(25%_-_10px)] border text-center p-[10px] rounded-md ">
            <h1 className="text-[25px] text-[#090808] mt-[16px] mb-[10px] font-semibold">{data.monthly_count}</h1>
            <p className="text-[14px] text-[#181b29] font-normal ">This Month Orders</p>
        </div>
        <div className="md:flex-[0_0_calc(100%_-_5px)] lg:flex-[0_0_calc(25%_-_10px)] border text-center p-[10px] rounded-md ">
            <h1 className="text-[25px] text-[#090808] mt-[16px] mb-[10px] font-semibold">{data.all_count}</h1>
            <p className="text-[14px] text-[#181b29] font-normal ">All Time Orders</p>
        </div>
    </div>)}
   
    <div className="px-[10px] pt-[15px] pl-[10px]">
        <div className="flex items-center justify-between">
            <h1 className="text-[18px] text-[#090808] font-medium">Recent Orders</h1>
            <div className="">
                <button onClick={()=>{router.push('/profile?my_account=orders')}} className="primary_btn text-[13px] text-white font-bold py-[4px] px-[10px] rounded-[5px]">View All</button>
            </div>
            
        </div>
         <Orders dashboard={true}/>
    </div>
   </div>
    </>)
}