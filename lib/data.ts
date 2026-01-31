import { Product, Category } from "@/types";

export const defaultCategories: Category[] = [
  { id: "cat-1", name: "Beverages", color: "#3b82f6" },
  { id: "cat-2", name: "Bakery", color: "#f59e0b" },
  { id: "cat-3", name: "Food", color: "#10b981" },
];

export const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Premium Coffee",
    description: "Rich and aromatic premium coffee blend",
    price: 4.5,
    category: "Beverages",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80",
    qrCode: "PROD-001",
    sku: "BEV-001",
    stock: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Artisan Croissant",
    description: "Freshly baked buttery croissant",
    price: 3.75,
    category: "Bakery",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80",
    qrCode: "PROD-002",
    sku: "BAK-001",
    stock: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Green Tea Latte",
    description: "Smooth and creamy matcha green tea latte",
    price: 5.25,
    category: "Beverages",
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&q=80",
    qrCode: "PROD-003",
    sku: "BEV-002",
    stock: 80,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Blueberry Muffin",
    description: "Soft muffin packed with fresh blueberries",
    price: 3.5,
    category: "Bakery",
    image:
      "https://images.unsplash.com/photo-1587049016473-b1ec904f67b4?w=500&q=80",
    qrCode: "PROD-004",
    sku: "BAK-002",
    stock: 40,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Avocado Toast",
    description: "Sourdough toast with smashed avocado and seasonings",
    price: 12.0,
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80",
    qrCode: "PROD-005",
    sku: "FOO-001",
    stock: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Sparkling Water",
    description: "Refreshing sparkling mineral water",
    price: 2.5,
    category: "Beverages",
    image:
      "https://images.unsplash.com/photo-1554467484-a4721ec39717?w=500&q=80",
    qrCode: "PROD-006",
    sku: "BEV-003",
    stock: 200,
    createdAt: new Date().toISOString(),
  },
];

// Legacy export for backward compatibility
export const products = defaultProducts;
