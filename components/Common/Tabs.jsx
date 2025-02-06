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

  useEffect(() => {

  }, [stockDetails])

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

          <TableDatas label={"Product Code"} value={productDetails.item_code} />
          <TableDatas label={"Brand"} value={productDetails.brand} />
          <TableDatas label={"Group"} value={productDetails.item_group} />
          <TableDatas label={"Stock Uom"} value={productDetails.stock_uom} />
          <TableDatas label={"Beam Angle"} value={productDetails.beam_angle} />
          <TableDatas label={"body finish"} value={productDetails.body_finish} />
          <TableDatas label={"category list"} value={productDetails.category_list} />
          <TableDatas label={"color temp"} value={productDetails.color_temp_} />
          <TableDatas label={"dimension"} value={productDetails.dimension} />
          <TableDatas label={"input"} value={productDetails.input} />
          <TableDatas label={"ip rate"} value={productDetails.ip_rate} />
          <TableDatas label={"lamp type"} value={productDetails.lamp_type} />
          <TableDatas label={"lumen output"} value={productDetails.lumen_output} />
          <TableDatas label={"material"} value={productDetails.material} />
          <TableDatas label={"mounting"} value={productDetails.mounting} />
          <TableDatas label={"output current"} value={productDetails.output_current} />
          <TableDatas label={"output voltage"} value={productDetails.output_voltage} />
          <TableDatas label={"power"} value={productDetails.power} />
          <TableDatas label={"product type"} value={productDetails.product_type} />
          <TableDatas label={"warranty"} value={productDetails.warranty_} />

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

const TableDatas = ({ label, value }) => {
  return (
    <>
      {value ? <div className="flex justify-between items-center gap-3 py-2 text-gray-700 h-[40px]" >
        <span className="lg:text-[15px] md:text-[14px] font-normal capitalize"> {label} :</span>
        <span className="font-bold lg:text-[15px] md:text-[14px]">{value}</span>
      </div> : <></>}
    </>
  )
}

export default Tabs;
