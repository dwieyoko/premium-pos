"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";

const shortcuts = [
  { keys: ["Ctrl", "S"], description: "Open scanner" },
  { keys: ["Ctrl", "Enter"], description: "Checkout" },
  { keys: ["Ctrl", "A"], description: "Quick add product" },
  { keys: ["Ctrl", "F"], description: "Search products" },
  { keys: ["1-9"], description: "Set quantity for last item" },
  { keys: ["+", "-"], description: "Adjust quantity" },
];

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 bg-white border border-primary/20 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="h-5 w-5 text-primary" />
      </button>
      
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Keyboard className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="font-bold text-lg">Keyboard Shortcuts</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-muted rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
                
                {/* Shortcuts List */}
                <div className="p-4 space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-xl transition-colors"
                    >
                      <span className="text-foreground">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <span key={i}>
                            <kbd className="px-2 py-1 bg-muted rounded-lg text-sm font-mono font-medium">
                              {key}
                            </kbd>
                            {i < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-muted-foreground">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t bg-muted/30">
                  <p className="text-sm text-muted-foreground text-center">
                    USB barcode scanners work automatically
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
