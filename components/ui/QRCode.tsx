"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeLib from "qrcode";
import { Download } from "lucide-react";

interface QRCodeProps {
  value: string;
  size?: number;
  showDownload?: boolean;
  productName?: string;
}

export default function QRCode({ value, size = 128, showDownload = false, productName }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");
  
  useEffect(() => {
    if (canvasRef.current && value) {
      QRCodeLib.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      }).then(() => {
        // Get data URL for download
        if (canvasRef.current) {
          setDataUrl(canvasRef.current.toDataURL("image/png"));
        }
      }).catch((err) => {
        console.error("QR Code generation error:", err);
      });
    }
  }, [value, size]);
  
  const handleDownload = () => {
    if (!dataUrl) return;
    
    const link = document.createElement("a");
    link.download = productName ? `qr-${productName.toLowerCase().replace(/\s+/g, "-")}.png` : "qr-code.png";
    link.href = dataUrl;
    link.click();
  };
  
  if (!value) {
    return (
      <div 
        className="bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm"
        style={{ width: size, height: size }}
      >
        No QR Code
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} className="rounded-lg" />
      {showDownload && dataUrl && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      )}
    </div>
  );
}
