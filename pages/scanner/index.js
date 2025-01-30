import React, { useState, useEffect, useRef } from 'react';
import Quagga from 'quagga';

function Scanner() {
  const [scannedBarcode, setScannedBarcode] = useState('');
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const streamRef = useRef(null);

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

  return (
    <div>
      <div className="w-full h-full">
        {/* Video Feed */}
        <div ref={videoRef} className="w-full h-full bg-white relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-36 rounded-lg">
          {/* Scanning Line */}
          {scanning && (
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-scan" />
          )}
        </div>
        </div>

        {/* Centered Scanning Area */}
        
      </div>

      {/* Close Button */}
      <button
        onClick={() => {
          stopCamera(); // Stop the camera stream
          onClose(); // Close the scanner
        }}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Close Scanner
      </button>
    </div>
  );
}

export default Scanner;