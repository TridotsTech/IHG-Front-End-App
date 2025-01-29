// import {
//     GetServerSideProps,
//     GetStaticPathsContext,
//     GetStaticProps,
//   } from "next";

//   import { fetchProduct } from "../rest/product/product.query";
  
//   export async function getServerSidePaths({ locales }: GetStaticPathsContext) {
//     let paths: any = [];
//     return {
//       paths,
//       fallback: "blocking",
//     };
//   }
  
//   export const getServerSideProps: GetServerSideProps = async ({
//     query,
//     locale,
//   }) => {
//     const slug = query?.slug as string;
//     try {
//       const product = await fetchProduct(slug);
//       return {
//         props: {
//           product,
//         },
//       };
//     } catch (error) {
//       return {
//         notFound: true,
//       };
//     }
//   };

//   import Head from 'next/head';
//   import Link from 'next/link';
//   import { useRouter } from 'next/router';
//   import { BreadcrumbArrowIcon } from '../../components/Icons/common-icons';
//   import RelatedProducts from '../../components/Product/RelatedProducts';
//   import ProductSingleDetails from '../../components/Product/product-single-details';
//   import { getLayout } from '../../components/layout/layout';
//   import Container from '../../components/ui/container';
//   import { useRelatedProductsQuery } from '../../framework/rest/product/product.query';
//   import { ROUTES } from '../../lib/routes';
  
//   export { getServerSidePaths, getServerSideProps } from "../../framework/ssr/product";
  
//   export default function ProductPage({ product }: any) {
//     const router = useRouter();
//     const productSlug = router.query.slug
//     // const { data: product, isLoading: loading }: any = useProductQuery(productSlug);
//     const { data: relatedProducts, isLoading }: any = useRelatedProductsQuery(productSlug);
  
//     return (
//       <div>
  
//         <Head>
//           <title>{product?.data?.title}</title>
//           <meta name="description" content={product?.data?.title} />
//           <meta property="og:image" content={product?.data?.thumbnail}></meta>
//           <meta name="twitter:image" content={product?.data?.thumbnail}></meta>
//         </Head>
  
  
//         <Container className="bg-[#fafafa]">
//           <div className="">
//             <div className='mt-8 xs:mt-0 hidden md:flex items-center gap-2'>
//               <Link href={ROUTES.HOME}><p className='font-body font-medium text-[#4A5682] leading-[21px] text-[13px]'>Home</p></Link>
//               <span className="flex">
//                 <BreadcrumbArrowIcon height={'10px'} width={"5px"} />
//                 <BreadcrumbArrowIcon height={'10px'} width={"5px"} />
//               </span>
//               <Link href={"/category/" + product?.data?.category_l1_slug}>
//                 <p className='font-body font-medium text-[#4A5682] leading-[21px] text-[13px]'>{product?.data?.category_l1_name}</p>
//               </Link>
//               <BreadcrumbArrowIcon height={'10px'} width={"5px"} />
//               <Link href={ROUTES.PRODUCTS + "/" + product?.data?.product_slug}><p className='font-body font-medium text-[#4A5682] leading-[21px] text-[13px]'>{product?.data?.title}</p></Link>
//             </div>
//           </div>
  
//           <ProductSingleDetails product={product} />
//           {
//             relatedProducts?.length && <RelatedProducts products={relatedProducts} />
//           }
//         </Container>
//       </div>
//     )
//   }
  
//   ProductPage.getLayout = getLayout


// import Head from 'next/head'
// import React, { useEffect, useState } from 'react'
// import { check_Image } from '@/libs/api';
// import { domain } from '@/libs/config/siteConfig'

// const DEFAULT_OG_IMAGE = '/Favicon.jpg'

// export default function SEO({ meta, meta_data, canonical = 'https://go1market-next-js.vercel.app/',
//     ogType = "Products",
//     siteName = "Go1Market",

//     twitterHandle = "@d__Go1Market" }) {
//     const [title, setTitle] = useState();

//     useEffect(() => {
//         console.log(meta, 'meta ssr');
//         // console.log(meta_data, 'meta-data');

//         if (meta_data) {
//             setTitle(meta_data.meta_title ? meta_data.meta_title : meta_data.title + 'Go1Market')
//             document.querySelector('meta[name="description"]').setAttribute('content', meta_data.meta_description ? meta_data.meta_description : meta_data.blog_intro)
//             document.querySelector('meta[property="twitter:description"]').setAttribute('content', meta_data.meta_description ? meta_data.meta_description : meta_data.blog_intro)
//             document.querySelector('meta[property="og:title"]').setAttribute('content', meta_data.meta_title ? meta_data.meta_title : meta_data.title + 'Go1Market')
//             document.querySelector('meta[property="og:description"]').setAttribute('content', meta_data.meta_description ? meta_data.meta_description : meta_data.title + 'Go1Market')
//             document.querySelector('meta[property="og:image"]').setAttribute('content', check_Image(meta_data.meta_image ? meta_data.meta_image : meta_data.image))
//             document.querySelector('meta[property="twitter:image"]').setAttribute('content', check_Image(meta_data.meta_image ? meta_data.meta_image : meta_data.image))
//         }
//     }, [meta,meta_data]);


//     return (
//         <>
//             {/* <html> */}
//             <Head>
//                 {/* <title key="title">{`${meta.meta_title} – ${'Go1Market'}`}</title> */}
//                 <title key="title">{title ? title : meta.meta_title ? meta.meta_title : meta.title ? meta.title : 'Go1Market'}</title>
//                 <meta name="description" content={meta.meta_description} />
//                 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
//                 <meta name="theme-color" content="#e21b22" />
//                 <meta key="og_type" property="og:type" content={ogType} />
//                 <meta key="og_title" property="og:title" content={title ? title : meta.meta_title} />
//                 <meta key="og_description" property="og:description" content={meta.meta_description} />
//                 <meta key="og_locale" property="og:locale" content="en_IE" />
//                 <meta key="og_site_name" property="og:site_name" content={'Go1Market'} />
//                 <meta key="og_url" property="og:url" content={canonical ?? domain} />
//                 <meta key="og_site_name" property="og:site_name" content={siteName} />
//                 <meta
//                     key="og_image"
//                     property="og:image"
//                     itemprop="image"
//                     content={check_Image(meta.meta_image) ?? DEFAULT_OG_IMAGE}
//                 />
//                 <meta
//                     key="og_image:alt"
//                     property="og:image:alt"
//                     content={`${title ? title : meta.meta_title ? meta.meta_title : meta.title ? meta.title : 'Go1Market'} | ${'Go1Market'}`}
//                 />
//                 <meta key="og_image:width" property="og:image:width" content="1200" />
//                 <meta key="og_image:height" property="og:image:height" content="630" />

//                 <meta name="robots" content="index,follow" />

//                 <meta
//                     key="twitter:card"
//                     name="twitter:card"
//                     content="summary_large_image"
//                 />
//                 <meta
//                     key="twitter:site"
//                     name="twitter:site"
//                     content={twitterHandle}
//                 />
//                 <meta
//                     key="twitter:creator"
//                     name="twitter:creator"
//                     content={twitterHandle}
//                 />
//                 <meta property="twitter:image" content={check_Image(meta.meta_image) ?? DEFAULT_OG_IMAGE} />
//                 <meta
//                     key="twitter:title"
//                     property="twitter:title"
//                     content={title}
//                 />
//                 <meta
//                     key="twitter:description"
//                     property="twitter:description"
//                     content={meta.meta_description}
//                 />

//                 {/* <meta property="twitter:card" content="summary_large_image" /> */}
//                 {/* <meta property="twitter:url" content="https://metatags.io/" /> */}
//                 {/* <meta property="twitter:title" content="Meta Tags — Preview, Edit and Generate" /> */}
//                 {/* <meta property="twitter:description" content="With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, Twitter and more!" /> */}

//                 <link rel="canonical" href={canonical ?? domain} />

//                 <link rel="shortcut icon" href="/Favicon.jpg" />
//             </Head>
//             {/* <body>
//                 <span itemprop="image" itemscope >
//                     <link itemprop="url" href={`${check_Image(meta.meta_image) ?? DEFAULT_OG_IMAGE}`} />
//                 </span>
//             </body> */}
//         </>
//     )



    
// }


import Head from 'next/head'
import React from 'react'
import { domain } from '@/libs/config/siteConfig'

// export const metadata = {
//     title: "IndiaRetailing",
//     openGraph: {
//         title: "Home",
//         image: '/ads_baner.png'
//     }
// }

// const DEFAULT_OG_IMAGE = '/indiaretail_new.png'
// export default function SEO({ title = "India Reatiling",
//     description = "This is IndiaRetailing and its about news and articles based on the popular site.",
//     siteName = "Indiaretail",
//     canonical = 'https://indiaretail.vercel.app/',
//     ogImage = DEFAULT_OG_IMAGE,
//     ogType = "website",
//     twitterHandle = "@d__indiaRetail" }) {
//     return (
//         <>
//             {/* <html> */}
//                 <Head>
//                     <title key="title">{`${title} – ${siteName}`}</title>
//                     <meta name="description" content={description} />
//                     <meta name="theme-color" content="#e21b22" />
//                     <meta name="og_type" property="og:type" content={ogType} />
//                     <meta name="og_title" property="og:title" content={title} />
//                     <meta name="og_description" property="og:description" content={description} />
//                     <meta name="og_locale" property="og:locale" content="en_IE" />
//                     <meta name="og_site_name" property="og:site_name" content={siteName} />
//                     <meta name="og_url" property="og:url" content={canonical ?? domain} />
//                     <meta name="og_site_name" property="og:site_name" content={siteName} />
//                     <meta
//                         name="og_image"
//                         property="og:image"
//                         content={ogImage ?? DEFAULT_OG_IMAGE}
//                     />
//                     <meta
//                         name="og_image:alt"
//                         property="og:image:alt"
//                         content={`${title} | ${siteName}`}
//                     />
//                     <meta name="og_image:width" property="og:image:width" content="1200" />
//                     <meta name="og_image:height" property="og:image:height" content="630" />

//                     <meta name="robots" content="index,follow" />

//                     <meta
//                         key="twitter:card"
//                         name="twitter:card"
//                         content="summary_large_image"
//                     />
//                     <meta
//                         key="twitter:site"
//                         name="twitter:site"
//                         content={twitterHandle}
//                     />
//                     <meta
//                         key="twitter:creator"
//                         name="twitter:creator"
//                         content={twitterHandle}
//                     />
//                     <meta
//                         key="twitter:title"
//                         property="twitter:title"
//                         content={title}
//                     />
//                     <meta
//                         key="twitter:description"
//                         property="twitter:description"
//                         content={description}
//                     />

//                     <link rel="canonical" href={canonical ?? domain} />

//                     <link rel="shortcut icon" href="/ir_2023.png" />
//                 </Head>
//             {/* </html> */}
//         </>
//     )
// }


