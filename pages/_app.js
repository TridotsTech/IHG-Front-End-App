import '@/styles/globals.scss'
import { Fragment, useEffect, useState } from 'react'
import ErrorBoundary from '@/components/Exception/ErrorBoundary'
import { websiteSettings, check_Image, get_all_category, get_all_masters } from '@/libs/api';
import store from '@/redux/store'
import dynamic from 'next/dynamic';
const BottomTabs = dynamic(() => import('@/components/Common/BottomTabs'))
const WebHeader = dynamic(() => import('@/components/Headers/WebHeader'))
import RootLayout from '@/layouts/RootLayout'
// const RootLayout = dynamic(() => import('@/layouts/RootLayout'))
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux'
import nProgress from "nprogress";
import "nprogress/nprogress.css"

import 'react-lazy-load-image-component/src/effects/blur.css';
import 'rodal/lib/rodal.css'
import 'react-multi-carousel/lib/styles.css';
import 'tailwindcss/tailwind.css';
const BrandCategory = dynamic(() => import('@/components/Common/BrandCategory'))
import settig from '@/libs/websiteSettings'
import ScrollToTopButton from '@/components/Common/ScrollToTop';
// console.log('setting', settig.message)

// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { Poppins } from 'next/font/google'




// const poppins = Poppins({
//   weight: ['300', '400', '500', '600', '700'],
//   display: 'block',
//   preload: true,
//   style: 'normal',
//   subsets: ['latin']
// })


export default function App({ Component, pageProps }) {

  const router = useRouter();
  let [website_settings, setWebsite_settings] = useState()
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {

    // if (navigator && typeof window != 'undefined') {
    //   if ('serviceWorker' in navigator) {
    //     window.addEventListener('load', () => {
    //       // console.log('service work')
    //       navigator.serviceWorker.register('/service-worker.js')
    //         .then(registration => {
    //           // console.log('Service Worker registered: ', registration);
    //         })
    //         .catch(error => {
    //           // console.log('Service Worker registration failed: ', error);
    //         });
    //     });
    //   }
    // }

    // let cls = 0;
    // new PerformanceObserver((entryList) => {
    //   for (const entry of entryList.getEntries()) {
    //     // 500 ms input exclusion window
    //     if (!entry.hadRecentInput) {
    //       cls += entry.value;
    //       console.log('Current CLS value:', cls, entry);
    //     }
    //   }
    //   // the buffered flag enables observer to access entries from before the observer creation
    // }).observe({ type: 'layout-shift', buffered: true });


    get_websiteSettings()

    // setTimeout(() => {
    //   loadScripts()
    // }, 4000);


  }, []);

  useEffect(() => {
    // NProgress.configure({ showSpinner: false });
    nProgress.configure({ showSpinner: false })
    const handleStart = () => {
      nProgress.start()
    };
    const handleComplete = () => {
      nProgress.done()
    };


    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    }

  }, [router])

  async function get_websiteSettings() {
    setWebsite_settings(settig.message);
    // let res = await websiteSettings();
    // if (res && res.message) {
    //   website_settings = res.message;
    //   setWebsite_settings(website_settings)
    // }
  }

  const [categoryData, setCategoryData] = useState([])

  // const getCategoryList = async () => {
  //   try {
  //     const data = await get_all_category()
  //     setCategoryData(data.data)
  //     console.log('catego', data.data)
  //   } catch {

  //   }
  // }


  useEffect(() => {
    // getCategoryList()
    getValue()
  }, [])

  // const loadScripts = () => {
  //   // let lightScipt = document.createElement('script')
  //   // lightScipt.src = "https://cdn.jsdelivr.net/npm/lightgallery@1.6.12/dist/js/lightgallery.min.js"
  //   // lightScipt.async = true;
  //   let lightLink = document.createElement('link')
  //   lightLink.rel = "stylesheet";
  //   lightLink.href = "https://cdnjs.cloudflare.com/ajax/libs/lightgallery/1.6.12/css/lightgallery.min.css"
  //   // let jquery = document.createElement('script')
  //   // jquery.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js"
  //   // jquery.async = true;
  //   // document.head.appendChild(jquery)
  //   // document.head.appendChild(lightScipt)
  //   document.head.appendChild(lightLink)
  // }


  const getActiveTab = (tab_data) => {
    setActiveTab(tab_data)
  }


  const [tabs, setTabs] = useState([

    {
      menu_label: 'Home',
      alt_menu_label: 'Home Icon',
      redirect_url: '/',
      icon: '/Tabs/Home-1.svg',
      active_icon: '/Tabs/Home-fill.svg',
      tab: 'home',
      enable: 1,
    },
    {
      menu_label: 'Category',
      alt_menu_label: 'Categories',
      redirect_url: '/tabs/category',
      icon: '/Tabs/Category-1.svg',
      active_icon: '/Tabs/Category-fill.svg',
      tab: 'category',
      enable: 1
    },
    // {
    //   menu_label: 'Cart',
    //   alt_menu_label: 'Shopping Cart',
    //   redirect_url: '/tabs/yourcart',
    //   icon: '/Tabs/Cart-1.svg',
    //   active_icon: '/Tabs/Cart-fill.svg',
    //   tab: 'yourcart',
    //   enable: 1
    // },
    {
      menu_label: 'Account',
      alt_menu_label: 'User Profile',
      redirect_url: '/profile?my_account=',
      icon: '/Tabs/profile-1.svg',
      active_icon: '/Tabs/Account-filled.svg',
      tab: 'my-profile',
      enable: 1
    },

  ])

  const [shown, setShown] = useState(false)

  useEffect(() => {
    let routeLink = router.asPath;
    let value = tabs.find(res => { return res.redirect_url != '/tabs/yourcart' && res.redirect_url.includes(routeLink) });
    if (value) {
      setShown(true)
    } else {
      if (routeLink && routeLink.includes('/search')) {
        setShown(true)
      } else {
        setShown(false)
      }
    }
  }, [router])


  const [masterValue, setMasterValues] = useState()
  const getValue = async () => {
    const mastersRes = await get_all_masters();
    if (mastersRes && mastersRes.message) {
      // console.log("master", mastersRes.message)
      // console.log(mastersRes.message, "mastersRes.message")
      setMasterValues(mastersRes.message)
      setCategoryData(mastersRes.message.item_group)
    }
  }


  return (
    <>
      <script src="https://cdn.jsdelivr.net/npm/typesense-instantsearch-adapter@2/dist/typesense-instantsearch-adapter.min.js"></script>

      {/* <!-- You might want to pin the version of the adapter used if you don't want to always receive the latest minor version --> */}
      <ErrorBoundary >
        <Provider store={store}>
          <ToastContainer position={'bottom-right'} autoClose={2000} />
          <RootLayout >
            {website_settings && website_settings.app_settings.favicon &&
              <Head>
                {/* <link rel="shortcut icon" href={check_Image(website_settings.app_settings.favicon)} /> */}
                <link rel="shortcut icon" href={'/logo.png'} />
              </Head>}

            {router.pathname != "/login" && router.pathname != "/seller/[login]" && <WebHeader website_settings={website_settings && website_settings} categoryData={categoryData} />}
            {/* <main className={`${poppins.className} min-h-screen w-full`}> */}
            <Component  {...pageProps} />
            {/* </main> */}
            {shown && <div className='lg:hidden'>
              <BottomTabs tabs={tabs} getActiveTab={getActiveTab} activeTab={activeTab} />
            </div>
            }


            <div id='footer'>
              {(masterValue && masterValue['item_group']) && (router.pathname != "/login" && router.pathname != "/[...list]") && <>
                <div className="bg-[#F0F0F0] py-[30px]" >

                  <BrandCategory title={'Categories'} keys={'item_group'} masterValue={masterValue} />
                  <BrandCategory title={'Brands'} keys={'brand'} masterValue={masterValue} sliceKey={30} />

                </div>
                <div className='border-t border-t-[#ddd] w-full text-center bg-[#F0F0F0] py-2'>
                  © 2025 ihg-sigma.vercel.app. All Rights Reserved.
                </div>

              </>}
            </div>

            <ScrollToTopButton />
          </RootLayout>
        </Provider>
      </ErrorBoundary>

    </>
  )
}


