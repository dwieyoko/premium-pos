"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X } from "lucide-react";

interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function Scanner({ onScanSuccess, onClose }: ScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scannerRef.current.render(
      (decodedText) => {
        onScanSuccess(decodedText);
      },
      () => {
        // console.log(errorMessage);
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner", error);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="bg-background w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
          <h2 className="text-lg font-bold">Scan Product QR Code</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div id="reader" className="w-full rounded-xl overflow-hidden border-2 border-dashed border-primary/50"></div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Position the QR code within the frame to scan</p>
          </div>
        </div>
        
        <div className="p-4 border-t bg-muted/10 flex justify-center">
          <button 
            onClick={onClose}
            className="text-primary font-medium hover:underline"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    </div>
  );
}
