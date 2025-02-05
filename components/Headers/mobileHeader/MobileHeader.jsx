import { useState } from 'react'
import { check_Image, clear_cartitem, get_cart_items } from '@/libs/api';
import Image from 'next/image';
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
const SideMenu = dynamic(() => import('@/components/Headers/mobileHeader/SideMenu'), { ssr: false });
const AlertUi = dynamic(() => import('@/components/Common/AlertUi'), { ssr: false });
const Modals = dynamic(() => import('@/components/Detail/Modals'), { ssr: false });
// import SideMenu from '@/components/Headers/mobileHeader/SideMenu'
// import AlertUi from '@/components/Common/AlertUi';
import { toast } from 'react-toastify';
import { setCustomerInfo } from '@/redux/slice/logInInfo';
import { setCartItems } from '@/redux/slice/cartSettings'
// import Modals from '@/components/Detail/Modals'

export default function MobileHeader({ home, back_btn, share, search, cart, clear_cart, title, titleDropDown, titleClick, empty_div, navigateLink, theme_settings }) {

  const router = useRouter();
  const cartCount = useSelector((state) => state.cartSettings.cartCount)
  const [alertUi, setAlertUi] = useState(false)
  const [alertMsg, setAlertMsg] = useState({})
  let [sideMenu, setSideMenu] = useState(false)
  const dispatch = useDispatch();

  function logoutFn() {
    setAlertUi(true);
    setAlertMsg({ message: 'Are you sure do you want to logout ?' });
  }

  function logout(value) {
    if (value == 'Yes' && (alertMsg && alertMsg.alert == 'cart')) {
      ModalClose(value)
    } else if (value == 'Yes' && alertUi) {
      setAlertUi(false);
      localStorage.clear();
      dispatch(setCustomerInfo({ logout: true }));
      toast.success("You have successfully logged out!")
      router.push('/');
    } else {
      setAlertUi(false);
    }
  }

  async function ClearCart() {
    setAlertMsg({ message: 'Do you want to delete all the item', alert: 'cart' });
    setAlertUi(true);
  }

  async function ModalClose(value) {
    setAlertUi(false);
    if (value == 'Yes') {
      let param = { customer_id: localStorage['customerRefId'] }
      const resp = await clear_cartitem(param);
      get_cart_item()
      setAlertMsg({});

    }
  }

  async function get_cart_item() {
    // let res = await get_cart_items();
    // if (res && res.message && res.message.status && res.message.status == "success") {
    //   dispatch(setCartItems(res.message));
    // }
  }

  const [showSearch,setShowSearch] = useState(false)
  let [searchValue, setSearchValue] = useState('')
  function getSearchTxt(eve) {
    searchValue = eve.target.value
    // console.log(searchValue)
    setSearchValue(searchValue);
  }

  function navigateToSearch(route) {
    router.push(route)
    setSearchValue('')
  }


  return (
    <>

      {sideMenu &&
        <>
          <div className={`fixed sidebar ${sideMenu ? 'sideActive' : ''} `} >
            <SideMenu setSideMenu={setSideMenu} sideMenu={sideMenu} logout={logoutFn} />
          </div>
          <Backdrop />
        </>
      }


      {alertUi &&
        <AlertUi isOpen={alertUi} closeModal={(value) => logout(value)} headerMsg={'Alert'} button_1={'No'} button_2={'Yes'} alertMsg={alertMsg} />
      }

      <div className='lg:hidden md:min-h-[45px] your-element border-b-[1px] border-b-slate-100 sticky top-0 z-[99] bg-white'>
        {home &&
          <div className={`flex items-center md:min-h-[45px] your-element justify-between p-[10px] `}>

            <div className={`flex items-center gap-[10px]`}>

              <div onClick={() => { setSideMenu(sideMenu = !sideMenu) }} className='flex items-center justify-end'>
                <Image className='h-[25px] w-[25px] object-contain' height={40} width={40} alt='logo' src={'/menu.svg'}></Image>
              </div>
              <div className='flex items-center justify-start'>
                {theme_settings.website_logo && <Image className='w-auto h-[20px] object-contain' height={60} width={100} alt='logo' src={'/logo.png'}></Image>}
              </div>

            </div>

            <div className='flex items-center gap-[8px]'>
              <div onClick={() => { router.push('/search') }} className='flex items-center justify-end'>
                <Image onClick={() => { }} style={{ objectFit: 'contain' }} className='h-[20px] object-contain' height={40} width={40} alt='vantage' src={'/search.svg'}></Image>
              </div>
              {/* 
              <div onClick={() => { router.push('/tabs/yourcart') }} className='relative flex items-center justify-end'>
                <Image onClick={() => { }} style={{ objectFit: 'contain' }} className='h-[22px] w-[22px] object-contain' height={40} width={40} alt='vantage' src={'/cart_h.svg'}></Image>
                <p className='primary_bg text-[12px] text-[#fff] rounded-[50%] absolute h-[20px] w-[20px] flex items-center justify-center top-[-12px] right-[-10px]'>{cartCount}</p>
              </div> */}
            </div>
          </div>
        }
        {!home &&
          <div className={`flex items-center justify-between p-[10px] min-h[40px]`}>
            {back_btn &&
              <div className='flex items-center gap-5'>
                <div onClick={() => { navigateLink ? router.push(navigateLink) : router.back() }} className='flex items-center justify-center  h-[30px] w-[30px] cursor-pointer primary_bg rounded-[50%]'>
                  <Image style={{ objectFit: 'contain' }} className='h-[15px] object-contain' height={40} width={40} alt='vantage' src={'/Arrow/rightArrowWhite.svg'}></Image>
                </div>
                <Image onClick={()=> router.push('/')} className='w-auto h-[20px] object-contain' height={60} width={100} alt='logo' src={'/logo.png'}></Image>
              </div>
            }

            {/* {title &&
              <div onClick={() => { titleClick && titleClick() }} className={`flex items-center justify-center gap-[3px] ${clear_cart ? 'w-[50%]' : 'w-[70%]'}`}>
                <h6 className={`text-[15px] text-center font-semibold line-clamp-1`}>{title} </h6>
                {titleDropDown && <Image style={{ objectFit: 'contain' }} className='h-[10px] object-contain' height={20} width={20} alt='vantage' src={'/Arrow/downArrowBlack.svg'}></Image>}
              </div>
            } */}

            {(search && !router.asPath.includes('search')) &&
              <div className={`flex items-center gap-[8px] transition-all ease-in duration-500 delay-100 ${showSearch ? 'w-[180px]' : ''}`}>
                {search &&
                  <>
                  {/* router.push('/search') */}
                    {!showSearch && <div onClick={() => { setShowSearch(!showSearch) }} className='flex transition-all ease-in duration-500 delay-100 items-center justify-end'>
                      <Image onClick={() => { }} style={{ objectFit: 'contain' }} className='h-[20px] object-contain' height={40} width={40} alt='vantage' src={'/search.svg'}></Image>
                    </div>}

                    <div className={`transition-all ease-in duration-500 delay-100 ${!showSearch ? 'h-0 w-0 opacity-0' : 'opacity-100 p-[5px_10px] h-[30px] flex items-center w-full border_color rounded-[20px]'} `}>
                      <input id='search' value={searchValue} spellcheck="false" onChange={(eve) => { getSearchTxt(eve) }}  className='w-[95%] text-[14px]' placeholder='Search Products' />
                      <Image onClick={() => { searchValue == '' ? null : navigateToSearch('/search/' + searchValue) }} style={{ objectFit: 'contain' }} className='h-[18px] w-[15px] cursor-pointer' height={25} width={25} alt='vantage' src={'/search.svg'}></Image>
                    </div>
                  </>
                }


              </div>
            }


            {empty_div &&
              <div></div>
            }
          </div>
        }
      </div>
    </>
  )


}


const Backdrop = () => {
  return (
    <div className='backdrop'>
      <div className="h-[100%] flex flex-col gap-[10px] items-center  justify-center">
        <div class="animate-spin rounded-full h-[40px] w-[40px] border-l-2 border-t-2 border-black"></div>
      </div>
    </div>
  )
}

