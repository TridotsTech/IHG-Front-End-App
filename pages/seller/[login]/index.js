import { login_seller, websiteSettings,forgetPassword } from "@/libs/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { check_Image } from "@/libs/api";
import Link from "next/link";
import { HomePage } from '@/libs/api';
import style from '@/styles/Components.module.scss';
import { alertReducer } from "@/redux/slice/alertAction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/Components.module.scss'


export default function index() {
  // console.log(data)
  const [website_settings, setWebsite_settings] = useState(null);
 const [formLogin,setFormLogin]=useState({
  email:"",
  password:""
 })
 const [forgetEmail,setForgetEmail]=useState({
  emailId:""
 })
 const [show, setShow] = useState(false)
//  console.log(forgetEmail)
 const [error,setError]=useState(null)
 const [errorMessage, setErrorMessage] = useState({})
 const [isForgetPassword,setIsForgetPassword]=useState(false)
  useEffect(() => {
    get_websiteSettings();
  }, []);

  async function get_websiteSettings() {
    let res = await websiteSettings();
    if (res && res.message) {
      setWebsite_settings(res.message);
    }
  }

  const handleSumbit=(e)=>{
    e.preventDefault()
    let validationError = {}
    if (formLogin.email.length == 0) {
      validationError.email = "mailid is required"
  } else if (!formLogin.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      validationError.email = 'Invalid email address';
  }
  if(formLogin.password.length == 0){
    validationError.password ="password is required"
  }
  setErrorMessage(validationError)
   if(Object.keys(validationError).length === 0){
    sellerLogin()
   }
  }
  

  const sellerLogin=async()=>{
   const param={
        usr: formLogin.email,
        pwd: formLogin.password,
        get_user_token: 1,
        is_redirect:1,
   }
   const resp =await login_seller(param)
   const data=await resp.message
  setError(data)
  }
  const handleChange = (e) => {
    setFormLogin({ ...formLogin,[e.target.name]: e.target.value })
}

const handleEmail=(e)=>{
  e.preventDefault()
  if (forgetEmail.emailId.length == 0) {
   toast.error("please enter emailid")
} 
sellerForgetPassword()
}

const sellerForgetPassword=async()=>{
  let datas = { user: forgetEmail.emailId }
  const resp = await forgetPassword(datas);
  if (resp && resp.message && resp.message.status && resp.message.status == 'Failed'){
    toast.error((resp && resp.message && resp.message.message) ? resp.message.message : 'Something went wrong try again later')
  }else{
    toast.success('Password reset link have been sent to your email address')
  }
}

const handleEmailId=(e)=>{
  setForgetEmail({...forgetEmail,[e.target.name]:e.target.value})
}

const handleForgetPassword=()=>{
  setIsForgetPassword(!isForgetPassword)
}

  return (
    <>
    {/* <ToastContainer position={'bottom-right'} autoClose={2000}  /> */}
      <div className="main-width ">
        <div className="border-b flex justify-between items-center py-4 lg:pl-[60px]">
          <Image
            style={{ objectFit: "contain" }}
            className="h-[50px] w-[280px]"
            src={check_Image(
              website_settings && website_settings.length != 0
                ? website_settings.website_logo
                : null
            )}
            width={30}
            height={30}
            alt="website_logo"
          />
          <div>
            <Link href="/">
          <div className="flex items-center bg-[#f1f1f1] py-[2px] px-[5px] rounded-[5px] md:hidden">
            <Image src={"/cancel.svg"} width={14} height={14} alt="cancel" />
            <span  className="text-[#a19b9b] text-[14px]">Cancel</span>
          </div>
          </Link>
          </div>
        </div>
        <div className="flex w-full mt-2 items-center justify-center lg:pl-[60px]">
          {!isForgetPassword ?
          (
          <form onSubmit={handleSumbit} className="md:flex-[0_0_calc(100%_-_10px)] lg:flex-[0_0_calc(60%_-_10px)] lg:m-[10px] py-[10px]  ">
            <h1 className="text-[24px] font-normal text-[#000] pt-[10px] md:mb-2 lg:m-[10px]">Login</h1>
            <div className="w-full lg:m-[10px] md:mb-2">
            <h6 className="font-[13px] text-[#000] mb-[2px]">Email</h6>
            <input type="text" placeholder="Email" className="w-full border h-[50px] rounded-[5px] pl-[15px] text-[#000]" onChange={handleChange} name="email" value={formLogin.email}/>
            {errorMessage.email && <p className={`${style.danger} pb-1`}>{errorMessage.email}</p>}

            </div>
            <div className="w-full lg:m-[10px]  md:mb-2">
              <div className=" flex items-center">
            <h6 className="flex font-[13px] text-[#000] mb-[2px] ">password </h6>
            <div className="relative group cursor-pointer">
            <Image src={'/help-circle.svg'} width={15} height={15} />
            <div className="w-[200px] p-[10px] rounded-[5px] absolute top-0 left-[20px] bg-gray-200 hidden group-hover:flex ">
             <h1>Minimum of 8  character and must contain atleast Upper Case, Special Character,Number</h1>
            </div>
            </div>
            </div>
            <div className='border rounded-[5px] flex gap-[5px] mt-[5px] p-[0_10px] h-[40px] items-center'>
            <Image onClick={() => setShow(!show)} className={` h-[23px] w-[20px] cursor-pointer object-contain`} src={show ? '/login/password-02.svg' : '/login/password-01.svg'} height={15} width={15} alt={"pass"} />
            <input  id='password' type={`${show ? 'text' : 'password'}`} className={`${styles.input} ${styles.border_left} h-full`} placeholder="password"  onChange={handleChange} value={formLogin.password} name="password"/>
            <Image onClick={() => setShow(!show)} className={` h-[23px] w-[20px] cursor-pointer object-contain`} src={show ? '/login/eye.svg' : '/login/eye-hide.svg'} height={15} width={15} alt={"pass"} />

            </div>
            {errorMessage.password && <p className={`${style.danger} pb-1`}>{errorMessage.password}</p>}

            </div>
            <h6 className="text-[16px] text-end text-[#3d464d] cursor-pointer" onClick={handleForgetPassword}>Forget Password</h6>
         
              <button type="submit" className="text-[16px] lg:mx-[10px]  w-full h-[50px]  primary_bg  text-white text-center">SignIn</button>
        
            {(error && error.length != 0) && <h1 className={`${style.danger} w-full lg:mx-[10px] bg-red-200 text-center pb-1`}>{error.message}</h1>}
            <h1 className="text-[14px] text-[#181b29] lg:ml-[10px]">Do not have an account ? <span className="text-[#e8691d]">Register Here</span></h1>
          </form>
          
          )
          :
          (
            <form onSubmit={handleEmail} className="md:flex-[0_0_calc(100%_-_10px)] lg:flex-[0_0_calc(60%_-_10px)] lg:m-[10px] py-[10px]  ">
            <h1 className="text-[24px] font-normal text-[#000] pt-[10px] md:mb-2 lg:m-[10px]">Login</h1>
            <div className="w-full lg:m-[10px] md:mb-2">
            <h6 className="font-[13px] text-[#000] mb-[2px]">Email</h6>
            <input type="text" placeholder="Email" className="w-full border h-[50px] rounded-[5px] pl-[15px] text-[#000]" onChange={handleEmailId} name="emailId" value={forgetEmail. emailId}/>
            </div>
            <h6 className="text-[12px] text-end text-[#3d464d] cursor-pointer" onClick={handleForgetPassword}>have an account? Please <span className="text-[16px]">Login</span> </h6>
            <button  type="submit"  className="text-[16px] lg:mx-[10px]  w-full h-[50px]  primary_bg text-white text-center">SignIn</button>
            {(error && error.length != 0) && <h1 className={`${style.danger} w-full lg:m-[10px] bg-red-200 text-center pb-1`}>{error.message}</h1>}
            <h1 className="text-[14px] text-[#181b29] lg:ml-[10px]">Do not have an account ? <span className="text-[#e8691d] ">Register Here</span></h1>
          </form>
          )}
      
          <div className="md:hidden lg:flex-[0_0_calc(40%_-_10px)] text-center flex justify-center items-center w-[400px] h-[400px]">
          <Image src={"/LOG-IN.svg"} width={100} height={100} alt="go-market"  className="w-full h-full"/>
          </div>
        </div>
      </div>
    </>
  );
}


// export async  function getServerSideProps({params}){

//   let route =await params.page
//   let data={}
//   const param={
//     "route":route
//   }
//  const resp= await HomePage(param)
//  data =await resp.message
//   return{
//     props:{data}
//   }


// }
