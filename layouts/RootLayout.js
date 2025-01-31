import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setCartItems } from '@/redux/slice/cartSettings'
import { resetCart } from '@/redux/slice/cartSettings'
import { setDetail } from '@/redux/slice/customerInfo'
import { get_cart_items, get_customer_info } from '@/libs/api';

export default function RootLayout({ children, website_settings }) {

  const dispatch = useDispatch();
  const loginInfo = useSelector((state) => state.logInInfo.customerInfo)
  useEffect(() => {
    if ((website_settings && website_settings.app_settings) && typeof window != 'undefined') {
      if (localStorage && localStorage['CustomerName']) {
        customer_info()
        get_cart_item();
      } else {
        get_cart_item()
      }


    }

  }, [website_settings])




  async function get_cart_item() {
    // let res = await get_cart_items();
    // if (res && res.message && res.message.status && res.message.status == "success") {
    //   dispatch(setCartItems(res.message));
    // }
  }


  // useMemo(()=>{
  //   if(typeof window != 'undefined'){

  //     if((loginInfo && loginInfo.full_name) || (localStorage && localStorage['CustomerName'])){
  //       customer_info()
  //       get_cart_item();
  //     }

  //     if(loginInfo && loginInfo.logout){
  //       dispatch(resetCart({}));
  //     }  

  //   }
  // },[loginInfo])

  useEffect(() => {
    if (typeof window != 'undefined') {

      // if((loginInfo && loginInfo.full_name) || (localStorage && localStorage['CustomerName'])){
      //   customer_info()
      //   get_cart_item();
      // }

      if (loginInfo && loginInfo.logout) {
        dispatch(resetCart({}));
      }

    }
  }, [loginInfo])


  async function customer_info() {
    let data = { guest_id: '', user: localStorage['customerRefId'] };
    const resp = await get_customer_info(data);
    if (resp && resp.message && resp.message[0]) {
      let data = resp.message[0];
      dispatch(setDetail(data));
    }
  }

  return (
    <>
      {/* <div> */}
      {/* <WebHeader website_settings={website_settings}/> */}
      <main id='main' className='md:min-h-screen your-element md:w-full'>{children}</main>
      {/* </div> */}
    </>
  )
}
