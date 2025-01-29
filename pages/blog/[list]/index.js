import {  BlogList,BlogCategories } from "@/libs/api";
import SubHeader from "@/components/Common/SubHeader";
import BreadCrumb from "@/components/Common/BreadCrumb";
import BlogBox from "@/components/Blog/BlogBox";
import { useEffect ,useState,useRef} from "react";
import { useRouter } from 'next/router'
import MobileHeader from "@/components/Headers/mobileHeader/MobileHeader";


export default function bloglist({data,blogTitle}){

   const router = useRouter();
   const[categoryItem,setCategoryItem]=useState([])
   const[value,setValue]=useState([])
   const[loading,setLoading]=useState(false)
   const[loader,setLoader]=useState(true)
   const cardref=useRef()
   let page_no=1
   let no_product=false
 
   useEffect(() => {
    if (typeof window != undefined) {
      setLoader(true);
    }
 
     
     if(data && data.length != 0) {
       setValue(data);
        setLoader(false);
       page_no = page_no + 1;
     }else{
      setLoader(false)
        setValue([])
     }
    
     const intersectionObserver = new IntersectionObserver((entries) => {
       if (entries[0].intersectionRatio <= 0) return;
 
       if (!no_product) {
         page_no > 1 ? get_blog_content() : null;
         // page_no > 1 ? getPageData() : null;
         // page_no = page_no + 1;
       }
     });
 
     intersectionObserver?.observe(cardref?.current);
     return () => {
       cardref?.current && intersectionObserver?.unobserve(cardref?.current);
     };
   }, [router]);

   
   const get_blog_content = async () => {

     page_no > 1 ? setLoading(true): null
     const param = {
       page_no: page_no,
       page_size: 4,
       category: blogTitle,
     };
 
     const resp = await BlogList(param);
     const data = await resp.message;
  
     if (data  && data.length != 0) {
       if(page_no == 1){
         setValue(data);
       }else{
         setValue((d) => (d = [...d, ...data]));
         setLoading(false);
       }
     }else {
       no_product = true;
       setLoading(false);
     }
     page_no = page_no + 1;
 
   };
 

    useEffect(()=>{
        getBlogCategories()
    },[])

    const getBlogCategories=async()=>{
        const res = await BlogCategories();
        const category = await res.message;
        setCategoryItem(category)

    }
return (
    <>
     <MobileHeader home={false}  back_btn={true} title={'Blog'} search={true}/>
    <SubHeader title={"blog"} imageBanner={"/blogbanner.png"} />
    <div className="main-width w-[100%]">
      <div className="mb-[5px]">
        <BreadCrumb />
      </div>
      {loader ? (
          <Skeleton />
        ) : (
          <div className="flex md:flex-col lg:flex-row w-[100%] gap-[10px] lg:mb-[10px]">
            <BlogBox data={value} category={categoryItem} />
          </div>
        )}
    </div>
    <div className="more" ref={cardref}></div>
      {loading && (
        <div id="wave">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      )}
  </>
)
}


const Skeleton = () => {
  return (
    <>
      <div className="flex md:flex-col lg:flex-row w-[100%] gap-[10px] mb-[10px] animate-pulse">
        <div className="lg:flex-[0_0_calc(20%_-_5px)]   ">
          <div className="flex lg:flex-col gap-[10px] w-[100%]  lg:rounded-[5px] md:sticky md:top-[50px]  bg-slate-300">
          <div className="border-b-[1px] p-[20px] "></div>
          <div className="border-b-[1px] p-[20px] "></div>
          <div className="border-b-[1px] p-[20px] "></div>
          <div className="border-b-[1px] p-[20px] "></div>
          <div className="border-b-[1px] p-[20px] "></div>
          <div className="border-b-[1px] p-[20px] "></div>
          </div>
        </div>
        <div className="lg:flex-[0_0_calc(80%_-_5px)] flex gap-[10px] px-[10px] md:flex-col flex-wrap  w-[100%]">
          {[1,2,,3,4,5,6,7].map((item,i)=>{
            return(
              <div className="lg:flex-[0_0_calc(32.33%_-_1px)] border rounded-[5px]">
              <div className="w-full h-[170px] bg-slate-300"></div>
              <div className="px-[5px]">
              <h1 className="line-clamp-1 my-[10px] h-[20px] rounded-[15px] mx-[10px] px-[10px] text-start text-[14px] font-semibold bg-slate-300"></h1>
                      <p className="line-clamp-3 px-[8px] h-[20px] rounded-[15px] mx-[10px] text-[12px] font-thin text-star bg-slate-300t bg-slate-300"></p>
                      <div className="flex my-[5px]  items-center  gap-1">
                      <p className="text-[12px] font-normal h-[20px] rounded-[15px] ml-[10px] pr-[5px] bg-slate-300 flex-[0_0_calc(70%_-_10px)]"></p>
                      <button className="bg-slate-300  h-[20px] text-[12px] text-white rounded-[15px] mr-[11px]  font-normal flex-[0_0_calc(30%_-_10px)]"></button>
                      </div>
                      </div>
            </div>
            )
          })}
         

        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context){
    const blogTitle = context.params?.list
    const param=
        {
            page_no: 1,
            page_size: 4,
            category: blogTitle
        }

        const resp=await  BlogList(param)
        const data= await resp.message
        
    return{
     props:{
        data,blogTitle
     }
    }
}