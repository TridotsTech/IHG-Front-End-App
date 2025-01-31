import { HomePage, seo_Image, getCurrentUrl } from "@/libs/api";
import { useEffect, useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
// import IsMobile from "@/libs/hooks/resize";
const MobileHeader = dynamic(() => import("@/components/Headers/mobileHeader/MobileHeader"))
const WebPageSection = dynamic(() => import("@/components/Builders/WebPageSection"))

import Head from 'next/head'

export default function Home({ data, checkIsMobileValue }) {
  const [value, setValue] = useState([]);
  let [isMobile, setIsMobile] = useState(false);
  // const { mobile } = IsMobile()
  const [loading, setLoading] = useState(false);
  const webSettings = useSelector((state) => state.webSettings.websiteSettings);
  const business = useSelector((state) => state.webSettings.business);
  // let page_no = 1;
  let cardref = useRef();
  // let no_product = false;
  const router = useRouter();

  // useEffect(() => {

  //   if (data && data.page_content && data.page_content.length != 0) {
  //     setValue(data.page_content);
  //     page_no = page_no + 1;
  //   }

  //   const intersectionObserver = new IntersectionObserver((entries) => {
  //     if (entries[0].intersectionRatio <= 0) return;

  //     if (!no_product) {
  //       page_no > 1 ? get_home_content() : null;
  //     }
  //   });

  //   intersectionObserver?.observe(cardref?.current);
  //   return () => {
  //     cardref?.current && intersectionObserver?.unobserve(cardref?.current);
  //   };
  // }, [no_product]);

  let [page_no, setPageNo] = useState(1)
  let [no_product, setNoProduct] = useState(false);
  // useEffect(()=>{
  // const param = {
  //       application_type: checkIsMobileValue ? "mobile" : "web",
  //       route: "p/home",
  //       page_no: 1,
  //       page_size: 4,
  //     };

  //     const resp = await HomePage(param);
  //     // const data = await resp.message;
  //     console.log(resp)
  // },[])

  useEffect(() => {
    if (data && data.page_content && data.page_content.length != 0) {
      setValue(data.page_content);
    }

    // get_home_content()
  }, [])

  useEffect(() => {

    // if (page_no) {
    //   if (page_no * 4 == value?.length) {
    //     no_product = false
    //   } else {
    //     no_product = true
    //   }
    // }

    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const cardElement = cardref.current;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const cardPosition = cardElement?.getBoundingClientRect().top;

        if (cardPosition - windowHeight < 2000) {
          // Your logic here when the card is near the viewport
          // Example: dispatch an action or call a function
          // console.log(no_product, 'no_product');
          if (!no_product) {
            no_product = true
            page_no += 1;
            setPageNo(page_no)
            // setNoProduct(no_product)
            // setTimeout(() => {

            // dispatch(setLoad(loadData ? false : true))
            // }, 800)
          }
        }
      };

      window.addEventListener('scroll', handleScroll);

      // Cleanup: Remove the scroll event listener when the component unmounts
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [value, no_product])



  const get_home_content = async () => {

    page_no > 1 ? setLoading(true) : null


    const param = {
      application_type: isMobile ? "mobile" : "web",
      route: "home-page",
      page_no: page_no,
      page_size: 4,
      business: localStorage['business'] ? localStorage['business'] : ''
    };

    const resp = await HomePage(param);
    const data = await resp.message;
    if (data && data.page_content && data.page_content.length != 0) {
      if (page_no == 1) {
        setValue(data.page_content);
      } else {
        setValue((d) => (d = [...d, ...data.page_content]));
        setLoading(false);
      }
      // page_no += 1;
      // setPageNo()
      no_product = false;
      setNoProduct(no_product)
    } else {
      no_product = true;
      setNoProduct(no_product)
      setLoading(false);
    }

  };

  function getHomePageValues() {
    page_no = 1
    setPageNo(page_no)
    setValue([])
    get_home_content();
  }

  const [theme_settings, setTheme_settings] = useState();

  useMemo(() => {
    if (webSettings && webSettings.app_settings) {
      let settings = webSettings.app_settings;
      setTheme_settings(settings);
    }
  }, [webSettings]);

  useMemo(() => {
    if (typeof window != 'undefined') {
      if (business || localStorage['business']) {
        no_product = true;
        getHomePageValues()

      }
    }
  }, [business]);



  useEffect(() => {
    // if (typeof window !== 'undefined') {
    //   if (mobile) {
    //     getHomePageValues()
    //   }
    // }
    const handleResize = () => {
      const mobileWidth = 768; // Adjust this value to define your mobile width threshold
      if (window.innerWidth <= mobileWidth) {
        isMobile = true
        setIsMobile(isMobile);
      } else {
        isMobile = false
        setIsMobile(isMobile);
      }

      if (window.innerWidth == 768) {
        getHomePageValues()
      }

    };

    handleResize(); // Initial check on component mount

    window.addEventListener('resize', handleResize); // Event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, []);


  return (
    <>
      <Head>
        {/* <title>{data?.meta_info?.meta_title ? data?.meta_info?.meta_title : "Single Vendor"}</title> */}
        <title>{"IHG"}</title>
        <meta name="description" content={data?.meta_info?.meta_description ? data?.meta_info?.meta_description : "Single Vendor"} />
        <meta property="og:type" content={'Blog'} />
        <meta property="og:title" content={data?.meta_info?.meta_title ? data?.meta_info?.meta_title : "Single Vnedor"} />
        <meta key="og_description" property="og:description" content={data?.meta_info?.meta_description} />
        <meta property="og:image" content={seo_Image(data?.meta_info?.meta_image)}></meta>
        <meta property="og:url" content={getCurrentUrl(router.asPath)}></meta>
        <meta name="twitter:image" content={seo_Image(data?.meta_info?.meta_image)}></meta>
      </Head>

      <div className={`lg:hidden sticky top-0 z-[99] bg-white md:min-h-[45px] md:w-full your-element`}>
        {theme_settings && (
          <MobileHeader home={true} cart={true} theme_settings={theme_settings} />
        )}
      </div>


      {/* {memoizedState} */}
      <WebPageSection />


    </>

  );
}


export async function getServerSideProps(context) {
  const userAgent = context.req.headers['user-agent'];
  const checkIsMobileValue = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );
  const param = {
    application_type: checkIsMobileValue ? "mobile" : "web",
    route: "home-page",
    page_no: 1,
    page_size: 4,
  };

  // const resp = await HomePage(param);
  const data = []


  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data, checkIsMobileValue },
    // revalidate: 120
  }
}
