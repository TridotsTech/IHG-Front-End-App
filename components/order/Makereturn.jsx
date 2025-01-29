import React, { useEffect, useState } from 'react'
import { returnReasonlist, create_return_request } from '@/libs/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/checkout.module.scss';
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import Image from "next/image";

export default function WebHeader({order_id, hide, eligibleItems}) {

  const [returnList,setReturnList] = useState([]);  
  const [indexValue,setIndex] = useState(-1);
  const [loader,setLoader] = useState(-1);

  let [images,setImages] = useState([])

  useEffect(()=>{
    eligibleItems.map(res=>{
     res.count = res.quantity
    })
   getReasons()
  },[])


  
  async function getReasons() {
    let res = await returnReasonlist();
    // console.log(res)
    if(res && res.message && res.message.return_request_reason && res.message.return_request_reason != 0){
      setReturnList(res.message.return_request_reason)
    }
  }

  const { handleSubmit, control, reset , setValue, formState: { errors } } = useForm({
    defaultValues: {
      reason_for_return: '',
      remarks: '',
      picture:''
    }
  });

  const [fileName,setFileName] = useState();
  const [fileUrl,setUrl] = useState();
  
  const changeListener = (event) => {
    // console.log(event)
    // base64(event.target);
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      var file_size = fileInput.files[0].size;
      var categoryfile = fileInput.files[0].name;
      setFileName(categoryfile)

      if (selectedFile instanceof Blob || selectedFile instanceof File) {
        const reader = new FileReader();
  
        reader.onload = function (event) {
          const base64String = event.target.result.split(',')[1]; // Extract base64 part
          let img_data = {
            file_name: categoryfile,
            content: base64String,
          }

          setUrl(base64String)
          
          if (file_size <= 10000000) {  
            images = [];
            images.push(img_data);
            setImages(images)
          }else{
            toast.error("Max file size is 10mb");
          }
        };
  
        reader.readAsDataURL(selectedFile);
      } else {
        // console.log('Invalid file selected.');
      }
    } else {
      // console.log('No file selected.');
    }
  }


  const uploadFile = () => {
    const fileInput = document.getElementById('Picture');
    fileInput ? fileInput.click() : null; // Trigger the file input click event
  };

  const onSubmit = (data) => {
  let returnItems = eligibleItems.filter(res=>{return (res.count != 0) })
    if(returnItems.length != 0){
      if(images.length != 0){
        data.reason_for_return = data.reason_for_return.label
        delete data.picture;
        submit(data,returnItems)
      }else{
        toast.error('Upload a file');
      }
    }else{
      toast.error('Please select a item');
    }

  };


  async function submit(obj,items){
    let data = {
      order_id:order_id,
      items:items,
      images:images
    }
    data = {...data,...obj}
    let res = await create_return_request(data);

    if(res && res.message && res.message.status && res.message.status == 'Success'){
      hide(res)
    }
  }
  
  const handleClick = () => {
    handleSubmit(onSubmit)();
  };

  function sanitizeHtml(htmlValue){
    const stringWithHtmlTags = htmlValue;
    const withoutTags = stringWithHtmlTags.replace(/<\/?[^>]+(>|$)/g, "");
    return withoutTags;
  }

  function addCart(obj, index, type){
    obj.count = type == 'inc' ?  (obj.count + 1) : (obj.count - 1)
    setIndex(indexValue + 1);
  }
  
  return (
    <>
      {/* <ToastContainer position={'bottom-right'} autoClose={2000}  /> */}
      <div className={`flex flex-col w-full h-full `}>

        <h6 className='flex items-center text-[16x] font-semibold h-[55px] border-b-[1px] border-b-slate-100 p-[10px]'>Return Items From Order <span className='text-[14px]'>({order_id})</span></h6>

        <div className='body_sec h-[100%] overflow-auto scrollbar-hide p-[10px]'>


        <ul className='w-[calc(100%)] border-[1px] border-slate-100 rounded-[5px]'>
         {eligibleItems && eligibleItems.length != 0 && eligibleItems.map((item,index)=>{
            return(
                <li key={index} className={`flex items-center p-[8px] border-b-[1px] border-b-slate-100 last:border-b-[0] relative`}>
                    {/* <div className='flex items-center justify-center h-[95px] w-[95px]'><Image className='h-[95px] w-[95px] object-contain' height={100}  width={100} alt='logo' src={check_Image(item.image)}></Image></div> */}
                    <div className='flex items-center w-full gap-[10px]'>
                     
                     <div className='flex-[0_0_calc(70%_-_10px)]'>
                       <h3 className='text-[14px] py-[5px] font-medium line-clamp-1 capitalize'>{item.item_name}</h3>
                       {item.variant_text && <span className='gray_color text-[12px] pb-[5px] line-clamp-1' dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.variant_text)}} ></span>}
                       {/* <h6 className='text-[12px] pb-[5px] font-medium primary_color capitalize'><span className='gray_color text-[12px] px-[2px]'>Sold by : </span>{item.business_name}</h6> */}
                     </div> 

                      <div className={`flex items-center flex-[0_0_calc(30%_-_0px)]`}>
                         <div className="flex items-center">
                          <button disabled={(item.count == 0 ? true : false)} onClick={()=>{item.count == 0 ? null : addCart(item,index,'dec')}} className={`border-1 rounded-[5px] light_bg primary_color text-[16px]  flex items-center justify-center h-[28px] w-[28px]`}> - </button>
                          <div className={`ease-in duration-300 flex items-center justify-center min-w-[15px] mx-2`}>
                              <span className="ease-in duration-300 text-[12px]">{item.count}</span> 
                          </div>
                          <button disabled={(item.count == item.quantity ? true :false)} onClick={()=>{item.count == item.quantity ? null : addCart(item,index,'inc')}} className={`border-1 rounded-[5px] primary_bg text-[#fff] text-[16px]  flex items-center justify-center 'h-[28px] w-[28px]`}> +</button>
                       </div>
                      </div>

                    </div>
                </li>
            )})
          }
        </ul>
         
         <form onSubmit={handleSubmit(onSubmit)}>

                <Controller
                name="reason_for_return"
                control={control}
                rules={{ required: 'Reason is required' }}
                render={({ field }) => (
                <Select
                    className={`${styles.custom_input1} w-full`}
                    placeholder="Reason"
                    {...field}
                    options={returnList.map(item => ({
                    value: item.name,
                    label: item.name
                    }))}
                    styles={{
                    control: provided => ({
                        ...provided,
                        border: "none",
                        height: "43px"
                    })
                    }}
                />
                )}
                />
                {errors.reason_for_return && <p className={`${styles.danger}`}>{errors.reason_for_return.message}</p>}

                <Controller name="remarks" control={control} rules={{ required: 'Remark is required' }} render={({ field }) => ( <input className={`${styles.custom_input} w-full`} type="text" placeholder="Remark" id="remarks" {...field} />)} />
                {errors.remarks && <p className={`${styles.danger}`}>{errors.remarks.message}</p>}


                <Controller name="picture"control={control} render={({ field }) => (
                 <div><input {...field} className={`${styles.custom_input} w-full hidden`} type="file"placeholder="Picture" onChange={(e) => {changeListener(e) }} id="Picture"/></div>)}/>

                <div className="flex cursor-pointer items-center my-[10px] min-h-[45px] border-[1px] border-[#e2e2e2] rounded-[5px] justify-between" onClick={() => fileName ? null : uploadFile()}>
                    <p onClick={() => fileUrl ? window.open(fileUrl, '_blank') : null} className="mb-0 text-[13px] hover:text-[#000] hover:underline px-[10px] line-clamp-1">{fileName ? fileName : 'Upload a Picture'}</p>
                    <span onClick={() => fileName ? uploadFile() : null} className="flex items-center justify-center m-0 border-l-[1px] border-l-[#e2e2e2] px-[10px] min-h-[45px]"><Image className="" src={'/file_upload.svg'} height={18} width={18} alt="image"></Image></span>
                </div>

                {/* {errors.picture && <p className={`${styles.danger}`}>{errors.picture.message}</p>} */}


                {/* <Controller name="picture" control={control}  render={({ field }) => (
                <input {...field}  accept=".pdf, .doc, .docx"  onChange={(e) => {changeListener(e) }} className={`${styles.custom_input} w-full hidden`} type="file" placeholder="Picture" id="Picture" />)} />
                <div className="flex cursor-pointer items-center my-[10px] min-h-[45px] border-[1px] border-[#e2e2e2] rounded-[5px] justify-between" onClick={()=>fileName ? null : uploadFile()}>
                  <p onClick={()=>fileUrl ? window.open((fileUrl), '_blank') : null}  className="mb-0 text-[13px] hover:text-[#000] hover:underline px-[10px]">{fileName ? fileName : 'Upload a Picture'}</p>
                  <span onClick={()=>fileName ? uploadFile() : null} className="flex items-center justify-center m-0 border-l-[1px] border-l-[#e2e2e2] px-[10px] min-h-[45px]"><Image className="" src={'/file_upload.svg'} height={18} width={18} alt="image"></Image></span>
                </div> */}
            
           </form>  

        </div>

        <div className='flex items-center gap-[10px] p-[10px] footer border-t-[1px] border-t-slate-100'>
          <button onClick={()=>{hide()}} className='flex-[0_0_calc(50%_-_5px)] h-[40px] primaryTxt_btn'>Cancel</button>
          <button type="submit" onClick={()=>{handleClick()}} className='flex-[0_0_calc(50%_-_5px)] h-[40px] primary_btn'>Submit</button>
        </div>
        
      </div>
    </>
  )


}
