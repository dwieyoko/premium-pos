"use client";

export interface ReceiptSettings {
  businessName: string;
  businessLogo: string; // Base64 or URL
  address: string;
  phone: string;
  footerText: string;
  showQRCode: boolean;
  currency: string;
  taxLabel: string;
}

const RECEIPT_SETTINGS_KEY = "pos-receipt-settings";

const defaultSettings: ReceiptSettings = {
  businessName: "Premium POS",
  businessLogo: "",
  address: "123 Business Street, City",
  phone: "+1 234 567 890",
  footerText: "Thank you for your purchase!\nVisit us again soon.",
  showQRCode: true,
  currency: "$",
  taxLabel: "Tax (10%)",
};

// Get receipt settings
export function getReceiptSettings(): ReceiptSettings {
  if (typeof window === "undefined") return defaultSettings;

  const data = localStorage.getItem(RECEIPT_SETTINGS_KEY);
  if (!data) return defaultSettings;

  try {
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch {
    return defaultSettings;
  }
}

// Save receipt settings
export function saveReceiptSettings(
  settings: Partial<ReceiptSettings>,
): ReceiptSettings {
  const current = getReceiptSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(RECEIPT_SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}

// Reset to defaults
export function resetReceiptSettings(): ReceiptSettings {
  localStorage.removeItem(RECEIPT_SETTINGS_KEY);
  return defaultSettings;
}

// Generate receipt QR code data
export function generateReceiptQRData(orderId: string, total: number): string {
  // In a real app, this would be a URL to view the digital receipt
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/receipt/${orderId}?total=${total.toFixed(2)}`;
}
