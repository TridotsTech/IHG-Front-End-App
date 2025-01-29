import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { blog_details, check_Image, seo_Image, getCurrentUrl, post_comments } from "@/libs/api";
import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/Common/BreadCrumb"));
const MobileHeader = dynamic(() => import("@/components/Headers/mobileHeader/MobileHeader"));
const AuthModal = dynamic(() => import("@/components/Auth/AuthModal"));
const Rodal = dynamic(() => import("rodal"));
const BlogBox = dynamic(() => import("@/components/Blog/BlogBox"));
const Modals = dynamic(() => import("@/components/Detail/Modals"));
// import BreadCrumb from "@/components/Common/BreadCrumb";
// import MobileHeader from "@/components/Headers/mobileHeader/MobileHeader";
// import AuthModal from "@/components/Auth/AuthModal";
// import Rodal from "rodal";
// import BlogBox from "@/components/Blog/BlogBox";
// import Modals from '@/components/Detail/Modals'
import Image from "next/image";
import styles from "@/styles/Components.module.scss";
import { useForm } from "react-hook-form";
import Head from 'next/head'

export default function BlogDetails({ blogDetail }) {

  const [value, setValue] = useState(null);
  let [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window != 'undefined') {

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
          closeModal();
          hide(); // Call your function to hide the popup
        }
      });

      if (visible || isOpen) {
        document.body.classList.add("active_visible");
      } else {
        document.body.classList.remove("active_visible");
      }

      get_blog_details();
      // loader = true
      // setLoader(loader);
    }
  }, [router]);

  const get_blog_details = async () => {
    // let param = {
    //   route: router.asPath.substring(1),
    // };
    // const resp = await blog_details(param);
    // const data = await resp.message;
    // console.log(blogDetail);
    let data = blogDetail
    if (data && data.status == "success") {
      setValue(data);

      // if (data.blog_details) {
      //   let obj = {};
      //   obj.meta_title = data.blog_details.meta_title
      //   obj.meta_description = data.blog_details.meta_description
      //   obj.meta_image = check_Image(data.blog_details.thumbnail_image)
      //   setMetaInfo(obj)
      // }
      loader = true
      setLoader(loader);
    }
  };

  function formatDate(inputDate) {
    // Split the input date by spaces to extract day, month, and year
    const [day, month, year] = inputDate.split(" ");

    // Create a JavaScript Date object
    const date = new Date(`${year}-${month}-${day}`);

    // Use the Date object's toLocaleDateString method to format the date
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return formattedDate;
  }

  const originalDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // const originalDate = (inputDate) => {
  //   const original = new Date(inputDate);
  //   const options = {
  //     year: "numeric",
  //     month: "numeric",
  //     day: "numeric",
  //     hour: "numeric",
  //     minute: "numeric",
  //     second: "numeric",
  //     timeZoneName: "short",
  //   };

  //   const formattedDate = original.toLocaleString("en-US", options);
  //   return formattedDate;
  // };

  const handleUserCheck = () => {
    if (localStorage && localStorage["api_key"]) {
      setIsOpen(true);
    } else {
      setVisible(true);
    }
  };

  const hide = () => {
    setVisible(false);
    setIsOpen(false);
  };


 function postComments(commentObj){
  
   let comments = value.comments.unshift(commentObj)
   setValue((data)=>({
    ...data,
    ...comments
   }))
   setIsOpen(false);

 }


  return (
    <>

      <Head>
        <title>{blogDetail?.blog_details?.meta_title}</title>
        <meta name="description" content={blogDetail?.blog_details?.meta_description} />
        <meta property="og:type" content={'Blog'} />
        <meta property="og:title" content={blogDetail?.blog_details?.meta_title} />
        <meta key="og_description" property="og:description" content={blogDetail?.blog_details?.meta_description} />
        <meta property="og:image" content={seo_Image(blogDetail?.blog_details?.meta_image)}></meta>
        <meta property="og:url" content={getCurrentUrl(router.asPath)}></meta>
        <meta name="twitter:image" content={seo_Image(blogDetail?.blog_details?.meta_image)}></meta>
      </Head>

      {/* {blogDetail && blogDetail.blog_details && <Seoconfig meta={blogDetail.blog_details} meta_data={blogDetail.blog_details} />} */}

      {isOpen && (
        <div className="post_comment">
          <Rodal visible={isOpen} animation="slideUp" onClose={hide}>
            <PostComment title={value.blog_details.name} hide={(obj)=>postComments(obj)} />
          </Rodal>
        </div>
      )}
      {visible && (
        <AuthModal visible={visible} hide={hide} setVisible={setVisible} />
      )}
      {/* <h1>{router.query}</h1> */}
      <MobileHeader home={false} back_btn={true} title={"Blog"} search={true} />
      <div className="main-width w-[100%]">
        <div className="mb-[5px]">
          <BreadCrumb />
        </div>
        {/* {loader ? (
          <Skeleton />
        ) : (
          <div className="flex md:flex-col lg:flex-row w-[100%] gap-[10px] lg:mb-[10px]">
            <BlogBox data={value} category={categoryItem} />
          </div>
        )} */}

        {!loader ? 
          <Skeleton />
         : 
          <>
            {value && value.blog_details && Object.keys(value.blog_details).length != 0 && (
              <div className=" w-full mx-auto mb-[10px]">
                {/* <Image
                  src={check_Image(value.blog_details.thumbnail_image)}
                  width={20}
                  height={20}
                  className="lg:min-h-[500px] lg:max-h-[500px] lg:z-[10] lg:top-[180px] lg:w-[90%] lg:object-cover lg:absolute lg:rounded-[10px]  md:w-full md:rounded-[10px]   h-[200px] md:object-cover md:mb-[10px]"
                /> */}
                {/* <div className="md:flex lg:absolute lg:right-[50px]  lg:w-[110px]  lg:top-[700px] rounded-[10px] border-[1px]">
                  <div className="md:flex-[0_0_calc(50%_-_10px)] md:flex md:items-center md:flex-col md:justify-center">
                    <Image
                      src={"/purchase_count.webp"}
                      width={30}
                      height={30}
                      alt="demo"
                      className="lg:w-full lg:p-[10px] md:p-[10px] md:w-[70px] md:h-[80px] object-contain"
                    />
                    <h6 className="text-[14px] text-[#000000] text-center">
                      Community organiser
                    </h6>
                  </div>
                  <div className="flex-[0_0_calc(50%_-_10px)] flex items-center justify-center">
                    <p className="text-[12px] text-center text-[#181b29] ">
                      Meet a popular blogger.
                    </p>
                  </div>
                </div> */}
                {/* <div className=" lg:p-[15px] lg:w-[82%] lg:sticky lg:z-[80] lg:m-auto lg:mt-[20%] lg:bg-white  lg:border-[1px] lg:border-black "> */}
                <div className="lg:shadow-[0_0_5px_#ddd] lg:mt-[15px] rounded-[10px]">
                  <div className="p-[15px] m-[15px_0 10px_0] lg:border-dashed lg:border-b-2"> 
                    <div className="flex pb-[5px]">
                      <h1 className="w-[90%] md:text-[17px] lg:text-[20px] font-medium"> {value.blog_details.title}</h1>
                      <div className="w-[10%] flex justify-end"><Modals/> </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-[10px] lg:gap-[10px]">
                        <h1 className="flex gap-1 text-[14px] lg:items-center lg:justify-center font-normal">
                          <Image src={"/time.svg"} width={20} height={20} />
                          {formatDate(value.blog_details.published_on)}
                        </h1>
                        {value && value.blog_details && value.blog_details.disable_comments != 1 &&  <h1 className="flex gap-1 text-[14px] items-center justify-center font-normal">
                          <Image src={"/chats.svg"} width={20} height={20} />
                          {value.comments.length != 0
                            ? value.comments.length + " comments"
                            : "no comments"}
                        </h1>}
                      </div>
                      <h1 className="text-[18px] md:hidden text-[#00000]">
                        {value.blog_details.blog_category}
                      </h1>
                    </div>
                  </div>
                  <div className="hidden p-[0_15px_0_15px] lg:mt-[15px] md:flex md:items-center md:justify-between">
                    <div className="flex gap-2 py-[5px]">
                      <Image
                        src={"/detail/Instagram.svg"}
                        width={20}
                        height={20}
                        alt="pinterest"
                        className="w-[20px] h-[20px] rounded-[50%] cursor-pointer "
                      />
                      <Image
                        src={"/detail/pinterest-01.svg"}
                        width={20}
                        height={20}
                        alt="pinterest"
                        className="w-[20px] h-[20px] rounded-[50%] cursor-pointer "
                      />
                      <Image
                        src={"/detail/twitter-01.svg"}
                        width={20}
                        height={20}
                        alt="pinterest"
                        className="w-[20px] h-[20px] rounded-[50%] cursor-pointer "
                      />
                      <Image
                        src={"/detail/facebook-01.svg"}
                        width={20}
                        height={20}
                        alt="pinterest"
                        className="w-[20px] h-[20px] rounded-[50%] cursor-pointer "
                      />
                      <Image
                        src={"/detail/Whatapp.svg"}
                        width={20}
                        height={20}
                        alt="pinterest"
                        className="w-[20px] h-[20px] rounded-[50%] cursor-pointer "
                      />
                    </div>
                    {/* <div className="lg:hidden bg-red-400 px-[15px] py-[3px] rounded-[5px]">
                      <Image src={"/detail/share.svg"} width={25} height={25} />
                    </div> */}
                  </div>
                  <div className="p-[15px] flex items-center justify-center">
                    <Image
                      src={check_Image(value.blog_details.thumbnail_image)}
                      width={30}
                      height={30}
                      className="md:w-[100%] w-[50%] h-[200px] object-contain rounded-[10px]"
                    />
                  </div>
                  <div className="p-[15px]">
                    {/* <div className="p-[15px] text-[16px] text-[#212121bf] text-justify">{value.blog_details.content}</div> */}
                    {value && value.blog_details && value.blog_details.content && 
                      <HtmlContent htmlContent={value.blog_details.content} />
                    //  <div className="p-[15px] text-[16px] text-[#212121bf] text-justify" dangerouslySetInnerHTML={{ __html: value.blog_details.content }} > </div>
                    }
                  </div>
                </div>
              </div>
            )}
            <div className="py-[10px] md:px-[10px]">
              {value &&
                value.related_bloglist &&
                value.related_bloglist.length != 0 && (
                  <>
                    <h1 className="text-center text-[20px] font-medium mb-[15px]"> Related Blogs </h1>
                    <BlogBox width={'100%'} cssContent={'p-[10px]'} rowCount={'flex-[0_0_calc(30%_-_8px)]'} scroll_button={true} scroll_id='related_blogs' data={value.related_bloglist} />
                  </>
                )}
            </div>

            {value && value.blog_details && value.blog_details.disable_comments != 1 && <div className="border-b mb-[10px]">
              <div className="border-b flex justify-between items-center my-[10px] py-[10px] md:px-[10px]">
                <h1 className="lg:text-[20px] font-medium uppercase"> LEAVE YOUR COMMENT</h1>
                <button className="primary_bg text-white px-[10px] rounded-[5px] text-[12px] lg:py-[10px] md:p-[4px_8px]" onClick={handleUserCheck}>Add Comments  </button>
              </div>

              <div className="md:p-[10px]">
                {value.comments && value.comments.length != 0 ? (
                  <div>
                    {value.comments.map((item, i) => (
                      <div className="border-b-[1px] flex gap-[15px] items-start justify-start py-[10px]">
                        <Image
                          src={"/profile (2).svg"}
                          width={40}
                          height={40}
                        />
                        <div key={i}>
                          <h1 className="capitalize text-[16px]">
                            by {item.name1}
                          </h1>
                          <p className="text-[12px]">
                            {originalDate(item.creation)}
                          </p>
                          <p className="text-[14px]">{item.comments}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <Image src={"/smiley.svg"} width={40} height={40} />
                    <h1 className="text-[16px] py-[10px] text-[#181b29]">
                      No comments yet
                    </h1>
                    {/* <p className="text-[18px] py-[10px] text-[#22222]">
                      Post your first comment
                    </p> */}
                  </>
                )}
              </div>
            </div>}
          </>
        }
      </div>
    </>
  );
}


export async function getServerSideProps({ params }) {

  // const { detail,list } = context.params;
  let param = 'blog/' + params.list + '/' + params.detail

  if(param && param.includes('?')){
    let data = param.split('?')
    param = data[0]
  }

  let data = { route: param }

  const resp = await blog_details(data);

  let blogDetail = resp.message;
  // blogDetail.blog_details.meta_image = (blogDetail.blog_details && blogDetail.blog_details.meta_image) ? blogDetail.blog_details.meta_image : blogDetail.blog_details.thumbnail_image
  return {
    props: { blogDetail },
  }
}

function HtmlContent({ htmlContent }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

const PostComment = ({ title, hide }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const postCommentDetail = async (data) => {
    const param = {
      user_name: data.user_name,
      blog: title,
      email: data.email,
      message: data.message,
    };
    const datas = JSON.stringify(param);
    const resp = await post_comments({ data: datas });
    if (resp && resp.message && resp.message.comments) {
      reset();
      hide(resp.message);
    }
  };

  
  const handleClick = () => {
    handleSubmit(postCommentDetail)();
  };

  return (
    <>
      <div className="flex flex-col h-full">
      
      
        <div className="p-[10px] border-b-[1px] ">
          <h1 className="text-[20px] font-bold">Leave your comments</h1>
        </div>
        {/* handleSubmit((data) => postCommentDetail(data)) */}
        <form className="h-full overflow-auto scrollbarHide px-[10px]"
          onSubmit={handleSubmit(postCommentDetail)}
          autoComplete="off"
        >
          <div className={`flex flex-col py-[10px] `}>
            <label
              className={`text-[14px] font-medium text-[#000000] `}
              htmlFor="user_name"
            >
              UserName
            </label>
            <div className="  mt-[5px] h-[40px] items-center">
              <input
                placeholder="Username"
                className={`border w-full pl-[10px] h-full`}
                {...register("user_name", {
                  required: { value: true, message: "username is required" },
                })}
              />
            </div>
            {errors?.user_name && (
              <p className={`${styles.danger}`}>{errors.user_name.message}</p>
            )}
          </div>
          <div className={`flex flex-col py-[10px] `}>
            <label
              className={`text-[14px] font-medium text-[#000000] `}
              htmlFor="email"
            >
              Email
            </label>
            <div className="  mt-[5px] h-[40px] items-center">
              <input
                placeholder="Email"
                className={`border w-full pl-[10px] h-full`}
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
            </div>
            {errors?.email && (
              <p className={`${styles.danger}`}>{errors.email.message}</p>
            )}
          </div>
          <div className={`flex flex-col py-[10px] `}>
            <label
              className={`text-[14px] font-medium text-[#000000] `}
              htmlFor="email"
            >
              Mobile Number
            </label>
            <div className="  mt-[5px] h-[40px] items-center">
              <input
                placeholder="Mobile Number"
                className={`border w-full pl-[10px] h-full`}
                {...register("phoneNumber", {
                  required: {
                    value: true,
                    message: "Phone number is required",
                  },
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number format",
                  },
                })}
              />
            </div>
            {errors?.phoneNumber && (
              <p className={`${styles.danger}`}>{errors.phoneNumber.message}</p>
            )}
          </div>
          <div className={`flex flex-col py-[10px] `}>
            <label
              className={`text-[14px] font-medium text-[#000000] `}
              htmlFor="message"
            >
              Message
            </label>
            <div className="  mt-[5px] items-center">
              <textarea
                row={10}
                placeholder="Message"
                className={`border outline-none w-full pl-[10px] h-[70px] `}
                {...register("message", {
                  required: { value: true, message: "Message is required" },
                })}
              />
            </div>
            {errors?.message && (
              <p className={`${styles.danger}`}>{errors.message.message}</p>
            )}
          </div>

          {/* <button
            type="submit"
            className={`primary_bg px-[20px]  uppercase rounded-[5px] py-[5px] text-white `}
          >
            Post comment
          </button> */}

          {/* {wrong && <p className='text-center pt-[5px] text-[#ff1010] font-semibold'>Please check your email or password</p>} */}
        </form>

        <button onClick={()=>{handleClick()}}  className={`w-max m-[0px_0px_10px_10px] primary_bg px-[20px]  uppercase rounded-[5px] py-[5px] text-white `}>
            Post comment
        </button>
      </div>
    </>
  );
};

const Skeleton = () => {
  return (
    <>
      <div className="w-[100%]  animate-pulse main-width ">
        <div className="w-[100%] bg-slate-300 md:h-[200px] lg:h-[100vh]"></div>
        <div className="lg:flex-[0_0_calc(100%_-_5px)]  flex px-[15px]  gap-4 my-[10px] md:flex-col flex-wrap  w-[100%]">
          {[1, 2, , 3, 4].map((item, i) => {
            return (
              <div className="lg:flex-[0_0_calc(24%_-_1px)] border rounded-[5px]">
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
            );
          })}
        </div>
      </div>
    </>
  );
};
