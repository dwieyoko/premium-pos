"use client";

import { useEffect, useCallback, useRef } from "react";

interface ShortcutAction {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutAction[]) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if user is typing in an input/textarea
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    for (const shortcut of shortcutsRef.current) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrlKey
        ? event.ctrlKey || event.metaKey
        : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

// USB Barcode Scanner Hook - captures rapid keyboard input
export function useBarcodeScanner(
  onScan: (barcode: string) => void,
  options: { minLength?: number; maxGap?: number } = {},
) {
  const { minLength = 4, maxGap = 50 } = options;
  const bufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const currentTime = Date.now();
      const timeSinceLastKey = currentTime - lastKeyTimeRef.current;

      // If too much time passed, reset buffer
      if (timeSinceLastKey > maxGap) {
        bufferRef.current = "";
      }

      // Handle Enter key - submit barcode
      if (event.key === "Enter") {
        if (bufferRef.current.length >= minLength) {
          onScan(bufferRef.current);
        }
        bufferRef.current = "";
        return;
      }

      // Only accept printable characters
      if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        bufferRef.current += event.key;
        lastKeyTimeRef.current = currentTime;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onScan, minLength, maxGap]);
}

// Shortcut definitions for the POS app
export const POS_SHORTCUTS = {
  SCAN: { key: "s", ctrlKey: true, description: "Open scanner" },
  CHECKOUT: { key: "Enter", ctrlKey: true, description: "Checkout" },
  QUICK_ADD: { key: "a", ctrlKey: true, description: "Quick add product" },
  CLEAR_CART: { key: "Delete", ctrlKey: true, description: "Clear cart" },
  SEARCH: { key: "f", ctrlKey: true, description: "Focus search" },
};
