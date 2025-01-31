import React, { useEffect, useMemo, useState, useRef } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router'
import { check_Image, currencyFormatter1, stored_customer_info, clear_cartitem, get_cart_items, move_all_tocart, get_search_products } from '@/libs/api';
import { useSelector, useDispatch } from 'react-redux';
import YourCart from '@/components/Product/YourCart'
import WishList from '@/components/Product/WishList'
import Rodal from 'rodal';
// import 'rodal/lib/rodal.css';
import { setCartItems } from '@/redux/slice/cartSettings'
import AlertUi from '@/components/Common/AlertUi';
import AuthModal from '@/components/Auth/AuthModal'
import SearchProduct from '@/components/Search/SearchProduct';
import { setCustomerInfo } from '@/redux/slice/logInInfo';
import { resetCust } from '@/redux/slice/customerInfo';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

export default function MainHeader({ header_template, theme_settings, website_settings, all_categories }) {

  const router = useRouter();
  const cartCount = useSelector((state) => state.cartSettings.cartCount)
  const wishlistCount = useSelector((state) => state.cartSettings.wishlistCount)
  const cartValue = useSelector((state) => state.cartSettings.cartValue)
  const loginInfo = useSelector((state) => state.logInInfo.customerInfo)
  const business = useSelector((state) => state.webSettings.business);
  const adddressInfo = useSelector((state) => state.webSettings.adddressInfo);
  const cartItems = useSelector((state) => state.cartSettings.cartItems)

  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const searchRef = useRef(null)

  useMemo(() => {
    // console.log(cartItems,'cartItems')
    // console.log(router,'router')
  }, [cartItems])


  useEffect(() => {
    const handleClickOutside = (event) => {
      // console.log(searchRef.current.contains(event.target))
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // console.log("hello world")
        setActiveSearch(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      // console.log("world hello")
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(false)
  const [activeSearch, setActiveSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [customerName, setCustomerName] = useState()
  const [customerMenu, setCustomerMenu] = useState(false)
  let [enableLocation, setEnableLocation] = useState(false)

  let tabsValue = [
    { 'label': 'Shopping Cart' },
    { 'label': 'Wishlist' }
  ]

  const [tabs, setTabs] = useState(tabsValue)
  let [localValue, setLocalValue] = useState(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let localValue = stored_customer_info()
      setLocalValue(localValue);
    }

    // const handleClick = (event) => {
    //   setActiveSearch(false)
    // };

    // window.addEventListener('click', handleClick);

    // return () => {
    //   window.removeEventListener('click', handleClick);
    // };

  }, [])


  useMemo(() => {
    if (business || localStorage['business'] || (adddressInfo && adddressInfo.address)) {
      let localValue = stored_customer_info()
      setLocalValue(localValue);
    }
  }, [business, adddressInfo]);

  const closeModal = () => {
    // console.log("tfgyhujkl")
    setIsOpen(false)
  }

  const openModal = (type) => {
    tabs.map(res => {
      if (res.label == type) {
        res.isActive = true;
      } else {
        res.isActive = false;
      }
    })
    setActiveTab(type)
    setTabs(tabs)
    setIsOpen(true)

  }

  useMemo(() => {

  }, [cartCount, wishlistCount, cartValue, tabs])

  useMemo(() => {
    if ((loginInfo && loginInfo.full_name) || localStorage['CustomerName']) {
      // console.log(loginInfo,'loginInfo')
      setCustomerName(localStorage['CustomerName'])
      get_cart_item()
    } else {
      setCustomerName()
    }

  }, [loginInfo])

  const [enableModal, setEnableModal] = useState(false)
  const [alertMsg, setAlertMsg] = useState({})

  async function get_cart_item() {
    // let res = await get_cart_items();
    // if (res && res.message && res.message.status && res.message.status == "success") {
    //   dispatch(setCartItems(res.message));
    // }
  }

  async function ClearCart() {
    setAlertMsg({ message: 'Do you want to delete all the item' });
    setEnableModal(true);
  }

  async function moveToCart() {
    let param = { customer_id: localStorage['customerRefId'] }
    const res = await move_all_tocart(param);
    if (res && res.message && res.message.status == 'success') {
      get_cart_item()
      setAlertMsg({});
      openModal('Shopping Cart')
    }
  }


  async function ModalClose(value) {
    setEnableModal(false);
    if (value == 'Yes') {
      let param = { customer_id: localStorage['customerRefId'] }
      const resp = await clear_cartitem(param);
      get_cart_item()
      setAlertMsg({});

    }
  }

  let [visible, setVisible] = useState(false)
  const hide = () => {
    setVisible(false);
  }
  const checkUser = () => {

    if (localStorage && localStorage['api_key']) {

    } else {
      visible = true
      setVisible(visible)
    }
  }

  const [searchProducts, setSearchProducts] = useState([]);


  async function getSearchValues(inputText,query_bg="name,description") {
    // let data = { "search_text": inputText, "page_no": 1, "page_len": 15 }
    // let res = await get_search_products(data);
    // setLoader(false)
    // if (res && res.message && res.message.length != 0) {
    //   setSearchProducts(res.message);
    // } else {
    //   setSearchProducts([])
    // }
    let api = `http://<TYPESENSE_HOST>:<PORT>/collections/product/documents/search?q=${inputText}&query_by=${query_bg}`

    const myHead = new Headers({ "Content-Type": "application/json","X-TYPESENSE-API-KEY": "<API_KEY>" })
    const response = await fetch(api, { method: 'GET', headers: myHead, })
    console.log(response,"response")
  }

  function getSearchTxt(eve) {
    eve = eve.target.value

    if (eve != '') {
      setSearchValue(eve);
      debounceSearch(eve);
    } else {
      setSearchValue(eve);
      setSearchProducts([])
    }
    // setSearchValue(eve);
    // debounceSearch(searchValue);
  }

  let debounceTimer;
  const debounceSearch = (inputText) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setActiveSearch(true)
      setLoader(true)
      getSearchValues(inputText)
      // console.log('Perform search for:', inputText);
    }, 300); // Adjust the debounce delay (in milliseconds) 
  };

  async function handleKeyDown(event) {
    if (event.key === 'Enter') {
      if (searchValue && searchValue != '') {
        navigateToSearch('/search/' + searchValue)
      }
    }
  }

  function navigateToSearch(route) {
    router.push(route)
    setSearchValue('')
    setActiveSearch(false)
  }

  const [alertUi, setAlertUi] = useState(false)


  let dropDownList = [
    { 'title': 'My Profile', route: '/profile?my_account=edit-profile' },
    { 'title': 'My Order', route: '/profile?my_account=orders' },
    { 'title': 'My Cart', route: '/profile?my_account=mycart' },
    { 'title': 'Logout', route: '' },
  ]
  const moveToProfile = (res) => {
    // console.log(res, "res")
    if (res.title == 'Logout') {
      setAlertUi(true);
      setAlertMsg({ message: 'Are you sure do you want to logout ?' });
    } else {
      router.push(res.route);
    }
  }

  function logout(value) {
    if (value == 'Yes' && alertUi) {
      setAlertUi(false);
      localStorage.clear();
      dispatch(setCustomerInfo({ logout: true }));
      dispatch(resetCust({}));
      toast.success("You have successfully logged out!")
      router.push('/');
    } else {
      setAlertUi(false);
    }
  }

  // const hidePopUp=()=>{
  //   setVisible(false)
  // }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
      closeModal();
      hide()// Call your function to hide the popup
    }
  });

  // if (visible || isOpen) {
  //   document.body.classList.add('active_visible')
  // } else {
  //   document.body.classList.remove('active_visible')
  // }


  useMemo(() => {
    if (cartValue && typeof window !== 'undefined') {
      // console.log(cartValue,'Cart Value in Modal')
      if (visible || isOpen) {
        !document.body.classList.contains('active_visible') ? document.body.style.overflow = "hidden" : null;
        // !document.body.classList.contains('active_visible') ?  document.body.classList.add('active_visible') : null
      } else {
        // document.body.classList.remove('active_visible')
        document.body.style.overflow = "unset";
      }
    }
  }, [cartValue, visible, isOpen])

  // console.log(isOpen,"open")



  function closeModalLoaction() {
    setEnableLocation(enableLocation = !enableLocation)
  }


  return (
    <>
      {/* <ToastContainer position={'bottom-right'} autoClose={2000}  /> */}

      {visible && <AuthModal visible={visible} hide={hide} setVisible={setVisible} />}
        
      {enableModal &&
        <AlertUi isOpen={enableModal} closeModal={(value) => ModalClose(value)} headerMsg={'Alert'} button_1={'No'} button_2={'Yes'} alertMsg={alertMsg} />
      }

      {alertUi &&
        <AlertUi isOpen={alertUi} closeModal={(value) => logout(value)} headerMsg={'Alert'} button_1={'No'} button_2={'Yes'} alertMsg={alertMsg} />
      }

      <div className='flex items-center justify-between gap-[10px] w-[100%]'>
        {header_template && header_template.items.length != 0 &&
          header_template.items.map((res, index) => {
            return (
              <>
                {(res.section_name == 'Header Logo' && res.section_type == 'Static Section') &&
                  <div key={index} className=''>
                    {/* /h-[100px] */}
                    {/* {theme_settings.website_logo && <Image onClick={() => { router.push('/') }} className='cursor-pointer  w-[150px] object-cover' height={60} width={100} alt='logo' src={check_Image(theme_settings.website_logo)}></Image>} */}
                    {theme_settings.website_logo && <Image onClick={() => { router.push('/') }} className='cursor-pointer object-cover' height={41} width={51} alt='logo' src={'/logo.png'}></Image>}
                  </div>
                }

                {(res.section_name == 'Header Menu' && res.section_type == 'Menu') &&
                  <div className={`flex items-center gap-[10px]`}>
                  </div>
                }

                {(res.section_name == 'Header Button' && res.section_type == 'Static Section') &&
                  <div key={index} className='pl-[15px] flex gap-[25px] items-center justify-end'>

                   
                    <div>
                      <Link href={"/scanner"}>
                        <Image src="/scanner.svg" height={20} width={20} />
                      </Link>
                    </div>
                                       

                    <div onClick={() => {checkUser()}} onMouseEnter={() => customerName ? setCustomerMenu(true) : null} onMouseLeave={() => customerName ? setCustomerMenu(false) : null} class="relative  cursor-pointer flex flex-row-reverse items-center">
                      <div className='headerBtbs'>
                        {theme_settings.user_icon && <Image style={{ objectFit: 'contain' }} className='h-[25px] w-[23px]' height={25} width={25} alt='vantage' src={check_Image(theme_settings.user_icon)}></Image>}
                      </div>
                      <p className='text-[16px] font-bold text-center line-clamp-1 bottom-[-21px]'>{customerName ? customerName : 'Login'}</p>

                      {(customerName && customerMenu) &&
                        <div className='shadow-[0_0_5px_#ddd] rounded-[5px] w-[145px] absolute top-[47px] right-0 bg-[#fff] z-[999] p-[5px]'>
                          {dropDownList.map((res, i) => {
                            return (
                              <h5 key={i + 'drop'} onClick={() => { moveToProfile(res) }} className={`${res.title == 'Logout' ? 'hover:bg-red-300 hover:text-red-800' : 'hover:bg-slate-100'} hover:opacity-[0.9] opacity-[0.7] rounded-[5px]  text-[15px] cursor-pointer font-medium p-[5px_10px] border-b-[1px] border-b-slate-100`}>{res.title}</h5>
                            )
                          })}
                        </div>
                      }
                    </div>
                  </div>
                }

              </>
            )
          })
        }
      </div>
    </>
  )
}
