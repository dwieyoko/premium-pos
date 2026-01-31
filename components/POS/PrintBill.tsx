/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CartItem, Customer } from "@/types";
import { useState, useEffect } from "react";
import { getReceiptSettings, ReceiptSettings, generateReceiptQRData } from "@/lib/receiptStore";
import Image from "next/image";
import QRCode from "@/components/ui/QRCode";

interface PrintBillProps {
  items: CartItem[];
  customer?: Customer;
  discount?: number;
  orderId?: string;
}

export default function PrintBill({ items, customer, discount = 0, orderId }: PrintBillProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * 0.1;
  const total = afterDiscount + tax;
  const now = new Date();

  const [orderNumber, setOrderNumber] = useState("");
  const [settings, setSettings] = useState<ReceiptSettings | null>(null);
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const id = orderId || `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderNumber(id);
    setSettings(getReceiptSettings());
    setQrData(generateReceiptQRData(id, total));
  }, [orderId, total]);

  if (!settings) return null;

  return (
    <div id="printable-bill" className="print-only p-8 bg-white text-black font-mono w-[80mm] mx-auto text-sm">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-bill, #printable-bill * {
            visibility: visible;
          }
          #printable-bill {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 0;
          }
        }
        .print-only {
          display: none;
        }
        @media print {
          .print-only {
            display: block;
          }
        }
      `}</style>
      
      {/* Header with Logo */}
      <div className="text-center mb-6">
        {settings.businessLogo && (
          <div className="relative w-16 h-16 mx-auto mb-2">
            <Image
              src={settings.businessLogo}
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        )}
        <h1 className="text-xl font-bold uppercase tracking-widest">
          {settings.businessName}
        </h1>
        <p className="text-sm font-bold mt-2">*** RECEIPT ***</p>
        {settings.address && <p className="text-xs mt-2">{settings.address}</p>}
        {settings.phone && <p className="text-xs">{settings.phone}</p>}
      </div>

      {/* Order Info */}
      <div className="border-t border-b border-dashed py-2 mb-4">
        <div className="flex justify-between text-xs">
          <span>Order: {orderNumber}</span>
          <span>{now.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {customer && <span>Customer: {customer.name}</span>}
        </div>
      </div>

      {/* Items */}
      <table className="w-full mb-4">
        <thead>
          <tr className="border-b border-dashed">
            <th className="text-left py-1 font-bold">Item</th>
            <th className="text-center py-1 font-bold">Qty</th>
            <th className="text-right py-1 font-bold">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="text-xs">
              <td className="py-2 pr-2">{item.name}</td>
              <td className="py-2 text-center">{item.quantity}</td>
              <td className="py-2 text-right">
                {settings.currency}{(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="border-t border-dashed pt-4 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{settings.currency}{subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-{settings.currency}{discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>{settings.taxLabel}:</span>
          <span>{settings.currency}{tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-double">
          <span>TOTAL:</span>
          <span>{settings.currency}{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        {settings.footerText && (
          <p className="text-xs whitespace-pre-line mb-4">{settings.footerText}</p>
        )}
        
        {/* QR Code */}
        {settings.showQRCode && qrData && (
          <div className="flex flex-col items-center mt-4">
            <p className="text-[10px] mb-2">Scan for digital receipt</p>
            <QRCode value={qrData} size={80} />
          </div>
        )}
      </div>
    </div>
  );
}
