import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/router";
// import { check_Image } from '@/libs/common';
import Image from "next/image";
import {
  check_Image,
  get_customer_order_list,
  getColor,
  get_order_info,
} from "@/libs/api";
import OrderDetail from "@/components/Profile/OrderDetail";
import NoProductFound from "@/components/Common/NoProductFound";
import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { MyContext } from "@/pages/_app";

const options = {
  rootMargin: "100px", // Adjust this value based on the position you want the loading to start
};

export default function Orders({ dashboard }) {
  // console.log("hello")
  const [orderInfo, setOrderInfo] = useState([]);
  const [orderId, setorderId] = useState([]);
  let [Skeleton, setSkeleton] = useState(true);
  const [loading, setLoading] = useState(false);
  const webSettings = useSelector((state) => state.webSettings.websiteSettings);
  const router = useRouter();
  let cardref = useRef();
  let page_no = 1;
  let no_product = false;

  useEffect(() => {
    order_info();

    const intersectionObserver = new IntersectionObserver((entries) => {

      if (entries[0].intersectionRatio <= 0) return;

      if (!no_product && !dashboard) {
        // page_no > 1 ? order_info() : null;
        page_no = page_no + 1;
        order_info()
      }
    });

    intersectionObserver.observe(cardref?.current);

    return () => {
      cardref?.current && intersectionObserver.unobserve(cardref?.current);
    };
  }, []);

  async function order_info() {
    setLoading(true);
    // router.push(`/profile?my_account=orders${page_no > 2?page_no:''}`)
    let data = { page_length: dashboard ? 5 : 20, page_no: page_no };
    const resp = await get_customer_order_list(data);
    if (resp && resp.message && resp.message.length != 0) {
      setSkeleton(false);
      setLoading(false);
      setOrderInfo((d) => (d = [...d, ...resp.message]));
    } else {
      setSkeleton(false);
      no_product = true;
      setLoading(false);
      page_no == 1 ? setOrderInfo([]) : null;
    }
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });

  // Replace this with your date object
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const [visible, setVisible] = useState(false);

  function show() {
    setVisible(true);
  }

  function hide(obj) {
    setVisible(false);
    if (orderId && orderInfo && orderInfo.length != 0) {
      orderInfo.map((res) => {
        if (res.name == orderId) {
          order_detail(orderId, res, orderInfo);
        }
      });
    }
  }

  async function order_detail(order_id, obj, orderInfo) {
    let data = { order_id: order_id };
    const resp = await get_order_info(data);
    if (resp && resp.message && resp.message.info) {
      let payment_status = resp.message.info;
      obj.payment_status = resp.message.info["payment_status"];
      setOrderInfo(orderInfo);
    }
  }

  function detailNavigation(res) {
    router.push("/profile?my_account=orderdetail&order_id=" + res.name);
  }

  const [theme_settings, setTheme_settings] = useState();

  useMemo(() => {
    if (webSettings && webSettings.app_settings) {
      let settings = webSettings.app_settings;
      setTheme_settings(settings);
    }
  }, [webSettings]);

  return (
    <>
      {/* {visible &&
          <OrderDetail order_id={orderId} visible={visible} hide={(obj)=> hide(obj)} />
    } */}

      <div
        className={`md:hidden px-[20px] items-center grid grid-cols-6 h-[50px] ${
          dashboard ? "bg-[#f5f5f5] mt-2" : ""
        }`}
      >
        <h6 className="text-[15px] font-semibold">#Order Id</h6>
        <h6 className="text-[15px] font-semibold">Order Date</h6>
        <h6 className="text-[15px] font-semibold">Status</h6>
        <h6 className="text-[15px] font-semibold">Items</h6>
        <h6 className="text-[15px] font-semibold">Total Price</h6>
        <h6 className="text-[15px] font-semibold">Payment Status</h6>
      </div>

      {Skeleton ? (
        <SkeletonDiv />
      ) : (
        <>
          {orderInfo && orderInfo.length == 0 ? (
            <>
              {theme_settings && (
                <NoProductFound
                  cssClass={"flex-col h-[calc(100vh_-_220px)]"}
                  api_empty_icon={theme_settings.no_order}
                  heading={"No Orders Found"}
                />
              )}
            </>
          ) : (
            orderInfo.map((res, index) => {
              return (
                <>
                  <div
                    onClick={() => {
                      setorderId(res.name),
                        setVisible(true),
                        detailNavigation(res);
                    }}
                    className="md:hidden px-[20px] cursor-pointer items-center grid grid-cols-6 h-[50px] border-b-[1px] border-b-slate-100 last-child:border-b[0px]"
                  >
                    <h6 className="text-[14px]">{res.name}</h6>
                    <h6 className="text-[14px]">{formatDate(res.creation)}</h6>
                    <div className="flex items-center gap-[5px]">
                      <div
                        style={{
                          background: res.status
                            ? getColor(res.status)
                            : "#ddd",
                        }}
                        className={`h-[10px] w-[10px] rounded-[50%]`}
                      ></div>
                      <h6 className="text-[14px]">{res.status}</h6>
                    </div>
                    <h6 className="text-[14px]">{res.Items.length}</h6>
                    <h6 className="text-[14px] font-sans">
                      {formatter.format(res.total_amount)}
                    </h6>
                    <div className="flex items-center gap-[5px]">
                      <div
                        style={{
                          background: res.payment_status
                            ? getColor(res.payment_status)
                            : "#ddd",
                        }}
                        className={`h-[10px] w-[10px] rounded-[50%]`}
                      ></div>
                      <h6 className="text-[14px]">{res.payment_status}</h6>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setorderId(res.name),
                        setVisible(true),
                        detailNavigation(res);
                    }}
                    className="lg:hidden flex flex-wrap p-[10px] cursor-pointer items-center border-b-[1px] border-b-slate-100 last-child:border-b[0px]"
                  >
                    <h6 className="md:flex-[0_0_calc(50%_-_0px)] text-[14px] font-semibold">
                      {res.name}
                    </h6>
                    <h6 className="md:flex-[0_0_calc(50%_-_0px)] text-end text-[12px] gray_color">
                      {formatDate(res.creation)}
                    </h6>
                    {/* <div className='flex items-center gap-[5px]'><div style={{background:res.status ? getColor(res.status)  : '#ddd'}} className={`h-[10px] w-[10px] rounded-[50%]`}></div><h6 className='text-[14px]'>{res.status}</h6></div> */}
                    <h6 className="md:flex-[0_0_calc(50%_-_0px)] py-[2px] text-[12px]">
                      <span className="text-[12px] font-semibold">
                        Items :{" "}
                      </span>
                      {res.Items.length}
                    </h6>
                    <h6 className="md:flex-[0_0_calc(50%_-_0px)] py-[2px] text-end text-[12px] font-sans">
                      {formatter.format(res.total_amount)}
                    </h6>
                    <div className="flex items-center gap-[5px]">
                      <div
                        style={{
                          background: res.payment_status
                            ? getColor(res.payment_status)
                            : "#ddd",
                        }}
                        className={`h-[6px] w-[6px] rounded-[50%]`}
                      ></div>
                      <h6 className="text-[12px]">{res.payment_status}</h6>
                    </div>
                  </div>
                </>
              );
            })
          )}
        </>
      )}

      <div className="more" ref={cardref}></div>

      {loading && !dashboard && (
        <div id="wave">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      )}
    </>
  );
}

const SkeletonDiv = () => {
  return (
    <>
      {[
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ].map((res, index) => {
        return (
          <>
            <div className="animate-pulse md:hidden px-[20px] items-center grid grid-cols-6 h-[50px]">
              <div className="h-[20px] w-[80%] bg-slate-200 rounded"></div>
              <div className="h-[20px] w-[75%] bg-slate-200 rounded"></div>
              <div className="h-[20px] w-[60%] bg-slate-200 rounded"></div>
              <div className="h-[20px] w-[85%] bg-slate-200 rounded"></div>
              <div className="h-[20px] w-[70%] bg-slate-200 rounded"></div>
              <div className="h-[20px] w-[75%] bg-slate-200 rounded"></div>
            </div>
            <div className="animate-pulse lg:hidden gap-[10px] flex flex-wrap p-[10px] cursor-pointer items-center border-b-[1px] border-b-slate-100 last-child:border-b[0px]">
              <h6 className="md:flex-[0_0_calc(50%_-_5px)] h-[20px] w-[80%] bg-slate-200 rounded"></h6>
              <h6 className="md:flex-[0_0_calc(50%_-_5px)] h-[20px] w-[80%] bg-slate-200 rounded"></h6>
              <h6 className="md:flex-[0_0_calc(50%_-_5px)] py-[2px] h-[20px] w-[80%] bg-slate-200 rounded">
                {" "}
              </h6>
              <h6 className="md:flex-[0_0_calc(50%_-_5px)] py-[2px] text-end h-[20px] w-[80%] bg-slate-200 rounded"></h6>
              <div className="h-[20px] w-[80%] bg-slate-200 rounded"></div>
            </div>
          </>
        );
      })}
    </>
  );
};
