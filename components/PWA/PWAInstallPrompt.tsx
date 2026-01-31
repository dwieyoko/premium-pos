"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Zap, Wifi } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  useEffect(() => {
    // Check if dismissed in this session
    if (typeof window !== "undefined") {
      setIsDismissed(sessionStorage.getItem("pwa-dismissed") === "true");
    }
    
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }
    
    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a short delay
      setTimeout(() => setIsVisible(true), 2000);
    };
    
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    
    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    });
    
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);
  
  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    
    setIsVisible(false);
    setDeferredPrompt(null);
  };
  
  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Don't show again for this session
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pwa-dismissed", "true");
    }
  };
  
  // Don't render if installed or dismissed
  if (isInstalled || isDismissed) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-primary/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-[#0052a3] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">Install Premium POS</p>
                    <p className="text-sm opacity-90">Get the full experience</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Features */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <Wifi className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-foreground">Works offline</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-foreground">Faster and smoother</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Download className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-foreground">Access from home screen</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-4 pt-0 flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 border-2 border-primary/20 rounded-xl text-primary font-medium hover:bg-primary/5 transition-colors"
              >
                Not Now
              </button>
              <motion.button
                onClick={handleInstall}
                className="flex-1 btn-gradient py-2.5 rounded-xl font-medium flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                <Download className="h-4 w-4" />
                Install
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
