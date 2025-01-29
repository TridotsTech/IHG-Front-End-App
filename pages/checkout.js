// import RootLayout from '@/layouts/RootLayout'
import { useEffect, useMemo, useState } from 'react'
import styles from '@/styles/checkout.module.scss';
import { currencyFormatter1, get_wallet_details, get_order_discount, get_cart_items, get_customer_info, validate_coupon, calculate_shipping_charges, get_shipping_methods, get_cart_delivery_slots, update_order_status, stored_customer_info, get_payment_method, delete_address, get_razorpay_settings, insertOrder, check_Image, checkMobile } from '@/libs/api';
import Image from 'next/image'
import dynamic from 'next/dynamic';
const AddressModal = dynamic(() => import('@/components/Address/AddressModal'))
const Address = dynamic(() => import('@/components/Address/Address'))
const AlertUi = dynamic(() => import('@/components/Common/AlertUi'))
const LoaderButton = dynamic(() => import('@/components/Common/LoaderButton'))
const YourCart = dynamic(() => import('@/components/Product/YourCart'))
const ShippingMethods = dynamic(() => import('@/components/Checkout/ShippingMethods'))
const AuthModal = dynamic(() => import('@/components/Auth/AuthModal'))
const MobileCart = dynamic(() => import('@/components/MobileCart'))
const AddAddress = dynamic(() => import('@/components/Address/AddAddress'))
const MobileHeader = dynamic(() => import('@/components/Headers/mobileHeader/MobileHeader'))
const NoProductFound = dynamic(() => import('@/components/Common/NoProductFound'))
const YouMayLike = dynamic(() => import('@/components/Common/YouMayLike'))
const Rodal = dynamic(() => import('rodal'))
const RootLayout = dynamic(() => import('@/layouts/RootLayout'))

import { format } from 'date-fns';
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
// import { alertAction } from '@/redux/slice/alertAction'
import { toast } from 'react-toastify';
// import DeliverySlot from '@/components/Checkout/DeliverySlot';
import { setCartItems } from '@/redux/slice/cartSettings'
import { setTotal } from '@/redux/slice/checkoutInfo'

// import Rodal from 'rodal';
// import 'rodal/lib/rodal.css';
import { app_name, r_pay_color } from "@/libs/config/siteConfig"

export default function checkout() {


  const [currentIndex, setIndex] = useState(0);
  const [paymentIndex, setPaymentIndex] = useState(0);
  const [payment_methods, setPaymentMethods] = useState([]);
  const [shippingMethodList, setShippingMethods] = useState([]);
  let [deliverySlot, setDeliverySlots] = useState([]);
  let [isMobile, setIsmobile] = useState();
  let [customerInfo, setCustomerInfo] = useState({});
  const [editAddress, setEditAddress] = useState(undefined);
  const router = useRouter();
  const [razorpay_settings, setRazorpay_settings] = useState({});
  const dispatch = useDispatch()
  let [localValue, setLocalValue] = useState(undefined);
  let [loadSpinner, setLoadSpinner] = useState(false);
  let [activeWallet, setActiveWallet] = useState(false)
  let [coupon, setCoupon] = useState()
  // let [isLogin,setIsLogin] = 

  let [sample, setSample] = useState(-1);
  let [enabledSlot, setEnabledSlot] = useState(true);
  // const customer = useSelector(s => s.customer);
  const customer = useSelector((state) => state.customerInfo.address)

  let cartValueSlice = useSelector((state) => state.cartSettings.cartValue)
  let you_may_like = useSelector((state) => state.cartSettings.you_may_like)

  const webSettings = useSelector((state) => state.webSettings.websiteSettings)
  let loginInfo = useSelector((state) => state.logInInfo.customerInfo)
  const cartItems = useSelector((state) => state.cartSettings.cartItems)
  // console.log(cartItems,"cartItems")

  let totalAmt = useSelector((state) => state.checkoutInfo.total)
  let orders_Id;

  useMemo(() => {
    //  console.log('cartItems',cartItems)
  }, [cartItems])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // customer_info();
      shipping_methods();
      get_payments();
      // get_cart_item()
      localValue = stored_customer_info()
      setLocalValue(localValue);
      get_razor_pay_values();
      checkIsMobile();
      window.addEventListener('resize', checkIsMobile)
      return () => {
        window.removeEventListener('resize', checkIsMobile);
      };
    }
  }, [])

  const setAddressAfterLogin = () => {
    if (loginInfo && loginInfo.address && loginInfo.address.length != 0) {
      loginInfo = JSON.stringify(loginInfo)
      loginInfo = JSON.parse(loginInfo)
      customerInfo = JSON.stringify(customerInfo)
      customerInfo = JSON.parse(customerInfo)
      let data;
      // let is_default = loginInfo.address;
      let is_default = loginInfo.address.filter((res) => { return res.is_default == 1 })
      if (is_default && is_default.length != 0) {
        data = loginInfo.address;
      } else {
        loginInfo.address[0]['is_default'] = 1
        // copy[0]['is_default'] = 1
        data = loginInfo.address
      }

      setCustomerInfo(
        { ...customerInfo, address: data }
      )
    }
  }

  useMemo(() => {
    if (typeof window != 'undefined') {
      if ((loginInfo && loginInfo.full_name) || localStorage['CustomerName'] || localStorage['customerRefId']) {
        // customer_info();
        
        shipping_methods();
        get_payments();
        setAddressAfterLogin()
        get_cart_item()
        localValue = stored_customer_info()
        setLocalValue(localValue);
        if (webSettings && webSettings.enable_wallet == 1) {
          // setActiveWallet(true)
          dispatch(setTotal({ activeWallet: true }));
          getWalletDetail();
        }
      }
    }
  }, [loginInfo])


  useMemo(() => {
    if (cartValueSlice && cartValueSlice.total) {
      let value = { total: cartValueSlice.total, tax: cartValueSlice.tax }
      dispatch(setTotal(value));

      // setCartValue((prevState) => ({
      //   ...prevState,
      //   total: cartValueSlice.total,
      //   tax: cartValueSlice.tax,
      // }));
      // setSample(sample + 1)
      // getPayableAmount('')
    }
  }, [cartValueSlice])




  useMemo(() => {

    if (typeof window != 'undefined') {
      if (webSettings && webSettings.enable_wallet == 1 && localStorage['CustomerName']) {
        // setActiveWallet(true)
        dispatch(setTotal({ activeWallet: true }));
        getWalletDetail();
      }
    }

  }, [webSettings])


  function getPayableAmount(type) {
    // payableAmount = 0;
    // totalAmount = 0;

    // let walletAmt = walletAmount
    // let cartTotal = (cartValue && cartValue.total) ? cartValue.total : 0;
    // let cartTax = (cartValue && cartValue.tax) ? cartValue.tax : 0;

    // let discountValue = (discount && discount.discountTotalAmount) ? discount.discountTotalAmount : 0
    // let couponValue = (discount && discount.coupon_amount) ? discount.coupon_amount : 0


    // if(type == 'Wallet'){
    //   walletAmt = 0
    // }

    // payableAmount = (payableAmount + cartTotal + cartTax + shippingAmount) - (discountValue + couponValue)
    // totalAmount = (cartTotal + cartTax + shippingAmount) - (discountValue - couponValue)

    // if(walletAmt > 0 && walletAmt >= payableAmount){
    //   payableAmount = payableAmount
    // }else{
    //   payableAmount = payableAmount - walletAmt
    // }

    // setDiscount((prevDiscount) => ({ ...prevDiscount, discountTotalAmount:(discountValue + couponValue)}));

    // setPayableAmount(payableAmount)
    // setTotalAmount(totalAmount)
    // console.log('total',totalAmount)
  }

  async function getWalletDetail() {
    let res = await get_wallet_details();
    let reducerValues = { walletAmount: 0 }

    if (res && res.message && res.message.length != 0) {
      reducerValues.walletAmount = res.message[0].total_wallet_amount
      // setWalletAmount(res.message[0].total_wallet_amount)
    } else {
      reducerValues.walletAmount = 0
      // setWalletAmount(0)
    }

    dispatch(setTotal(reducerValues));
    // getPayableAmount('')
  }

  const removeWallet = () => {
    // console.log('dasdasda', activeWallet)
    activeWallet = !activeWallet
    if (activeWallet) {
      getWalletDetail()
    } else {
      getPayableAmount('Wallet')
    }

    setActiveWallet(activeWallet)
    dispatch(setTotal({ activeWallet: activeWallet }));
  }

  async function calculateShippingCharges(value) {

    let check_address = (customerInfo.address && customerInfo.address.length != 0) ? customerInfo.address.find((res) => { return res.is_default == 1 }) : undefined
    if (check_address) {
      let data = {
        "shipping_addr": check_address.name,
        "subtotal": totalAmt.total,
        "shipping_method": value,
        "cartId": cartValueSlice.name
      }
      const resp = await calculate_shipping_charges(data);
      let reducerValues = { shippingAmount: 0 }
      if (resp && resp.message && resp.message.status && resp.message.status == 'Success') {
        // shippingAmount = resp.message.shipping_charges
        reducerValues.shippingAmount = resp.message.shipping_charges
        // setShippingAmount(shippingAmount)
        getOrderDiscount(value, reducerValues.shippingAmount)
      } else {
        reducerValues.shippingAmount = 0
        // setShippingAmount(0)
        // getOrderDiscount(value,0)
      }

      dispatch(setTotal(reducerValues));
      // getPayableAmount('')
    } else {
      setIndex(-1);
      toast.error('Please select Billing address');
    }

  }

  async function getOrderDiscount(value, shipping_charges) {

    let data = {
      "subtotal": totalAmt.total,
      "customer_id": localStorage['customerRefId'],
      "shipping_method": value,
      "shipping_charges": shipping_charges
    }

    const resp = await get_order_discount(data);

    let reducerValues = { tax: 0, discount_name: '', discount_amount: 0 }

    if (resp && resp.message && resp.message.status && resp.message.status == 'Success') {

      // discount.discount_amount = resp.message.discount_amount
      // let taxValue = resp.message.tax

      // setCartValue(obj=> {return {...obj,tax:taxValue}})
      // setDiscount((prevDiscount) => ({ ...prevDiscount, name: resp.message.discount }));
      // setDiscount((prevDiscount) => ({ ...prevDiscount, discount_amount: prevDiscount.discount_amount }));


      reducerValues.tax = resp.message.tax
      reducerValues.discount_name = resp.message.discount
      reducerValues.discount_amount = resp.message.discount_amount

      // setDiscount(discount=> {return {...discount,name:resp.message.discount}})
      // setDiscount(discount=> {return {...discount,discount_amount:discount.discount_amount}})
    } else {

    }

    dispatch(setTotal(reducerValues));
    // getPayableAmount('')

  }

  async function validateCoupon(value) {

    let data =
    {
      "coupon_code": value,
      "subtotal": totalAmt.total,
      "customer_id": localStorage['customerRefId'],
      "shipping_method": (shippingMethodList[currentIndex] && shippingMethodList[currentIndex].name) ? shippingMethodList[currentIndex].name : ''
    }
    const resp = await validate_coupon(data);

    let reducerValues = { coupon_tax: 0, couponName: '', coupon_amount: 0 }

    if (resp && resp.message && resp.message.status && resp.message.status == 'success') {
      // let taxValue = resp.message.tax
      // discount.coupon_amount = resp.message.discount_amount
      // setCartValue(obj=> {return {...obj,tax:taxValue}})
      // setDiscount((prevDiscount) => ({ ...prevDiscount, coupon_amount: resp.message.discount_amount}))
      // setDiscount((prevDiscount) => ({ ...prevDiscount, couponName: resp.message.discount,}))

      reducerValues.coupon_tax = resp.message.tax
      reducerValues.couponName = resp.message.discount
      reducerValues.coupon_amount = resp.message.discount_amount
      toast.success("Coupon apply applied successful!");

    } else if (resp && resp.message && resp.message.status && resp.message.status == 'failed') {
      toast.error(resp.message.message);
    }

    dispatch(setTotal(reducerValues));

    // getPayableAmount('')
  }

  const applyCoupons = () => {
    if (totalAmt && totalAmt.coupon_amount) {
      // discount.coupon_amount = 0
      // setDiscount((prevDiscount) => ({ ...prevDiscount, coupon_amount: 0}))
      // getPayableAmount('')
      setCoupon('')
      dispatch(setTotal({ coupon_amount: 0 }));
    } else {
      if (coupon && coupon != '') {
        validateCoupon(coupon)
      } else {
        let data = document.getElementById('coupons');
        let error = document.getElementById('error');
        if (!error) {
          let newParagraph = `<p id="error" class="text-[12px] text-red-500 py-[5px]">Please Enter Coupon Code</p>`;
          data.insertAdjacentHTML('afterend', newParagraph);
        }
      }
    }
  }

  const getCouponValue = (eve) => {
    eve = eve.target.value
    coupon = eve
    setCoupon(eve)
    let error = document.getElementById('error');
    if (error) {
      error.remove();
    }
  }



  async function get_razor_pay_values() {
    let razorpay = await get_razorpay_settings();
    setRazorpay_settings(razorpay);
  }

  const checkIsMobile = async () => {
    isMobile = await checkMobile();
    setIsmobile(isMobile);
    // console.log('isMobile',isMobile)
  }


  async function get_payments() {
    const resp = await get_payment_method();
    if (resp && resp.message && resp.message.length != 0) {
      let data = resp.message
      setPaymentMethods(data)
    }
  }


  async function shipping_methods() {
    const resp = await get_shipping_methods();
    if (resp && resp.message && resp.message.length != 0) {
      let data = resp.message
      setShippingMethods(data)
      if(data[0].is_deliverable == 0){
        deliverySlots(data[0].name);
        // calculateShippingCharges(data[0].name)
      } 
    }
  }

  async function deliverySlots(value) {
    let data = { "shipping_method": value, "customer_id": localStorage['customerRefId'] }
    const resp = await get_cart_delivery_slots(data);
    if (resp && resp.message && resp.message.length != 0) {
      deliverySlot = resp.message
      setDeliverySlots(deliverySlot)
    } else {
      setDeliverySlots([])
    }
  }



  // async function customer_info() {

  //   if (customer && customer.address && customer.address.length != 0) {
  //     check_info(customer);
  //   } else {
  //     let data = { guest_id: '', user: localStorage['customerRefId'] };
  //     const resp = await get_customer_info(data);
  //     if (resp && resp.message && resp.message[0]) {

  //       // isMobile ? dispatch(customerInfoAction(resp.message[0])) : null;
  //       let data = JSON.stringify(resp.message[0]);
  //       data = JSON.parse(data);
  //       check_info(data)
  //     }
  //   }
  // }

  // async function check_info(data) {
  //   if (isMobile && data.address && data.address.length != 0) {
  //     let is_default = data.address.filter((res) => { return res.is_default == 1 })
  //     if (is_default && is_default.length != 0) {
  //       data.address = is_default;
  //     } else {
  //       data.address[0].is_default = 1;
  //     }
  //   }
  //   customerInfo = data;
  //   setCustomerInfo(data);
  // }

  function goToAddres() {
    router.push('/add-address');
  }

  // const [name, setName] = useState('');
  // const options = [
  //   { label: 'India', value: 'India' },
  // ];

  // const handleNameChange = (e) => {
  //   setName(e.target.value);
  // };

  const selectMethod = (e, index) => {
    setIndex(index);
    setDeliverySlots([])
    let check_address = (customerInfo.address && customerInfo.address.length != 0) ? customerInfo.address.find((res) => { return res.is_default == 1 }) : undefined

    if (check_address) {
      if (e.is_deliverable == 1) {
        enabledSlot = true
        setEnabledSlot(true)
        deliverySlots(e.name)
        calculateShippingCharges(e.name)
        setSample(sample + 1)
        buttonNameFn()
      } else {
        enabledSlot = false
        setEnabledSlot(false)
        setSample(sample + 1)
        buttonNameFn()
      }
    } else {
      setIndex(-1);
      toast.error('Please select Billing address');
    }


  };

  const [loader, setLoader] = useState(false)
  let [loading, setLoading] = useState(false)

  const checkout = (e) => {
    setLoader(true)
    check_checkout_values()
  }


  const [alertMsg, setAlertMsg] = useState({})

  function closeModal(value) {

    if (alertMsg && alertMsg.navigate) {
      router.push('/thankyou?order_id=' + alertMsg.order_id);
    } 
    
    // else if ('Yes') {

    // }

  }


  async function check_checkout_values() {
    let check_address = (customerInfo.address && customerInfo.address.length != 0) ? customerInfo.address.find((res) => { return res.is_default == 1 }) : undefined

    if (!check_address) {
      setLoader(false);
      await setAlertMsg({ message: 'Please select Billing address' });
      // alert_dispatch(alertAction(true))
      toast.error('Please select Billing address');

      // openModal();
      // dispatch(openDialog('OPEN_DIALOG'))
    } else if (paymentIndex < 0) {
      setLoader(false);
      await setAlertMsg({ message: 'Please select Payment Method' });
      // alert_dispatch(alertAction(true))
      toast.error('Please select Payment Method');
      // openModal()
    } else if (currentIndex < 0) {
      setLoader(false);
      await setAlertMsg({ message: 'Please select shipping Method' });
      // alert_dispatch(alertAction(true))
      toast.error('Please select shipping Method');
    } else {
      checkDeliverySlots(check_address)
      // pay(check_address)
    }

  }


  function checkDeliverySlots(check_address) {
    let array = [];
    let obj = {}
    if (deliverySlot && deliverySlot.length == 0) {
      // let check_payment = payment_methods[paymentIndex]
      // console.log('check_payment',check_payment)
      // setLoader(false);
      pay(check_address, array)
    } else {
      let data = deliverySlot[0].dates_lists.find(res => { return (res.isActive && res.isActive == 1) })
      if (data) {
        obj.date = data.date;
        let slots = data.slots.find(res => { return (res.isActive && res.isActive == 1) })
        if (slots) {
          obj.from_time = slots.from_time;
          obj.to_time = slots.to_time;
          array.push(obj)
          // console.log('deliverySlot', array);
          pay(check_address, array)
        } else {
          setLoader(false);
          toast.error('Please select the time');
        }
      } else {
        setLoader(false);
        toast.error('Please select the delivery slot');
      }
    }
  }

  async function pay(check_address, deliverySlots) {

    var orderdata = {
      "customer_name": localStorage['customerRefId'],
      "order_type": "Shopping Cart",
      "bill_addr": check_address.name ? check_address.name : check_address.name,
      "ship_addr": check_address.name,
      "payment_method": payment_methods[paymentIndex].name,
      "payment_gateway_charges": "",
      "order_date": format(new Date(), 'yyyy/MM/dd'),
      "slot_time": 0,
      "from_time": null,
      "to_time": null,
      "date": null,
      "coupon_code": (totalAmt && totalAmt.couponName) ? totalAmt.couponName : '',
      "shipping_charge": totalAmt.shippingAmount ? totalAmt.shippingAmount : 0,
      "shipping_method": (shippingMethodList[currentIndex] && shippingMethodList[currentIndex].name) ? shippingMethodList[currentIndex].name : '',
      "discount_amount": (totalAmt && (totalAmt.discount_amount || totalAmt.coupon_amount)) ? (totalAmt.discount_amount + totalAmt.coupon_amount) : '',
      "discount": (totalAmt && totalAmt.discount_name) ? totalAmt.discount_name : '',
      "discount_free_products": [],
      "order_from": "Website",
      "checkout_attributes": [],
      // "manual_wallet_debit":walletAmount ? walletAmount : 0,
      "manual_wallet_debit": activeWallet ? 1 : 0,
      "slot_time": 0,
      "loyalty_points": 0,
      "loyalty_amount": 0,
      "delivery_slots": deliverySlots
    }


    const resp = await insertOrder(orderdata);
    // console.log(resp)
    if (resp && resp.message && resp.message.status == true) {
      loading = true
      setLoading(loading)
      let data = resp.message
      setLoader(false);
      setLoadSpinner(true);
      orders_Id = data.order.name;

      let outstanding_amount=Number(data.order.outstanding_amount)
      let check_payment = payment_methods[paymentIndex]
      if (check_payment.payment_method == 'Razor Pay' || check_payment.payment_method.match(/Razor/) || check_payment.payment_type == 'Online Payment') {
        load_razorpay(outstanding_amount, 'Order', data.order.name);
      } else {
        setLoadSpinner(false);
        setAlertMsg({ message: 'Order placed successfully', navigate: true, order_id: orders_Id });
        toast.success('Order placed successfully');
        router.push('/thankyou?order_id=' + orders_Id);
        setTimeout(() => {
          get_cart_item();
        }, 800);
      }

    }
    else {
      setLoader(false);
      loading = false
      setLoading(loading)
      let msg = sanitizeHtml(resp.message.message)
      toast.error(msg);
      // setAlertMsg({ message: resp.message.message });  
      // alert_dispatch(alertAction(true))
    }

  }

  async function get_cart_item() {
    let res = await get_cart_items();
    if (res && res.message && res.message.status && res.message.status == "success") {
      dispatch(setCartItems(res.message));
    }
  }

  function payment_error_callback(error, order_id) {
    setAlertMsg({ message: 'Payment failed', navigate: true, order_id: order_id });
    // alert_dispatch(alertAction(true))
    toast.error('Payment failed');
    loading = false
    setLoading(loading)
    router.push('/thankyou?order_id=' + order_id);

    setTimeout(() => {
      get_cart_item();
    }, 800);
    // setEnableModal(true);
  }

  async function payment_Success_callback(response, amount, order_id) {
    let params = {
      "transaction_id": response.razorpay_payment_id,
      "order_id": order_id,
    }
    const resp = await update_order_status(params);
    if (resp && resp.message && resp.message.status && resp.message.status == true) {
      setLoadSpinner(false);
      setAlertMsg({ message: 'Order placed successfully', navigate: true, order_id: order_id });
      // alert_dispatch(alertAction(true));
      toast.success('Order placed successfully');
      setTimeout(() => {
        loading = false
        setLoading(loading)
      }, 200);
      router.push('/thankyou?order_id=' + order_id);
      // setEnableModal(true);
    } else {
      setLoadSpinner(false);
      loading = false
      setLoading(loading)
    }

    setTimeout(() => {
      get_cart_item();
    }, 800);
  }

  const load_razorpay = async (amount, description, order_id) => {
    // console.log(razorpay_settings.api_key)
    // let r_pay_color = '#e21b22';
    // const app_name = 'Go1 Market';
    loading = false
    setLoading(loading)
    var options = {
      "key": razorpay_settings.api_key,
      "amount": Number((amount * 100).toString()),
      "currency": webSettings.currency ? webSettings.currency : "INR",
      "name": app_name,
      "description": "Payment for" + description,
      "image": (razorpay_settings.site_logo ? check_Image(razorpay_settings.site_logo) : null),
      "prefill": { "name": localStorage['full_name'], "email": localStorage['userid'] },
      "theme": { "color": r_pay_color },
      "modal": { "backdropclose": false, "ondismiss": () => { payment_error_callback(description, order_id) } },
      "handler": async (response, error) => {
        if (response) {
          setLoadSpinner(true);
          loading = true
          setLoading(loading)
          payment_Success_callback(response, amount, order_id)
          // response.razorpay_payment_id
        } else if (error) {
          loading = true
          setLoading(loading)
          payment_error_callback(error, order_id)
        }

      }
    };

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => { const rzp = new window.Razorpay(options); rzp.open(); };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };

  }


  // const formatter = new Intl.NumberFormat('en-US', {
  //   style: 'currency',
  //   currency: 'INR',
  // });

  // const imageChange = (e) => {
  //   // console.log(e);
  //   let value = '/visa.svg';
  //   if (e.payment == 'Visa') {
  //     value = '/visa.svg'
  //   } else if (e.payment == 'Paytm') {
  //     value = '/paypal.svg'
  //   } else if (e.payment == 'Razor Pay') {
  //     value = '/Razorpay.svg'
  //   }
  //   return value;
  // };

  const selectAddress = (array, index) => {
    let arr1 = JSON.stringify(array)
    let arr = JSON.parse(arr1)
    arr.map((res, i) => {
      if (i == index) {
        res.is_default = 1
      } else {
        res.is_default = 0
      }
    })
    setCustomerInfo(
      { ...customerInfo, address: arr }
    )
  }

  // Modal
  const [visible, setVisible] = useState(false)

  function show() {
    setVisible(true);
  }

  function hide(obj) {
    setVisible(false);

    if (obj) {

      if (customerInfo.address && customerInfo.address.length != 0 && obj.name) {
        let addressIndex = customerInfo.address.findIndex((res) => { return res.name == obj.name });
        if (addressIndex >= 0) {
          customerInfo.address[addressIndex] = obj;
        } else {
          customerInfo.address.push(obj);
          let objs = JSON.stringify(customerInfo.address)
          let obj1 = JSON.parse(objs)
          for (let i = 0; i < obj1.length; i++) {
            if (obj.is_default == 1 && (obj.name == obj1[i]['name'])) {
              obj1[i]['is_default'] = 1;
            } else if (obj.is_default != 1 && (obj.name != obj1[i]['name'] && obj1[i]['is_default'] == 1)) {
              obj1[i]['is_default'] = 1
            } else {
              obj1[i]['is_default'] = 0
            }
          }
          // customerInfo.address.push(obj);
          customerInfo.address = obj1
        }
      } else {
        isMobile ? obj.is_default = 1 : null;
        customerInfo.address.push(obj);
      }

      setCustomerInfo(
        { ...customerInfo, address: customerInfo.address }
      )
      // setCustomerInfo(customerInfo);
    }
  }

  const [addressDelete, setDeleteAddress] = useState(false)

  function address_closeModal(value) {
    setDeleteAddress(false);
    if (value == 'Yes') {
      deleteAddress(alertMsg.res, alertMsg.index);
    }

  }


  function edit_address(res, type, index) {
    if (type == 'New') {
      setEditAddress(undefined);
      show();
    } else if (type == 'Edit') {
      setEditAddress(res);
      show();
    } else if (type == 'Delete') {
      setAlertMsg({ message: 'Do you want to delete your address ?', res: res, index: index });
      setDeleteAddress(true);
      // alert_dispatch(alertAction(true))
      // deleteAddress(res,index);
    }

  }

  async function deleteAddress(delete_obj, index) {
    let data = { "id": delete_obj.name, "customer": localStorage['customerRefId'] }
    const resp = await delete_address(data);
    if (resp && resp.message && resp.message == 'Success') {
      setAlertMsg({});
      customerInfo.address.splice(index, 1);
      setCustomerInfo(
        { ...customerInfo, address: customerInfo.address }
      )
    }
  }

  let [visibleLogin, setVisibleLogin] = useState(false)

  const hideLogin = () => {
    setVisibleLogin(false);
  }

  const checkUser = () => {
    if (typeof window != 'undefined') {
      if (localStorage && localStorage['api_key']) {

      } else {
        setVisibleLogin(true)
      }
    }

  }

  let customerDetail = useSelector((state) => state.customerInfo.customerDetail)
  let [selectedAddress, setSelectedAddress] = useState()
  const [buttonName, setButtonName] = useState('')
  let [deliveryDate, setDeliveryDate] = useState('')
  let [deliveryTime, setDeliveryTime] = useState('')

  useEffect(() => {
    if (customerDetail && customerDetail.name) {
      customerDetail = JSON.stringify(customerDetail);
      customerDetail = JSON.parse(customerDetail)
      let address = customerDetail.address ? customerDetail.address : []
      if (address.length != 0) {
        selectedAddress = address.find(res => { return res.is_default == 1 })
        if (selectedAddress) {
          setSelectedAddress(selectedAddress)
        }
        setCustomerInfo(customerDetail);
        buttonNameFn()
      } else {
        setCustomerInfo(customerDetail);
        buttonNameFn()
      }
    } else {
      let obj = {
        address: []
      }
      setCustomerInfo(obj);
      buttonNameFn()
    }

  }, [customerDetail])



  function buttonClickFn() {
    if (buttonName == 'Login') {
      setVisibleLogin(true)
    } else if (buttonName == 'Choose Address') {
      setIsOpen(true);
    } else if (buttonName == 'Choose Delivery Method' || buttonName == 'Choose Delivery slot') {
      setIsOpenShip(true);
    } else if (buttonName == 'Place Order') {
      checkout()
    }
  }

  function buttonNameFn() {
    if (!(localValue && localValue['cust_name'])) {
      setButtonName('Login')
    } else if (!selectedAddress) {
      setButtonName('Choose Address')
      // setButtonName('Choose Delivery Method') 
    } else if (currentIndex == -1) {
      setButtonName('Choose Delivery Method')
    } else if (enabledSlot && (deliveryDate == '' || deliveryTime == '')) {
      setButtonName('Choose Delivery slot')
    } else {
      setButtonName('Place Order')
    }
  }

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenShipping, setIsOpenShip] = useState(false)


  function closeModal() {
    setIsOpen(false);
    setIsOpenShip(false)
    let shipping = currentIndex == -1 ? undefined : shippingMethodList[currentIndex];
    if (deliverySlot && shipping && shipping.is_deliverable == 1 && (deliverySlot[0] && deliverySlot[0].dates_lists && deliverySlot[0].dates_lists.length != 0)) {
      let data = deliverySlot[0].dates_lists.find(res => { return (res.isActive && res.isActive == 1) })
      if (data) {
        deliveryDate = data.date;
        setDeliveryDate(deliveryDate)
        let slots = data.slots.find(res => { return (res.isActive && res.isActive == 1) })
        if (slots) {
          deliveryTime = slots.time_format
          setDeliveryTime(deliveryTime)
        }
      }
    } else {
      setDeliveryDate('')
      setDeliveryTime('')
    }

    buttonNameFn()
  }

  function sanitizeHtml(htmlValue) {
    const stringWithHtmlTags = htmlValue;
    const withoutTags = stringWithHtmlTags.replace(/<\/?[^>]+(>|$)/g, "");
    return withoutTags;
  }

  useMemo(() => {
    // console.log(customerInfo,'customerInfo')
  }, [customerInfo])

  return (
    <>
    {/* {console.log(cartItems.length,"cartItems")} */}
      {cartItems && cartItems.length != 0 &&
        <>
          {(loadSpinner || loading) && <Backdrop />}
          <RootLayout checkout={isMobile ? false : true}>
            {/* <ToastContainer position={'bottom-right'} autoClose={2000} /> */}

            {addressDelete &&
              <AlertUi isOpen={addressDelete} closeModal={(value) => address_closeModal(value)} headerMsg={'Alert'} button_1={'No'} button_2={'Yes'} alertMsg={alertMsg} />
            }

            {visibleLogin && <AuthModal visible={visibleLogin} hide={hideLogin} />}


            <div className='lg:pt-[25px] md:hidden'>
              <div className={`flex ${styles.container_} lg:align-baseline md:gap-8px lg:gap-[20px] md:flex-col py-[10px] main-width`}>

                <div className={`${styles.box_1} md:hidden`}>


                  <div className='flex justify-between lg:bg-slate-100 md:[22px] lg:h-[43px] px-[10px] rounded-md items-center'>
                    <div className='flex'>
                      <span className='flex items-center justify-center md:hidden mr-[10px] w-[25px]'><Image className='h-[23px] object-contain' src="/checkout/login.svg" height={20} width={20} layout="fixed" alt="Edit" /></span>
                      <h6 className='text-[16px] font-semibold' >Login / Register</h6>
                    </div>
                    {/* {(!(loginInfo && loginInfo.full_name) || !(localValue && localValue['cust_name'])) && */}
                    {(!(localValue && localValue['cust_name'])) &&
                      <button onClick={() => checkUser()} className={`${isMobile ? 'text-[14px] font-semibold primary_color' : 'border rounded-[5px] py-[2px] px-[7px] text-[14px] text-medium'} primary_btn`} >Login</button>
                    }
                  </div>

                  <div className={`${styles.address_sec} ${isMobile ? null : 'w-[95%] m-[0px_8px_auto_auto] '} md:border-b-[1px] md:border-slate-200 md:mb-[8px] md:px-[10px] py-[10px] cursor-pointer justify-between  gap-[5px]`}>
                    {localValue && localValue['cust_name'] && <p className={`${isMobile ? 'sub_title' : null} m-0 text-[14px] text-medium`}>{localValue['cust_name']}</p>}
                    {localValue && localValue['cust_email'] && <p className={`${isMobile ? 'sub_title' : null} m-0 text-[14px] py-[5px] text-medium`}>{localValue['cust_email']}</p>}
                    {localValue && localValue['phone'] && <p className={`${isMobile ? 'sub_title' : null}vm-0 text-[14px] text-medium`}>{localValue['phone']}</p>}
                  </div>


                  <div className='flex justify-between lg:bg-slate-100 md:[22px] lg:h-[43px] px-[10px] rounded-md items-center'>
                    <div className='flex'>
                      <span className='flex items-center justify-center md:hidden mr-[10px] w-[25px]'><Image className='h-[23px] object-contain' src="/checkout/Billing.svg" height={20} width={20} layout="fixed" alt="Edit" /></span>
                      <h6 className='text-[16px] font-semibold' >Billing Address</h6>
                    </div>
                    {customerInfo && customerInfo.address && customerInfo.address.length != 0 &&
                      <button className={`${isMobile ? 'text-[14px] font-semibold primary_color' : 'border rounded-[5px] py-[2px] px-[7px] text-[14px] text-medium'} primary_btn`} onClick={() => isMobile ? goToAddres() : edit_address(undefined, 'New', '')} >{isMobile ? 'Edit' : 'Add New'}</button>
                    }
                  </div>

                  {localValue && localValue['cust_name'] ?
                    <>
                      {customerInfo && customerInfo.address && customerInfo.address.length != 0 && customerInfo.address.map((res, index) => (
                        
                        <div key={index} className={`${styles.address_sec} ${(isMobile && res.is_default != 1) ? 'hidden' : null}  flex cursor-pointer justify-between ${isMobile ? null : 'w-[95%] m-[0px_8px_auto_auto] '} md:border-b-[1px] md:border-slate-200 md:mb-[8px] md:px-[10px] py-[10px] gap-[5px]`}>
                          <div onClick={() => { setIndex(-1), selectAddress(customerInfo.address, index) }} className={`flex w-full justify-between cursor-pointer gap-[10px]`}>
                            {!isMobile && <input className={styles.input_radio} checked={res.is_default} type="radio" />}
                            <div className='w-full'>
                              <span className='flex justify-between items-center'>
                                <h6 className={`${isMobile ? 'sub_title' : null} m-0 text-[15px]  capitalize font-semibold`}>{res.first_name + ' ' + res.last_name}</h6>
                              </span>
                              <p className={`${isMobile ? 'sub_title' : null} m-0 text-[14px] text-medium`}>{res.address} , <br></br> {res?.city}, {res?.state}, {res?.country} - {res?.zipcode}</p>
                            </div>
                          </div>

                          {!isMobile &&
                            <div className='flex items-center'>
                              <div onClick={() => { edit_address(res, 'Edit', index) }} className='flex cursor-pointer mr-[15px] items-center'>
                                <span className={`${styles.edit_text}  text-[12px] mr-[5px]`}>Edit</span>
                                <Image className='h-[14px]' src="/Address/edit-green.svg" height={14} width={15} layout="fixed" alt="Edit" />
                              </div>
                              <div onClick={() => { edit_address(res, 'Delete', index) }} className='flex cursor-pointer  items-center'>
                                <span className={`${styles.delete_text} text-[12px] mr-[5px]`}>Delete</span>
                                <Image className='h-[14px]' src="/Address/delete-red.svg" height={14} width={15} layout="fixed" alt="Ddelete" />
                              </div>

                            </div>
                          }
                        </div>

                      ))}

                      {customerInfo && customerInfo.address && customerInfo.address.length == 0 &&
                        <Address hide={(obj) => hide(obj)} />
                      }

                      {visible &&
                        <AddressModal edit_address={editAddress} visible={visible} hide={(obj) => hide(obj)} />
                      }
                    </>
                    :
                    <div className='h-[20px]'></div>
                  }

                  <div className=' lg:bg-slate-100 flex items-center md:[22px] lg:h-[43px] px-[10px] rounded-md'>
                    <span className='flex items-center justify-center md:hidden mr-[10px] w-[25px]'><Image className='h-[23px] object-contain' src="/checkout/payment.svg" height={20} width={20} layout="fixed" alt="Edit" /></span>
                    <h6 className='text-[16px] font-semibold' >Shipping Methods</h6>
                  </div>

                  {localValue && localValue['cust_name'] ?
                    <ShippingMethods shippingMethodList={shippingMethodList} styles={styles} selectMethod={selectMethod} currentIndex={currentIndex} deliverySlot={deliverySlot} />
                    :
                    <div className='h-[20px]'></div>
                  }

                  <div className='flex lg:bg-slate-100 items-center md:[22px] lg:h-[43px] px-[10px] rounded-md'>
                    <span className='flex items-center justify-center md:hidden mr-[10px] w-[25px]'><Image className='h-[23px] object-contain' src="/checkout/payment.svg" height={20} width={20} layout="fixed" alt="Edit" /></span>
                    <h6 className='text-[16px] font-semibold' >Payment Methods</h6>
                  </div>

                  {localValue && localValue['cust_name'] ?
                    <PaymentMethods removeWallet={removeWallet} setPaymentIndex={setPaymentIndex} walletAmount={totalAmt.walletAmount} totalAmt={totalAmt} webSettings={webSettings} activeWallet={activeWallet} payment_methods={payment_methods} paymentIndex={paymentIndex} />
                    :
                    <div className='h-[20px]'></div>
                  }

                  {localValue && localValue['cust_name'] && <div class="flex mb-[15px] justify-end items-center">
                    <LoaderButton loader={loader} buttonClick={checkout} cssClass={'primary_btn w-[255px] h-[50px] mt-[20px]'} button_name={'Place Order'} />
                  </div>
                  }



                </div>

                <div className={`${styles.box_2} lg:sticky lg:h-[460px] top-[172px]`}>

                  <div className='md:hidden'>
                    <h5 className='mb-[10px] text-[14px] font-medium'>Order Summary</h5>
                    <YourCart checkout={true} />
                  </div>

                  {localValue && localValue['cust_name'] &&
                    <>
                      <ApplyCoupon discount={totalAmt} coupon={coupon} getCouponValue={getCouponValue} applyCoupons={applyCoupons} />
                    </>
                  }

                  <PriceDetails webSettings={webSettings} currencyFormatter1={currencyFormatter1} discount={totalAmt} cartValue={totalAmt} shippingAmount={totalAmt.shippingAmount}  activeWallet={activeWallet} walletAmount={totalAmt.walletAmount} />
                </div>

              </div>
            </div>


            <div className='lg:hidden light_bg mb-[70px]'>

              <MobileHeader back_btn={true} title={'Checkout'} search={true} />

              {isOpenShipping &&
                <div className='shippingPopup'>
                  <Rodal visible={isOpenShipping} enterAnimation='slideDown' animation='' onClose={closeModal}>
                    <ShippingMethods modal={true} shippingMethodList={shippingMethodList} styles={styles} selectMethod={selectMethod} currentIndex={currentIndex} deliverySlot={deliverySlot} closeModal={closeModal} />
                  </Rodal>
                </div>
              }

              {isOpen &&
                <div className='filtersPopup'>
                  <Rodal visible={isOpen} enterAnimation='slideDown' animation='' onClose={closeModal}>
                    <AddAddress closeModal={closeModal} selectAddressFn={selectAddress} />
                  </Rodal>
                </div>
              }

              <MobileCart enabledSlot={enabledSlot} setVisibleLogin={setVisibleLogin} selectedAddress={selectedAddress} deliveryDate={deliveryDate} deliveryTime={deliveryTime} setIsOpen={setIsOpen} setIsOpenShip={setIsOpenShip} shipping_method_name={(shippingMethodList && shippingMethodList[currentIndex] && shippingMethodList[currentIndex].shipping_method_name) ? shippingMethodList[currentIndex].shipping_method_name : undefined} />



              <PaymentMethods removeWallet={removeWallet} setPaymentIndex={setPaymentIndex} walletAmount={totalAmt.walletAmount} totalAmt={totalAmt} webSettings={webSettings} activeWallet={activeWallet} payment_methods={payment_methods} paymentIndex={paymentIndex} />

              <ApplyCoupon discount={totalAmt} coupon={coupon} getCouponValue={getCouponValue} applyCoupons={applyCoupons} />

              <PriceDetails webSettings={webSettings} currencyFormatter1={currencyFormatter1} discount={totalAmt} cartValue={totalAmt} shippingAmount={totalAmt.shippingAmount}  activeWallet={activeWallet} walletAmount={totalAmt.walletAmount} />

              <div className='lg:hidden h-[60px] bg-[#fff] flex items-center justify-between fixed w-full bottom-0 z-[99] p-[10px] shadow-[0_0_5px_#ddd]'>
                <div onClick={() => { router.push('/tabs/yourcart') }} className='flex items-center gap-[5px]'>
                  <Image className='h-[35px] w-[35px] object-contain' height={60} width={60} alt='logo' src={'/cart.svg'}></Image>
                  <h6 className='primary_color text-[14px] font-medium'>{cartItems.length} Items</h6>
                </div>

                {buttonName == 'Place Order' ? <div class="flex">
                  <LoaderButton loader={loader} buttonClick={buttonClickFn} cssClass={'primary_btn p-[8px_12px]'} button_name={buttonName} />
                </div>
                  : <button onClick={() => { buttonClickFn() }} className='primary_btn p-[8px_12px]'>{buttonName}</button>
                }

              </div>
            </div>



            {(you_may_like && you_may_like.length != 0) &&
              <>
                <div className='md:m-[15px] main-width pb-[15px]'>
                  <h3 className='text-[15px] font-[500] mb-[8px]'>You may like this</h3>
                  <YouMayLike productList={you_may_like} rowCount={'flex-[0_0_calc(20%_-_8px)]'} scroll_button={true} scroll_id='you_may_like' />
                </div>
              </>
            }

          </RootLayout>
        </>
      }

      {cartItems && cartItems.length == 0 && <>
        {webSettings && webSettings.app_settings && <NoProductFound route={'/'} btnName={'Go Home'} button={true} cssClass={'flex-col h-[calc(100vh_-_95px)] mx-auto'} api_empty_icon={webSettings.app_settings.no_cart} heading={'No Cart Items!'} sub_heading={'Sorry, your cart is empty!'} />}
      </>
      }
    </>
  )
}

const ApplyCoupon = ({ discount, coupon, getCouponValue, applyCoupons }) => {
  return (
    <div className='bg-[#fff] md:p-[10px]'>
      <h5 className='md:pb-[7px] lg:my-[10px] text-[14px] font-medium'>Apply Coupon</h5>
      <div id='coupons' className='flex items-center h-[40px] border-[1px] border-slate-100 rounded-[5px]'>
        <input disabled={discount.coupon_amount ? true : false} value={coupon} onChange={(eve) => { getCouponValue(eve) }} className='px-[10px] w-[70%] bg-white' placeholder='Coupon code' />
        <button onClick={() => applyCoupons()} className={`h-full w-[30%] ${discount.coupon_amount ? 'bg-red-700 text-[#fff] text-[14px] font-medium rounded-[5px]' : 'primary_btn'}`}>{discount.coupon_amount ? 'Cancel' : 'Apply'}</button>
      </div>
    </div>
  )
}

const PriceDetails = ({ webSettings, currencyFormatter1, discount, cartValue, shippingAmount, activeWallet, walletAmount }) => {
  return (
    <div className='md:bg-[#fff] md:p-[10px]'>
      <h5 className='my-[10px] text-[14px] font-medium'>Price Details</h5>

      {(webSettings && webSettings.currency) && cartValue &&
        <><div className='flex items-center flex-wrap p-[0_5px]'>
          <h5 className='w-[50%] min-h-[30px] text-[14px] gray_color'>Subtotal</h5>
          <h5 className='w-[50%] text-end min-h-[30px] text-[14px] openSens'>{currencyFormatter1(cartValue.total, webSettings.currency)}</h5>
          <h5 className='w-[50%] min-h-[30px] text-[14px] gray_color'>Delivery Charges</h5>
          <h5 className='w-[50%] text-end min-h-[30px] text-[14px] openSens'>{currencyFormatter1(cartValue.shippingAmount, webSettings.currency)}</h5>
          {(cartValue.discountTotalAmount > 0) && <h5 className='w-[50%] min-h-[30px] text-[14px] gray_color'>Discount</h5>}
          {(cartValue.discountTotalAmount > 0) && <h5 className='w-[50%] text-end min-h-[30px] text-[14px]'>{currencyFormatter1(cartValue.discountTotalAmount, webSettings.currency)}</h5>}
          <h5 className='w-[50%] min-h-[30px] text-[14px] gray_color'>Tax</h5>
          <h5 className='w-[50%] text-end min-h-[30px] text-[14px] openSens'>{currencyFormatter1(cartValue.coupon_amount > 0 ? cartValue.coupon_tax : cartValue.tax, webSettings.currency)}</h5>
          {(activeWallet && (cartValue.walletAmount && cartValue.walletAmount > 0)) ? <>
            <h5 className='w-[50%] min-h-[30px] text-[14px] gray_color'>Wallet Amount Debited</h5>
            <h5 className='w-[50%] text-end min-h-[30px] text-[14px] openSens'>{currencyFormatter1(activeWallet ? ((cartValue.walletAmount < cartValue.totalAmount) ? cartValue.walletAmount : cartValue.totalAmount) : 0, webSettings.currency)}</h5>
          </> : <></>}
        </div>

          <div className='flex items-center flex-wrap p-[0_6px] border-t-[1px] border-t-slate-200 pt-[10px] mt-[5px]' >
            <h5 className='w-[50%] min-h-[30px] text-[15px] font-medium'>Amount Payable</h5>
            <h5 className='w-[50%] text-end min-h-[30px] text-[15px] font-medium openSens'>{currencyFormatter1(activeWallet ? ((cartValue.totalAmount == cartValue.payableAmount) ? 0 : cartValue.payableAmount) : cartValue.totalAmount, webSettings.currency)}</h5>
          </div></>
      }

      {/* {'walet' + activeWallet}      
    {'total-' + cartValue.totalAmount}
    {'pay' + cartValue.payableAmount} */}

    </div>

  )
}

const PaymentMethods = ({ totalAmt, removeWallet, walletAmount, setPaymentIndex, webSettings, activeWallet, payment_methods, paymentIndex }) => {
  return (
    <div className='bg-[#fff] md:mb-[5px]'>
      <div className='flex items-center h-[43px] px-[10px] lg:hidden gap-[8px] bg-[#fff] '>
        <span className='flex items-center justify-center w-[35px]'><Image className='h-[27px] w-[28px] opacity-[0.9] object-contain' src="/checkout/payment.svg" height={40} width={40} layout="fixed" alt="Edit" /></span>
        <h6 className='text-[15px] font-medium' >Payment Methods</h6>
      </div>

      <div className={`lg:w-[95%] lg:m-[0px_8px_auto_auto] lg:py-[10px] gap-[10px] px-[15px] bg-[#fff]`}>
      
        {(walletAmount > 0) && webSettings && webSettings.enable_wallet == 1 &&
          <>
            <h5 className='py-[10px] text-[14px] font-medium'>Redeem</h5>

            <div onClick={() => removeWallet()} className='checkbox flex items-center gap-[6px] min-h-[30px] cursor-pointer'>
              <input type="checkbox" checked={activeWallet} className="w-[16px] h-[16px] rounded-[5px] cursor-pointer"></input>
              <span className='text-[12px] font-normal capitalize'>Use Wallet Amount available in wallet : <span className='text-[12px] font-medium openSens'>{currencyFormatter1(walletAmount)}</span></span>
            </div>
          </>
        }

        {(!activeWallet || (totalAmt.walletAmount < totalAmt.payableAmount)) && payment_methods.map((res, index) => (
          <div key={index} onClick={() => setPaymentIndex(index)} className={`h-[50px] cursor-pointer flex items-center gap-[5px] rounded-[5px]`}>
            <input className={styles.input_radio} checked={index == paymentIndex} type="radio" />
            <h5 className='text-[14px] font-medium capitalize'>{res.payment_method}</h5>
          </div>
        ))}

      </div>
    </div>
  )
}

// const ShippingMethods = ({shippingMethodList, styles, selectMethod, currentIndex, deliverySlot}) => {
//   return (
//     <>
//      <div className={`w-[95%] m-[0px_8px_auto_auto] md:border-b-[1px] md:border-slate-200 md:px-[10px] py-[10px] gap-[10px]`}>
//                   {shippingMethodList.map((res, index) => (
//                     <div key={index} onClick={() => selectMethod(res, index)} className={`h-[50px] cursor-pointer flex items-center gap-[5px] rounded-[5px]`}>
//                       <input className={styles.input_radio} checked={index == currentIndex} type="radio" />
//                       <h5 className='text-[14px] font-medium capitalize'>{res.shipping_method_name}</h5>
//                     </div>
//                   ))}

//                   {deliverySlot.length != 0 &&
//                     <>
//                       <h6 className='text-[15px] font-medium pb-[10px]' >Choose a Delivery Slot</h6>
//                       <DeliverySlot deliverySlot={deliverySlot} />
//                     </>
//                   }

//       </div>
//     </>
//   )
// }

// const MobileCart = ({shippingMethodList}) => {
//   return (
//     <>
//     </>
//   )
// }



const Backdrop = () => {
  return (
    <div className='backdrop'>
      <div className="h-[100%] flex flex-col gap-[10px] items-center  justify-center">
        <div class="animate-spin rounded-full h-[40px] w-[40px] border-l-2 border-t-2 border-black"></div>
        <span className='text-[15px]'>Loading...</span>
      </div>
    </div>
  )
}

