import { HomePage, seo_Image, getCurrentUrl } from "@/libs/api";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
// import IsMobile from "@/libs/hooks/resize";
const MobileHeader = dynamic(() => import("@/components/Headers/mobileHeader/MobileHeader"))
const WebPageSection = dynamic(() => import("@/components/Builders/WebPageSection"))

import Head from 'next/head'

export default function Home() {
  let [isMobile, setIsMobile] = useState(false);
  const webSettings = useSelector((state) => state.webSettings.websiteSettings);
  const router = useRouter();

  const [theme_settings, setTheme_settings] = useState();

  useMemo(() => {
    if (webSettings && webSettings.app_settings) {
      let settings = webSettings.app_settings;
      setTheme_settings(settings);
    }
  }, [webSettings]);

  const [data, setData] = useState([])

  useEffect(()=>{
    const getData = async()=>{
      const param = {
            application_type: "web",
            route: "default-home-page",
          };
      const resp = await HomePage(param);
      const data = resp.message ? resp.message : {}
      setData(data)
    }

    getData();

  }, [])


  useEffect(() => {
    const handleResize = () => {
      const mobileWidth = 768; // Adjust this value to define your mobile width threshold
      if (window.innerWidth <= mobileWidth) {
        isMobile = true
        setIsMobile(isMobile);
      } else {
        isMobile = false
        setIsMobile(isMobile);
      }

    };

    handleResize(); // Initial check on component mount

    window.addEventListener('resize', handleResize); // Event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, []);

  
  const memoizedData = useMemo(() => {
    // console.log(data, "data")
    if (data && data.page_content && data.page_content.length != 0) {
      return (
        <>
          {
            data.page_content.map((res,i) => (
              <WebPageSection key={res.section} isLast={i == data.page_content.length-1} data={res} />
            ))
          }
        </>
      )
    }

  }, [data])


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

      {memoizedData}

    </>

  );
}


// export async function getServerSideProps() {
//   const param = {
//     application_type: "web",
//     route: "default-home-page",
//   };

//   const resp = await HomePage(param);
//   const data = resp.message ? resp.message : {}


//   if (!data) {
//     return {
//       notFound: true,
//     }
//   }

//   return {
//     props: { data },
//     // revalidate: 120
//   }
// }
