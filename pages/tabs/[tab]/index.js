import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router'
const MobileCategoryFilter = dynamic(()=> import('@/components/Product/filters/MobileCategoryFilter'))
const MobileHeader = dynamic(()=> import('@/components/Headers/mobileHeader/MobileHeader'))

export default function index() {

  const router = useRouter();
  let  [routeName,setRouteName] = useState('')
  let [title,setTitle] = useState('')

  const webSettings = useSelector((state) => state.webSettings.websiteSettings)

  useEffect(()=>{
    routeName = router.query.tab
    setRouteName(router.query.tab);

    if(routeName == 'category'){
      title = 'Categories'
    }

    setTitle(title);

  },[router])


  
  const [theme_settings, setTheme_settings] = useState()

  useMemo(() => {
   
    if (webSettings && webSettings.app_settings) {
      let settings = webSettings.app_settings;
      setTheme_settings(settings);
    }

  }, [webSettings])

  return (
    <div class={`main-width lg:py-[25px] mb-[65px]`}>
       {(theme_settings && routeName) && <MobileHeader back_btn={true} title={title} search={true} theme_settings={theme_settings}/>}
       {routeName == 'category' && <MobileCategoryFilter/>}
    </div>
  )
  
}

