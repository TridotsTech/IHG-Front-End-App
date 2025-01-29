import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import styles from '@/styles/Components.module.scss'
import Image from 'next/image';
import { registerUser, checkMobile } from '@/libs/api';
import { login, get_customer_info, storeCustomerInfo } from '@/libs/api';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomerInfo } from '@/redux/slice/logInInfo'


import AlertUi from '../Common/AlertUi'

export default function SignUp({ hide, checkModal, webSettings }) {

    const [show, setShow] = useState(false)
    const router = useRouter();


    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const dispatch = useDispatch();

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

    let [msg, setMsg] = useState({})
    let [headerMsg, setHeaderMsg] = useState()

    async function signup(data) {
        if (data) {
            let datas = {
                first_name: data.name,
                last_name: '',
                email: data.email,
                phone: data.phone,
                pwd: data.password
            }
            let val = await registerUser(datas);
            if (val.message.status == 'success') {
                // checkModal('login')
                log_in(datas)
            } else if(val.message.status == 'failed') {
                msg = { message: val.message.message }
                setMsg(msg)
                headerMsg = 'Alert'
                setHeaderMsg(headerMsg)
                setShowAlert(true)
            }else {
                let value = JSON.parse(val._server_messages)
                let parsedData = JSON.parse(value)
                msg = { message: parsedData.message }
                setMsg(msg)
                headerMsg = 'Alert'
                setHeaderMsg(headerMsg)
                setShowAlert(true)
            }
        }
    }

    async function log_in(data) {
        
        if (data) {
            let datas = {
                usr: data.email,
                pwd: data.pwd
            }
            let val = await login(datas);
            if (val.message.status == 'success') {
                localStorage['api_key'] = val.message.api_key
                localStorage['api_secret'] = val.message.api_secret
                getCustomerInfo({ email: data.email,guest_id :localStorage['customerRefId'] })
                // localStorage['customerUser_id'] = val.message.user_id;
                // localStorage['customer_id'] = val.message.customer_id;
                localStorage['full_name'] = val.full_name;
                localStorage['roles'] = JSON.stringify(val.message.roles);
                hide()
            }
            else {
                msg = { message: val.message }
                setMsg(msg)
                headerMsg = 'Alert'
                setHeaderMsg(headerMsg)
                setShowAlert(true)
            }
        }
    }

    const getCustomerInfo = async (mail) => {
        const resp = await get_customer_info(mail);
        if (resp.message && resp.message.length != 0) {
            storeCustomerInfo(resp);
            dispatch(setCustomerInfo(resp.message[0]));
            // localStorage['CustomerId'] = resp.message[0].email;
            // localStorage['email'] = resp.message[0].email;
            // localStorage['CustomerName'] = resp.message[0].full_name;
            // localStorage['referral_code'] = resp.message[0].referral_code
            // localStorage['Customerphone'] = resp.message[0].phone;
            // localStorage['Customerfirst_name'] = resp.message[0].first_name
            // localStorage['Customerlast_name'] = resp.message[0].last_name
            // localStorage['customerRefId'] = resp.message[0].name
            // localStorage['customerUser_id'] = resp.message[0].user_id;
            // let business_addr_info = {};
            // business_addr_info.business_name = resp.message[0].business_name
            // business_addr_info.business_phone = resp.message[0].business_phone
            // business_addr_info.business_address = resp.message[0].business_address
            // business_addr_info.business_landmark = resp.message[0].business_landmark
            // business_addr_info.business_city = resp.message[0].business_city
            // business_addr_info.business_state = resp.message[0].business_state
            // business_addr_info.business_zip = resp.message[0].business_zip
            // business_addr_info.business_country = resp.message[0].business_country
            // localStorage['Business_address'] = JSON.stringify(business_addr_info);
            // localStorage.removeItem('guestRefId');
        }
    }

    let [showAlert, setShowAlert] = useState(false)
    const closeModal = () => {
        setShowAlert(false)
    }

    
    const numberInputOnWheelPreventChange = (e) => {
        // Prevent the input value change
        e.target.blur()
    
        // Prevent the page/container scrolling
        e.stopPropagation()
    
          setTimeout(() => {
            e.target.focus()
        }, 0)
    }

    const handleKeyDown=(event)=>{
        if (event.keyCode === 38 || event.keyCode === 40) {
          event.preventDefault();
          event.stopPropagation(); 
        }
    
      }



    return (
        <>
            {showAlert && <AlertUi button_2={'Ok'} closeModal={closeModal} isOpen={showAlert} headerMsg={headerMsg} alertMsg={msg} />}

            <div className='w-full text-center'>
                <h2 className='text-[20px] font-semibold'>SignUp for free!</h2>
                <p className='text-[14px]'>Already registered? <span className='primary_color text-[15px] cursor-pointer' onClick={() => checkModal('login')}>Sign In Now</span></p>
            </div>
            <form onSubmit={handleSubmit((data) => signup(data))} autoComplete='off'>
                <div className={`flex flex-col py-[15px] relative`}>
                    <label className={`${styles.label} `} htmlFor='name' >Name</label>
                    <div className='border rounded-[5px] flex gap-[5px] mt-[5px] p-[0_10px] h-[40px] items-center'>
                        {/* absolute  left-[10px] ${errors.email?.message ? 'bottom-[50px]' : 'bottom-[30px]'} */}
                        {/* <Image className={` h-[20px] w-[25px] object-contain`} src={'/login/email.svg'} height={15} width={15} alt={"pass"} /> */}
                        <Image className={`t-[10px] ${errors.name?.message ? 'bottom-[48px]' : 'bottom-[25px]'} h-[23px] w-[20px] object-contain`} src={'/login/profile-01.svg'} height={15} width={15} alt={"pass"} />
                        <input placeholder='Name' className={`${styles.input} ${styles.border_left} h-full`} {...register('name', { required: { value: true, message: 'Name is required' } },)} />
                    </div>
                    {errors?.name && <p className={`${styles.danger}`}>{errors.name.message}</p>}
                </div>

                <div className={`flex flex-col pb-[15px] relative`}>
                    <label className={`${styles.label} `} htmlFor='email' >Email </label>
                    <div className='border rounded-[5px] flex gap-[5px] mt-[5px] p-[0_10px] h-[40px] items-center'>
                        {/* absolute  left-[10px] ${errors.email?.message ? 'bottom-[50px]' : 'bottom-[30px]'} */}
                        {/* <Image className={` h-[20px] w-[25px] object-contain`} src={'/login/email.svg'} height={15} width={15} alt={"pass"} /> */}
                        <Image className={`t-[10px] ${errors.email?.message ? 'bottom-[48px]' : 'bottom-[25px]'} h-[23px] w-[20px] object-contain`} src={'/login/mail-01.svg'} height={15} width={15} alt={"pass"} />
                        <input placeholder='Email' className={`${styles.input} ${styles.border_left} h-full`} {...register('email', { required: { value: true, message: 'Email is required' }, pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: "Please enter a valid email" } },)} />
                    </div>
                    {errors?.email && <p className={`${styles.danger}`}>{errors.email.message}</p>}
                </div>

                <div className={`flex flex-col  pb-[15px] relative`}>
                    <label className={` ${styles.label}`} htmlFor='password'>Password</label>
                    <div className='border rounded-[5px] flex gap-[5px] mt-[5px] p-[0_10px] h-[40px] items-center'>
                        {/* absolute  left-[10px] ${errors.password?.message ? 'bottom-[45px]' : 'bottom-[25px]'} */}
                        <Image onClick={() => setShow(!show)} className={` h-[23px] w-[20px] cursor-pointer object-contain`} src={show ? '/login/password-02.svg' : '/login/password-01.svg'} height={15} width={15} alt={"pass"} />
                        {webSettings.password_validation.password_policy == 'Any' ? 
                           <input placeholder='Password' type={`${show ? 'text' : 'password'}`} className={`${styles.input} ${styles.border_left} h-full`} {...register('password', { required: { value: true, message: 'Password is required'}, minLength: {value: webSettings.password_validation.min_password_length, message: `Password must be at least ${webSettings.password_validation.min_password_length} characters long`,},})} />
                         : <input placeholder='Password' type={`${show ? 'text' : 'password'}`} className={`${styles.input} ${styles.border_left} h-full`} {...register('password', { required: { value: true, message: 'Password is required'}, pattern: { value: new RegExp(`^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\-]).{${webSettings.password_validation.min_password_length},}$`), message: "Please enter a password with " + webSettings.password_validation.password_policy }, minLength: {value: webSettings.password_validation.min_password_length, message: `Password must be at least ${webSettings.password_validation.min_password_length} characters long`}, })} />
                        }
                        <Image onClick={() => setShow(!show)} className={` h-[23px] w-[20px] cursor-pointer object-contain`} src={show ? '/login/eye.svg' : '/login/eye-hide.svg'} height={15} width={15} alt={"pass"} />
                    </div>
                    {errors.password && <p className={`${styles.danger}`}>{errors.password.message}</p>}
                </div>

                <div className={`flex flex-col pb-[15px] relative`}>
                    <label className={`${styles.label} `} htmlFor='mobile' >Mobile Number</label>
                    <div className='border rounded-[5px] flex gap-[5px] mt-[5px] p-[0_10px] h-[40px] items-center'>
                        <Image className={` h-[23px] w-[20px] cursor-pointer object-contain`} src={'/login/call-01.svg'} height={15} width={15} alt={"pass"} />
                        <input type='number' placeholder='Mobile Number' onWheel={numberInputOnWheelPreventChange} onKeyDown={handleKeyDown} className={`${styles.input}   ${styles.border_left} h-full`} {...register('phone', { required: { value: true, message: 'Mobile Number is required' }, pattern: {value: new RegExp(`^[0-9]{${webSettings.phone_vaidation.min_phone_length},${webSettings.phone_vaidation.max_phone_length}}$`), message: `Please enter a valid mobile number` }},)} />
                        {/* <input type='number' placeholder='Mobile Number' className={`${styles.input}  ${styles.border_left} h-full`} {...register('phone', { required: { value: true, message: 'Mobile Number is required' }, pattern: { value: /^\d{10}$/, message: "Please enter a valid Mobile Number" } },)} /> */}
                    </div>
                    {/* <Image className={`absolute  right-[10px] h-[27px] w-[22px] ${errors.phone?.message ? 'bottom-[50px]' : 'bottom-[25px]'}`} src={'/login/mobile.svg'} height={15} width={15} alt={"pass"} /> */}
                    {errors?.phone && <p className={`${styles.danger}`}>{errors.phone.message}</p>}
                </div>

                <button type="submit" className={`${styles.loginBtn} `}>Register</button>
            </form>

        </>
    )
}







