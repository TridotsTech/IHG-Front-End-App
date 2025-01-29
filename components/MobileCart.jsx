import { useMemo } from 'react'
import Image from 'next/image';
import { useSelector } from 'react-redux';

export default function MobileCart({selectedAddress, enabledSlot, setVisibleLogin, setIsOpen, setIsOpenShip, shipping_method_name, deliveryDate, deliveryTime}) {

  const customerDetail = useSelector((state)=> state.customerInfo.customerDetail)

  
  useMemo(() => {

  }, [customerDetail])


  
  return (
    <div className='light_bg' >

        <div className="flex mb-[5px] p-[10px] gap-[10px] bg-[#fff]">
          <div className='flex gap-[8px] w-[80%]'>
           <Image className='h-[35px] w-[35px] object-contain' height={60}  width={60} alt='logo' src={'/Delivery/delivery-location.svg'}></Image>
           <div>
              <h5 className='text-[15px] font-medium'>Delivery Address</h5>
              {selectedAddress ? <p className='m-0 text-[13px]'>{selectedAddress.address} <br></br> {selectedAddress?.city}, {selectedAddress?.state}, {selectedAddress?.country} - {selectedAddress?.zipcode}</p> 
              : <p className='m-0 text-[13px]'>Choose a delivery address</p>
              }
            </div>
          </div>
          <div className='w-[20%] flex items-center justify-end'><button onClick={()=>{localStorage['api_key'] ? setIsOpen(true) : setVisibleLogin(true)}} className='border rounded-[5px] text-[14px] bg-[#f1f1f1] h-[35px] p-[4px_8px]'>{selectedAddress ? 'Change' : 'Choose'}</button></div>
        </div>

        <div className="flex mb-[5px] p-[10px] gap-[10px] bg-[#fff]">
          <div className='flex gap-[8px] w-[80%]'>
           <Image className='h-[35px] w-[35px] object-contain' height={60}  width={60} alt='logo' src={'/Delivery/shipping-method.svg'}></Image>
           <div>
              <h5 className='text-[15px] font-medium'>Shipping Method</h5>
              {shipping_method_name ? <p className='text-[13px]'>{shipping_method_name}</p> 
              :
              <p className='m-0 text-[13px]'>Choose a Shipping Method</p>
             }
            </div>
           </div>
           <div className='w-[20%] flex items-center justify-end'><button onClick={()=>{localStorage['api_key'] ? setIsOpenShip(true) : setVisibleLogin(true)}} className='border rounded-[5px] text-[14px] bg-[#f1f1f1] h-[35px] p-[4px_8px]'>{shipping_method_name ? 'Change' : 'Choose'}</button></div>
         </div>
        

        {enabledSlot && <div className="flex mb-[5px] p-[10px] gap-[10px] bg-[#fff]">
          <div className='flex gap-[8px] w-[80%]'>
           <Image className='h-[35px] w-[35px] object-contain' height={60}  width={60} alt='logo' src={'/Delivery/delivery-slot.svg'}></Image>
           <div>
              <h5 className='text-[15px] font-medium'>Delivery Slot</h5>
              {(deliveryDate != '' || deliveryTime != '') ? <p className='text-[13px]'>{deliveryDate + ' ' + deliveryTime}</p>
              :
              <p className='m-0 text-[13px]'>Choose a delivery Slot</p>
              }
            </div>
          </div>
          <div className='w-[20%] flex items-center justify-end'><button onClick={()=>{localStorage['api_key'] ? setIsOpenShip(true) : setVisibleLogin(true)}} className='border rounded-[5px] text-[14px] bg-[#f1f1f1] h-[35px] p-[4px_8px]'>{(deliveryDate != '' || deliveryTime != '') ? 'Change' : 'Choose'}</button></div>
         </div>
        }
        {/* <h5 className='p-[8px_5px_5px_5px] text-[14px] font-medium bg-[#fff]'>Bill Details</h5>

        <div className='flex items-center flex-wrap p-[0_5px] bg-[#fff]'>
            <h5 className='w-[50%] mb-[2px] text-[14px] gray_color'>Subtotal</h5>
            <h5 className='w-[50%] text-end mb-[2px] text-[14px] openSens'>{currencyFormatter.format(cartValue.total)}</h5>
            <h5 className='w-[50%] mb-[2px] text-[14px] gray_color'>Delivery Charges</h5>
            <h5 className='w-[50%] text-end mb-[2px] text-[14px] openSens'>{currencyFormatter.format(shippingAmt)}</h5>
            <h5 className='w-[50%] mb-[2px] text-[14px] gray_color'>Tax</h5>
            <h5 className='w-[50%] text-end mb-[2px] text-[14px] openSens'>{currencyFormatter.format(cartValue.tax ? cartValue.tax : '0')}</h5>
            <h5 className='w-[50%] mb-[2px] text-[14px] gray_color'>Total</h5>
            <h5 className='w-[50%] text-end mb-[2px] text-[14px] openSens'>{currencyFormatter.format(total)}</h5>
        </div> */}

   
        {/* <div className='lg:hidden h-[60px] bg-[#fff] flex items-center justify-between fixed w-full bottom-0 z-[99] p-[10px] shadow-[0_0_5px_#ddd]'>
             <div className='flex items-center gap-[5px]'>
              <Image className='h-[35px] w-[35px] object-contain' height={60}  width={60} alt='logo' src={'/Profile/my-cart.svg'}></Image>
              <h6 className='primary_color text-[14px] font-medium'>{cartItems.length} Items</h6>
             </div>
            <button onClick={()=>{buttonClickFn()}} className='primary_btn p-[8px_12px]'>{buttonName}</button>
        </div> */}
        
            
    </div>
  )
}

