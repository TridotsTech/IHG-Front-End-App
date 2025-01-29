import Image from "next/image";
import React, { useState } from "react";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const productDetails = {
    "Barcode": "/barcode.png",
    "Product Code": "0026165",
    "Brand": "SYLVANIA",
    "Group": "LIGHTING",
    "Lumen Output": "LIGHTING",
  };

  const stockDetails = {
    "Lumen Output": "136lm",
    "Range": "INDOOR",
    "Series": "TOLEDO",
    "Stock Uom": "Nos",
  };

  const tabs = [
    { id: 0, label: "Product Details" },
    { id: 1, label: "Stock Details" },
  ];

  const renderContent = () => {
    if (activeTab === 0) {
      return (
        <div className="space-y-2">
          {Object.entries(productDetails).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center gap-3 py-2 text-gray-700 h-[40px]"
            >
              <span className="lg:text-[16px] font-normal">{key} :</span>
              {key === "Barcode" ? (
                <Image
                  src={value}
                  width={100}
                  height={20}
                  alt="Barcode"
                  className="w-[200px] h-[40px]"
                />
              ) : (
                <span className="font-bold lg:text-[16px]">{value}</span>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          {Object.entries(stockDetails).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center gap-3 h-[40px] py-2 text-gray-700"
            >
              <span className="text-[16px]">{key} :</span>
              <span className="font-bold text-[16px]">{value}</span>
            </div>
          ))}
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
            className={`py-2 text-[15px] lg:text-[18px] font-medium border-b-2 transition-all duration-300 ${
              activeTab === tab.id
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
