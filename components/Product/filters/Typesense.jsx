// import React, { useEffect, useState } from "react";
// import RangeSlider from "./RangeSlider";
// import { useSelector, useDispatch } from "react-redux";
// import { setFilter } from "@/redux/slice/filtersList";

// const TypesenseSearch = () => {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const filtersData = useSelector((state) => state.FiltersList);
//   const dispatch = useDispatch();

//   const [filters, setFilters] = useState({
//     ...filtersData,
//     price_range: { min: 0, max: 100000 },
//     stock_range: { min: 0, max: 200}
//   });

//   const buildFilterQuery = () => {
//     const filterParams = [];
//     if (filters.item_code) filterParams.push(`item_code:${filters.item_code}*`);
//     if (filters.item_description)
//       filterParams.push(`item_description:${filters.item_description}*`);
//     if (filters.item_group) filterParams.push(`item_group:${filters.item_group}`);
//     if (filters.show_promotion) filterParams.push(`show_promotion:=true`);
//     if (filters.in_stock) filterParams.push(`in_stock:=true`);
//     if (filters.brands) filterParams.push(`brand:=[${filters.brands}]`);
//     if (filters.price_range && filters.price_range.min > 0) {
//       const { min, max } = filters.price_range;
//       filterParams.push(`rate:[${parseFloat(min)}...${parseFloat(max)}]`);
//     }
//     if (filters.stock_range && filters.stock_range.min > 0) {
//       const { min, max } = filters.stock_range;
//       filterParams.push(`stock:[${parseFloat(min)}...${parseFloat(max)}]`);
//     }
//     return filterParams.length > 0 ? filterParams.join(" && ") : "";
//   };
  

//   const fetchResults = async () => {
//     setLoading(true);
//     setError(null);

//     const filterQuery = buildFilterQuery(); 
//     const queryParams = new URLSearchParams({
//       q: "*",
//       query_by: "item_name,item_description,brand",
//       page: "1",
//       per_page: "30",
//       query_by_weights: "1,2,3",
//       ...(filterQuery && { filter_by: filterQuery }),
//     });

//     try {
//       const response = await fetch(
//         `http://178.128.108.196:8108/collections/product/documents/search?${queryParams.toString()}`,
//         {
//           method: "GET",
//           headers: {
//             "x-typesense-api-key": "xyz",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       setResults(data.hits || []);
//     } catch (err) {
//       setError(err.message || "An error occurred while fetching data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     dispatch(setFilter(filters));
//   }, [filters, dispatch]);

//   return (
//     <div className="p-4">
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Item Code"
//           value={filters.item_code || ""}
//           onChange={(e) => setFilters({ ...filters, item_code: e.target.value })}
//           className="border p-2 mr-2"
//         />
//         <input
//           type="text"
//           placeholder="Item Description"
//           value={filters.item_description || ""}
//           onChange={(e) =>
//             setFilters({ ...filters, item_description: e.target.value })
//           }
//           className="border p-2 mr-2"
//         />
//         <input
//           type="text"
//           placeholder="Item Name"
//           value={filters.item_name || ""}
//           onChange={(e) => setFilters({ ...filters, item_name: e.target.value })}
//           className="border p-2 mr-2"
//         />

//         <div>
//           <label>
//             <input
//               type="checkbox"
//               checked={filters.show_promotion || false}
//               onChange={(e) =>
//                 setFilters({ ...filters, show_promotion: e.target.checked })
//               }
//               className="mr-2"
//             />
//             Show Promotion
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               checked={filters.in_stock || false}
//               onChange={(e) =>
//                 setFilters({ ...filters, in_stock: e.target.checked })
//               }
//               className="mr-2"
//             />
//             In Stock
//           </label>
//         </div>

//         <select
//           value={filters.brands || ""}
//           onChange={(e) => setFilters({ ...filters, brands: e.target.value })}
//           className="border p-2 mr-2"
//         >
//           <option value="">Select Brand</option>
//           <option value="LTECH">LTECH</option>
//         </select>
//         <select
//           value={filters.item_group || ""}
//           onChange={(e) =>
//             setFilters({ ...filters, item_group: e.target.value })
//           }
//           className="border p-2 mr-2"
//         >
//           <option value="">Select Item Group</option>
//           <option value="ELECTRICAL">Electrical</option>
//         </select>

//         <div className="w-60">
//           <RangeSlider
//             MIN={0}
//             MAX={100}
//             ranges={filters.price_range}
//             setRanges={(ranges) =>
//               setFilters({ ...filters, price_range: ranges })
//             }
//             label={"Price"}
//           />
//         </div>

//         <div className="w-60">
//           <RangeSlider
//             MIN={0}
//             MAX={100000}
//             ranges={filters.stock_range}
//             setRanges={(ranges) =>
//               setFilters({ ...filters, stock_range: ranges })
//             }
//             label={"Price"}
//           />
//         </div>

//         <button onClick={fetchResults} className="p-2 bg-blue-500 text-white">
//           Submit
//         </button>
//       </div>

    
//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">Error: {error}</p>}
//       {!loading && !error && (
//         <div>
//           {results.length > 0 ? (
//             <ul className="list-disc pl-5">
//               {results.map((result, index) => (
//                 <li key={index} className="mb-2">
//                   <strong>{result.document.item_name}</strong>:{" "}
//                   {result.document.item_description} (Brand:{" "}
//                   {result.document.brand})
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No results found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TypesenseSearch;


// "use client"
// import { useEffect, useState } from "react";
// import ScanbotSDK from "scanbot-web-sdk/ui";

// const App = () => {
//   const [scanResult, setScanResult] = useState("");

//   useEffect(() => {
//     const init = async () => {
//       await ScanbotSDK.initialize({
//         licenseKey: "",
//       });
//     };

//     init();
//   }, []);

//   const startScanner = async () => {
//     const config = new ScanbotSDK.UI.Config.BarcodeScannerConfiguration();

//     const result = await ScanbotSDK.UI.createBarcodeScanner(config);

//     if (result && result.items.length > 0) {
//       setScanResult(result.items[0].text);
//     }

//     return result;
//   };

//   return (
//     <div>
//       <button onClick={startScanner}>Start Scanner</button>
//       {scanResult && <div>{scanResult}</div>}
//     </div>
//   );
// };

// export default App;







import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const App = (props) => {

  const firstUpdate = useRef(true);
  const [isStart, setIsStart] = useState(false);
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    return () => {
      if (isStart) stopScanner();
    };
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (isStart) startScanner();
    else stopScanner();
  }, [isStart]);

  const _onDetected = res => {
    // stopScanner();
    setBarcode(res.codeResult.code);
  };

  const startScanner = () => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: document.querySelector('#scanner-container'),
          constraints: {
            facingMode: 'environment' // or user
          }
        },
        numOfWorkers: navigator.hardwareConcurrency,
        locate: true,
        frequency: 1,
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true
        },
        multiple: false,
        locator: {
          halfSample: false,
          patchSize: 'large', // x-small, small, medium, large, x-large
          debug: {
            showCanvas: false,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatchLabels: false,
            boxFromPatches: {
              showTransformed: false,
              showTransformedBox: false,
              showBB: false
            }
          }
        },
        decoder: {
          readers: props.readers
        }
      },
      err => {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(_onDetected);
    Quagga.onProcessed(result => {
      let drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute('width')),
            parseInt(drawingCanvas.getAttribute('height'))
          );
          result.boxes.filter(box => box !== result.box).forEach(box => {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
              color: 'green',
              lineWidth: 2
            });
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
      }
    });
  };

  const stopScanner = () => {
    Quagga.offProcessed();
    Quagga.offDetected();
    Quagga.stop();
  };

  return <div>
    <h3>Barcode scanner in React - <a href="https://www.cluemediator.com/" target="_blank">Clue Mediator</a></h3>
    <button onClick={() => setIsStart(prevStart => !prevStart)} style={{ marginBottom: 20 }}>{isStart ? 'Stop' : 'Start'}</button>
    {isStart && <React.Fragment>
      <div id="scanner-container" />
      <span>Barcode: {barcode}</span>
    </React.Fragment>}
  </div>
}

export default App;