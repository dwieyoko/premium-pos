export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  qrCode: string;
  sku?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  qrCode: string;
  sku?: string;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

// Payment Types
export type PaymentMethodType = "cash" | "card" | "wallet";

export interface PaymentMethod {
  type: PaymentMethodType;
  amount: number;
  reference?: string; // Card last 4 digits, transaction ID, etc.
}

export interface SplitPayment {
  methods: PaymentMethod[];
  totalPaid: number;
}

// Discount Types
export type DiscountType = "percentage" | "fixed";

export interface Discount {
  id: string;
  name: string;
  type: DiscountType;
  value: number; // Percentage (0-100) or fixed amount
  minPurchase?: number; // Minimum purchase amount to apply
  maxDiscount?: number; // Maximum discount for percentage type
}

export interface Coupon {
  id: string;
  code: string;
  discount: Discount;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface BulkDiscountRule {
  id: string;
  name: string;
  minQuantity: number;
  discountPercentage: number;
  applicableCategories?: string[]; // Empty = all categories
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

// Order Types
export interface Order {
  id: string;
  items: CartItem[];
  customer?: Customer;
  subtotal: number;
  discount: number;
  discountDetails?: {
    coupon?: Coupon;
    bulkDiscount?: number;
  };
  tax: number;
  total: number;
  payments: PaymentMethod[];
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

// Applied Discount
export interface AppliedDiscount {
  type: "coupon" | "bulk";
  name: string;
  amount: number;
}
