"use client";

import { Customer } from "@/types";

const CUSTOMERS_KEY = "pos-customers";
const RECENT_CUSTOMERS_KEY = "pos-recent-customers";
const MAX_RECENT = 10;

// Generate unique ID
function generateCustomerId(): string {
  return `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get all customers
export function getCustomers(): Customer[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CUSTOMERS_KEY);
  return data ? JSON.parse(data) : [];
}

// Get recent customers (for quick selection)
export function getRecentCustomers(): Customer[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(RECENT_CUSTOMERS_KEY);
  return data ? JSON.parse(data) : [];
}

// Save customers
function saveCustomers(customers: Customer[]): void {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

// Add customer to recent list
function addToRecent(customer: Customer): void {
  const recent = getRecentCustomers();

  // Remove if already exists
  const filtered = recent.filter((c) => c.id !== customer.id);

  // Add to front
  const updated = [customer, ...filtered].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_CUSTOMERS_KEY, JSON.stringify(updated));
}

// Add new customer
export function addCustomer(
  data: Omit<Customer, "id" | "createdAt">,
): Customer {
  const customers = getCustomers();

  const newCustomer: Customer = {
    ...data,
    id: generateCustomerId(),
    createdAt: new Date().toISOString(),
  };

  customers.push(newCustomer);
  saveCustomers(customers);
  addToRecent(newCustomer);

  return newCustomer;
}

// Find customer by phone
export function findCustomerByPhone(phone: string): Customer | null {
  const customers = getCustomers();
  return customers.find((c) => c.phone === phone) || null;
}

// Find customer by name (partial match)
export function searchCustomers(query: string): Customer[] {
  if (!query.trim()) return [];

  const customers = getCustomers();
  const lowerQuery = query.toLowerCase();

  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.phone?.includes(query) ||
      c.email?.toLowerCase().includes(lowerQuery),
  );
}

// Get or create customer
export function getOrCreateCustomer(
  name: string,
  phone?: string,
  email?: string,
): Customer {
  // Check if customer exists by phone
  if (phone) {
    const existing = findCustomerByPhone(phone);
    if (existing) {
      addToRecent(existing);
      return existing;
    }
  }

  // Create new customer
  return addCustomer({ name, phone, email });
}

// Update customer to recent (for tracking usage)
export function markCustomerAsRecent(customerId: string): void {
  const customers = getCustomers();
  const customer = customers.find((c) => c.id === customerId);
  if (customer) {
    addToRecent(customer);
  }
}
