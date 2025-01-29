import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
export default function BreadCrumb() {

    const router = useRouter();
    let [breadCrumb, setBreadCrumb] = useState([])
    let [data,setData] = useState()
    useEffect(() => {
        // console.log(router.asPath.split('/'));
        if(router && router.asPath){
            let data = router.asPath.split('/');
            setData(data);
            // console.log(data)
            breadCrumb = []
            if (data && data.length > 1) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i] != '' && data[i] != 'pr') {
                        let name = data[i].split('-').join(' ').toString()
                        let obj = { name: name, route: data[i] }
                        breadCrumb.push(obj);
                        // setBreadCrumb(breadCrumb)
    
                    }
                }
    
    
                breadCrumb.unshift({ name: 'Home', route: '/' })
                setBreadCrumb(breadCrumb)

                if(breadCrumb && breadCrumb[1] && breadCrumb[1].route && breadCrumb[1].route == 'blog'){
                    breadCrumb.map((r,i)=>{
                        if(i > 1){
                            r.route = breadCrumb[i - 1].route + '/' + r.route
                        }
                    })
                }

                setBreadCrumb(breadCrumb)
            }
        }
    }, [router])

    return (
        <>
            <div className={`${(data && data[1] && data [1] == 'pr') ? 'hidden' : ''} md:hidden flex items-center container p-[10px_0_0_0] gap-[7px]`}>
                {/* {BreadCrumbs && BreadCrumbs.length != 0 && BreadCrumbs.map((res, index) => {
                    return (
                        <div className='flex items-center gap-[7px]' key={index}>
                            <h6 onClick={() => { (((index + 1) != BreadCrumbs.length) && res.route) ? router.push(res.route) : null }} className=" cursor-pointer capitalize text-[14px] hover:text-[red]" >{res.name}</h6>
                            {index + 1 < BreadCrumbs.length && <div className='flex items-center justify-center'><Image height={7} priority width={7} alt='search' src={'/forwardIcon.svg'} className="opacity-50"></Image></div>}
                        </div>
                    )
                })} */}


                {breadCrumb && breadCrumb.length != 0 && breadCrumb.map((res, index) => {
                    return (
                        <div className='flex items-center gap-[7px]' key={index}>
                            <h6 onClick={() => { (((index + 1) != breadCrumb.length) && res.route) ? router.push('/' + res.route) : null }} className=" cursor-pointer capitalize text-[14px] hover:text-[red]" >{res.name}</h6>
                            {breadCrumb.length == (index + 1) ? <></> : <div className='flex items-center justify-center'><Image height={7} priority width={7} alt='search' src={'/forwardIcon.svg'} className="opacity-50"></Image></div>}
                        </div>
                    )
                })}
            </div>
        </>
    )
}