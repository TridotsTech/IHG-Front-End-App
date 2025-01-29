import { useMemo, useState } from 'react'
import Image from 'next/image';
import { check_Image, currencyFormatter1, delete_cart_items, get_cart_items, move_item_to_cart, move_all_tocart } from '@/libs/api';
import { useSelector, useDispatch } from 'react-redux';
import { setCartItems } from '@/redux/slice/cartSettings'
import dynamic from 'next/dynamic';
const NoProductFound = dynamic(() => import('@/components/Common/NoProductFound'))
// import NoProductFound from '@/components/Common/NoProductFound';
import { toast } from 'react-toastify';

export default function WishList({ theme_settings, myprofile }) {

  const carItems = useSelector((state) => state.cartSettings.wishlistItems)
  const webSettings = useSelector((state) => state.webSettings.websiteSettings)
  const [theme_setting, setTheme_settings] = useState()

  const dispatch = useDispatch();
  // const [enableModal, setEnableModal] = useState(false)
  // const [alertMsg, setAlertMsg] = useState({})


  useMemo(() => {

    if (webSettings && webSettings.app_settings) {
      let settings = webSettings.app_settings;
      setTheme_settings(settings);
    }

  }, [webSettings])

  async function DeleteCart(dataValue, index) {
    let param = { name: dataValue.name, customer_id: localStorage['customerRefId'] }
    const resp = await delete_cart_items(param);
    if (resp.message.status == 'success') {
      get_cart_item()
    }
  }

  async function MoveToCart(dataValue, index) {
    let param = { name: dataValue.name, customer_id: localStorage['customerRefId'] }
    const resp = await move_item_to_cart(param);
    if (resp.message.status == 'success') {
      get_cart_item()
    } else {
      toast.error(resp.message.message)
    }
  }

  async function get_cart_item() {
    let res = await get_cart_items();
    if (res && res.message && res.message.status && res.message.status == "success") {
      dispatch(setCartItems(res.message));
    }
  }

  //   async function DeleteCart(data,index) {
  //     setAlertMsg({message:'Do you want to delete the item',name:data.name,index:index});
  //     setEnableModal(true);
  // }

  async function moveAllToCart() {
    let param = { customer_id: localStorage['customerRefId'] }
    const res = await move_all_tocart(param);
    if (res && res.message && res.message.status == 'Success') {
      get_cart_item()
    } else {
      toast.error(res.message.message)
    }
  }

  function sanitizeHtml(htmlValue) {
    const stringWithHtmlTags = htmlValue;
    const withoutTags = stringWithHtmlTags.replace(/<\/?[^>]+(>|$)/g, "");
    return withoutTags;
  }


  return (
    <>
      {carItems && carItems.length != 0 ?
        <ul className='w-[calc(100%_-_20px)] border-[1px] border-slate-100 rounded-[5px] m-[10px]'>
          {carItems && carItems.length != 0 && carItems.map((item, index) => {
            return (
              <li className={`flex items-center p-[8px] border-b-[1px] border-b-slate-100 last:border-[0] relative`}>
                <div className='flex items-center justify-center h-[95px] w-[95px]'><Image className='h-[95px] w-[95px] object-contain' height={100} width={100} alt='logo' src={check_Image(item.image)}></Image></div>
                <div className=' w-full p-[10px]'>
                  <h3 className='text-[14px] py-[5px] font-semibold line-clamp-1'>{item.item}</h3>
                  {item.attribute_description && <span className='gray_color text-[12px] pb-[5px] line-clamp-1' dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.attribute_description) }} ></span>}
                  {/* <h6 className='text-[12px] pb-[5px] font-semibold primary_color'><span className='gray_color text-[12px] px-[2px]'>Sold by : </span>{item.vendor_name}</h6> */}
                  {(webSettings && webSettings.currency) && <h3 className='text-[13px] pb-[5px] font-semibold openSens'>{currencyFormatter1(item.price, webSettings.currency)}</h3>}
                  <div className='flex items-center justify-end gap-[8px]'>

                    <button onClick={() => { MoveToCart(item, index) }} className='flex items-center rounded-[5px] p-[5px_10px] cursor-pointer bg-[#0080001c]'>
                      <span className='text-[#008000] text-[14px] '>Add</span>
                      <Image style={{ objectFit: 'contain' }} className='ml-[7px] h-[18px] w-[20px] opacity-60' height={25} width={25} alt='Delete' src={'/Cart/cart-active.svg'}></Image>
                    </button>
                    <button onClick={() => { DeleteCart(item, index) }} className='flex items-center rounded-[5px] p-[5px_10px] cursor-pointer bg-[#ff000014]'>
                      <span className='text-red-500 text-[14px] '>Remove</span>
                      <Image style={{ objectFit: 'contain' }} className='ml-[7px] h-[18px] w-[20px] opacity-60' height={25} width={25} alt='Delete' src={'/Cart/delete-red.svg'}></Image>
                    </button>

                  </div>
                </div>
              </li>
            )
          })
          }

          {myprofile &&
            <div className='flex items-center justify-center'>
              <button onClick={() => { moveAllToCart() }} className='primary_btn w-[280px] m-[10px_auto] h-[50px]'>Move to Cart</button>
            </div>
          }
        </ul>
        :
        <>{theme_setting && <NoProductFound cssClass={'flex-col h-[calc(100vh_-_95px)]'} api_empty_icon={theme_setting.no_wishlist} heading={'No Wishlist Items!'} sub_heading={'Sorry, your wishlist is empty!'} />}</>
      }
    </>
  )

}