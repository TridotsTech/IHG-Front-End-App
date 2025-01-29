import { useState } from 'react'
import styles from '@/styles/checkout.module.scss';

export default function DeliverySlot({ deliverySlot }) {

  const [activeSlot, setActiveSlot] = useState()
  const [dateList, setDateList] = useState([])


  // useEffect(() => {
    // console.log(deliverySlot)
    // deliverySlot[0].dates_lists.map((r,i)=>{
    //   if(r.isActive && r.isActive == 1){
    //     setActiveSlot(prevState => {return { ...prevState, date: i }});
    //     setDateList(r.slots)

    //     r.slots.map((res,j)=>{
    //       if(res.isActive && res.isActive == 1){
    //         setActiveSlot({...activeSlot,time:j})
    //       }
    //     })

    //   }
    // })
  // }, [])


  function getTime(obj, index) {
    obj.isActive = 1
    deliverySlot[0].dates_lists.map((res, i) => {
      if (i != index) {
        res.isActive = 0
      }
    })

    setActiveSlot(prevState => { return { ...prevState, date: index } });
    setDateList(obj.slots)
    setActiveSlot(prevState => { return { ...prevState, time: -1 } });
  }

  function getDate(obj, index) {
    // obj.isActive = 1
    // dateList.map((res,i)=>{
    //   if(i != index){
    //     obj.isActive = 0
    //   }
    // })

    deliverySlot[0].dates_lists.map((res, i) => {
      if (i == activeSlot.date) {
        res.slots.map((res, j) => {
          if (j == index) {
            res.isActive = 1
          } else {
            res.isActive = 0
          }
        })
      }
    })
  }


  return (
    <>
      <div className={`flex items-center flex-wrap gap-[7px]`}>
        {deliverySlot && deliverySlot[0] && deliverySlot[0].dates_lists.map((res, index) => {
          return (
            <label key={index} onClick={() => { getTime(res, index) }} className={`${((activeSlot && activeSlot.date) == index) ? 'primary_bg text-[#fff]' : 'light_bg'} text-[12px]  cursor-pointer p-[3px_8px] rounded-[5px]`}>{res.format_date}</label>
          )
        })}
      </div>

      {dateList &&
        dateList.map((slot, slotIndex) => {
          return (
            <div key={slotIndex} onClick={() => { getDate(slot, slotIndex), setActiveSlot({ ...activeSlot, time: slotIndex }) }} className={`h-[50px] cursor-pointer flex items-center gap-[5px] rounded-[5px]`}>
              <input checked={(activeSlot && activeSlot.time) == slotIndex} className={styles.input_radio} type="radio" />
              <h5 className='text-[14px] font-medium capitalize'>{slot.slot_label}</h5>
            </div>
          )
        })
      }
    </>
  )

}