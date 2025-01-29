import RootLayout from "@/layouts/RootLayout";
import { HomePage,seo_Image, getCurrentUrl } from "@/libs/api";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import MobileHeader from "@/components/Headers/mobileHeader/MobileHeader";
import Head from 'next/head'
import WebPageSection from "@/components/Builders/WebPageSection";
import SubHeader from "@/components/Common/SubHeader";

export default function index({ data, params,route }) {
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subheader, setSubHead] = useState();
  let page_no = 1;
  let cardref = useRef();
  let no_product = false;
  let router = useRouter();


  useEffect(() => {

    if (typeof window != undefined) {

    // console.log('data',data);

    setSubHead(data);

    (data.page_content && data.page_content.length )== 4 ? null : no_product = true
    
    if (data && data.page_content && data.page_content.length != 0) {
      setValue(data.page_content);
      page_no = page_no + 1;
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;

      if (!no_product) {
        page_no > 1 ? get_whysellwithus_content() : null;
      }
    });

    intersectionObserver?.observe(cardref?.current);
    return () => {
      cardref?.current && intersectionObserver?.unobserve(cardref?.current);
    };
   }
  }, [no_product,router]);

  const get_whysellwithus_content = async () => {

    page_no > 1 ? setLoading(true) : null;

    const param = {
      route: router.query.page,
      page_no: page_no,
      page_size: 4,
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
    } else {
      no_product = true;
      setLoading(false);
    }
    
    page_no = page_no + 1;
  };



  const sanitizeHtml = (html) => {

    if (html && typeof html == "string") {
      let cleanedHtml = html.replace(/&nbsp;/g, " ");

      // Remove extra spaces (multiple consecutive spaces) without removing tags and colors
      cleanedHtml = cleanedHtml.replace(/<[^>]*>/g, (match) => {
        // Preserve inline colors (style attributes) within tags
        if (match.includes('style="color:')) {
          return match;
        }
        // Remove spaces from other parts of the tags
        return match.replace(/\s+/g, " ");
      });

      // Parse the cleaned HTML into a DOM tree
      const parser = new DOMParser();
      let doc = parser.parseFromString(cleanedHtml, "text/html");

      // Remove all elements that do not have any content (including nested content)
      const emptyElements = doc.querySelectorAll(
        "*:empty:not(br):not(img):not(div)"
      );
      for (const element of emptyElements) {
        element.parentNode.removeChild(element);
      }

      cleanedHtml = new XMLSerializer().serializeToString(doc);
      doc = parser.parseFromString(cleanedHtml, "text/html");
      const brElements = doc.querySelectorAll("br");
      for (const br of brElements) {
        const prevNode =
          br.previousSibling && br.previousSibling.data
            ? br.previousSibling.data
            : undefined;
        const nextNode =
          br.nextSibling && br.nextSibling.data
            ? br.nextSibling.data
            : undefined;
        if ((prevNode && prevNode != " ") || (nextNode && nextNode != " ")) {
        } else {
          if (!br.closest("strong")) {
            br.parentNode.removeChild(br);
          }
        }
      }
      cleanedHtml = new XMLSerializer().serializeToString(doc);
      return cleanedHtml;
    }
  };


  return (
    <>

      <Head>
        <title>{data?.meta_info?.meta_title}</title>
        <meta name="description" content={data?.meta_info?.meta_description} />
        <meta property="og:type" content={'Blog'} />
        <meta property="og:title" content={data?.meta_info?.meta_title} />
        <meta key="og_description" property="og:description" content={data?.meta_info?.meta_description} />
        <meta property="og:image" content={seo_Image(data?.meta_info?.meta_image)}></meta>
        <meta property="og:url" content={getCurrentUrl(router.asPath)}></meta>
        <meta name="twitter:image" content={seo_Image(data?.meta_info?.meta_image)}></meta>
      </Head>

      <RootLayout>
        <MobileHeader home={false} back_btn={true} title={data?.meta_info?.meta_title} search={true}/>
        <>
        
          <>
              <div className="w-[100%]">
                {value &&
                  value.length != 0 &&
                  value.map((datas, index) => {
                    return (
                      <>
                      {datas.use_page_builder == 0 ? (
                        <>
                          {subheader && subheader.sub_header && subheader.sub_header && subheader.sub_header.enabled == 1 &&  <SubHeader data={subheader.sub_header}   page_id={datas.name} />}

                          <div
                            className="main-width py-[20px] px-2"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(datas.content),
                            }}
                          />
                        </>
                       ) : 
                       <>
                          {subheader && subheader.sub_header && subheader.sub_header && subheader.sub_header.enabled == 1 &&  <SubHeader data={subheader.sub_header} />}
                          <WebPageSection data={datas}  i={index} />
                       </>
                       }
                      </>
                    );
                  })}
                
              </div>
          </>
  
          <div className="more md:h-5" ref={cardref}></div>
         
          {loading && (
            <div id="wave" className="md:mb-[40px]">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}

        </>
      </RootLayout>
      
    </>
  );
}

export async function getServerSideProps({ params }) {
  let route = await params.page;
  let data = {};

  const param = {
    route: route,
    page_no: 1,
    page_size: 4,
  };

  const resp = await HomePage(param);

  data = await resp.message;

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data, params ,route},
  };
}


