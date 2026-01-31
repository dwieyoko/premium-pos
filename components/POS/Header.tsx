"use client";

import Link from "next/link";
import { ShoppingCart, ScanLine, Plus, Settings } from "lucide-react";

interface HeaderProps {
  onToggleScanner: () => void;
  isScannerOpen: boolean;
  onQuickAdd?: () => void;
}

export default function Header({ onToggleScanner, isScannerOpen, onQuickAdd }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full header-gradient px-4 md:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#0066cc] to-[#0052a3] p-2.5 rounded-xl shadow-lg shadow-blue-200">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Premium POS</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Point of Sale System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Button */}
          {onQuickAdd && (
            <button
              onClick={onQuickAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all text-primary"
              title="Quick Add Product"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Quick Add</span>
            </button>
          )}
          
          {/* Scan QR Button */}
          <button
            onClick={onToggleScanner}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              isScannerOpen 
                ? "bg-red-500 text-white shadow-lg shadow-red-200 hover:bg-red-600" 
                : "btn-gradient"
            }`}
          >
            <ScanLine className="h-5 w-5" />
            <span className="hidden sm:inline">
              {isScannerOpen ? "Close Scanner" : "Scan QR"}
            </span>
          </button>
          
          <div className="h-8 w-[2px] bg-border rounded-full hidden sm:block"></div>
          
          {/* Manage Products Link */}
          <Link
            href="/admin/products"
            className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors text-primary"
            title="Manage Products"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
