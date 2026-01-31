"use client";

import { Order, CartItem, Customer, PaymentMethod } from "@/types";

const ORDERS_KEY = "pos-orders";
const SALES_STATS_KEY = "pos-sales-stats";

// Generate unique order ID
function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

// Get all orders
export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

// Save orders
function saveOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// Create new order
export function createOrder(
  items: CartItem[],
  customer: Customer | undefined,
  payments: PaymentMethod[],
  discountAmount: number = 0,
  taxRate: number = 0.1,
): Order {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const afterDiscount = subtotal - discountAmount;
  const tax = afterDiscount * taxRate;
  const total = afterDiscount + tax;

  const order: Order = {
    id: generateOrderId(),
    items,
    customer,
    subtotal,
    discount: discountAmount,
    tax,
    total,
    payments,
    status: "completed",
    createdAt: new Date().toISOString(),
  };

  const orders = getOrders();
  orders.unshift(order); // Add to beginning
  saveOrders(orders);

  return order;
}

// Get orders by date range
export function getOrdersByDateRange(startDate: Date, endDate: Date): Order[] {
  const orders = getOrders();
  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startDate && orderDate <= endDate;
  });
}

// Get today's orders
export function getTodayOrders(): Order[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getOrdersByDateRange(today, tomorrow);
}

// Get this week's orders
export function getThisWeekOrders(): Order[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return getOrdersByDateRange(startOfWeek, endOfWeek);
}

// Get this month's orders
export function getThisMonthOrders(): Order[] {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
    23,
    59,
    59,
  );
  return getOrdersByDateRange(startOfMonth, endOfMonth);
}

// Calculate revenue
export function calculateRevenue(orders: Order[]): number {
  return orders.reduce((sum, order) => sum + order.total, 0);
}

// Get daily revenue for the past N days
export function getDailyRevenue(
  days: number = 7,
): { date: string; revenue: number; orders: number }[] {
  const result: { date: string; revenue: number; orders: number }[] = [];
  const orders = getOrders();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= date && orderDate < nextDate;
    });

    result.push({
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      revenue: calculateRevenue(dayOrders),
      orders: dayOrders.length,
    });
  }

  return result;
}

// Get weekly revenue for the past N weeks
export function getWeeklyRevenue(
  weeks: number = 4,
): { week: string; revenue: number; orders: number }[] {
  const result: { week: string; revenue: number; orders: number }[] = [];
  const orders = getOrders();

  for (let i = weeks - 1; i >= 0; i--) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - i * 7);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);

    const weekOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate < endDate;
    });

    result.push({
      week: `Week ${weeks - i}`,
      revenue: calculateRevenue(weekOrders),
      orders: weekOrders.length,
    });
  }

  return result;
}

// Get best selling products
export function getBestSellingProducts(limit: number = 5): {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
}[] {
  const orders = getOrders();
  const productStats: Record<
    string,
    { name: string; quantity: number; revenue: number }
  > = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productStats[item.id]) {
        productStats[item.id] = { name: item.name, quantity: 0, revenue: 0 };
      }
      productStats[item.id].quantity += item.quantity;
      productStats[item.id].revenue += item.price * item.quantity;
    });
  });

  return Object.entries(productStats)
    .map(([productId, stats]) => ({ productId, ...stats }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

// Get sales summary
export function getSalesSummary(): {
  todayRevenue: number;
  todayOrders: number;
  weekRevenue: number;
  weekOrders: number;
  monthRevenue: number;
  monthOrders: number;
  averageOrderValue: number;
} {
  const todayOrders = getTodayOrders();
  const weekOrders = getThisWeekOrders();
  const monthOrders = getThisMonthOrders();
  const allOrders = getOrders();

  return {
    todayRevenue: calculateRevenue(todayOrders),
    todayOrders: todayOrders.length,
    weekRevenue: calculateRevenue(weekOrders),
    weekOrders: weekOrders.length,
    monthRevenue: calculateRevenue(monthOrders),
    monthOrders: monthOrders.length,
    averageOrderValue:
      allOrders.length > 0 ? calculateRevenue(allOrders) / allOrders.length : 0,
  };
}

// Generate sample orders for demo
export function generateSampleOrders(): void {
  if (typeof window === "undefined") return;

  const existingOrders = getOrders();
  if (existingOrders.length > 0) return; // Don't overwrite existing data

  const sampleProducts = [
    { id: "1", name: "Premium Coffee", price: 4.99, category: "Beverages" },
    { id: "2", name: "Artisan Croissant", price: 3.49, category: "Bakery" },
    { id: "3", name: "Green Tea Latte", price: 5.49, category: "Beverages" },
    { id: "4", name: "Avocado Toast", price: 8.99, category: "Food" },
    { id: "5", name: "Blueberry Muffin", price: 2.99, category: "Bakery" },
  ];

  const sampleOrders: Order[] = [];

  // Generate orders for the past 14 days
  for (let day = 13; day >= 0; day--) {
    const ordersPerDay = Math.floor(Math.random() * 8) + 3; // 3-10 orders per day

    for (let i = 0; i < ordersPerDay; i++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM - 8 PM
      date.setMinutes(Math.floor(Math.random() * 60));

      const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items
      const items: CartItem[] = [];

      for (let j = 0; j < itemCount; j++) {
        const product =
          sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          items.push({
            ...product,
            image: "/placeholder.jpg",
            qrCode: `QR-${product.id}`,
            quantity: Math.floor(Math.random() * 2) + 1,
          });
        }
      }

      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const tax = subtotal * 0.1;

      sampleOrders.push({
        id: generateOrderId(),
        items,
        subtotal,
        discount: 0,
        tax,
        total: subtotal + tax,
        payments: [{ type: "cash", amount: subtotal + tax }],
        status: "completed",
        createdAt: date.toISOString(),
      });
    }
  }

  saveOrders(sampleOrders);
}
