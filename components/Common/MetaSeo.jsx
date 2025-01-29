import Head from 'next/head'
import React from 'react'
import { domain } from '@/libs/config/siteConfig'

// const MetaSeo =  {
//     title: 'My Next.js App',
//     description: 'This is a sample Next.js app with next-seo.',
//     openGraph: {
//       type: 'website',
//       url: 'https://example.com',
//       title: 'My Next.js App',
//       description: 'This is a sample Next.js app with next-seo.',
//       images: [
//         {
//           url: 'https://example.com/og-image.jpg',
//           width: 1200,
//           height: 630,
//           alt: 'Og Image Alt',
//         },
//       ],
//     },
//     twitter: {
//       handle: '@example',
//       site: '@example',
//       cardType: 'summary_large_image',
//     },
//   };

//   export default MetaSeo;

const DEFAULT_OG_IMAGE = '/go1-market-color.svg'

export default function MetaSeo({ title = "Go1 Market",
    description = "This is Go1 Market and its about buying and selling products.",
    siteName = "Go1 Market",
    canonical = 'https://go1market.vercel.app/',
    ogImage = DEFAULT_OG_IMAGE,
    ogType = "website",
    twitterHandle = "@d__go1market" }) {
    return (
        <>
            {/* <html> */}
            <Head>
                <title key="title">{`${title} – ${siteName}}`}</title>
                <meta name="description" content={description} />
                <meta name="theme-color" content="#e21b22" />
                <meta name="og_type" property="og:type" content={ogType} />
                <meta name="og_title" property="og:title" content={title} />
                <meta name="og_description" property="og:description" content={description} />
                <meta name="og_locale" property="og:locale" content="en_IE" />
                <meta name="og_site_name" property="og:site_name" content={siteName} />
                <meta name="og_url" property="og:url" content={canonical ?? domain} />
                <meta name="og_site_name" property="og:site_name" content={siteName} />
                <meta
                    name="og_image"
                    property="og:image"
                    content={ogImage ?? DEFAULT_OG_IMAGE}
                />
                <meta
                    name="og_image:alt"
                    property="og:image:alt"
                    content={`${title} | ${siteName}`}
                />
                <meta name="og_image:width" property="og:image:width" content="1200" />
                <meta name="og_image:height" property="og:image:height" content="630" />

                <meta name="robots" content="index,follow" />

                <meta
                    key="twitter:card"
                    name="twitter:card"
                    content="summary_large_image"
                />
                <meta
                    key="twitter:site"
                    name="twitter:site"
                    content={twitterHandle}
                />
                <meta
                    key="twitter:creator"
                    name="twitter:creator"
                    content={twitterHandle}
                />
                <meta
                    key="twitter:title"
                    property="twitter:title"
                    content={title}
                />
                <meta
                    key="twitter:description"
                    property="twitter:description"
                    content={description}
                />

                <link rel="canonical" href={canonical ?? domain} />

                <link rel="shortcut icon" href="/Favicon.jpg" />
            </Head>
            {/* </html> */}
        </>
    )
}
