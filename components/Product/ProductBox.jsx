import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image';
import dynamic from 'next/dynamic';
const CardButton = dynamic(() => import('@/components/Product/CardButton'))
// const QuickView = dynamic(() => import('@/components/Product/QuickView'))
const Variants = dynamic(() => import('@/components/Product/Variants'))
const Rodal = dynamic(() => import('rodal'))
const ImageLoader = dynamic(() => import('@/components/ImageLoader'))
// import CardButton from '@/components/Product/CardButton'
// import QuickView from '@/components/Product/QuickView'
// import Variants from '@/components/Product/Variants'
// import Rodal from 'rodal';
// import ImageLoader from '@/components/ImageLoader'
import { useSelector, useDispatch } from 'react-redux';
import { check_Image, checkMobile, currencyFormatter1, delete_cart_items, get_cart_items, insert_cart_items } from '@/libs/api';
import { setCartItems } from '@/redux/slice/cartSettings'
// import 'rodal/lib/rodal.css';
// import { Open_Sans } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router';

// const open_Sans = Open_Sans({
//   weight: ['300', '400', '500', '600', '700'],
//   display: 'block',
//   preload: true,
//   style: 'normal',
//   subsets: ['latin']
// })

export default function ProductBox({ productList, size, rowCount, leftHorizontalImage, scroll_button, scroll_id, productBoxView, home, remove_bg,openFilter,tabView }) {
  // console.log('produ', productList)
  const webSettings = useSelector((state) => state.webSettings.websiteSettings);
  const cartItems = useSelector((state) => state.cartSettings.cartItems)
  const wishlistItems = useSelector((state) => state.cartSettings.wishlistItems)
  const dispatch = useDispatch();
  const [sample, setSample] = useState(0)
  // const [quick, setQuick] = useState(-1)
  // const [isMobile, setIsmobile] = useState(false)
  // console.log(productList)



  const setProductQty = () => {
    if (productList && Array.isArray(productList)) {
      productList.map(res => {
        // res.count = checkCart1(res.name,cartItems)


        if (res.vendor_price_list && res.vendor_price_list[0] && res.vendor_price_list[0].business) {
          res.business = res.vendor_price_list[0].business
        }

        if (res.has_variants == 1) {
          var cnt = 0;
          var cart_id = undefined;
          if (res.vendor_price_list) {

            res.vendor_price_list.length > 0 && res.vendor_price_list[0].variants.map(variant => {
              if (cartItems && cartItems.length != 0) {
                cnt = 0;
                cart_id = undefined;
                let value = cartItems.find(r => { return (r.attribute_ids == variant.attribute_id) })
                if (value) {
                  cnt += value.quantity;
                  cart_id = value.name
                }
              }
              variant.count = cnt;
              variant.cart_id = cart_id;
              variant.business = res.vendor_price_list[0].business
              variant.name = res.name
            })
          }

          //  Initial count set
          if (res.vendor_price_list && res.vendor_price_list.length > 0 && res.vendor_price_list[0].default_variant) {
            // let variant = res.vendor_price_list[0].default_variant.attribute_id
            // let value = cartItems.find(r => { return (r.attribute_ids == variant) })
            // res.count = (value && value.quantity) ? value.quantity : undefined;
            // res.cart_id = (value && value.name) ? value.name : undefined;

            // Set Total Count

          } else {
            var cnt = 0;
            var cart_id = undefined;
            if (cartItems && cartItems.length != 0) {
              let value = cartItems.find(r => { return (r.product == res.name && r.is_free_item != 1) })
              if (value) {
                cnt += value.quantity;
                cart_id = value.name
              }
            }
            res.count = cnt;
            res.cart_id = cart_id;
          }

          let countArray = cartItems.filter(r => { return (r.product == res.name && r.is_free_item != 1) })
          var cnt = 0;

          if (countArray.length != 0) {
            countArray.map(res => {
              cnt += res.quantity;
            })
          }

          res.count = cnt;

        } else {
          var cnt = 0;
          var cart_id = undefined;
          if (cartItems && cartItems.length != 0) {
            let value = cartItems.find(r => { return (r.product == res.name && r.is_free_item != 1) })
            if (value) {
              cnt += value.quantity;
              cart_id = value.name
            }
          }
          res.count = cnt;
          res.cart_id = cart_id;
        }

        var wish = 0
        var wish_id = undefined;
        if (wishlistItems && wishlistItems.length != 0) {
          let value = wishlistItems.find(r => { return (r.product == res.name && r.is_free_item != 1) })

          if (value) {
            wish += value.quantity;
            wish_id = value.name
          }
        }
        res.wish_count = wish;
        res.wish_id = wish_id;

        if (res.vendor_price_list && res.vendor_price_list[0]) {
          if (res.has_variants == 1) {
            let default_variant = res.vendor_price_list[0].default_variant;
            res.default_variant = default_variant
            res.price = default_variant.product_price
            res.old_price = default_variant.old_price
            res.discount_percentage = default_variant.discount_percentage
            res.stock = default_variant.stock
          } else {
            let default_variant = res.vendor_price_list[0];
            // res.default_variant = default_variant
            res.price = default_variant.product_price
            res.old_price = default_variant.old_price
            res.discount_percentage = default_variant.discount_percentage
            res.stock = default_variant.stock
          }
        }
      })
      // setProductList(data)
    }
  }

  useMemo(() => {
    // setProductQty();
    // console.log('routetproduct')
  }, [cartItems, productList])

  useMemo(() => { }, [webSettings])

  async function addRemovewish(item) {
    if (item.wish_count == 1) {
      let param = { name: item.wish_id, "customer": localStorage['customerRefId'] }
      const resp = await delete_cart_items(param);
      if (resp.message.status == 'success') {
        get_cart_item()
      }
    } else {
      insert_cart(item)
    }
  }

  async function insert_cart(value) {
    let param = {
      "item_code": value.name,
      "qty": 1,
      "qty_type": "",
      "cart_type": "Wishlist",
      "customer": localStorage['customerRefId'],
      "attribute": value.attribute ? value.attribute : '',
      "attribute_id": value.attribute_ids ? value.attribute_ids : '',
      "business": value.business ? value.business : ''
    }

    const resp = await insert_cart_items(param);
    // setTimeout(()=>{setLoader(-1)},500)
    if (resp.message && resp.message.marketplace_items) {
      localStorage['customerRefId'] = resp.message.customer
      get_cart_item()
    } else if (resp.message && resp.message.status == 'Failed') {
      //   setAlertMsg({message:resp.message.message});
    }
  }

  async function get_cart_item() {
    let res = await get_cart_items();
    if (res && res.message && res.message.status && res.message.status == "success") {
      dispatch(setCartItems(res.message));
    }
  }


  const [isOpen, setIsOpen] = useState(false)
  let [variantItems, setVariantItems] = useState()


  const variantOpen = (variantItems) => {
    setVariantItems(variantItems)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  let isDown = false;
  var slider = '';



  useEffect(() => {
    const handleResize = () => {
      const mobileWidth = 768; // Adjust this value to define your mobile width threshold
      if (window.innerWidth <= mobileWidth) {

      } else {
        scrollingFn()
      }
    };

    handleResize(); // Initial check on component mount

    window.addEventListener('resize', handleResize); // Event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, [])

  function scrollingFn() {
    let slider_child_id = 'sliderID' + (scroll_id ? scroll_id : '')
    if (slider_child_id) {
      slider = document.getElementById(slider_child_id);
      (() => {
        slider.addEventListener('mousedown', start);
        slider.addEventListener('touchstart', start);

        slider.addEventListener('mousemove', move);
        slider.addEventListener('touchmove', move);

        slider.addEventListener('mouseleave', end);
        slider.addEventListener('mouseup', end);
        slider.addEventListener('touchend', end);
      })();
    }
  }

  const sctollTo = (direction) => {

    let slider_child_id = document.getElementById('sliderID' + (scroll_id ? scroll_id : ''))

    if (slider_child_id) {
      let slider_div = slider_child_id;
      let slider_width = slider_child_id.clientWidth
      if (size) {
        //  console.log(data.left_image ,"ghjkl")
        if (direction == 'next') {
          slider_div.scrollBy({ top: 0, left: 300, behavior: 'smooth' });
        } else {
          slider_div.scrollBy({ top: 0, left: -300, behavior: 'smooth' });
        }
      }
      else {
        if (direction == 'next') {
          slider_div.scrollBy({ top: 0, left: 250, behavior: 'smooth' });
        } else {
          slider_div.scrollBy({ top: 0, left: -250, behavior: 'smooth' });
        }
      }

      let nextBtn = document.getElementById('next_' + (scroll_id ? scroll_id : ''))
      let prevBtn = document.getElementById('prev_' + (scroll_id ? scroll_id : ''))

      // console.log(slider_div.scrollLeft)
      // console.log(slider_div.offsetWidth + slider_div.scrollLeft)
      // console.log(slider_div.scrollWidth)

      if (slider_div.scrollLeft == 0) {
        prevBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
      } else if (slider_div.offsetWidth + slider_div.scrollLeft == slider_div.scrollWidth - 1) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
      } else if (slider_div.scrollLeft > 0) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
      }

      setSample(sample + 1)
    }
  }

  // const containerRef = useRef(null);
  // const [isDragging, setIsDragging] = useState(false);
  let startX = ''
  let scrollLeft = ''

  // start
  const end = () => {
    isDown = false;
    slider.classList.remove('active');
  }

  const start = (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  }

  const move = (e) => {
    if (!isDown) return;

    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    const dist = (x - startX);
    slider.scrollLeft = scrollLeft - dist;
  }

  // const [enableQuick, setEnableQuick] = useState(false)
  // const [quickItems, setQuickItems] = useState(false)

  // function enableQuickFn(item) {
  //   setQuick(-1)
  //   setQuickItems(item)
  //   setEnableQuick(true)
  // }

  // function closeQuickModal() {
  //   setEnableQuick(false)
  // }

  // document.addEventListener('keydown', (event) => {
  //   if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
  //     closeModal()
  //     closeQuickModal()// Call your function to hide the popup
  //   }
  // });

  useEffect(() => {
    if (isOpen) {
      // if (enableQuick || isOpen) {
      document.body.classList.add('active_visible')
    } else {
      document.body.classList.remove('active_visible')
    }

  }, [isOpen])

  const [isMobile, setIsMobile] = useState()
  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile)
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [])

  const checkIsMobile = async () => {
    let isMobile = await checkMobile();
    setIsMobile(isMobile);
  }

  const router = useRouter()

  const navigateDetail = (item) => {
    localStorage['product_detail'] = JSON.stringify(item.document)
    router.push('/pr/' + item.document.item_code)
  }

  return (
    <>
      {(isOpen && variantItems) && <div className='varinatspopup'>
        <Rodal visible={isOpen} enterAnimation='lg:slideRight md:slideSown' animation='' onClose={closeModal}>
          <Variants item={variantItems} />
        </Rodal>
      </div>
      }
      {/* {
        enableQuick && <div className='QuickViewPopup'>
          <Rodal visible={enableQuick} enterAnimation='lg:slideRight md:slideSown' animation='' onClose={closeQuickModal}>
            <QuickView item={quickItems} webSettings={webSettings} closeQuickModal={closeQuickModal} />
          </Rodal>
        </div>
      } */}

      <div className={`w-full relative your-element ${home ? 'md:min-h-[300px]' : ''}`}>

        <div className={`${!scroll_button && 'hidden'} absolute top-[40%] left-[-22px] h-[35px] w-[35px] z-10 bg-[#fff] text-black border-[1px]  border-slate-100 rounded-full flex items-center justify-center  cursor-pointer md:hidden`} onClick={() => sctollTo('prev')} id={'prev_' + (scroll_id ? scroll_id : '')}> <Image className='h-[12px] object-contain' alt="Prev" src={'/rightArrow.svg'} width={35} height={35} /></div>

        <ul id={'sliderID' + (scroll_id ? scroll_id : '')} className={` ${home ? 'lg:gap-[20px]' : 'lg:gap-[10px]'} ${!scroll_button && 'flex-wrap'} ${scroll_button ? 'gap-[10px]' : ''} product_box w-full flex overflow-auto scrollbarHide ${(productBoxView && productBoxView == 'List View') ? 'p-[5px] lg:grid lg:grid-cols-2 tab:grid-cols-2 lg:gap-5' : 'lg:grid lg:grid-cols-4 tab:grid-cols-3 2xl:grid-cols-5 lg:gap-3'} ${openFilter && tabView ? (productBoxView && productBoxView == 'List View') ? 'tab:!grid-cols-1' : 'tab:!grid-cols-2' : ''} ${(home) ? 'md:min-h-[300px] md:w-full your-element' : ''}`}>

          {leftHorizontalImage && <Image src={check_Image(leftHorizontalImage)} width={400} height={400} alt="icon1" className="lg:hidden h-[300px] w-[200px] object-cover" />}


          {(productList && productList.length != 0 && Array.isArray(productList)) && productList.map((item, index) => {
            return (
              // onMouseEnter={() => { setQuick(index) }} onMouseLeave={() => { setQuick(-1) }}
              <li key={index} className={`${rowCount ? rowCount : 'flex-[0_0_calc(25%_-_8px)]'} ${(productBoxView && productBoxView == 'List View') ? 'lg:flex-[0_0_calc(50%_-_5px)] md:flex-[0_0_calc(100%_-_0px)] flex items-center mb-[5px] p-[5px]' : (scroll_button ? 'md:flex-[0_0_calc(60%_-_0px)] ' : 'md:flex-[0_0_calc(50%_-_0px)] ')} relative your-element border`} >


                <div className={`${remove_bg ? '' : 'product_images'} product_images_container  flex cursor-pointer items-center justify-center lg:h-[230px]  relative ${(productBoxView && productBoxView == 'List View') ? 'md:h-[140] md:w-[140px] lg:w-[25%] lg:!h-[120px]' : 'md:h-[170px] md:w-[100%] pb-[10px] '} your-element `}>
                  <Link onClick={()=> navigateDetail(item)} href={'/pr/' + item.document.item_code} className={` ${productBoxView && productBoxView == 'List View' ? 'lg:!h-[120px]' : 'lg:h-[220px]'}  md:h-[125px] md:w-[125px] lg:w-full your-element`}><ImageLoader height={(productBoxView && productBoxView == 'List View') ? (isMobile ? 120 : 120) : isMobile ? 125 : 220} width={'100'} style={`${productBoxView && productBoxView == 'List View' ? 'lg:!h-[120px]' : 'lg:h-[220px]'}  lg:w-full md:h-[125px] md:w-[125px] object-cover your-element`} src={item.document.website_image_url} title={item.item ? item.item : ''} /></Link>
                  {(item.document.offer_rate) ? <h6 className='bg-green-500 text-[#fff] p-[3px_13px] absolute top-3 left-2 rounded-[5px] text-[12px]'>{parseFloat((item.document.offer_rate/item.document.rate)*100).toFixed(1)}<span className='px-[0px] text-[#fff] text-[12px]'>% off</span> </h6> : <></>}
                </div>

                <div className={`${(productBoxView && productBoxView == 'List View') ? 'md:w-full lg:w-[75%]' : ''} p-[10px]`}>
                  {/* <Link href={'/pr/' + item.route} className={`${productBoxView && productBoxView == 'List View' ? 'h-fit' : 'h-[50px] lg:h-[65px]'} text-[14px] lg:text-[18px] cursor-pointer py-[5px] font-[700] line-clamp-2 capitalize`}>{item.item}</Link> */}

                  <p onClick={() => navigateDetail(item)} className={`line-clamp-2 cursor-pointer pt-[5px] h-[60px] text-[15px] md:text-[12px] font-semibold md:leading-[2.1] lg:leading-[25px] openSens gray_color`}>{item.document.item_name}</p>

                  <p dangerouslySetInnerHTML={{ __html: item.document.item_description }} className={`line-clamp-2 pt-[5px] text-[13px] md:text-[12px] h-[50px] md:leading-[2.1] lg:leading-[25px] openSens innerHtml_desc`} />

                  <div className='flex items-center gap-5 justify-between mt-2'>
                    {(webSettings && webSettings.currency) && <h3 className={`text-[14px] primary_color inline-flex gap-[6px] float-left font-semibold openSens `}>AED {item.document.offer_rate > 0 ? (<p className='text-green-600 font-semibold'>{parseFloat(item.document.offer_rate).toFixed(2)} <span className=' line-through font-medium text-gray-700 ml-[2px]'>{parseFloat(item.document.rate).toFixed(2)}</span></p>) : (<p className='font-semibold'>{parseFloat(item.document.rate).toFixed(2)}</p>) }</h3>}

                    
                  </div>
                  <p className={`line-clamp-1 uppercase py-[5px] text-[13px] md:text-[11px] md:leading-[2.1] font-semibold lg:leading-[25px] text-[#189E46]`}>IN STOCK ({item.document.stock ? item.document.stock : '0'} {item.document.stock_uom ? item.document.stock_uom : ''})</p>

                </div>
              </li>
            )
          })}

        </ul>

        <div className={`${!scroll_button && 'hidden'} absolute top-[40%] right-[-10px] h-[35px] w-[35px] z-10 bg-[#fff] text-black border-[1px] border-slate-100  rounded-full flex items-center justify-center cursor-pointer md:hidden`} onClick={() => sctollTo('next')} id={'next_' + (scroll_id ? scroll_id : '')}><Image className='h-[12px] object-contain' alt="forward" src={'/leftArrow.svg'} width={35} height={35} /> </div>

      </div>
    </>
  )
}
