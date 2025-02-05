import Image from "next/image";
import React, { useEffect, useState } from "react";

const Tabs = ({ stockDetails, productDetails }) => {
  const [activeTab, setActiveTab] = useState(0);

  // const productDetails = {
  //   "Barcode": "/barcode.png",
  //   "Product Code": "0026165",
  //   "Brand": "SYLVANIA",
  //   "Group": "LIGHTING",
  //   "Lumen Output": "LIGHTING",
  // };

  // const stockDetails = {
  //   "Lumen Output": "136lm",
  //   "Range": "INDOOR",
  //   "Series": "TOLEDO",
  //   "Stock Uom": "Nos",
  // };

  useEffect(()=>{

  },[stockDetails])

  const tabs = [
    { id: 0, label: "Product Details" },
    { id: 1, label: "Stock Details" },
  ];

  const renderContent = () => {
    if (activeTab === 0) {
      return (
        <div className="space-y-2">

          <div className="flex justify-between items-center gap-3 py-2 text-gray-700 h-[40px]" >
            <span className="lg:text-[15px] md:text-[14px] font-normal"> Barcode :</span>
            <span className="lg:text-[36px] md:text-[36px] barcode-font font-normal">{productDetails.barcode}</span>
          </div>

          <div className="flex justify-between items-center gap-3 py-2 text-gray-700 h-[40px]" >
            <span className="lg:text-[15px] md:text-[14px] font-normal"> Product Code :</span>
            <span className="font-bold lg:text-[15px] md:text-[14px]">{productDetails.item_code}</span>
          </div>

          <div className="flex justify-between items-center gap-3 py-2 text-gray-700 h-[40px]" >
            <span className="lg:text-[15px] md:text-[14px] font-normal"> Brand :</span>
            <span className="font-bold lg:text-[15px] md:text-[14px]">{productDetails.brand}</span>
          </div>

          <div className="flex justify-between items-center gap-3 py-2 text-gray-700 h-[40px]" >
            <span className="lg:text-[15px] md:text-[14px] font-normal"> Group :</span>
            <span className="font-bold lg:text-[15px] md:text-[14px]">{productDetails.item_group}</span>
          </div>

          <div className="flex justify-between items-center gap-3 py-2 text-gray-700 h-[40px]" >
            <span className="lg:text-[15px] md:text-[14px] font-normal"> Stock Uom :</span>
            <span className="font-bold lg:text-[15px] md:text-[14px]">{productDetails.stock_uom}</span>
          </div>

        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          {stockDetails && stockDetails.length > 0 ? <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">No</th>
                  <th className="border border-gray-300 px-4 py-2">Warehouse</th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {stockDetails.map((res, index) => (
                  <tr key={res.warehouse} className="text-gray-700 text-center">
                    <td className="border  border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border  border-gray-300 px-4 py-2 text-start">{res.warehouse}</td>
                    <td className="border  border-gray-300 px-4 py-2 font-bold">{res.actual_qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            

          </>
            : <>
              <div className="flex items-center justify-center">
                <h5 className="text-[14px] font-semibold">No Stocks available</h5>
              </div>
            </>}
        </div>
      );
    }
  };

  return (
    <div className="w-full mt-2">
      <div className="flex gap-4 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-2 text-[15px] lg:text-[16px] font-medium border-b-2 transition-all duration-300 ${activeTab === tab.id
              ? "text-black border-black"
              : "text-[#7C8184] border-transparent"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
};

export default Tabs;
