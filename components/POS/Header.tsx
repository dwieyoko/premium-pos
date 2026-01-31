"use client";

import { ShoppingCart, ScanLine, Sun } from "lucide-react";

interface HeaderProps {
  onToggleScanner: () => void;
  isScannerOpen: boolean;
}

export default function Header({ onToggleScanner, isScannerOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Premium POS</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleScanner}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isScannerOpen 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            <ScanLine className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">
              {isScannerOpen ? "Close Scanner" : "Scan QR Code"}
            </span>
          </button>
          
          <div className="h-8 w-[1px] bg-border hidden sm:block"></div>
          
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Sun className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
