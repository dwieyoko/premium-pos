"use client";

import { Coupon, BulkDiscountRule, CartItem, AppliedDiscount } from "@/types";

const COUPONS_KEY = "pos-coupons";
const BULK_RULES_KEY = "pos-bulk-rules";

// Default coupons for demo
const defaultCoupons: Coupon[] = [
  {
    id: "coupon-1",
    code: "WELCOME10",
    discount: {
      id: "disc-1",
      name: "Welcome 10% Off",
      type: "percentage",
      value: 10,
      minPurchase: 10,
      maxDiscount: 50,
    },
    usageLimit: 100,
    usedCount: 0,
    isActive: true,
  },
  {
    id: "coupon-2",
    code: "SAVE5",
    discount: {
      id: "disc-2",
      name: "$5 Off",
      type: "fixed",
      value: 5,
      minPurchase: 20,
    },
    usageLimit: 50,
    usedCount: 0,
    isActive: true,
  },
  {
    id: "coupon-3",
    code: "VIP20",
    discount: {
      id: "disc-3",
      name: "VIP 20% Off",
      type: "percentage",
      value: 20,
      minPurchase: 50,
      maxDiscount: 100,
    },
    usageLimit: 20,
    usedCount: 0,
    isActive: true,
  },
];

// Default bulk discount rules
const defaultBulkRules: BulkDiscountRule[] = [
  {
    id: "bulk-1",
    name: "Buy 3+ Get 5% Off",
    minQuantity: 3,
    discountPercentage: 5,
  },
  {
    id: "bulk-2",
    name: "Buy 5+ Get 10% Off",
    minQuantity: 5,
    discountPercentage: 10,
  },
];

// Initialize stores
export function initializeCoupons(): void {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(COUPONS_KEY)) {
    localStorage.setItem(COUPONS_KEY, JSON.stringify(defaultCoupons));
  }
  if (!localStorage.getItem(BULK_RULES_KEY)) {
    localStorage.setItem(BULK_RULES_KEY, JSON.stringify(defaultBulkRules));
  }
}

// Coupon CRUD
export function getCoupons(): Coupon[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(COUPONS_KEY);
  return data ? JSON.parse(data) : defaultCoupons;
}

export function getCouponByCode(code: string): Coupon | null {
  const coupons = getCoupons();
  return (
    coupons.find((c) => c.code.toUpperCase() === code.toUpperCase()) || null
  );
}

export function validateCoupon(
  code: string,
  subtotal: number,
): { valid: boolean; error?: string; coupon?: Coupon } {
  const coupon = getCouponByCode(code);

  if (!coupon) {
    return { valid: false, error: "Coupon not found" };
  }

  if (!coupon.isActive) {
    return { valid: false, error: "Coupon is no longer active" };
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, error: "Coupon usage limit reached" };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: "Coupon has expired" };
  }

  if (coupon.discount.minPurchase && subtotal < coupon.discount.minPurchase) {
    return {
      valid: false,
      error: `Minimum purchase of $${coupon.discount.minPurchase.toFixed(2)} required`,
    };
  }

  return { valid: true, coupon };
}

export function calculateCouponDiscount(
  coupon: Coupon,
  subtotal: number,
): number {
  if (coupon.discount.type === "percentage") {
    let discount = (subtotal * coupon.discount.value) / 100;
    if (coupon.discount.maxDiscount) {
      discount = Math.min(discount, coupon.discount.maxDiscount);
    }
    return discount;
  } else {
    return Math.min(coupon.discount.value, subtotal);
  }
}

export function useCoupon(couponId: string): void {
  const coupons = getCoupons();
  const updated = coupons.map((c) =>
    c.id === couponId ? { ...c, usedCount: c.usedCount + 1 } : c,
  );
  localStorage.setItem(COUPONS_KEY, JSON.stringify(updated));
}

// Bulk Discount Rules
export function getBulkRules(): BulkDiscountRule[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(BULK_RULES_KEY);
  return data ? JSON.parse(data) : defaultBulkRules;
}

export function calculateBulkDiscount(items: CartItem[]): {
  discount: number;
  rule: BulkDiscountRule | null;
} {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const rules = getBulkRules();

  // Find the best applicable rule (highest discount for quantity)
  const applicableRules = rules
    .filter((rule) => totalQuantity >= rule.minQuantity)
    .sort((a, b) => b.discountPercentage - a.discountPercentage);

  if (applicableRules.length === 0) {
    return { discount: 0, rule: null };
  }

  const bestRule = applicableRules[0];
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = (subtotal * bestRule.discountPercentage) / 100;

  return { discount, rule: bestRule };
}

// Calculate all discounts
export function calculateAllDiscounts(
  items: CartItem[],
  couponCode?: string,
): {
  subtotal: number;
  discounts: AppliedDiscount[];
  totalDiscount: number;
  finalTotal: number;
} {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discounts: AppliedDiscount[] = [];
  let totalDiscount = 0;

  // Apply bulk discount
  const { discount: bulkDiscount, rule: bulkRule } =
    calculateBulkDiscount(items);
  if (bulkDiscount > 0 && bulkRule) {
    discounts.push({
      type: "bulk",
      name: bulkRule.name,
      amount: bulkDiscount,
    });
    totalDiscount += bulkDiscount;
  }

  // Apply coupon discount (only if no bulk discount or coupon is better)
  if (couponCode) {
    const validation = validateCoupon(couponCode, subtotal);
    if (validation.valid && validation.coupon) {
      const couponDiscount = calculateCouponDiscount(
        validation.coupon,
        subtotal - totalDiscount,
      );
      discounts.push({
        type: "coupon",
        name: `${validation.coupon.code} - ${validation.coupon.discount.name}`,
        amount: couponDiscount,
      });
      totalDiscount += couponDiscount;
    }
  }

  return {
    subtotal,
    discounts,
    totalDiscount,
    finalTotal: Math.max(0, subtotal - totalDiscount),
  };
}
