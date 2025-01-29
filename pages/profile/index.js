import { useEffect, useState, useMemo } from 'react'
import { checkMobile, check_Image, get_customer_info, stored_customer_info, get_razorpay_settings } from '@/libs/api';
import { useRouter } from 'next/router'
import Image from 'next/image'
import dynamic from 'next/dynamic';

const RootLayout = dynamic(()=> import('@/layouts/RootLayout'))
const Myprofile = dynamic(()=> import('@/components/Profile/Myprofile'))
const Editprofile = dynamic(()=> import('@/components/Profile/Editprofile'))
const DashBoard = dynamic(()=> import('@/components/Profile/DashBoard'))
const Orders = dynamic(()=> import('@/components/Profile/Orders'))
const OrderDetail = dynamic(()=> import('@/components/Profile/OrderDetail'))
const Wallet = dynamic(()=> import('@/components/Profile/Wallet'))
const ChangePwd = dynamic(()=> import('@/components/Profile/ChangePwd'))
const AlertUi = dynamic(()=> import('@/components/Common/AlertUi'))
const AddAddress = dynamic(()=> import('@/components/Address/AddAddress'))
const YourCart = dynamic(()=> import('@/components/Product/YourCart'))
const WishList = dynamic(()=> import('@/components/Product/WishList'))
const MobileHeader = dynamic(()=> import('@/components/Headers/mobileHeader/MobileHeader'))
// import RootLayout from '@/layouts/RootLayout'
// import Myprofile from '@/components/Profile/Myprofile';
// import Editprofile from '@/components/Profile/Editprofile';
// import DashBoard from '@/components/Profile/DashBoard';
// import Orders from '@/components/Profile/Orders';
// import OrderDetail from '@/components/Profile/OrderDetail';
// import Wallet from '@/components/Profile/Wallet';
// import ChangePwd from '@/components/Profile/ChangePwd';
// import AlertUi from '@/components/Common/AlertUi';
// import AddAddress from '@/components/Address/AddAddress';
// import YourCart from '@/components/Product/YourCart'
// import WishList from '@/components/Product/WishList'
// import MobileHeader from '@/components/Headers/mobileHeader/MobileHeader'

import { useSelector, useDispatch } from 'react-redux';

export default function profile({ my_account, order_id }) {
 

  let profileDetail = [
    { 'title': 'Dashboard', icon: '/Profile/dashboard.svg', route: 'dashboard' },
    { 'title': 'My Profile', icon: '/Navbar/account.svg', route: 'edit-profile' },
    { 'title': 'My Address', icon: '/Profile/My-Address.svg', route: 'my-address' },
    { 'title': 'My Orders', icon: '/Profile/orders.svg', route: 'orders' },
    { 'title': 'My Cart', icon: '/Profile/my-cart.svg', route: 'mycart' },
    { 'title': 'My WishList', icon: '/Profile/wishlist.svg', route: 'myWishList' },
    { 'title': 'Wallet', icon: '/Profile/Wallet1.svg', route: 'wallet' },
    { 'title': 'Change Password', icon: '/Profile/edit.svg', route: 'change-password' },
    { 'title': 'Logout', icon: '/Navbar/Logout.svg', route: 'logout' },
  ]

  let [isMobile, setIsmobile] = useState();
  let [tab, setTab] = useState('');
  let [title, setTitle] = useState('');
  const [customerInfo, setCustomerInfo] = useState();
  const [razorpay_settings, setRazorpay_settings] = useState({});
  const [profileInfo, setProfileInfo] = useState(profileDetail);
  let [localValue, setLocalValue] = useState(undefined);
  const [alertUi, setAlertUi] = useState(false)
  const [alertMsg, setAlertMsg] = useState({})
  const [enableModal, setEnableModal] = useState(false)
  const [isLoad, setIsload] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter();
  const webSettings = useSelector((state) => state.webSettings.websiteSettings)


  useEffect(() => {
    if(typeof window  != undefined){
    if (localStorage['api_key']) {
      setIsload(true);
     
      get_razor_pay_values();
      let localValue = stored_customer_info()
      setLocalValue(localValue);

      if (my_account && my_account != '') {
        tab = my_account;
        setTab(tab);
        getInfo(my_account);
        let titleValue = profileDetail.find(res=>{return res.route == tab})
        titleValue ? setTitle(titleValue.title) : setTitle('')
      } else {
        setTab('');
      }
      setCustomerInfo(undefined);
      checkIsMobile();
      window.addEventListener('resize', checkIsMobile)
      return () => {
        window.removeEventListener('resize', checkIsMobile);
      };
    } else {
      router.push('/login');
    }}

  }, [router.query])

  const navigateToProfile = (data) => {
    if (data.route == 'logout') {
      setAlertUi(true);
      setAlertMsg({ message: 'Are you sure do you want to logout ?' });
    } else {
      router.push('/profile?my_account=' + data.route);
    }

  }

  async function get_razor_pay_values() {
    let razorpay = await get_razorpay_settings();
    setRazorpay_settings(razorpay);
  }

  const checkIsMobile = async () => {
    isMobile = await checkMobile();
    setIsmobile(isMobile);
  }

  function getInfo(my_account) {

    profileInfo.map(res => {
      if (res.route == my_account) {
        res.selected = 1
      } else {
        res.selected = 0
      }
    })

    setProfileInfo(profileInfo);

    if (my_account == 'edit-profile') {
      customer_info()
    } 
  }

  async function customer_info() {

    let data = { guest_id: '', user: localStorage['customerRefId'] };
    const resp = await get_customer_info(data);
    if (resp && resp.message && resp.message[0]) {
      setCustomerInfo(resp.message[0]);
    }
  }


  function closeModal(value) {
    setEnableModal(false);
    if (value == 'Yes' && alertUi) {
      setAlertUi(false);
      localStorage.clear();
      dispatch(setRole(''))
      dispatch(setUser(''))
      router.push('/');
    } else {
      setAlertUi(false);
    }
  }

  function logout(value) {
    setEnableModal(false);
    if (value == 'Yes' && alertUi) {
      setAlertUi(false);
      localStorage.clear();
      dispatch(setRole(''))
      dispatch(setUser(''))
      router.push('/');
    } else {
      setAlertUi(false);
    }
  }
 
  const [theme_settings,setTheme_settings] = useState()

  useMemo(()=>{
    setTheme_settings(webSettings.app_settings);
  },[webSettings])


  return (

    <>
       <RootLayout checkout={isMobile ? false : true}>
        {(theme_settings && tab == '') && <MobileHeader home={true} theme_settings={theme_settings}/>}
        {(theme_settings && tab != '') && <MobileHeader back_btn={true} title={tab == 'orderdetail' ? ('Order Detail(' + order_id + ')') : title} empty_div={true} theme_settings={theme_settings}/>}

        {alertUi &&
          <AlertUi isOpen={alertUi} closeModal={(value) => logout(value)} headerMsg={'Alert'} button_1={'No'} button_2={'Yes'} alertMsg={alertMsg} />
        }

        {enableModal && <AlertUi isOpen={enableModal} closeModal={(value) => closeModal(value)} headerMsg={'Alert'} button_2={'Ok'} alertMsg={alertMsg} />}


        {!isLoad ? <Backdrop /> : 
        <div className='md:mb-[65px]'>

          {((tab == '' || !isMobile) && localValue) &&
            <div className='lg:hidden p-[12px_5px] flex items-center gap-[10px]'>
              <div className="flex items-center h-[75px]"><Image className='h-[56px] object-contain' height={100} width={100} src={'/Tabs/Profile-Avatar.svg'} alt='profile'></Image></div>
              <div>
                <h6 className='text-[15px] font-semibold'>{localValue.cust_name}</h6>
                
              </div>
            </div>
          }

          <div className='min-h-[350px] main-width flex'>
            {(tab == '' || !isMobile) &&
              // p-[10px_20px_20px_0]
              <div className={'lg:flex-[0_0_calc(20%_-_0px)] md:w-full sticky  top-[143px] overflow-auto scrollbarHide h-[calc(100vh_-_160px)]'}>

                <h6 className='md:hidden flex items-center p-[0_25px] text-[16px] font-semibold h-[50px] border-b-[0px] border-b-slate-200'>Account Settings</h6>

                <Myprofile profileInfo={profileInfo} navigateToProfile={navigateToProfile} />
              </div>}

            {tab && tab != '' &&
              <div className={'min-h-[calc(100vh_-_70px)] md:w-full lg:flex-[0_0_calc(80%_-_0px)] pb-[20px] border-l-[1px] border-l-slate-200 '}>
                <div className='lg:border rounded-[5px] lg:m-[20px] pb-[20px]'>
                 
                   {tab == 'dashboard' && <div>
                   <h6 className='bg-[#FBFBFB] md:hidden rounded-[5px_5px_0_0] flex items-center px-[10px] text-[16px] font-semibold h-[50px] border-b-[0px] border-b-slate-200 mb-[10px]'>Dash Board</h6>
                    <div className='px-[10px]'>
                      <DashBoard/>
                    </div>
                    </div>}
                  {tab == 'edit-profile' &&
                    <div>
                      <h6 className='bg-[#FBFBFB] md:hidden rounded-[5px_5px_0_0] flex items-center px-[10px] text-[16px] font-semibold h-[50px] border-b-[0px] border-b-slate-200 mb-[10px]'>Personal Information</h6>
                      <div className='px-[20px]'>
                        {customerInfo ? <Editprofile customerInfo={customerInfo} /> : <Skeleton />}
                      </div>
                    </div>
                  }

                  {tab == 'orders' &&
                    <div>
                      <h6 className='bg-[#FBFBFB] md:hidden rounded-[5px_5px_0_0] flex items-center px-[10px] text-[16px] font-semibold h-[50px] border-b-[0px] border-b-slate-200'>Orders List</h6>
                      <div className=''>
                        <Orders />
                      </div>
                    </div>
                  }

                  {tab == 'mycart' &&
                    <div>
                      <h6 className='bg-[#FBFBFB] md:hidden rounded-[5px_5px_0_0] flex items-center px-[10px] text-[16px] font-semibold h-[50px] border-b-[0px] border-b-slate-200'>My Cart</h6>
                      <div className=''>
                        <YourCart checkout={true} myprofile={true} />
                      </div>
                    </div>
                  }

                  {tab == 'myWishList' &&
                    <div>
                      <h6 className='bg-[#FBFBFB] md:hidden rounded-[5px_5px_0_0] flex items-center px-[10px] text-[16px] font-semibold h-[50px] border-b-[0px] border-b-slate-200'>My WishList</h6>
                      <div className=''>
                        <WishList myprofile={true} theme_settings={theme_settings}/>
                      </div>
                    </div>
                  }

                  {tab == 'orderdetail' &&
                    <div>
                      <div className='flex items-center gap-[8px] bg-[#FBFBFB] md:hidden rounded-[5px_5px_0_0] px-[10px] h-[50px] border-b-[0px] border-b-slate-200' >
                        <div className={`h-[35px] w-[35px] z-10 bg-[#fff] border-[1px] border-slate-200 rounded-full flex items-center justify-center cursor-pointer `} onClick={() => { router.push('profile?my_account=orders') }} > <Image className='h-[12px] object-contain' alt="Prev" src={'/rightArrow.svg'} width={35} height={35} /></div>
                        <h6 className='flex items-center text-[16px] font-semibold '>Order Detail (<span className=''>{order_id}</span>)</h6>
                      </div>
                      <div className=''>
                        <OrderDetail loadPage={true} order_id={order_id} webSettings={webSettings} />
                      </div>
                    </div>
                  }
                     {tab == 'wallet' &&
                    <div>
                      <h6 className='bg-[#FBFBFB] md:hidden rounded-[5px_5px_0_0] flex items-center px-[10px] text-[16px] font-semibold h-[50px] border-b-[0px] border-b-slate-200 mb-[10px]'>Wallet</h6>
                     <div>
                      <Wallet/>
                     </div>
                    </div>
                  }
                  {tab == 'change-password' &&
                    <div>
                      <h6 className='bg-[#FBFBFB] md:hidden rounded-[5px_5px_0_0] flex items-center px-[10px] text-[16px] font-semibold h-[50px] border-b-[0px] border-b-slate-200 mb-[10px]'>Change Password</h6>
                      <div className='px-[20px]'>
                        <ChangePwd />
                      </div>
                    </div>
                  }

                  {tab == 'my-address' &&
                    <div>
                      <h6 className='bg-[#FBFBFB] md:hidden rounded-[5px_5px_0_0] flex items-center px-[10px] text-[16px] font-semibold h-[50px] border-b-[0px] border-b-slate-200'>My Address</h6>
                      <div className=''>
                        <AddAddress />
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
        }
      </RootLayout>
      :

    </>
  )
}

const Backdrop = () => {
  return (
    <div className='backdrop'>
      <div className="h-[100%] flex flex-col gap-[10px] items-center  justify-center">
        <div className="animate-spin rounded-full h-[40px] w-[40px] border-l-2 border-t-2 border-black"></div>
        <span className='text-[15px]'>Loading...</span>
      </div>
    </div>
  )
}


export async function getServerSideProps({ query }) {
  let my_account = query.my_account
  let order_id = query.order_id ? query.order_id : ''
  return {
    props: { my_account, order_id }
  }
}


const Skeleton = () => {
  return (
    <>
      <div class="md:h-[calc(100vh_-_150px)] lg:w-[50%] animate-pulse">
        {[1, 2, 3, 4].map((res, index) => (
          <div key={index} className=' py-[10px]'>
            <div className={`h-[15px] w-[25%] bg-slate-100 rounded-[5px]`}></div>
            <div className={`h-[40px] w-[100%] md:mb-[10px] bg-slate-100 rounded-[5px] mt-[10px]`}></div>
          </div>
        ))}
        <div className={`h-[40px] w-[60%] m-[0_auto] bg-slate-100 rounded-[5px] mt-[10px]`}></div>
      </div>
    </>
  )
}