import { useState } from "react";
import { useEffect, useRef } from "react";
import { getColor, get_transaction_details } from "@/libs/api";
import NoProductFound from "../Common/NoProductFound";
import { TRUE } from "sass";

export default function Wallet() {
  let [order, setOrder] = useState([]);
  const [walletInfo, setWalletInfo] = useState({});
  const [loading, setLoading] = useState(false);
  let [Skeleton, setSkeleton] = useState(true);
  let page_no = 1;
  let no_product = false;
  let cardref = useRef();
  useEffect(() => {
    transactionDetails();

    const intersection = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      if (!no_product) {
        page_no > 1 ? transactionDetails() : null;
        // page_no = page_no + 1;
      }
    });
    intersection.observe(cardref?.current);

    return () => {
      cardref?.current && intersection.unobserve(cardref?.current);
    };
  }, []);

  const transactionDetails = async () => {
    setLoading(true);
    let data = {
      list_type: "app_pay",
      vendor: localStorage["customerRefId"],
      page_no: page_no,
      page_len: 10,
    };
    const resp = await get_transaction_details(data);
    //   const res = await resp.message
    // //   console.log(res,"hshdsfoij")
    //   setOrder(res)
    setSkeleton(false);
    if (
      resp &&
      resp.message &&
      resp.message[0] &&
      resp.message[0].transactions &&
      resp.message[0].transactions.length != 0
    ) {
      if (page_no == 1) {
        setOrder(resp.message[0].transactions);
        setWalletInfo(resp.message[0]);
      } else {
        // console.log(order);
        // order[0].transactions = [...order[0].transactions,...resp.message[0].transactions]
        // setOrder(order)
        setTimeout(() => {
          setOrder((d) => (d = [...d, ...resp.message[0].transactions]));
          setLoading(false);
        }, 200);
      }
      page_no = page_no + 1;
    } else {
      // page_no == 1 ? setOrder([]) : null;
      no_product = true;
      setLoading(false);
    }
  };
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      {Skeleton ? (
        <SkeletonDiv />
      ) : (
        <>
          {order && order.length != 0 ? (
            <div>
              <div className="flex flex-wrap  w-[100%] lg:items-center lg:justify-center gap-4 px-4 md:mt-2">
                <div className="md:flex-[0_0_calc(100%_-_10px)] lg:flex-[0_0_calc(33.33%_-_10px)]  border text-center p-[10px] rounded-md ">
                  <h1 className="text-[14px] font-sans lg:text-[16px] text-[#181b29] mt-[10px] mb-[6px] font-semibold">
                    {formatter.format(walletInfo.total_wallet_amount)}
                  </h1>
                  <p className="text-[12px] text-[#000] font-normal ">
                    Total
                  </p>
                </div>
                <div className="md:flex-[0_0_calc(100%_-_10px)] lg:flex-[0_0_calc(33.33%_-_10px)] border text-center p-[10px] rounded-md ">
                  <h1 className="text-[14px] font-sans lg:text-[16px] text-[#181b29] mt-[10px] mb-[6px] font-semibold">
                    {formatter.format(walletInfo.current_wallet_amount)}
                  </h1>
                  <p className="text-[12px] text-[#000] font-normal ">
                    Current Value
                  </p>
                </div>
                <div className="md:flex-[0_0_calc(100%_-_10px)] lg:flex-[0_0_calc(33.33%_-_10px)] border text-center p-[10px] rounded-md ">
                  <h1 className="text-[14px] font-sans lg:text-[16px] text-[#181b29] mt-[10px] mb-[6px] font-semibold">
                    {formatter.format(walletInfo.locked_in_amount)}
                  </h1>
                  <p className="text-[12px] text-[#000] font-normal ">
                    Locked Amount
                  </p>
                </div>
              </div>
              <div className="md:hidden px-[20px] items-center grid grid-cols-9 h-[50px] bg-[#f5f5f5] mt-5 gap-3 ">
                <h6 className="text-[15px] font-semibold col-span-2">
                  Order Id
                </h6>
                <h6 className="text-[15px] font-semibold col-span-2">
                  Transaction Date
                </h6>
                <h6 className="text-[15px] font-semibold">Status</h6>
                <h6 className="text-[15px] font-semibold">Amount</h6>
                <h6 className="text-[15px] font-semibold col-span-3">Notes</h6>
              </div>
              <div>
                {order &&
                  order.length != 0 &&
                  order.map((data, i) => {
                    return (
                      <>
                        <div className="md:hidden px-[20px] cursor-pointer items-center grid grid-cols-9 h-[50px] border-b-[1px] gap-3  last:border-b-0">
                          <h6 className="text-[14px] col-span-2 text-[#0e0e0e]">
                            {data.name}
                          </h6>
                          <h6 className="text-[14px] col-span-2 text-[#0e0e0e] ">
                            {formatDateTime(data.transaction_date)}
                          </h6>
                          <div className="flex items-center gap-2">
                            <div
                              style={{
                                background: data.status
                                  ? getColor(data.status)
                                  : "#ddd",
                              }}
                              className={`h-[10px] w-[10px] rounded-[50%] `}
                            ></div>
                            <h6 className="text-[14px] text-[#0e0e0e]">
                              {data.status}
                            </h6>
                          </div>
                          <h6 className="font-sans text-[14px] text-[#181b29] font-medium">{`${
                            data.status == "Credited" ? "+" : "-"
                          }${formatter.format(data.amount)}`}</h6>
                          <h6 className="text-[12px] col-span-3">
                            {data.notes}
                          </h6>
                        </div>
                        <div
                          className={`px-4 py-2  mt-3 border-b-[1px] lg:hidden last:border-b-0`}
                          key={i}
                        >
                          <div className="flex items-center">
                            <div className="flex-[0_0_calc(50%_-_5px)] ">
                              <h6 className="text-[14px] font-medium text-[#0e0e0e] ">
                                {data.name}
                              </h6>
                              <h6 className="text-[11px] text-[#0e0e0e] ">
                                {formatDateTime(data.transaction_date)}
                              </h6>
                            </div>
                            <div className="flex-[0_0_calc(50%_-_5px)] text-end">
                              <h6 className="font-sans text-[14px] text-[#181b29] font-medium">{`${
                                data.status == "Credited" ? "+" : "-"
                              }${formatter.format(data.amount)}`}</h6>
                            </div>
                          </div>
                          <h6 className="text-[10px] text-[#0e0e0e]">
                            {data.notes}
                          </h6>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          ) : (
            <NoProductFound
              cssClass={"flex-col h-[calc(100vh_-_220px)]"}
              empty_icon={"/EmptyImg/no-wallet-01.svg"}
              heading={"No wallet Found"}
            />
          )}
        </>
      )}

      <div className="more" ref={cardref}></div>
      {/* <h1>hello world</h1> */}
      {loading && (
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
