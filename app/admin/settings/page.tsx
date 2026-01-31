"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Settings,
  Image as ImageIcon,
  FileText,
  QrCode,
  Upload,
  X,
  Save,
  RotateCcw
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  getReceiptSettings, 
  saveReceiptSettings, 
  resetReceiptSettings,
  ReceiptSettings 
} from "@/lib/receiptStore";
import { useToast } from "@/contexts/ToastContext";
import Image from "next/image";

export default function ReceiptSettingsPage() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<ReceiptSettings>({
    businessName: "",
    businessLogo: "",
    address: "",
    phone: "",
    footerText: "",
    showQRCode: true,
    currency: "$",
    taxLabel: "Tax (10%)",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    setSettings(getReceiptSettings());
    setIsLoading(false);
  }, []);
  
  const handleChange = (field: keyof ReceiptSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 500 * 1024) {
      showToast("Logo must be less than 500KB", "error");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      handleChange("businessLogo", reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveLogo = () => {
    handleChange("businessLogo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      saveReceiptSettings(settings);
      showToast("Receipt settings saved", "success");
      setIsSaving(false);
    }, 300);
  };
  
  const handleReset = () => {
    if (confirm("Reset all settings to defaults?")) {
      const defaults = resetReceiptSettings();
      setSettings(defaults);
      showToast("Settings reset to defaults", "success");
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="font-medium">Loading settings...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Receipt Settings</h1>
            <p className="text-muted-foreground">
              Customize your receipt appearance
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 btn-gradient rounded-xl font-medium disabled:opacity-50"
            whileTap={{ scale: 0.98 }}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </div>
      
      {/* Settings Form */}
      <div className="grid gap-6">
        {/* Business Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Business Logo</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-xl border-2 border-dashed border-primary/30 cursor-pointer flex items-center justify-center overflow-hidden hover:border-primary hover:bg-primary/5 transition-all"
            >
              {settings.businessLogo ? (
                <>
                  <Image
                    src={settings.businessLogo}
                    alt="Logo"
                    fill
                    className="object-contain p-2"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLogo();
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="h-6 w-6 text-primary/50 mx-auto" />
                  <span className="text-xs text-muted-foreground mt-1">Upload</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Upload your business logo to appear on receipts.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: Square image, max 500KB
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Business Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Business Information</h3>
          </div>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                placeholder="Your Business Name"
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="123 Business Street, City"
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 234 567 890"
                  className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  placeholder="$"
                  className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer & QR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <QrCode className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Footer & QR Code</h3>
          </div>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Custom Footer Text
              </label>
              <textarea
                value={settings.footerText}
                onChange={(e) => handleChange("footerText", e.target.value)}
                placeholder="Thank you for your purchase!&#10;Visit us again soon."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 transition-all resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tax Label
              </label>
              <input
                type="text"
                value={settings.taxLabel}
                onChange={(e) => handleChange("taxLabel", e.target.value)}
                placeholder="Tax (10%)"
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 transition-all"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium">Show QR Code on Receipt</p>
                <p className="text-sm text-muted-foreground">
                  Customers can scan to view digital receipt
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showQRCode}
                  onChange={(e) => handleChange("showQRCode", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </motion.div>
        
        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Receipt Preview</h3>
          
          <div className="max-w-xs mx-auto bg-white border rounded-lg p-6 shadow-inner font-mono text-sm">
            {/* Header */}
            <div className="text-center border-b pb-4 mb-4">
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
              <p className="font-bold text-lg">{settings.businessName || "Business Name"}</p>
              <p className="text-xs text-gray-500">{settings.address || "Address"}</p>
              <p className="text-xs text-gray-500">{settings.phone || "Phone"}</p>
            </div>
            
            {/* Sample items */}
            <div className="space-y-1 border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span>Coffee x2</span>
                <span>{settings.currency}9.98</span>
              </div>
              <div className="flex justify-between">
                <span>Croissant x1</span>
                <span>{settings.currency}3.49</span>
              </div>
            </div>
            
            {/* Totals */}
            <div className="space-y-1 border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{settings.currency}13.47</span>
              </div>
              <div className="flex justify-between">
                <span>{settings.taxLabel || "Tax"}</span>
                <span>{settings.currency}1.35</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{settings.currency}14.82</span>
              </div>
            </div>
            
            {/* Footer */}
            <div className="text-center text-gray-500 text-xs whitespace-pre-line">
              {settings.footerText || "Thank you!"}
            </div>
            
            {/* QR Code placeholder */}
            {settings.showQRCode && (
              <div className="mt-4 flex justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
