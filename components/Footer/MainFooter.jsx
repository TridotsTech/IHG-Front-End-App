import { useEffect, useState, useMemo } from 'react'
// import footerData from '@/libs/footer';
import Image from 'next/image';
import { check_Image, insert_email_subscription } from '@/libs/api';
import { useRouter } from 'next/router'
import Link from 'next/link'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function MainFooter({ }) {

    let footerData;
    const router = useRouter();
    // const [email_ids,setEmail] = useState([])
    const [footerValues, setFooter] = useState()
    const [valid, setInvalid] = useState(true);

    const website_settings = useSelector((state) => state.webSettings.websiteSettings)

    useMemo(() => {
        if (website_settings && website_settings.default_footer) {
            footerData = website_settings.default_footer;
            getValues();
        }
    }, [website_settings])

    useEffect(() => {

    }, [])

    function getValues() {
        let footerValues = JSON.stringify(footerData)
        footerData = JSON.parse(footerValues)

        if (footerData && footerData.items && footerData.items.length != 0) {
            footerData.items.map(res => {
                if (res.items && res.items.length != 0) {
                    res.items.map(item => {
                        if (item.section_name == 'Footer Contact') {
                            // let email_ids = [];
                            // if(item.email_id && item.email_id.includes(',')){
                            //    email_ids = item.email_id.split(',')
                            //    email_ids.slice(0,1);
                            //    setEmail(email_ids)
                            // }else if(item.email_ids){
                            //    email_ids.push(item.email_id)
                            //    setEmail(email_ids)
                            // }
                        } else if (item.section_name == 'Footer Copyrights') {
                            footerData['copyRight'] = item;
                        }
                    })
                }
            })

            if (footerData.layout_json_data && footerData.layout_json_data.length != 0) {
                footerData.layout_json_data.map(res => {
                    res.columns.map((rec, index) => {
                        let check = footerData.items.find(res => res.column_index == index);
                        // rec.width = 'w-['+ rec.width + '] md:w-full'
                        if (check)
                            rec['layout_data'] = rec['layout_data'] ? rec['layout_data'] : []
                        rec['layout_data'] = [...rec['layout_data'], ...check.items];
                    })
                })
            }
            setFooter(footerData)
            // console.log('footerData',footerData)
        }
    }

    // const navigateToDetail = (item) =>{
    //     if(item.redirect_url){
    //         if(item.redirect_url.includes('.pdf') || item.redirect_url.includes('.PDF')){
    //             let pdfUrl = check_Image(item.redirect_url);
    //             window.open(pdfUrl, '_blank');
    //         }else{
    //            router.push(item.redirect_url)
    //         }
    //     }
    // }

    // function getSelection(index){
    //     let flex = ''
    //     if(index == 0){
    //         return 'calc(35%_-_0px)'
    //     }else if(index == 1){
    //         return 'calc(20%_-_10px)'
    //     }else if(index == 2){
    //         return 'calc(20%_-_10px)'
    //     }else if(index == 3){
    //         return 'calc(25%_-_20px)'
    //     }
    //     return flex;
    // }

    // const [dropdown, setDropdown] = useState(-1);

    // const enbleDropdown = (type,i,item) => {
    // if(type == 'enter'){

    //   item.menus.map((res,index)=>{
    //       if(i == index){
    //         res.isActive = true
    //       }else{
    //         res.isActive = false
    //     }
    //   })

    //   setDropdown(i);

    // }else{
    //     item.menus[i].isActive = false
    //     setDropdown(-1)
    // }
    // };

    async function checkEmail() {
        let element = document.getElementById('email');
        if (element && element.value != null || element.value != '') {

            if (validateEmail(element.value)) {
                setInvalid(true)
                let param = { email: element.value }
                const res = await insert_email_subscription(param);

                if (res.message == 'Success') {
                    element.value = ''
                    toast.success('Newsletter subscribed successfully');
                } else {
                    toast.error(res.message ? res.message : 'Try again later');
                }
            } else {
                setInvalid(false);
            }
        }
    }


    const emailCheck = (e) => {
        let data = validateEmail(e.target.value);
        setInvalid(data)
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };


    return (
        <>
            {/* <ToastContainer position={'bottom-right'} autoClose={2000}  /> */}
            {/* bg-[url('/footerbg.png')] */}
            <div className={`bg-[#000] border-[1px] border-t-slate-200 your-element`} style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center w-full' }}>

                <div className='footer'>
                    {footerValues && footerValues.layout_json_data[0] && <div className={`container main-width w-[100%] row flex md:block gap-[15px] py-8 md:px-[15px] md:py-[20px]`}>
                        {footerValues.layout_json_data[0].columns && footerValues.layout_json_data[0].columns.map((layOut, index) => {

                            return (
                                // ${'flex-[0_0_'+ getSelection(index ) +']'} 
                                <div key={index} style={{ width: layOut.width }} className={`flex md:flex-wrap md:mb-[10px] footer_section lg:flex-col lg:gap-[25px]`}>
                                    {/* {footer_item.items && footer_item.items.map((item,i) => { */}
                                    {layOut.layout_data && layOut.layout_data.length != 0 && layOut.layout_data.map((item, i) => {

                                        return (
                                            <div key={i}>
                                                {item.section_name == 'Footer Contact' &&
                                                    <div className={` flex-[0_0_calc(25%_-_10px)] md:flex-[0_0_calc(100%_-_10px)]`}>
                                                        {item.logo && <div className='flex items-start justify-start'><Image src={check_Image(item.logo)} height={66} width={200} alt={"image"} className='mb-[20px] w-[50%] h-[95px]' /></div>}
                                                        {item.title && <h6 className='text-[12px] font-medium mb-3 text-[#B2B2B2]'>{item.title}</h6>}
                                                        {item.address_content && item.address_content != "" && <div className='flex flex-row mt-2.5 text-[#000]'>
                                                            <Image src={check_Image(item.icon)} height={25} width={25} alt={"image"} className='mr-2 m-0.5 h-[17px] object-contain' />
                                                            <p className='mb-[0] text-[14px] text-[#B2B2B2]'>{item.address_content}</p>
                                                        </div>}

                                                        {item.phone_no && item.phone_no != "" && <div className='flex flex-row mt-2.5 text-[#000]'>
                                                            <Image src={check_Image(item.phone_icon)} height={25} width={25} alt={"image"} className='mr-2 m-0.5 h-[20px] object-contain' />
                                                            <a href={`tel:${item.phone_no}`} className=' ease-in duration-200 delay-50 active_hover_color hover:pl-[4px] text-[14px] text-[#B2B2B2]'>{item.phone_no}</a>
                                                        </div>}

                                                        {item.email_id && item.email_id != "" && <div key={index} className='flex flex-row mt-2.5 text-[#000]'>
                                                            <Image src={check_Image(item.email_icon)} height={25} width={25} alt={"image"} className='mr-2 m-0.5 h-[15px] object-contain' />
                                                            <a href={`mailto:${item.email_id}`} className=' ease-in duration-200 delay-50 active_hover_color hover:pl-[4px] text-[14px] text-[#B2B2B2]'>{item.email_id}</a>
                                                        </div>}
                                                        {/* {email_ids && email_ids.length != 0 && email_ids.map((mail,index)=>{
                                                return(
                                                    <span key={index} className='flex flex-row mt-2.5 text-[#000]'>
                                                    <Image src={check_Image(item.email_icon)} height={25} width={25} alt={"image"} className='mr-2 m-0.5 h-[17px] object-contain' />
                                                    <a href={`mailto:${mail}`} className=' ease-in duration-200 delay-50 active_hover_color hover:pl-[4px] text-[14px]'>{mail}</a>
                                                    </span>
                                                )
                                                })
                                            } */}
                                                        {/* <span className='flex flex-row mt-2.5 text-[#000]'>
                                                <Image src={check_Image(item.email_icon)} height={25} width={25} alt={"image"} className='mr-2 m-0.5 h-[20px] object-contain' />
                                                <a href={`mailto:${item.email_id}`} className=' ease-in duration-200 delay-50 active_hover_color hover:pl-[4px] text-[14px]'>{item.email_id}</a>
                                            </span> */}
                                                    </div>
                                                }

                                                {item.section_name == 'Footer About' &&
                                                    <div className={` flex-[0_0_calc(25%_-_10px)] md:flex-[0_0_calc(100%_-_10px)]`}>
                                                        {item.logo && <Image src={check_Image(item.logo)} height={66} width={200} alt={"image"} className='mb-[20px] ' />}
                                                        <p className='text-[12px] font-normal text-[#000]'>{item.content}</p>
                                                    </div>
                                                }

                                                {item.section_name == 'Social Links' &&
                                                    <div className='md:flex-[0_0_calc(100%_-_10px)]'>
                                                        <h6 className='text-[18px] font-semibold mb-3 text-[#976563]'>Our Social Media</h6>
                                                        <div className='flex items-center flex-wrap gap-[14px] py-[10px]'>
                                                            {item.social_links && item.social_links.map((res, index) => {
                                                                return (
                                                                    <div key={index} className='flex items-center justify-center border-[1px] border-[#ddd] rounded-[5px] p-[5px] h-[35px] w-[35px]'><a className='flex items-center justify-center' href={res.link_url} target='_blank'><Image src={check_Image(res.icon)} height={30} width={30} alt='icon' className='h-[20px] w-[25px] object-contain' /></a></div>
                                                                )
                                                            })}
                                                        </div>
                                                        {/* <div className='flex items-center justify-start gap-[14px] mt-3'>
                                            <div className='flex items-center justify-center'><Image className='h-[65px] w-[65px] object-contain' src={'/footer/certificate1.svg'} height={150} width={150} alt={"image"} /></div>
                                            <div className='flex items-center justify-center'><Image className='h-[65px] w-[65px] object-contain' src={'/footer/certificate2.svg'} height={150} width={150} alt={"image"} /></div>
                                        </div> */}
                                                    </div>
                                                }
                                                {/* {item.section_name == 'Social Links' && <div className='md:flex-[0_0_calc(100%_-_10px)]'>
                                        <h6 className='text-[16px] font-semibold py-3'>Download Indiaretailing App</h6>
                                        <div className='flex gap-[15px] items-center'>
                                            <Image src={'/footer/play-store.svg'} className='h-[32px] w-[101px]' height={15} width={20} alt={'app-store'} />
                                            <Image src={'/footer/app-store.svg'} className='h-[32px] w-[101px]' height={15} width={20} alt={'app-store'} />
                                        </div>
                                    </div>
                                    } */}

                                                {item.section_name == "Menu" &&
                                                    <div className={`list_div leading-[2.5] md:min-h-[20px] md:flex-[0_0_calc(50%_-_20px)] md:mr-[20px]`}>
                                                        <h6 className='text-[18px] font-semibold mb-3 text-[#fff]'>{item.title}</h6>
                                                        {(item.menus && item.menus.length != 0) && item.menus.map((value, index) => {
                                                            return (
                                                                // onClick={()=>{navigateToDetail(value)}} 
                                                                // onMouseEnter={()=>enbleDropdown('enter',index,item)} onMouseLeave={()=>enbleDropdown('leave',index,item)}

                                                                value.menu_label != "My cart" &&
                                                                <Link href={(value && value.redirect_url) ? value.redirect_url : '#'} className='flex items-center gap-[8px] min-h-[21px] p-[10px_0_5px_0]' key={index} >
                                                                    <Image style={{ objectFit: 'contain' }} className='h-[11px] w-[13px] opacity-30' height={25} width={25} alt='vantage' src={value.isActive ? '/Arrow/arrowBlack.svg' : '/Arrow/arrowBlack.svg'}></Image>
                                                                    <p className='cursor-pointer mb-0 text-left sub_title pb-0  ease-in duration-200 delay-50 active_hover_color hover:pl-[4px] text-[#B2B2B2] text-[14px]'>{value.menu_label == "My cart" ? null : value.menu_label}</p>
                                                                </Link>

                                                            )
                                                        })}
                                                    </div>
                                                }

                                                {item.section_name == "Newsletter Subscription" &&
                                                    <>
                                                        <h6 className='text-[18px] font-semibold mb-3 text-[#000]'>{item.title}</h6>
                                                        <div className='flex w-[100%] h-[41px] border rounded-[5px]   bg-white mb-[10px]'>
                                                            <div className='pl-[10px] flex items-center justify-center h-[39px]'><Image className={`h-[20px]`} src={'/email.svg'} height={30} width={30} alt='email' /></div>
                                                            <input id='email' onChange={emailCheck} placeholder="What's your email" type='email' className={`text-[12px] border-0 w-full px-[10px]`} />
                                                            <button onClick={() => checkEmail()} className='h-[39px] p-[0_15px] text-[14px] subscribe_btn cursor'>Subscribe</button>
                                                        </div>
                                                        {!valid && <p className='text-red-500 text-[12px] m-[0_0_10px_5px]'>Enter a valid E-mail</p>}

                                                    </>
                                                }

                                                {/* Payment Icons */}
                                                
                                                {/* {item.section_name == "Footer Payment Gateways" &&
                                                    <>
                                                        <h6 className='text-[#000] text-[15px] font-semibold mb-[10px] pt-[20px] lg:ml-10'>{item.sub_title}</h6>
                                                        <div className='flex items-center lg:ml-10'>
                                                            <Image style={{ objectFit: 'contain' }} className='h-[45pxx] w-[216px]' height={60} width={60} alt='vantage' src={check_Image(item.gateways_image)}></Image>
                                                        </div>
                                                    </>
                                                } */}

                                            </div>)
                                    })}
                                </div>
                            )

                        })}
                    </div>}
                </div>

                {footerValues && footerValues.copyRight &&
                    <div className={`main-width border-t-[1px] border-t-slate-100 flex items-center p-[10px_0px] md:flex-wrap`}>

                        {((footerValues.copyRight.powered_by_link && footerValues.copyRight.powered_by_text) || (footerValues.copyRight.youtube || footerValues.copyRight.instagram || footerValues.copyRight.facebook || footerValues.copyRight.twitter)) &&
                            <div className='flex items-center justify-start flex-[0_0_50%] md:flex-[0_0_100%]'>
                                {(footerValues.copyRight.powered_by_link && footerValues.copyRight.powered_by_text) ?
                                    <Link href={footerValues.copyRight.powered_by_link} className={`text-[14px] text-[#000] hover:primary_color`}>{footerValues.copyRight.powered_by_text}</Link>
                                    :
                                    <div className={`${footerValues.copyright_layout != 'One Column' ? 'flex-[0_0_50%] md:flex-[0_0_100%]' : ''} flex items-center gap-[7px]`}>
                                        {footerValues.copyRight.facebook && <Image style={{ objectFit: 'contain' }} className='h-[18px] w-[15px]' height={25} width={25} alt='vantage' src={check_Image(footerValues.copyRight.facebook)}></Image>}
                                        {footerValues.copyRight.instagram && <Image style={{ objectFit: 'contain' }} className='h-[18px] w-[15px]' height={25} width={25} alt='vantage' src={check_Image(footerValues.copyRight.instagram)}></Image>}
                                        {footerValues.copyRight.twitter && <Image style={{ objectFit: 'contain' }} className='h-[18px] w-[15px]' height={25} width={25} alt='vantage' src={check_Image(footerValues.copyRight.twitter)}></Image>}
                                        {footerValues.copyRight.youtube && <Image style={{ objectFit: 'contain' }} className='h-[18px] w-[15px]' height={25} width={25} alt='vantage' src={check_Image(footerValues.copyRight.youtube)}></Image>}

                                    </div>
                                }
                            </div>
                        }

                        <p className={`${((footerValues.copyRight.powered_by_link && footerValues.copyRight.powered_by_text) || (footerValues.copyRight.youtube || footerValues.copyRight.instagram || footerValues.copyRight.facebook || footerValues.copyRight.twitter)) ? 'flex-[0_0_50%] text-end' : 'w-full text-center'} text-[14px] text-[#000]`}>{footerValues.copyRight.copyright_text}</p>

                    </div>
                }

                {footerValues && (footerValues.enable_copyright && footerValues.enable_copyright == 1) ?
                    <div className='flex bg-[#000] items-center p-[10px] border-t-[1px] border-t-[#f1f1f142] md:flex-wrap'>

                        {footerValues.fc_ct_type == 'Custom' && <p className={`${footerValues.copyright_layout != 'One Column' ? 'flex-[0_0_50%] md:flex-[0_0_100%]' : 'w-full'}  ${footerValues.cp_fc_alignment == 'Left' ? 'text-left' : (footerValues.cp_fc_alignment == 'Center' ? 'text-center' : 'text-right')}    text-[14px] text-[#B2B2B2] md:text-left`} dangerouslySetInnerHTML={{ __html: footerValues.cp_fc_content }}></p>}
                        {(footerValues.sc_ct_type == 'Custom' && footerValues.copyright_layout != 'One Column') && <p className={`${footerValues.copyright_layout != 'One Column' ? 'flex-[0_0_50%] md:flex-[0_0_100%]' : ''}  ${footerValues.cp_sc_alignment == 'Left' ? 'text-left' : (footerValues.cp_sc_alignment == 'Center' ? 'text-center' : 'text-right')} text-[14px] text-[#B2B2B2] md:text-left`} dangerouslySetInnerHTML={{ __html: footerValues.cp_sc_content }}></p>}

                    </div>
                    :
                    <></>
                }

            </div>
        </>
    )
}


// ${(footerValues.copyRight.copyright_text && ((footerValues.copyRight.powered_by_link && footerValues.copyRight.powered_by_text) ||  (footerValues.copyRight.youtube || footerValues.copyRight.instagram || footerValues.copyRight.facebook || footerValues.copyRight.twitter))) ? 'justify-between' : 'justify-center'} 