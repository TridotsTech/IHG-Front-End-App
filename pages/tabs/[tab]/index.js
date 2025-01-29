import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router'
const MobileCategoryFilter = dynamic(()=> import('@/components/Product/filters/MobileCategoryFilter'))
const YourCart = dynamic(()=> import('@/components/Product/YourCart'))
const WishList = dynamic(()=> import('@/components/Product/WishList'))
const MobileHeader = dynamic(()=> import('@/components/Headers/mobileHeader/MobileHeader'))
const Orders = dynamic(()=> import('@/components/Profile/Orders'))
const Wallet = dynamic(()=> import('@/components/Profile/Wallet'))
// import MobileCategoryFilter from '@/components/Product/filters/MobileCategoryFilter'
// import MobileCart from '@/components/MobileCart'
// import YourCart from '@/components/Product/YourCart'
// import WishList from '@/components/Product/WishList'
// import MobileHeader from '@/components/Headers/mobileHeader/MobileHeader'
// import Orders from '@/components/Profile/Orders';
// import Wallet from '@/components/Profile/Wallet';

export default function index() {

  const router = useRouter();
  let  [routeName,setRouteName] = useState('')
  let [title,setTitle] = useState('')

  const webSettings = useSelector((state) => state.webSettings.websiteSettings)

  useEffect(()=>{
    routeName = router.query.tab
    setRouteName(router.query.tab);

    if(routeName == 'category'){
      title = 'Categories'
    }else if(routeName == 'yourcart'){
      title = 'My Cart'
    }else if(routeName == 'wishlist'){
      title = 'My Wishlist'
    }else if(routeName == 'my-orders'){
      title = 'My Orders'
    }else if(routeName == 'wallet'){
      title = 'My Wallet'
    }

    setTitle(title);

  },[router])


  
  const [theme_settings, setTheme_settings] = useState()

  useMemo(() => {
   
    if (webSettings && webSettings.app_settings) {
      let settings = webSettings.app_settings;
      setTheme_settings(settings);
    }

  }, [webSettings])

  return (
    <div class={`main-width lg:py-[25px] mb-[65px]`}>
       {(theme_settings && routeName) && <MobileHeader back_btn={true} title={title} search={routeName == 'yourcart' ? false : true} clear_cart={routeName == 'yourcart' ? true : false} theme_settings={theme_settings}/>}
       {routeName == 'category' && <MobileCategoryFilter/>}
       {/* {routeName == 'yourcart' && <MobileCart />} */}
       {routeName == 'yourcart' && <YourCart mobileCart={true}/>}
       {routeName == 'wishlist' && <WishList />}
       {routeName == 'my-orders' && <Orders />}
       {routeName == 'wallet' && <Wallet />}
    </div>
  )
  
}

