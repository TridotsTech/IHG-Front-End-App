import React, { useState, useEffect, useRef } from 'react';
import Quagga from 'quagga';
import { typesense_search_items } from '@/libs/api';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

function Scanner() {
  const [scannedBarcode, setScannedBarcode] = useState('');
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const streamRef = useRef(null);
  const router = useRouter()
  // Start the scanner automatically when the component mounts
  useEffect(() => {
    if (!scanning) return;

    // Initialize Quagga
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: videoRef.current,
          constraints: {
            facingMode: 'environment', // Use the rear camera
          },
        },
        decoder: {
          readers: ['ean_reader'], // Specify the barcode format
        },
      },
      (err) => {
        if (err) {
          console.error('Error initializing Quagga:', err);
          return;
        }
        Quagga.start();

        // Get the camera stream and store it in the ref
        if (videoRef.current && videoRef.current.srcObject) {
          streamRef.current = videoRef.current.srcObject;
        }
      }
    );

    // Detect barcodes
    Quagga.onDetected((result) => {
      setScanning(false); // Stop scanning
      setScannedBarcode(result.codeResult.code); // Set the scanned barcode
      getScannedProducts(result.codeResult.code)
      stopCamera(); // Stop the camera stream
    });

    // Cleanup function
    return () => {
      stopCamera(); // Stop the camera stream when the component unmounts
      Quagga.stop();
    };
  }, [scanning]);

  // Function to stop the camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop()); // Stop each track in the stream
      streamRef.current = null; // Clear the stream ref
    }
  };

  const [errorMsg, setErrorMsg] = useState('');

  const getScannedProducts = async (barcode) => {
    console.log(barcode, "barcode")

    const queryParams = new URLSearchParams({
      q: "*",
      // query_by: "item_name,item_description,brand",
      // page: "1",
      // per_page: "1",
      // query_by_weights: "1,2,3",
      filter_by: `barcode:=${barcode}`,
    });

    const data = await typesense_search_items(queryParams);
    console.log(data, "data")
    if (data && data.hits && data.hits.length > 0 && data.hits[0] && data.hits[0].document) {
      router.push(`/pr/${data.hits[0].document.item_code}`)
    } else {
      toast.error('Something went wrong!')
      setErrorMsg("No product found!");
    }
  }

  return (
    <div className='bg-gray-200 min-h-screen flex justify-center items-center'>
      <div className="w-full h-full">
        {/* Video Feed */}
        {
          errorMsg === '' ? (
            <div ref={videoRef} className="w-full h-[500px] bg-white relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-36 rounded-lg">
                {/* Scanning Line */}
                {scanning && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-scan" />
                )}
              </div>
            </div>
          ) : (
            <p className='text-lg font-semibold'>{errorMsg}</p>
          )
        }

        {/* Centered Scanning Area */}

      </div>

      {/* Close Button */}
      {/* <button
        onClick={() => {
          stopCamera(); // Stop the camera stream
          onClose(); // Close the scanner
        }}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Close Scanner
      </button> */}
    </div>
  );
}

export default Scanner;