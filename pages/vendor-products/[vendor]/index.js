import { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get_vendor_details, seo_Image, getCurrentUrl } from '@/libs/api';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';
const ProductBox = dynamic(() => import('@/components/Product/ProductBox'));
const SortBy = dynamic(() => import('@/components/Product/SortBy'));
const NoProductFound = dynamic(() => import('@/components/Common/NoProductFound'));
const BreadCrumb = dynamic(() => import('@/components/Common/BreadCrumb'));
const MobileHeader = dynamic(() => import('@/components/Headers/mobileHeader/MobileHeader'));
const Modals = dynamic(() => import('@/components/Detail/Modals'));
// import ProductBox from '@/components/Product/ProductBox'
// import SortBy from '@/components/Product/SortBy'
// import NoProductFound from '@/components/Common/NoProductFound';
// import BreadCrumb from '@/components/Common/BreadCrumb'
// import MobileHeader from '@/components/Headers/mobileHeader/MobileHeader'
// import Modals from '@/components/Detail/Modals'
import Image from 'next/image';
import { setBoxView } from '@/redux/slice/websiteSettings'
import { setFilters, resetSetFilters } from '@/redux/slice/ProductListFilters'
import Head from 'next/head'

export default function index({ list }) {

  const router = useRouter();
  let [productList, setProductList] = useState([]);
  let [vendorInfo, setVendorInfo] = useState();

  let [loader, setLoader] = useState(true);
  let [pageLoading, setPageLoading] = useState(true);

  const cartItems = useSelector((state) => state.cartSettings.cartItems)
  const webSettings = useSelector((state) => state.webSettings.websiteSettings)
  const productBoxView = useSelector((state) => state.webSettings.productBoxView)
  let productFilters = useSelector((state) => state.ProductListFilters.filtersValue)
  const dispatch = useDispatch();

  let cardref = useRef();
  let [loadSpinner, setLoadSpinner] = useState(false);
  let [no_product,setNoProduct] = useState(true);



  useEffect(() => {
    dispatch(resetSetFilters());
    setLoader(true);
    setPageLoading(false);
  }, [router])


  useEffect(() => {

      const intersectionObserver = new IntersectionObserver(entries => {
        if (entries[0].intersectionRatio <= 0) return;
   
        if (!no_product) {
           no_product = true
           setNoProduct(no_product)
           setTimeout(()=>{
            let updatedPageNo = productFilters.page_no + 1;
            let obj = { ...productFilters, page_no: updatedPageNo };
            setPageLoading(true);
            dispatch(setFilters(obj));
           },800)
        }
      },{
        root: null,
        rootMargin: "500px",
        threshold: 0.5,
      }
      );
  
      intersectionObserver.observe(cardref?.current);
  
      return () => {
        cardref?.current && intersectionObserver.unobserve(cardref?.current)
      }
    


  }, [productFilters,no_product])

  
 

  useEffect(() => {
    const handleResize = () => {
      const mobileWidth = 768; // Adjust this value to define your mobile width threshold
      if (window.innerWidth <= mobileWidth) {
        dispatch(setBoxView('List View'));
      } else {
        dispatch(setBoxView('Grid View'));
      }
    };

    handleResize(); // Initial check on component mount

    window.addEventListener('resize', handleResize); // Event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, []);


  useMemo(()=>{
    if(typeof window != 'undefined'){
      getProductList();
    }
  },[productFilters])

  function ProductFilter(value) {
    no_product = true
    let obj = { page_no :1 }
    let data = {...value,...obj}  
    window.scrollTo(0, 0);
    setLoader(true);
    setLoadSpinner(true)
    dispatch(setFilters(data));

  }


  async function getProductList() {
    
    let datas =  {
        "route": router.query.vendor,
        "sort_by":productFilters.sort,
        "page_no": productFilters.page_no,
        "page_size": 20,
        "isMobile": 1,
        "show_reviews": 1,
        "customer":localStorage['customerRefId']
    }

    let res = await get_vendor_details(datas);
    setLoader(false);
    setPageLoading(false);
    setLoadSpinner(false);

    if (res && res.message && res.message.products && res.message.products.length != 0) {
      if (productFilters.page_no == 1) {
        
        setProductList(res.message.products)
      } else {
        setProductList(d => d = [...d, ...res.message.products])
      }
      no_product = false
    } else {
      productFilters.page_no == 1 ? setProductList([]) : null;
      no_product = true;
    }

    if(res && res.message && res.message.info){
        setVendorInfo(res.message.info)
    }

    setNoProduct(no_product)
  }



  const [theme_settings, setTheme_settings] = useState()
  const [currentRoute, setCurrentRoute] = useState()


  useMemo(() => {
   
    if (webSettings && webSettings.app_settings) {
      let settings = webSettings.app_settings;
      setTheme_settings(settings);

      let route = router.asPath.split('/')[1]
      let value = webSettings.all_categories.find(res=>{return res.route == route})
      if(value){
        setCurrentRoute(value);
      }
    }

  }, [webSettings,router])

  const [isOpenCat,setIsOpenCat] = useState(false)

  function closeModal(){
    setIsOpenCat(false)
  }

  function titleClick(){
    setIsOpenCat(true)
  }





  return (
    // <ProductList.Provider value={{clearFilter}} >
      <>

      <Head>
        <title>{vendorInfo?.meta_title}</title>
        <meta name="description" content={vendorInfo?.meta_description} />
        <meta property="og:type" content={'Blog'} />
        <meta property="og:title" content={vendorInfo?.meta_title} />
        <meta key="og_description" property="og:description" content={vendorInfo?.meta_description} />
        <meta property="og:image" content={seo_Image(vendorInfo?.meta_image)}></meta>
        <meta property="og:url" content={getCurrentUrl(router.asPath)}></meta>
        <meta name="twitter:image" content={seo_Image(vendorInfo?.meta_image)}></meta>
      </Head>

      {/* <button onClick={()=>{setPageNo(page_no + 1), getProductList()}}>Click</button> */}
        {loadSpinner && <Backdrop />}
       

        {(theme_settings && vendorInfo) && <MobileHeader titleClick={titleClick}  back_btn={true} title={vendorInfo.restaurant_name} search={true} theme_settings={theme_settings}/>}

        <div className='flex items-center justify-between pt-[10px] main-width md:hidden'>
          <BreadCrumb />
          {productList.length != 0 ? <SortBy ProductFilter={ProductFilter} sort_by={productFilters.sort}/> : <></>}
        </div>
        
        
          <div class={`md:mb-[60px] lg:flex main-width lg:py-[10px] gap-[10px] md:bg-slate-100`}>
            
           

            <div className="w-full">
              <>

              {loader ?
                  <Skeleton />
                  :
                  <>
                  {vendorInfo && 
                    <div className='VendorInfo bg-[#f7f7f7d9] p-[15px] rounded-[10px] mb-[10px]'>
                      <h6 className='text-[15px] font-medium'>{vendorInfo.restaurant_name}</h6>
                      <h5 class="text-[14px] font-normal gray_color py-[5px]"><span class="text-[14px] font-normal gray_color">{vendorInfo?.address}{vendorInfo?.city}, {vendorInfo?.state} {vendorInfo.zipcode ? (' - ' + vendorInfo.zipcode) : ''} </span></h5>
                      <Modals />
                    </div>
                   }
                  {(productList.length != 0 && productBoxView) ? <ProductBox productList={productList} productBoxView={productBoxView} rowCount={'flex-[0_0_calc(20%_-_8px)]'}  /> :
                  <>{theme_settings && <NoProductFound cssClass={'flex-col lg:h-[calc(100vh_-_265px)] md:h-[calc(100vh_-_200px)]'} api_empty_icon={theme_settings.nofound_img} heading={'No Products Found!'} />}</>
                  }
                  </>
                } 
              <div className='more' ref={cardref}></div>

              {pageLoading && 
              <div id="wave">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              </div>
              }

              </>
            </div>

          </div>

          {(cartItems && cartItems.length > 0) &&
            <div className='lg:hidden h-[60px] bg-[#fff] flex items-center justify-between fixed w-full bottom-0 z-[99] p-[10px] shadow-[0_0_5px_#ddd]'>
              <div onClick={()=>{router.push('/tabs/yourcart')}} className='flex items-center gap-[5px]'>
               <Image className='h-[35px] w-[35px] object-contain' height={60}  width={60} alt='logo' src={'/cart.svg'}></Image>
              <h6 className='primary_color text-[14px] font-medium'>{cartItems.length} Items</h6>
             </div>
              <button onClick={()=>{router.push('/tabs/yourcart')}} className='primary_btn p-[8px_12px]'>View Cart</button>
            </div>
          }

      </>

  )

}

const Skeleton = ({}) =>{
  return(
    <>
     <div className={`flex items-center animate-pulse lg:gap-[10px] flex-wrap w-full`}>

     <div className='bg-slate-200 h-[125px] mb-[10px] w-[100%] rounded-[10px]'></div>

      {[1,2,3,4,5,6,7,8,9,10].map((res,index)=>{
          return(
            <div className='flex-[0_0_calc(20%_-_8px)] md:flex-[0_0_calc(50%_-_0px)] h-[358px] border-[1px] border-slate-200 rounded-[5px]'>
              <div className='bg-slate-200 h-[182px] md:h-[140px] mb-[10px] md:m-[10px]'></div>
               <div className='p-[8px]'>
                <div className='bg-slate-200 h-[18px] mb-[5px] w-[80%] rounded-[5px]'></div>
                <div className='bg-slate-200 h-[25px] mb-[5px] w-[100%] rounded-[5px]'></div>
                <div className='bg-slate-200 h-[25px] mb-[5px] w-[60%] rounded-[5px]'></div>
                <div className='bg-slate-200 h-[30px] mb-[5px] w-[75%] rounded-[5px]'></div>
               </div> 
               <div className='p-[0_8px_8px_8px] flex items-center justify-between'>
                <div className='bg-slate-200 h-[25px] w-[35%] rounded-[5px]'></div>
                <div className='bg-slate-200 h-[25px] text-end w-[35%] rounded-[5px]'></div>
               </div>  
            </div>
          )
        })
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
          <span className='text-[15px]'>Loading...</span>
       </div>
    </div>
  )
}
