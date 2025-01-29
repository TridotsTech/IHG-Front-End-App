import { useEffect, useState, useRef } from 'react'
import Image from "next/image";
import BlogCategory from "@/components/Blog/BlogCategory";
import { formatDate, check_Image } from "@/libs/api";
import NoProductFound from "../Common/NoProductFound";
import { useRouter } from "next/router";

export default function BlogBox({ data, cssContent, category, width, scroll_button, scroll_id, rowCount }) {

  const router = useRouter()
  var slider = '';
  let isDown = false;
  const [sample, setSample] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const mobileWidth = 768; // Adjust this value to define your mobile width threshold
      if (window.innerWidth <= mobileWidth) {

      } else {
        scrollingFn()
      }
    };

    handleResize(); // Initial check on component mount

    window.addEventListener('resize', handleResize); // Event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, [])

  function scrollingFn() {
    let slider_child_id = 'sliderID' + (scroll_id ? scroll_id : '')
    if (slider_child_id) {
      slider = document.getElementById(slider_child_id);
      if (slider) {
        (() => {
          slider.addEventListener('mousedown', start);
          slider.addEventListener('touchstart', start);

          slider.addEventListener('mousemove', move);
          slider.addEventListener('touchmove', move);

          slider.addEventListener('mouseleave', end);
          slider.addEventListener('mouseup', end);
          slider.addEventListener('touchend', end);
        })();
      }
    }
  }

  const sctollTo = (direction) => {

    let slider_child_id = document.getElementById('sliderID' + (scroll_id ? scroll_id : ''))

    if (slider_child_id) {
      let slider_div = slider_child_id;
      let slider_width = slider_child_id.clientWidth
      if (direction == 'next') {
        slider_div.scrollBy({ top: 0, left: 250, behavior: 'smooth' });
      } else {
        slider_div.scrollBy({ top: 0, left: -250, behavior: 'smooth' });
      }

      let nextBtn = document.getElementById('next_' + (scroll_id ? scroll_id : ''))
      let prevBtn = document.getElementById('prev_' + (scroll_id ? scroll_id : ''))

      if (slider_div.scrollLeft == 0) {
        prevBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
      } else if (slider_div.offsetWidth + slider_div.scrollLeft == slider_div.scrollWidth - 1) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
      } else if (slider_div.scrollLeft > 0) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
      }

      setSample(sample + 1)
    }
  }

  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  let startX = ''
  let scrollLeft = ''

  // start
  const end = () => {
    isDown = false;
    slider.classList.remove('active');
  }

  const start = (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  }

  const move = (e) => {
    if (!isDown) return;

    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    const dist = (x - startX);
    slider.scrollLeft = scrollLeft - dist;
  }

  return (
    <>
      {category && <div className="lg:flex-[0_0_calc(20%_-_5px)] w-[100%] lg:rounded-[5px] md:sticky md:top-[50px] md:bg-[#f2f2f2]">
        <BlogCategory category={category} />
      </div>}


      <div className={`${scroll_id ? 'w-full' : 'lg:flex-[0_0_calc(80%_-_5px)] w-full'} relative`}>
        {(data && data.length != 0) ?
          <>
            <div className={`${!scroll_button && 'hidden'} absolute top-[40%] left-[-22px] h-[35px] w-[35px] z-10 bg-[#fff] text-black border-[1px]  border-slate-200 rounded-full flex items-center justify-center  cursor-pointer md:hidden`} onClick={() => sctollTo('prev')} id={'prev_' + (scroll_id ? scroll_id : '')}> <Image className='h-[12px] object-contain' alt="Prev" src={'/rightArrow.svg'} width={35} height={35} /></div>
            <ul id={'sliderID' + (scroll_id ? scroll_id : '')} className={`${!scroll_button && 'flex-wrap'} ${scroll_button ? 'gap-[10px]' : ''} product_box w-full flex overflow-auto scrollbarHide lg:gap-[10px] `}>
              {data.map((value, index) => {
                return (
                  // lg:border-[1px] lg:border-slate-200 lg:rounded-[5px]
                  <li onClick={() => router.push('/' + value.route)} key={index} className={`${rowCount ? rowCount : 'flex-[0_0_calc(100%_-_21px)]'} ${(scroll_button ? 'md:flex-[0_0_calc(70%_-_0px)] rounded-[5px] border-[1px] border-slate-200' : 'md:flex-[0_0_calc(100%_-_20px)] md:m-[10px_10px_10px_10px] rounded-[5px] md:border-[1px] md:border-slate-200')}  relative bg-[#fff] cursor-pointer lg:mb-[20px] md:p-[10px]`} >
                    <div className="w-full md:h-[170px] p-[0px]">
                      <Image src={check_Image(value.thumbnail_image)}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/empty-states.png'; }} width={20} height={20} alt="thumbnail_image" className="h-full w-full object-contain" />
                    </div>
                    <div className={`${cssContent ? cssContent : ''}`}>
                      <h6 className="mt-[10px] text-[12px] font-normal text-[#717171c9]">{formatDate(value.published_on)}</h6>
                      <h3 className="line-clamp-2 text-start text-[20px] font-medium">{value.title}</h3>
                      <p className="mb-[10px] line-clamp-3 text-[12px] font-thin text-start">{value.blog_intro}</p>
                      <button className="border-[1px] border-slate-200 h-[40px] text-[14px] gray_color rounded-[5px] p-[0px_25px] shadow-[0_0_5px_#dddddd24]">Read More</button>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className={`${!scroll_button && 'hidden'} absolute top-[40%] right-[-22px] h-[35px] w-[35px] z-10 bg-[#fff] text-black border-[1px] border-slate-200  rounded-full flex items-center justify-center cursor-pointer md:hidden`} onClick={() => sctollTo('next')} id={'next_' + (scroll_id ? scroll_id : '')}><Image className='h-[12px] object-contain' alt="forward" src={'/leftArrow.svg'} width={35} height={35} /> </div>
          </>
          :
          <NoProductFound cssClass={'flex-col h-[calc(100vh_-_220px)]'} empty_icon={'/EmptyImg/no-blog-01.svg'} heading={'No Blog Found'} />
        }
      </div>

      {/* <div className={`${width ? width : 'lg:flex-[0_0_calc(80%_-_5px)]'} flex gap-[10px] flex-wrap`}>
         {(data && data.length != 0 ) ?
            data.map((value,i)=>{
              return (
                <div onClick={() => router.push('/'+ value.route)} className="lg:flex-[0_0_calc(32.33%_-_1px)] border rounded-[5px] cursor-pointer" key={i}>
                  <div className="w-full h-[170px] p-[8px]">
                    <Image  src={check_Image(value.thumbnail_image)}    
                     onError={(e) => { e.target.onerror = null; e.target.src = '/empty-states.jpg'; }}  width={20} height={20} alt="thumbnail_image" className="h-full w-full object-contain" />
                  </div>
                    <h1 className="line-clamp-1 my-[10px] px-[10px] text-start text-[14px] font-semibold">{value.title}</h1>
                    <p className="line-clamp-3 px-[8px] text-[12px] font-thin text-start">{value.blog_intro}</p>
                    <div className="flex justify-between my-[5px] px-[8px] items-center">
                    <p className="text-[12px] font-normal pr-[5px]">Post on : <span className="text-[12px] font-normal text-[#717171c9]">{value.published_on}</span></p>
                    <button className="primary_bg h-[30px] text-[12px] text-white rounded-[3px] p-[5px_8px] font-normal">View More</button>
                    </div>
                </div>

              )}): 
             <NoProductFound cssClass={'flex-col h-[calc(100vh_-_220px)]'} empty_icon={'/EmptyImg/no-blog-01.svg'}  heading={'No Blog Found'}/>
            }
        </div> */}

    </>
  )
}