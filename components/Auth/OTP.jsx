import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import styles from '@/styles/Components.module.scss'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { send_otp, verify_otp, checkMobile } from '@/libs/api'
import AlertUi from '../Common/AlertUi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomerInfo } from '@/redux/slice/logInInfo'

export default function OTP({ hide, checkModal }) {
    const router = useRouter();
    const [show, setShow] = useState(false)
    const [otp, set_otp] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSuccessPopup, setIsSuccessPopup] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    const dispatch = useDispatch();

    async function sent_otp(data) {

        if (data) {
            let datas = {
                mobile_no: data.mobile
            }
            let val = await send_otp(datas);
            // console.log(val)
            if (val.message.status == 'Success') {
                set_otp(true)
                toast.success("OTP Sent Successfully");
                // setAlertMessage({ message: "Otp Sent Successfully" })
                // setIsSuccessPopup(true)
                // OTP sent successfully.

            }else if(val.message.status == 'Failed') {
                toast.error((val && val.message && val.message.message) ? val.message.message : 'Something went wrong try again later');
                // setAlertMessage({ message: "Otp Sent Successfully" })
                // setIsSuccessPopup(true)
                // OTP sent successfully.
            } else {
                toast.error("OTP Sent Failed");

                // setWrong(!wrong);
                // setAlertMessage({ message: "Otp Sent Failed" })
                // setIsSuccessPopup(true)
            }
        }
    }

    const [isMobile, setIsMobile] = useState()
    useEffect(() => {
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile)
        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, [])

    const checkIsMobile = async () => {
        let isMobile = await checkMobile();
        setIsMobile(isMobile);
    }


    async function verifyOtp(data) {
        if (data) {
            // console.log(data)
            let datass = {
                mobile_no: data.mobile,
                otp: data.otp,
                guest_id :localStorage['customerRefId']
            }
            let val = await verify_otp(datass);
            // console.log(val);
            if (val.message.status == 'Success') {
                // if (val.message.existing_customer == 0) {
                //     router.push(`${isMobile ? '/profile?my_account=' : '/profile?my_account=edit-profile'}`)
                // }
                if (val.message.type == 'Customer') {
                    localStorage['api_key'] = val.message.api_key
                    localStorage['api_secret'] = val.message.api_secret
                    // localStorage['customerUser_id'] = val.message.customer_email;
                    // localStorage['customer_id'] = val.message.customer_id;
                    // localStorage['full_name'] = val.message.customer_name;
                    localStorage['CustomerId'] = val.message.customer_email;
                    localStorage['email'] = val.message.customer_email;
                    localStorage['CustomerName'] = val.message.customer_name;
                    localStorage['customerRefId'] = val.message.customer_id
                    dispatch(setCustomerInfo(val));

                }
                toast.success('OTP Verified successfully!');
                hide()
            } else {
                toast.error(val.message.message);
                // setAlertMessage(val.message)
                // setIsSuccessPopup(true)
            }
        }
    }

    async function check(data) {
        // console.log(data)
        data.otp ? verifyOtp(data) : sent_otp(data)
    }

    async function closeModal() {
        setIsSuccessPopup(false)
    }

    function resendOtp() {
        let mobile_no = document.getElementById('mobile_no').value
        sent_otp({ mobile: mobile_no })
    }

    // function verify(data){
    //  let element = document.getElementById(data).value
    // }

    return (
        <>
            {/* {otp && <ToastContainer position={'bottom-right'} autoClose={2000} />} */}
            <div className='w-full text-center'>
                <h2 className='text-[20px] font-semibold'>Welcome</h2>
                <p className='text-[14px]'>Don't have an account? <span className='primary_color text-[15px] cursor-pointer' onClick={() => checkModal('signup')}>Sign Up</span></p>
            </div>
            <form onSubmit={handleSubmit((data) => check(data))} autoComplete='off'>

                <div className={`flex flex-col py-5 relative`}>
                    <label className={`${styles.label} `} htmlFor='mobile' >Mobile Number</label>
                    <div className='border rounded-[5px] flex  mt-[5px] p-[0_10px] h-[40px] items-center'>
                        +91 <input id='mobile_no' type='number' placeholder='Mobile Number' className={`${styles.input}  cartInput h-full `}  {...register('mobile', { required: { value: true, message: 'Mobile Number is required' }, pattern: { value: /^\d{10}$/, message: "Please enter a valid Mobile Number" } })} />
                    </div>
                    {/* <Image className={`absolute  right-[10px] h-[27px] w-[22px] ${errors.mobile?.message ? 'bottom-[50px]' : 'bottom-[25px]'} object-contain mt-[5px]`} src={'/login/mobile.svg'} height={15} width={15} alt={"pass"} /> */}
                    {errors?.mobile && <p className={`${styles.danger}`}>{errors.mobile.message}</p>}
                </div>

                {otp && <div className={`flex flex-col pt-[10px] pb-4 relative`}>
                    <label className={``} htmlFor='password'>OTP</label>
                    <input id='otp_input' type={`${show ? 'text' : 'number'}`} className={`${styles.input} ${styles.input1} cartInput`} {...register('otp', { required: { value: true, message: 'OTP is required' } })} />
                    {/* <Image onClick={() => setShow(!show)} className={`absolute  right-[10px] h-[23px] w-[20px] ${errors.otp ?.message ? 'bottom-[45px]' : 'bottom-[20px]'}`} src={show ? '/login/showPass.svg' : '/login/hidePass.svg'} height={15} width={15} alt={"pass"} /> */}
                    {errors.otp && <p className={`${styles.danger}`}>{errors.otp.message}</p>}
                </div>}

                {otp && <p onClick={() => resendOtp()} className='text-[12px] text-end pb-[15px] cursor-pointer hover:underline text-black'>Resend OTP</p>}
                {
                    otp ?
                        <button type="submit" className={`${styles.loginBtn} cursor-pointer`}>Verify OTP</button> : <button type="submit" className={`${styles.loginBtn} cursor-pointer`}>Send OTP</button>
                }

            </form>

            {/* <p className='text-center pt-[20px] text-[#B5B5BE]'>Instant Login</p> */}
            <div onClick={() => checkModal('login')} className='flex cursor-pointer gap-[10px] my-[18px] h-[45px] rounded-[5px] border items-center justify-center '>
                <Image height={20} width={20} alt='google' src={'/login/mail.svg'} />
                <p>Login With Mail</p>
            </div>

            {isSuccessPopup && <AlertUi alertMsg={alertMessage && alertMessage} isOpen={isSuccessPopup} closeModal={closeModal} button_2={"ok"} />}


        </>
    )
}
