import { useMemo, useState } from 'react'
import Image from 'next/image';
import { check_Image, currencyFormatter1, delete_cart_items, get_cart_items } from '@/libs/api';
import { useSelector, useDispatch } from 'react-redux';
import { setCartItems } from '@/redux/slice/cartSettings'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';
const CardButton = dynamic(()=> import('@/components/Product/CardButton'))
const AlertUi = dynamic(()=> import('@/components/Common/AlertUi'))
const NoProductFound = dynamic(()=> import('@/components/Common/NoProductFound'))
const YouMayLike = dynamic(()=> import('@/components/Common/YouMayLike'))
// import CardButton from '@/components/Product/CardButton'
// import AlertUi from '@/components/Common/AlertUi';
// import NoProductFound from '@/components/Common/NoProductFound';
// import YouMayLike from '@/components/Common/YouMayLike'

export default function YourCart({ headerRodal, checkout, myprofile, mobileCart }) {

  const router = useRouter();
  const cartItems = useSelector((state) => state.cartSettings.cartItems)
  const you_may_like = useSelector((state) => state.cartSettings.you_may_like)
  const cartValue = useSelector((state) => state.cartSettings.cartValue)
  const dispatch = useDispatch();
  const [enableModal, setEnableModal] = useState(false)
  const [alertMsg, setAlertMsg] = useState({})
  const webSettings = useSelector((state) => state.webSettings.websiteSettings)
  const [theme_settings, setTheme_settings] = useState()

  useMemo(() => {

    if (webSettings && webSettings.app_settings) {
      let settings = webSettings.app_settings;
      setTheme_settings(settings);
    }

  }, [cartItems, webSettings])

  // async function DeleteCart(dataValue){
  //   let param = { name: dataValue.cart_id,}
  //     const resp = await delete_cart_items(param);
  //     if (resp.message.status == 'success') {
  //         get_cart_item()
  //     }
  // }

  async function get_cart_item() {
    let res = await get_cart_items();
    if (res && res.message && res.message.status && res.message.status == "success") {
      dispatch(setCartItems(res.message));
    }
  }

  async function DeleteCart(data, index) {
    setAlertMsg({ message: 'Do you want to delete the item ?', name: data.name, index: index });
    setEnableModal(true);
  }

  async function closeModal(value) {
    setEnableModal(false);
    if (value == 'Yes') {
      let param = { name: alertMsg.name, customer_id: localStorage['customerRefId'] }
      const resp = await delete_cart_items(param);
      if (resp.message.status == 'success') {
        get_cart_item()
        setAlertMsg({});
      }
    }
  }

  function sanitizeHtml(htmlValue) {
    const stringWithHtmlTags = htmlValue;
    const withoutTags = stringWithHtmlTags.replace(/<\/?[^>]+(>|$)/g, "");
    return withoutTags;
  }

  return (
    <>
      {enableModal &&
        <AlertUi isOpen={enableModal} closeModal={(value) => closeModal(value)} headerMsg={'Alert'} button_1={'No'} button_2={'Yes'} alertMsg={alertMsg} />
      }
      {cartItems && cartItems.length != 0 ?
        <div className={`${checkout && !myprofile ? 'h-[150px] overflow-auto customScrollBar' : (mobileCart ? 'm-[5px] w-[calc(100%_-_10px)]' : 'm-[10px]')}`}>
          <ul className={`${mobileCart ? 'p-[10px]' : ''} w-[calc(100%)] border-[1px] border-slate-100 rounded-[5px] bg-[#fff]`}>
            {cartItems && cartItems.length != 0 && cartItems.map((item, index) => {
              return (
                <li key={index} className={`flex items-center p-[8px] border-b-[1px] border-b-slate-100 last:border-b-[0] relative`}>
                  <div className='flex items-center justify-center h-[95px] w-[95px]'><Image className='h-[95px] w-[95px] object-contain' height={100} width={100} alt='logo' src={check_Image(item.image)}></Image></div>
                  <div className='w-full p-[10px]'>
                    <h3 className='text-[14px] py-[5px] font-semibold line-clamp-1 capitalize'>{item.item}</h3>
                    {item.attribute_description && <span className='gray_color text-[12px] pb-[5px] line-clamp-1' dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.attribute_description) }} ></span>}
                    {/* <h6 className='text-[12px] pb-[5px] font-semibold primary_color capitalize'><span className='gray_color text-[12px] px-[2px]'>Sold by : </span>{item.vendor_name}</h6> */}

                    <div className={`flex items-center justify-between`}>
                      {(webSettings && webSettings.currency) && <h3 className='text-[13px] font-semibold openSens'>{currencyFormatter1(item.price, webSettings.currency)}</h3>}
                      <div className='flex items-center gap-[5px]'>
                        <CardButton item={item} index={index} />
                        <div onClick={() => { DeleteCart(item, index) }} className='cursor-pointer h-[27px] w-[25px] bg-[#ff000014] rounded-[5px] flex items-center justify-center'> <Image style={{ objectFit: 'contain' }} className='h-[18px] w-[20px] opacity-60' height={25} width={25} alt='Delete' src={'/Cart/delete-red.svg'}></Image></div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })
            }
          </ul>

          {
            (headerRodal && you_may_like && you_may_like.length != 0) &&
            <>
              <div className='ain-width p-[15px_10px]'>
                <h3 className='text-[15px] font-[500] mb-[8px]'>You may like this</h3>
                <YouMayLike productList={you_may_like} rowCount={'w-[55%]'} scroll_button={true} scroll_id='you_may_like' />
              </div>
            </>
          }

          {(!checkout || mobileCart) &&
            <>
              <h5 className='md:m-[8px] m-[8px_5px_5px_5px] text-[14px] font-medium'>Bill Details</h5>

              {(webSettings && webSettings.currency) && <div className='flex items-center flex-wrap p-[0_5px] md:p-[0_8px]'>
                <h5 className='w-[50%] mb-[2px] text-[14px] gray_color'>Subtotal</h5>
                <h5 className='w-[50%] text-end mb-[2px] text-[14px] openSens'>{currencyFormatter1(cartValue.total, webSettings.currency)}</h5>
                {/* <h5 className='w-[50%] mb-[2px] text-[14px] gray_color'>Delivery Charges</h5>
                <h5 className='w-[50%] text-end mb-[2px] text-[14px] openSens'>{currencyFormatter1('0', webSettings.currency)}</h5> */}
                <h5 className='w-[50%] mb-[2px] text-[14px] gray_color'>Tax</h5>
                <h5 className='w-[50%] text-end mb-[2px] text-[14px] openSens'>{currencyFormatter1(cartValue.tax ? cartValue.tax : '0', webSettings.currency)}</h5>
              </div>
              }
            </>
          }

          {myprofile &&
            <div className='flex items-center justify-center'>
              <button onClick={() => { router.push('/checkout') }} className='primary_btn w-[280px] m-[10px_auto] h-[50px]'>Proceed to Checkout</button>
            </div>
          }

          {mobileCart &&
            <div className='lg:hidden h-[60px] bg-[#fff] flex items-center justify-between fixed w-full bottom-0 z-[99] p-[10px] ml-[-5px] shadow-[inset_0px_10px_10px_-10px_#ddd]'>
              <div className='flex items-center gap-[5px]'>
                <Image className='h-[35px] w-[35px] object-contain' height={60} width={60} alt='logo' src={'/cart.svg'}></Image>
                <h6 className='primary_color text-[14px] font-medium'>{cartItems.length} Items</h6>
              </div>
              <button onClick={() => { router.push('/checkout') }} className='primary_btn p-[8px_12px]'>Proceed to Checkout</button>
            </div>
          }

        </div>
        :
        <>{theme_settings && <NoProductFound cssClass={'flex-col h-[calc(100vh_-_95px)]'} api_empty_icon={theme_settings.no_cart} heading={'No Cart Items!'} sub_heading={'Sorry, your cart is empty!'} />}</>
      }
    </>
  )
}