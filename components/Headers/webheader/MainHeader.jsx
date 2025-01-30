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
import Location from '@/components/Location/Location'
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
    let res = await get_cart_items();
    if (res && res.message && res.message.status && res.message.status == "success") {
      dispatch(setCartItems(res.message));
    }
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
      {isOpen && <div className='cartPopup'>
        <Rodal visible={isOpen} enterAnimation='slideRight' animation='' onClose={closeModal}>
          <SliderCart website_settings={website_settings} closeModal={closeModal} router={router} ClearCart={ClearCart} moveToCart={moveToCart} theme_settings={theme_settings} tabs={tabs} cartValue={cartValue} cartCount={cartCount} wishlistCount={wishlistCount} openModal={openModal} activeTab={activeTab} />
        </Rodal>
      </div>
      }


      {enableLocation &&
        <div className='locationPopup'>
          <Rodal visible={enableLocation} enterAnimation='slideDown' animation='' onClose={closeModalLoaction}>
            <Location theme_settings={theme_settings} closeModal={closeModalLoaction} />
          </Rodal>
        </div>
      }

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

                    {/* <div onClick={()=>closeModalLoaction()} className='w-[180px] overflow-hidden flex items-center gap-[8px] border_color rounded-[5px] h-[45px] p-[4px_10px] cursor-pointer'>
                   <Image className='h-[20px] w-[20px] object-contain' height={40}  width={40} alt='logo' src={'/location.svg'}></Image>
                   <div>
                     <h5 className='text-[12px] font-normal gray_color leading-[1.1]'>{(localValue && localValue.city) ? localValue.city : 'Location' }</h5>
                     {(localValue && localValue.address && localValue.address != 'undefined') ? <h5 className='text-[14px] font-medium line-clamp-1 w-[100px]'>{localValue.address}</h5> : <></>}
                   </div>
                  </div>  */}

                    <div key={index} className={`${website_settings.enable_multi_store == 1 ? 'w-full' : 'w-full'} relative flex justify-center`}>
                      <div className="p-[5px_10px] h-[40px] flex items-center m-0_auto] bg-[#00000008] rounded-[5px] w-[335px]">
                        <input value={searchValue} id='search' spellcheck="false" onKeyDown={handleKeyDown} ref={searchRef} onChange={(eve) => { getSearchTxt(eve) }} onFocus={() => { setActiveSearch(true) }} onBlur={() => { setActiveSearch(true) }} className='text-[13px] w-[95%] search bg-[#f7f7f7]' placeholder='Search Items' />
                        {theme_settings.header_search_icon && <Image onClick={() => { searchValue == '' ? null : navigateToSearch('/search/' + searchValue) }} style={{ objectFit: 'contain' }} className='h-[18px] w-[15px] cursor-pointer' height={25} width={25} alt='vantage' src={check_Image(theme_settings.header_search_icon)}></Image>}
                      </div>
                      {activeSearch && <div className={`p-[5px] max-h-[390px] min-h-[150px] w-full ${searchProducts && searchProducts.length > 0 ? "overflow-auto":"overflow-hidden"}  scrollbarHide absolute top-[43px] bg-[#fff] z-99 rounded-[8px] shadow-[0_0_5px_#ddd]`}>
                        <SearchProduct router={router} loader={loader} all_categories={all_categories} searchValue={searchValue} get_search_products={get_search_products} searchProducts={searchProducts} theme_settings={theme_settings} navigateToSearch={navigateToSearch} /> </div>}
                    </div>

                  </div>
                }

                {(res.section_name == 'Header Button' && res.section_type == 'Static Section') &&
                  <div key={index} className='pl-[15px] flex gap-[25px] items-center justify-end'>

                    {/* <div onClick={() => { openModal('Shopping Cart') }} class=" cursor-pointer flex items-center flex-col justify-center">
                      <div className='relative headerBtbs'>
                        {theme_settings.cart_icon && <Image style={{ objectFit: 'contain' }} className='h-[22px] w-[23px]' height={25} width={25} alt='vantage' src={check_Image(theme_settings.cart_icon)}></Image>}
                        <p className='primary_bg text-[12px] text-[#fff] rounded-[50%] absolute h-[20px] w-[20px] text-center top-[-8px] right-[-8px]'>{cartCount}</p>
                      </div>
                      <p className='text-[13px] text-center line-clamp-1 bottom-[-21px]'>Cart</p>
                    </div> */}

                    <div>
                      <Link href={"/scanner"}>
                        <Image src="/scanner.svg" height={20} width={20} />
                      </Link>
                    </div>
                    <Link href={"/"}>Help</Link>

                    {/* <div onClick={() => { openModal('Wishlist') }} class=" cursor-pointer  flex items-center flex-col justify-center">
                      <div className='relative headerBtbs'>
                        {theme_settings.wishlist_icon && <Image style={{ objectFit: 'contain' }} className='h-[22px] w-[23px]' height={25} width={25} alt='vantage' src={check_Image(theme_settings.wishlist_icon)}></Image>}
                        <p className='primary_bg text-[12px] text-[#fff] rounded-[50%] absolute h-[20px] w-[20px] text-center top-[-8px] right-[-8px]'>{wishlistCount}</p>

                      </div>
                      <p className='text-[13px] text-center line-clamp-1 bottom-[-21px]'>Wishlist</p>
                    </div> */}

                    <Link href={"/"}>About</Link>

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

// const SearchProduct = ({all_categories, router,searchValue, navigateToSearch, get_search_products, searchProducts, theme_settings}) =>{

//   return(
//    <>
//    {searchValue != '' ?
//     <>
//     {searchProducts.length == 0 ? 
//       <NoProductFound cssClass={'flex-col h-[calc(100vh_-_265px)]'} api_empty_icon={theme_settings.nofound_img} heading={'No Products Found!'} />
//       :
//       searchProducts.map((res,index)=>{
//         return(
//           <div onClick={()=>{navigateToSearch('/pr/' + res.route)}} key={index} className='py-[10px] flex items-center border-b-[1px] border-b-slate-100 last:border-b-[0px] justify-between'>
//             <div className='cursor-pointer flex items-center gap-[10px]' key={index}>
//               <Image  className='h-[55px] w-[55px] object-contain' height={60}  width={60} alt='logo' src={check_Image(res.product_image)}></Image>
//               <h6 className='text-[12px] text-center line-clamp-2'>{res.item}</h6> 
//             </div>

//             <Image className='h-[8px] object-contain opacity-60' height={14} width={14} alt='logo' src={'/Arrow/arrowBlack.svg'}></Image>
//         </div>
//         )
//       })
//     }
//     </>
//     :
//       <>
//         <h6 className="text-[14px] gray_color font-medium pt-[6px]">Enter a text to search a products...</h6> 
//         <h6 className="text-[15px] font-medium py-[6px]">Top Categories</h6> 
//         <div className='gap-[10px] grid grid-cols-3'>
//           {all_categories.map((res,index)=>{
//           return(
//             <div className='cursor-pointer flex items-center justify-center flex-col' onClick={()=>{navigateToSearch('/' + res.route)}} key={index}>
//               <Image  className='h-[50px] object-contain' height={60}  width={60} alt='logo' src={check_Image(res.mobile_image)}></Image>
//               <h6 className='text-[12px] text-center'>{res.category_name}</h6> 
//             </div>  
//           )
//           })}
//         </div>
//       </>
//     }
//    </>
//   )
// }

const SliderCart = ({ website_settings, closeModal, router, tabs, openModal, activeTab, wishlistCount, cartCount, cartValue, ClearCart, theme_settings, moveToCart }) => {

  const [tab, setTab] = useState(-1);


  useEffect(() => {
    let value = tabs.find(res => { return res.isActive })
    if (value) {
      // console.log(value)
      setTab(value.label)
    }
  }, [])

  const openModal1 = (type) => {
    openModal(type);
    setTab(tab + 1)
  }



  return (
    <>
      <div className={`flex flex-col h-full w-full`}>


        <div className='grid grid-cols-2'>
          {tabs.map(item => (
            <div onClick={() => { openModal1(item.label) }} className={`${item.isActive ? 'active_parent_Modal' : ''} border-b-[3px] cursor-pointer border-b-[#fff] min-h-[50px] flex items-center justify-center `}>
              <h5 className={`${item.isActive ? 'primary_color' : ''} text-[15px] font-semibold relative`}>
                {item.label}
                
                <p className='primary_bg text-[13px] text-[#fff] rounded-[50%] absolute h-[20px] w-[20px] text-center top-[-8px] right-[-18px]'>{item.label == 'Shopping Cart' ? cartCount : wishlistCount}</p>
              </h5>
            </div>
          ))}
        </div>



        <div className='scrollbarHide overflow-auto h-full'>

          {activeTab == 'Shopping Cart' &&
            <>
              <YourCart headerRodal={true} />
            </>
          }

          {activeTab == 'Wishlist' && <WishList theme_settings={theme_settings} />}
        </div>

        {(activeTab == 'Shopping Cart' && cartCount > 0) &&
          <div className='p-[10px] border-t border-t-slate-100'>
            <div className={`flex items-center justify-between pb-[8px]`}>

              <button onClick={() => { ClearCart() }} className='flex items-center rounded-[5px] p-[5px_10px] cursor-pointer light_bg'>
                <span className='text-[14px] '>Clear Cart</span>
                <Image style={{ objectFit: 'contain' }} className='ml-[7px] h-[18px] w-[20px] opacity-60' height={25} width={25} alt='Delete' src={'/Cart/delete.svg'}></Image>
              </button>

              {(website_settings && website_settings.currency) && <h6 className='text-[15px] pb-[5px] font-semibold openSens'><span className='gray_color text-[14px] px-[2px]'>Total : </span>{currencyFormatter1(cartValue.total + (cartValue.tax ? cartValue.tax : 0), website_settings.currency)}</h6>}

            </div>
            <button onClick={() => { closeModal(), router.push('/checkout') }} className='primary_btn h-[50px] w-full'>Proceed to Checkout</button>
          </div>
        }

        {(activeTab == 'Wishlist' && wishlistCount > 0) &&
          <div onClick={() => { moveToCart() }} className='p-[10px] border-t border-t-slate-100'>
            <button className='primary_btn h-[50px] w-full'>Move to Cart</button>
          </div>
        }

      </div>
    </>
  )
}