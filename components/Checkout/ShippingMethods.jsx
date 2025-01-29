import DeliverySlot from '@/components/Checkout/DeliverySlot';

export default function ShippingMethods({modal, shippingMethodList, styles, selectMethod, currentIndex, deliverySlot, closeModal}) {

  return (
    <div className={`${modal ? 'flex flex-col h-full':''}`}>
           
           {modal && <h5 className='text-[15px] font-semibold p-[10px]'>Choose Shipping Method</h5>}

           <div className={`${modal ? 'h-full overflow-auto scrollbarHide p-[0_10px]' : 'w-[95%] m-[0px_8px_auto_auto] md:border-b-[1px] md:border-slate-200 md:px-[10px] py-[10px] gap-[10px]'}`}>
                  {shippingMethodList.map((res, index) => (
                    <div key={index} onClick={() => selectMethod(res, index)} className={`h-[50px] cursor-pointer flex items-center gap-[5px] rounded-[5px]`}>
                      <input className={styles.input_radio} checked={index == currentIndex} type="radio" />
                      <h5 className='text-[14px] font-medium capitalize'>{res.shipping_method_name}</h5>
                    </div>
                  ))}

                  {deliverySlot.length != 0 &&
                    <>
                      <h6 className='text-[15px] font-medium pb-[10px]' >Choose a Delivery Slot</h6>
                      <DeliverySlot deliverySlot={deliverySlot} />
                    </>
                  }

         </div>

          {modal && 
           <div className='flex items-center p-[10px]'>
            <button onClick={()=>{closeModal()}} className='primary_btn p-[2px_8px] w-[98%] m-[0_auto] h-[40px] '>Choose Delivery method</button>
           </div> 
          }
    </div>
  )

}