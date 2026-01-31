/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { CartItem } from "@/types";
import { useState, useEffect } from "react";

interface PrintBillProps {
  items: CartItem[];
}

export default function PrintBill({ items }: PrintBillProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const now = new Date();

  const [orderNumber, setOrderNumber] = useState(0);
  const [barcodeLines, setBarcodeLines] = useState<string[]>([]);

  useEffect(() => {
    setOrderNumber(Math.floor(Math.random() * 10000));
    setBarcodeLines([...Array(30)].map(() => Math.random() > 0.5 ? '2px' : '1px'));
  }, []);

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
      
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Premium POS</h1>
        <p className="text-sm font-bold mt-2">*** RECEIPT ***</p>
        <p className="text-xs mt-2">123 Business Street, Suite 100</p>
        <p className="text-xs">City, State 12345</p>
        <p className="text-xs">Tel: (555) 0123-4567</p>
      </div>

      <div className="border-t border-b border-dashed py-2 mb-4 flex justify-between text-xs">
        <span>Order: #{orderNumber}</span>
        <span>{now.toLocaleDateString()} {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

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
              <td className="py-2 text-right">${`$`}{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed pt-4 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${`$`}{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (10%):</span>
          <span>${`$`}{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-double">
          <span>TOTAL:</span>
          <span>${`$`}{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs uppercase font-bold tracking-widest">Thank You!</p>
        <p className="text-[10px] mt-1 italic">Please come again</p>
        
        <div className="mt-4 flex justify-center opacity-50">
          <div className="flex gap-[1px] h-8 items-end">
            {barcodeLines.map((width, i) => (
              <div 
                key={i} 
                className="bg-black" 
                style={{ width, height: '100%' }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
