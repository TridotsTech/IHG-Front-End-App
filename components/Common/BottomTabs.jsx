import Image from "next/image";
import { useRouter } from "next/router";
export default function BottomTabs({ activeTab, getActiveTab,tabs }) {
    const router = useRouter()
   
    // useEffect(() => {
    //     if (!activeTab) {
    //         let route = router.asPath.split('/')
    //         let redirect_url = route[1] ? '/' + route[1] : '/'
    //         tabs.map(nd => {
    //             nd.active = nd.redirect_url == redirect_url ? true : false
    //         })
    //     } else {
    //         tabs.map(nd => {
    //             nd.active = nd.menu_label == activeTab.menu_label ? true : false
    //         })
    //     }
    // }, [activeTab,router])

    const changeNav = (nav) => {
        router.push(nav.redirect_url)
        getActiveTab(nav)
    }



    return (<>
       <div id='tabs' className="fixed bottom-0 w-full z-[99] md:min-h-[60px] your-element">
            <ul className='flex justify-between w-full bg-[#fff] py-[6px] your-element' style={{ borderTop: '1px solid #ddd' }}>
                {tabs.map((nav, index) => {
                    return (
                        // <Link href={nav.redirect_url}>
                        
                        <li key={index} className={`flex flex-col your-element flex-[0_0_25%] gap-[5px] justify-between cursor-pointer text-[14px] font-medium whitespace-pre text-[#858585] removeFlick ${nav.active && 'active_nav'}`}
                            onClick={() => changeNav(nav)} style={{ border: 'none' }}>
                            <Image loading="lazy" alt={nav.menu_label} src={router.asPath == nav.redirect_url ? nav.active_icon : nav.icon} width={16} height={16} className="m-auto h-[25px] w-[25px]" />
                            <p className="text-[12px] text-center">{nav.menu_label}</p>
                        </li>
                        // </Link>
                    )
                })}
            </ul>
        </div>
    </>);
}

