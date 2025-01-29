import {useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
// import { check_Image } from '@/libs/common';
import Image from 'next/image'
import {  check_Image, get_order_info,get_return_request_info, getColor, get_razorpay_settings, get_cart_items, update_order_status, reorder, currencyFormatter } from '@/libs/api';
import Rodal from 'rodal';
// import 'rodal/lib/rodal.css';
import AlertUi from '@/components/Common/AlertUi';
import { useDispatch } from 'react-redux';
import { setCartItems } from '@/redux/slice/cartSettings'
import Cancelorder from '@/components/order/Cancelorder'
import Makereturn from '@/components/order/Makereturn'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { app_name, r_pay_color } from "@/libs/config/siteConfig"

export default function OrderDetail({hide,visible,order_id,loadPage, thankyou, webSettings}) {

  return (
    <div className='orderDetail-popup'>
      {loadPage ?
        <OrderDetailScreen webSettings={webSettings} toast={toast} setCartItems={setCartItems} loadPage={loadPage} order_id={order_id} thankyou={thankyou} /> :
        <Rodal visible={visible} enterAnimation='lg:slideRight md:slideSown' onClose={()=>{hide(undefined)}}>
          <OrderDetailScreen webSettings={webSettings} toast={toast} setCartItems={setCartItems} order_id={order_id} thankyou={thankyou} />
        </Rodal>
      }
      </div>
    
  )
}


const OrderDetailScreen = ({order_id,loadPage, thankyou, setCartItems, toast, webSettings}) => {

  const dispatch = useDispatch();
  const router = useRouter();

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  });


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const [razorpay_settings, setRazorpay_settings] = useState({});
  const [alertMsg, setAlertMsg] = useState({});
  const [enableModal, setEnableModal] = useState(false);
  const [enableModalPopUp, setEnableModalPopUp] = useState(false);
  const [index,setIndex] = useState(-1);
  
  const [orderInfo,setOrderInfo] = useState([]);
  let [Skeleton,setSkeleton] = useState(true);
  let [eligibleItems,setEligibleItems] = useState([]);

  useEffect(() => {
      order_info(order_id);
      get_razor_pay_values();
      getReturnRequestInfo();
  },[])  

  useMemo(()=>{

  },[eligibleItems])

  async function getReturnRequestInfo(){
    let data = { order_id: order_id};
    const resp = await get_return_request_info(data);
      if (resp && resp.message && resp.message.eligible_items && resp.message.eligible_items.length != 0) {
        setEligibleItems(resp.message.eligible_items)
    } else {
      setEligibleItems([])
    }
  }

  async function order_info(order_id){
      let data = { order_id: order_id};
      const resp = await get_order_info(data);
        if (resp && resp.message && resp.message.info) {
          resp.message.info.delivery_slot = resp.message.delivery_slot ? resp.message.delivery_slot : []
          setOrderInfo(resp.message.info);
          setSkeleton(false)
        }else{
          setSkeleton(false)
        }
  }
  
  async function get_razor_pay_values() {
    let razorpay = await get_razorpay_settings();
    setRazorpay_settings(razorpay);
  }



  function payment_error_callback(error) {
    setAlertMsg({ message: 'Payment failed' });
    setEnableModal(true);
  }

  async function payment_Success_callback(response, amount, order_id) {
    setSkeleton(true);
    let params = {
      "transaction_id": response.razorpay_payment_id,
      "order_id": order_id,
    }
    const resp = await update_order_status(params);
    if (resp && resp.message && resp.message.status && resp.message.status == true) {
      setAlertMsg({ message: 'Payment received successfully', navigate: true });
      setEnableModal(true);
      orderInfo.payment_status = 'Paid'
      orderInfo.outstanding_amount = 0;
      setOrderInfo(orderInf)
      setIndex(index + 1);
      setSkeleton(false);
    }else{
      setSkeleton(false);

    }
  }

  async function reorderFn(order_id) {
    let params = {
      customer:localStorage['customerRefId'],
      "order_id": order_id,
    }
    const resp = await reorder(params);
    if (resp && resp.message && resp.message.status && resp.message.status == "Success") {
      get_cart_item()
      router.push('profile?my_account=mycart')
    }else if (resp && resp.message && resp.message.status && resp.message.status == "Failed") {
      toast.error(resp.message.message);
    }
  }

  async function get_cart_item() {
    let res = await get_cart_items();
    if(res && res.message && res.message.status && res.message.status == "success"){
      dispatch(setCartItems(res.message));
    }
  }

  const load_razorpay = async (amount, description, order_id) => {
    // console.log(razorpay_settings.api_key)
    // let r_pay_color = '#54b41f';
    // const app_name = 'Go1 Market';
    var options = {
      "key": razorpay_settings.api_key,
      "amount": (amount * 100).toString(),
      "currency": "INR",
      "name": app_name,
      "description": "Payment for" + description,
      "image": (razorpay_settings.site_logo ? check_Image(razorpay_settings.site_logo) : null),
      "prefill": { "name": localStorage['full_name'], "email": localStorage['userid'] },
      "theme": { "color": r_pay_color },
      "modal": { "backdropclose": false, "ondismiss": () => { payment_error_callback(description) } },
      "handler": async (response, error) => {
        if (response) {
          payment_Success_callback(response, amount, order_id)
          // response.razorpay_payment_id
        } else if (error) {
          payment_error_callback(error)
        }

      }
    };

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => { const rzp = new window.Razorpay(options); rzp.open(); };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };

  }

  function closeModal(value) {
    setEnableModal(false)
    setEnableModalPopUp(false)
    if (value == 'Yes') {
      setCancelOrderVisible(true)
    }

  }

  function closeModal1(value) {
    setEnableModal(false)
  }


  function sanitizeHtml(htmlValue){
    const stringWithHtmlTags = htmlValue;
    const withoutTags = stringWithHtmlTags.replace(/<\/?[^>]+(>|$)/g, "");
    return withoutTags;
  }

  const [cancelOrderVisible,setCancelOrderVisible] = useState(false);
  
  useEffect(()=>{
  if(typeof window != undefined){

    if(cancelOrderVisible){
      document.body.classList.add("active_visible")
    }else{
      document.body.classList.remove("active_visible")
    }
  }
  },[cancelOrderVisible])


  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) { 
      hide()// Call your function to hide the popup
    }
  });

  function hide(res){
    setCancelOrderVisible(false);
    if(res && res.message && res.message.status && res.message.status == 'Success'){
      toast.success(res.message.message);
      setOrderInfo((prevDiscount) => ({ ...prevDiscount, status:'Cancelled'}));
    }
  }

  const [makeReturnVisible,setMakeReturnVisible] = useState(false);

  function hideMAkeReturn(res){
    setMakeReturnVisible(false);
    if(res && res.message && res.message.status && res.message.status == 'Success'){
      order_info(order_id);
      getReturnRequestInfo()
      toast.success(res.message.message);
      // setOrderInfo((prevDiscount) => ({ ...prevDiscount, status:'Cancelled'}));
    }
  }

  function cancelOrder(){
    setAlertMsg({ message: 'Do you want to cancel the order'});
    setEnableModalPopUp(true)
  }

  return (
    <>

    {/* <ToastContainer position={'bottom-right'} autoClose={2000}  /> */}

    {enableModal &&
          <AlertUi isOpen={enableModal} closeModal={(value) => closeModal1(value)} headerMsg={'Alert'}  button_2={'Ok'} alertMsg={alertMsg} />
    }

    {enableModalPopUp &&
          <AlertUi isOpen={enableModalPopUp} closeModal={(value) => closeModal(value)} headerMsg={'Alert'} button_1={'No'} button_2={'Yes'} alertMsg={alertMsg} />
    }

    {cancelOrderVisible && <div className='cancelorder-popup'>
      <Rodal visible={cancelOrderVisible} enterAnimation='lg:slideRight md:slideSown' onClose={(val)=>{hide(val)}}>
        <Cancelorder order_id={order_id} hide={hide} />
      </Rodal>
     </div>
    }

    {makeReturnVisible && <div className='cancelorder-popup'>
      <Rodal visible={makeReturnVisible} enterAnimation='lg:slideRight md:slideSown' onClose={(val)=>{hideMAkeReturn(val)}}>
        <Makereturn order_id={order_id} eligibleItems={eligibleItems} hide={hideMAkeReturn} />
      </Rodal>
     </div>
    }

    {Skeleton ? <SkeletonLoader /> : orderInfo.length == 0? <div className='w-[100%] h-[300px] flex items-center justify-center'><Image src={"/EmptyImg/no-blog-01-01.svg"} width={100} height={100} alt='empty'/></div>:
     <div className='flex flex-col h-[100%]'>
       {!loadPage && 
        <div className='header h-[55px] border-b-[1px] border-b-slate-100 flex items-center lg:px-[10px]'>
         <h6 className='text-[16px] font-semibold'>Order Detail({orderInfo.name})</h6>
        </div>
       }

       {thankyou && <Notify orderInfo={orderInfo} load_razorpay={(amount, description, order_id)=>{load_razorpay(amount, description, order_id)}} /> }

       <div className='body_sec h-[100%] overflow-auto scrollbar-hide md:bg-[#eaeaea66] pb-[10px]'>
          <div className="p-[10px] flex md:flex-col gap-[10px]">
            <div className="flex gap-[10px] flex-wrap flex-[0_0_calc(50%_-_7px)] md:flex-[0_0_calc(100%_-_0px)]">
              <div className="flex-[0_0_calc(50%_-_7px)] md:bg-white md:p-[10px] md:rounded-[5px]">
                <h5 className="text-center pb-[5px] text-[15px] font-medium ">Shipping Method</h5>
                <h5 className="text-center gray_color pb-[5px] text-[14px] font-normal">{orderInfo.shipping_method_name}</h5>
              </div>
              <div className="flex-[0_0_calc(50%_-_7px)] md:bg-white md:p-[10px] md:rounded-[5px]">
                <h5 className="text-center pb-[5px] text-[15px] font-medium">Order Status</h5>
                <div className='flex items-center justify-center gap-[5px]'><div style={{background:orderInfo.status ? getColor(orderInfo.status)  : '#ddd'}} className={`h-[10px] w-[10px] rounded-[50%]`}></div><h6 className='text-[14px] gray_color'>{orderInfo.status}</h6></div>
              </div>
              <div className="flex-[0_0_calc(50%_-_7px)] md:bg-white md:p-[10px] md:rounded-[5px]">
                <h5 className="text-center pb-[5px] text-[15px] font-medium">Payment Method</h5>
                <h5 className="text-center text-[14px] font-normal gray_color">{orderInfo.payment_method_name}</h5>
              </div>
              <div className="flex-[0_0_calc(50%_-_7px)] md:bg-white md:p-[10px] md:rounded-[5px]">
                <h5 className="text-center pb-[5px] text-[15px] font-medium">Payment Status</h5>
                <div className='flex items-center justify-center gap-[5px]'><div style={{background:orderInfo.payment_status ? getColor(orderInfo.payment_status)  : '#ddd'}} className={`h-[10px] w-[10px] rounded-[50%]`}></div><h6 className='text-[14px] gray_color'>{orderInfo.payment_status}</h6></div>
              </div>
            </div>
            <div className="flex flex-[0_0_calc(50%_-_7px)] md:flex-wrap md:flex-[0_0_calc(100%_-_0px)] gap-[10px]">

              <div className="flex-[0_0_calc(50%_-_7px)] md:flex-[0_0_calc(100%_-_0px)] md:bg-white md:p-[10px] md:rounded-[5px]">
                <h5 className="text-[15px] pb-[5px] font-medium">Delivery Address</h5>
                <h5 class="text-[14px] font-normal gray_color">{orderInfo?.shipping_first_name} {orderInfo?.shipping_last_name}</h5>
                <h5 class="text-[14px] font-normal gray_color"><span class="text-[14px] font-normal gray_color">{orderInfo?.shipping_shipping_address}{orderInfo?.shipping_city} - {orderInfo?.shipping_zipcode}</span></h5>
                <h5 class="text-[14px] font-normal gray_color">{orderInfo?.shipping_phone}</h5>
              </div>

              <div className="flex-[0_0_calc(50%_-_7px)] md:flex-[0_0_calc(100%_-_0px)] md:bg-white md:p-[10px] md:rounded-[5px]">
                <h5 className="text-[15px] pb-[5px] font-medium">Billing Address</h5>
                <h5 class="text-[14px] font-normal gray_color">{orderInfo?.first_name} {orderInfo?.last_name}</h5>
                <h5 class="text-[14px] font-normal gray_color"><span class="text-[14px] font-normal gray_color">{orderInfo?.address}{orderInfo?.city} - {orderInfo?.zipcode}</span></h5>
                <h5 class="text-[14px] font-normal gray_color">{orderInfo?.phone}</h5>
              </div>

            </div>
          </div>

          <div className="md:mx-[10px] md:p-[10px] md:bg-white md:rounded-[5px]">
            
             <div className='flex md:flex-col lg:items-center lg:justify-between lg:px-[10px] md:gap-[10px]   '>
               <div>
                 <h5 className="text-[15px] pb-[3px] font-medium">Item Details</h5>
                 <h6 className="text-[12px] font-medium">Ordered on <span className='text-[12px]'>{formatDate(orderInfo.order_date)} , {orderInfo.order_time}</span></h6>
               </div>

               <div className='flex items-center md:hidden justify-end lg:justify-between gap-[10px]'>
                 {(webSettings && webSettings.enable_returns_system == 1 && orderInfo.status == 'Completed' && eligibleItems.length != 0) && <div className=''><button onClick={()=>{setMakeReturnVisible(true)}} className={`bg-gray-500  text-white p-[2px_20px] text-[12px] h-[35px] w-full rounded-[5px]`}>Make Return</button> </div>}
                 {(webSettings && webSettings.enable_reorder == 1) && <div className=''><button onClick={()=>{reorderFn(orderInfo.name)}} className={`primary_btn text-white p-[2px_20px] text-[15px] h-[35px] w-full rounded-[5px]`}>Reorder</button> </div>}
                 {(webSettings && webSettings.allow_cancel_order == 1 && orderInfo.status == 'Placed') && <div className=''><button onClick={()=>{cancelOrder()}} className={` p-[2px_20px] text-[15px] h-[35px] secondary_btn w-full rounded-[5px]`}>Cancel Order</button> </div>}
               </div>
             </div>

             <div className='flex items-center  h-[35px] md:pt-[5px] md:border-b md:hidden bg-[#f7f7f7] mt-[5px]'>
               <h5 className="text-center flex-[0_0_calc(40%_-_0px)] text-[14px] font-medium">ITEM NAME</h5>
               <h5 className="text-center flex-[0_0_calc(20%_-_0px)] text-[14px] font-medium">PRICE</h5>
               <h5 className="text-center flex-[0_0_calc(20%_-_0px)] text-[14px] font-medium">QUANTITY</h5>
               <h5 className="text-center flex-[0_0_calc(20%_-_0px)] text-[14px] font-medium">TOTAL</h5>
             </div>
             {orderInfo.order_item && orderInfo.order_item.length != 0 && 
               orderInfo.order_item.map((item,index)=>{
                return(
                  <>
                 <div key={index} className='flex md:hidden  items-center border-b-[1px] border-b-slate-100'>
                  <div key={index}className={`flex flex-[0_0_calc(40%_-_0px)] items-center gap-[10px] p-[8px] relative`}>
                       <div className='md:hidden flex  items-center justify-center h-[95px] w-[95px]'><Image className='h-[85px] w-[85px] object-contain' height={100}  width={100} alt='logo' src={check_Image(item.item_image)}></Image></div>
                       <div className='w-full'>
                        <h3 className='text-[14px] my-[5px] font-medium line-clamp-1 capitalize'>{item.item_name}</h3>
                        {item.attribute_description && <span className='gray_color text-[12px] pb-[5px] line-clamp-1' dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.attribute_description)}} ></span>}
                       </div>
                  </div>
                  <h5 className="text-center flex-[0_0_calc(20%_-_0px)] text-[14px] font-normal openSens">{currencyFormatter.format(item.price)}</h5>
                  <h5 className="text-center flex-[0_0_calc(20%_-_0px)] text-[14px] font-normal">{item.quantity}</h5>
                  <h5 className="text-center flex-[0_0_calc(20%_-_0px)] text-[14px] font-normal openSens">{currencyFormatter.format(item.quantity * item.price)}</h5>
                </div>
                <div key={item.item_name} className='lg:hidden flex items-center justify-center gap-1  py-[10px] '>
                  <div>
                  <div className=' flex-[0_0_calc(20%_-_10px)]  items-center justify-center h-[70px] w-[70px]'><Image className='h-[85px] w-[85px] object-contain' height={100}  width={100} alt='logo' src={check_Image(item.item_image)}></Image></div>
                  </div>
                  <div className='flex-[0_0_calc(80%_-_10px)]  flex justify-start flex-col'>
                  <h3 className='text-[14px] my-[5px] font-medium  capitalize'>{item.item_name}</h3>
                        {item.attribute_description && <span className='gray_color text-[12px] pb-[5px] line-clamp-1' dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.attribute_description)}} ></span>}
                     <div className='flex gap-5 '>
                        <div className='bg-[#ecffec] px-[10px]'>
                            <p className='text-[9px] text-[#4caf50]'>Price</p>
                        <h5 className=" text-[13px] font-normal openSens text-center text-[#4caf50]">{currencyFormatter.format(item.price)}</h5>
                        </div>
                        <div className='bg-[#ecffec] px-[10px]'>
                          <p className='text-[9px] text-[#4caf50]'>Quanity</p>
                          <h5 className=" text-[13px] font-normal text-center text-[#4caf50]">{item.quantity}</h5>
                        </div>
                        <div className='bg-[#ecffec] px-[10px]'>
                          <p className='text-[9px] text-[#4caf50]'>Amount</p>
                          <h5 className=" text-[13px] font-normal openSens text-center text-[#4caf50]">{currencyFormatter.format(item.quantity * item.price)}</h5>
                        </div>
                     </div>
                  </div>
                </div>
                </>
                )})
             }

             {orderInfo.delivery_slot && orderInfo.delivery_slot.length != 0 &&
              <div className='lg:p-[10px] md:pt-[10px]'>
                <h5 className="text-[15px] pb-[3px] font-medium">Delivery slot</h5>
                {orderInfo.delivery_slot.map((item,index)=>{
                  return(
                    <h6 key={index} className="text-[12px] font-medium"><span className='text-[12px]'>{formatDate(item.delivery_date)} , {item.from_time}  {item.from_time ? (' - ' + item.from_time) : ''}</span></h6>
                   )
                })}
              </div>
             }

          </div>

          <div className='flex items-center justify-between p-[10px]  border-b-[1px] border-b-slate-100 bg-white md:mx-[10px] mt-[10px] md:rounded-[5px_5px_0_0]'>
            <h5 className="text-[15px]  font-medium">Payment Details</h5>
            {(orderInfo.outstanding_amount > 0 && (orderInfo.payment_method_name == 'Credit/Debit Card/Net Banking' || orderInfo.payment_method_name == 'Razor Pay'  || orderInfo.payment_method_name == 'Online payment') ) && <div className=''><button onClick={()=>{load_razorpay(orderInfo.outstanding_amount,'Place Order',orderInfo.name)}} className={`primary_btn text-white p-[2px_20px] text-[12px] h-[30px] w-full rounded-[5px]`}>Pay Now</button> </div>}
          </div>  

          <div className='flex items-center flex-wrap mx-[10px] bg-white lg:rounded-[5px] md:p-[10px]'>
            <h5 className='w-[50%] mb-[4px] text-[14px] gray_color'>Total Items</h5>
           {orderInfo.order_item.length != 0  && <h5 className='w-[50%] text-end mb-[4px] text-[14px] font-sans'>{orderInfo.order_item.length  }</h5>}
            <h5 className='w-[50%] mb-[4px] text-[14px] gray_color'>Sub Total</h5>
            <h5 className='w-[50%] text-end mb-[4px] text-[14px] font-sans'>{formatter.format(orderInfo.order_subtotal)}</h5>
            <h5 className='w-[50%] mb-[4px] text-[14px] gray_color'>Delivery charges</h5>
            <h5 className='w-[50%] text-end mb-[4px] text-[14px] font-sans'>{formatter.format(orderInfo.shipping_charges ? orderInfo.shipping_charges : 0)}</h5>
            {orderInfo.discount > 0 && <><h5 className='w-[50%] mb-[4px] text-[14px] gray_color'>Discount</h5>
              <h5 className='w-[50%] text-end mb-[4px] text-[14px] font-sans'>{formatter.format(orderInfo.discount)}</h5></>
            }
            <h5 className='w-[50%] mb-[4px] text-[14px] gray_color'>Tax</h5>
            <h5 className='w-[50%] text-end mb-[4px] text-[14px]  font-sans'>{formatter.format(orderInfo.total_tax_amount)}</h5>
            {orderInfo.paid_using_wallet > 0 && <><h5 className='w-[50%] mb-[4px] text-[14px] gray_color'>Paid Using Wallet</h5>
            <h5 className='w-[50%] text-end mb-[4px] text-[14px] openSens'>{currencyFormatter.format(orderInfo.paid_using_wallet)}</h5></>
            }
            {orderInfo.redeem_loyalty_points == 1 &&
            <> 
              <h5 className='w-[50%] mb-[4px] text-[14px] gray_color'>Loyalty Amount</h5>
              <h5 className='w-[50%] text-end mb-[4px] text-[14px] openSens'>{currencyFormatter.format(orderInfo.paid_using_wallet)}</h5>
            </> }
            {orderInfo.order_additional_charges && orderInfo.order_additional_charges.length != 0 &&
               orderInfo.order_additional_charges.map((item,index)=>{
                return(
                  <>
                   <h5 key={index} className='w-[50%] mb-[4px] text-[14px] gray_color'>{item.charge_name}</h5>
                   <h5 key={index + 's'}className='w-[50%] text-end mb-[4px] text-[14px] openSens'>{currencyFormatter.format(item.amount)}</h5>
                  </>
                )})
            }
          </div>

          
          <div className='flex items-center flex-wrap border-t-[1px] border-t-slate-100 p-[10px]  md:bg-white md:mx-[10px] '> 
              <h5 className='w-[50%] mb-[4px] text-[14px] gray_color'>Total</h5>
              <h5 className='w-[50%] text-end mb-[4px] text-[14px] openSens'>{currencyFormatter.format(orderInfo.total_amount)}</h5>
              <h5 className='w-[50%] mb-[4px] text-[14px] gray_color'>Paid Amount</h5>
              <h5 className='w-[50%] text-end mb-[4px] text-[14px] openSens'>{currencyFormatter.format(orderInfo.paid_amount)}</h5>
              {orderInfo.outstanding_amount > 0 && <> <h5 className='w-[50%] mb-[4px] text-[14px] gray_color'>Outstanding amount</h5>
              <h5 className='w-[50%] text-end mb-[4px] text-[14px] openSens'>{currencyFormatter.format(orderInfo.outstanding_amount)}</h5></>
              }
          </div>
          
       </div>
      
       {(webSettings && (webSettings.enable_returns_system == 1 || webSettings.enable_reorder == 1 || webSettings.allow_cancel_order == 1 )) && <div className='flex items-center p-[10px] lg:hidden justify-end gap-[10px] fixed bottom-0 bg-white w-full h-[55px] shadow-2xl'>
                 {(webSettings && webSettings.enable_returns_system == 1 && orderInfo.status == 'Completed' && eligibleItems.length != 0) && <div className=''><button onClick={()=>{setMakeReturnVisible(true)}} className={`primary_btn text-white p-[2px_20px] text-[12px] h-[35px] w-full rounded-[5px]`}>Make Return</button> </div>}
                 {(webSettings && webSettings.enable_reorder == 1) && <div className=''><button onClick={()=>{reorderFn(orderInfo.name)}} className={`bg-gray-500 text-white p-[2px_20px] text-[12px] h-[35px] w-full rounded-[5px]`}>Reorder</button> </div>}
                 {(webSettings && webSettings.allow_cancel_order == 1 && orderInfo.status == 'Placed') && <div className=''><button onClick={()=>{cancelOrder()}} className={`secondary_btn p-[2px_20px] text-[12px] h-[35px] w-full rounded-[5px]`}>Cancel Order</button> </div>}
       </div>}

       {/* <div className='body_sec h-[100%] overflow-auto scrollbar-hide'>

         <div className='border-b-[1px] border-b-slate-100 p-[10px_15px]'>
             <div className='flex items-center justify-between'>
                 <h6 className='text-[14px] font-semibold'>{orderInfo.name}</h6>
                 <div className='flex items-center gap-[5px]'><div style={{background:orderInfo.status ? getColor(orderInfo.status)  : '#ddd'}} className={`h-[10px] w-[10px] rounded-[50%]`}></div><h6 className='text-[14px]'>{orderInfo.status}</h6></div>
                 </div>

                 <h6 className='text-[15px]  gray_color'>{formatDate(orderInfo.order_date)}</h6>
                
                <div className='flex items-center justify-between'>
                   <p class="flex items-center gap-[10px] text-[13px]">
                    <span class="flex items-center gap-[10px] text-[13px]"><Image height={10} width={15} src={'/order/' + (orderInfo.payment_method_name == 'Razor Pay' ? 'razorpay' :  'cash')+'.svg'}></Image> { orderInfo.payment_method_name}</span>
                    <span className='flex items-center gap-[5px]'><span style={{background:orderInfo.payment_status ? getColor(orderInfo.payment_status)  : '#ddd'}} className={`h-[10px] w-[10px] rounded-[50%]`}></span><h6 className='text-[14px]'>{orderInfo.payment_status}</h6></span>
                   </p>
                   {orderInfo.payment_status != 'Paid' && <div className=''><button onClick={()=>{load_razorpay(orderInfo.outstanding_amount,'Place Order',orderInfo.name)}} className={`primary_btn text-white p-[2px_20px] text-[12px] h-[30px] w-full rounded-[5px]`}>Pay Now</button> </div>}
                </div>

         </div>

        {orderInfo.shipping_address && <div className='border-b-[1px] border-b-slate-100 p-[10px_15px]'>
           <h6 className='text-[14px] font-semibold'>Shipping Address</h6>

           <h6 className='text-[14px] font-semibold'>{orderInfo.first_name + orderInfo.last_name}</h6>

            <h6 class="m-0 text-[13px]">
             {orderInfo.shipping_address.address}<br></br> 
             {orderInfo.shipping_address.city} - {orderInfo.shipping_address.zipcode}<br></br>
             {orderInfo.shipping_address.phone}
           </h6>
          </div>
         }

         {orderInfo.order_item && orderInfo.order_item.length != 0 && 
          <div className='border-b-[1px] border-b-slate-100 p-[10px_15px]'>
            
            <div className='flex items-center justify-between'>
              <h6 className='text-[14px] font-semibold'>Order Items</h6>
              <div className=''><button onClick={()=>{load_razorpay(orderInfo.outstanding_amount,'Place Order',orderInfo.name)}} className={`primary_btn text-white p-[2px_20px] text-[12px] h-[30px] w-full rounded-[5px]`}>Reorder</button> </div>
            </div>  
           
           {orderInfo.order_item.map((d,index)=>{return(
             <div className={'flex items-center gap-[10px] py-[10px] border-b-[1px] border-b-slate-100 last:border-b-[0px]'} key={index}>
                 <div class="flex items-center flex-[0_0_calc(80%_-_10px)]">
                     <span class="qty">{d.quantity}</span>
                     <span class="qty mx-[10px]">*</span>
                     <span>
                         <h6 class="m-0 text-[13px] font-semibold">{d.item_name}</h6>
                         {d.variant_text && <h6 class="m-0 text-[12px] gray_color">{d.variant_text}</h6>}
                         <h6 class="text-[12px] gray_color">{formatter.format(d.price)}</h6>
                     </span> 
                 </div>
                 <h6 class="m-0 text-[13px] font-semibold text-end flex-[0_0_calc(20%_-_0px)]">{formatter.format(d.quantity * d.price) }</h6>
             </div>
            )})
           }
          </div>
         }

         <div className='border-b-[1px] border-b-slate-100 p-[10px_15px]'>
           <h6 className='text-[14px] font-semibold'>Payment Details</h6>
           
           <div className=' py-[10px] justify-between items-center'>
                   <h6 className='w-3/6 text-[14px] pb-[5px]'>Subtotal</h6>
                   <h6 className='w-3/6 text-[14px] text-end pb-[5px] text-medium'>{formatter.format(orderInfo.total_amount)}</h6>
                   <h6 className='w-3/6 text-[14px] pb-[5px]'>Shipping</h6>
                   <h6 className='w-3/6 text-[14px] text-end pb-[5px] text-medium'>Free</h6>
                   <h6 className='w-3/6 text-[14px] pb-[5px]'>GST</h6>
                   <h6 className='w-3/6 text-[14px] text-end pb-[5px] text-medium'>{formatter.format(orderInfo.total_tax_amount)}</h6>
                   <h6 className='border-t-[1px] border-t-slate-100 w-3/6 text-[14px] mt-[8px] py-[8px]'>Total</h6>
                   <h6 className='border-t-[1px] border-t-slate-100 w-3/6 text-[14px] text-end mt-[8px] py-[8px] text-medium'>{formatter.format(orderInfo.total_amount)}</h6>     
          </div>
          </div>
         
   
  

       </div> */}

     </div>
     }
    </>
  )
}


const Notify = ({orderInfo,load_razorpay}) => {
  
  const router = useRouter();

  return (
    <div className={`md:flex-col md:gap-[10px] flex items-center justify-between border ${(orderInfo.payment_status === 'Paid' || orderInfo.payment_method_name.toLowerCase().includes('cash')) ? 'border-[#046306] bg-[url("/thankyou/Success-bg.jpg")]' : 'border-[#c90905] bg-[url("/thankyou/Failure-bg.jpg")]' }   bg-cover bg-bottom bg-no-repeat m-[10px] p-[10px] rounded-[5px] min-h-[82px]`}>
      
    <div className='flex lg:w-[80%] items-center'>
     <div className='md:h-[50px] md:w-[60px] lg:h-[50px] lg:w-[50px] rounded-[50%] mr-[8px] bg-[#fff] flex items-center justify-center'><Image className='h-[28px] w-[30px]' src={(orderInfo.payment_status === 'Paid' || orderInfo.payment_method_name.toLowerCase().includes('cash')) ? "/thankyou/Success.svg" : "/thankyou/Failure.svg"} alt="Tick" width={18} height={18} /></div>
     <div className='w-full'>
      <h6 className={`text-[15px] font-semibold ${(orderInfo.payment_status === 'Paid' || orderInfo.payment_method_name.toLowerCase().includes('cash')) ? 'text-[#046306]' : 'text-[#c90905]' }`}>{(orderInfo.payment_status === 'Paid' || orderInfo.payment_method_name.toLowerCase().includes('cash')) ? 'Your order placed successfully' : 'Your Payment Failed'}</h6>
      <p className={`text-[14px]  md:hidden ${(orderInfo.payment_status === 'Paid' || orderInfo.payment_method_name.toLowerCase().includes('cash')) ? 'text-[#046306]' : 'text-[#c90905]' }`}>{(orderInfo.payment_status === 'Paid' || orderInfo.payment_method_name.toLowerCase().includes('cash')) ? "Thank you for your purchase. Your order number is " + orderInfo.name : "Sorry, We're not able to process your payment. Please try again"}</p>
     </div>
    </div>
    {(orderInfo.payment_status === 'Paid' || orderInfo.payment_method_name.toLowerCase().includes('cash')) ? 
      <div className='pb-[15px] '><button onClick={()=>{router.push('/')}} className={`bg-[#046306] text-white p-[5px_25px] text-[13.5px] h-[35px] rounded-[5px] relative`}>Continue Shopping <Image className='h-[11px] w-[10px] absolute right-[9px] top-[12px]' src={"/Arrow/arrowWhite.svg"} alt="Tick" width={20} height={20} /></button> </div> : 
      <div className='pb-[15px]'><button onClick={()=>{load_razorpay(orderInfo.outstanding_amount,'Place Order',orderInfo.name)}} className={`bg-[#c90905] text-white p-[5px_25px] text-[13.5px] h-[35px] rounded-[5px]`}>Try Again<Image className='h-[11px] w-[6px] absolute right-[7px] top-[12px]' src={"/arrow_w.svg"} alt="Tick" width={12} height={20} /></button> </div>
    }
</div>
  )
}


const SkeletonLoader = () => {
  return (
   <div className="h-[80vh] flex flex-col gap-[10px] items-center  justify-center">
     <div class="animate-spin rounded-full h-[40px] w-[40px] border-l-2 border-t-2 border-black"></div>
     <span className='text-[15px] gray_color'>Loading...</span>
   </div>
  )
}