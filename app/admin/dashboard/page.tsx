"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Package,
  AlertTriangle,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  getSalesSummary, 
  getDailyRevenue, 
  getBestSellingProducts,
  generateSampleOrders 
} from "@/lib/orderStore";
import { useProducts } from "@/contexts/ProductContext";

type TimeRange = "daily" | "weekly" | "monthly";

export default function DashboardPage() {
  const { products } = useProducts();
  const [summary, setSummary] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    weekRevenue: 0,
    weekOrders: 0,
    monthRevenue: 0,
    monthOrders: 0,
    averageOrderValue: 0,
  });
  const [dailyData, setDailyData] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [bestSelling, setBestSelling] = useState<{ productId: string; name: string; quantity: number; revenue: number }[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [isLoading, setIsLoading] = useState(true);
  
  // Low stock threshold
  const LOW_STOCK_THRESHOLD = 10;
  const lowStockProducts = products.filter(p => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD && p.stock !== undefined);
  
  useEffect(() => {
    // Generate sample data on first load if empty
    generateSampleOrders();
    
    // Load data
    setSummary(getSalesSummary());
    setDailyData(getDailyRevenue(7));
    setBestSelling(getBestSellingProducts(5));
    setIsLoading(false);
  }, []);
  
  // Find max revenue for chart scaling
  const maxRevenue = Math.max(...dailyData.map(d => d.revenue), 1);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Sales Dashboard</h1>
            <p className="text-muted-foreground">
              Track your sales performance and inventory
            </p>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                timeRange === range
                  ? "btn-gradient"
                  : "border-2 border-primary/20 text-primary hover:bg-primary/5"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Revenue</p>
              <p className="text-2xl font-bold gradient-text mt-1">
                ${summary.todayRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.todayOrders} orders
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold gradient-text mt-1">
                ${summary.weekRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.weekOrders} orders
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold gradient-text mt-1">
                ${summary.monthRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.monthOrders} orders
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl font-bold gradient-text mt-1">
                ${summary.averageOrderValue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                per transaction
              </p>
            </div>
            <div className="p-3 rounded-xl bg-orange-100">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Revenue (Last 7 Days)</h3>
          
          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end gap-2">
            {dailyData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full bg-gradient-to-t from-primary to-primary/70 rounded-t-lg relative group cursor-pointer"
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  style={{ minHeight: day.revenue > 0 ? "20px" : "4px" }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-foreground text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <div className="font-bold">${day.revenue.toFixed(2)}</div>
                    <div>{day.orders} orders</div>
                  </div>
                </motion.div>
                <span className="text-xs text-muted-foreground text-center truncate w-full">
                  {day.date.split(",")[0]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Best Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Best Selling Products</h3>
          
          <div className="space-y-3">
            {bestSelling.length > 0 ? (
              bestSelling.map((product, index) => (
                <div 
                  key={product.productId}
                  className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.quantity} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No sales data yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Low Stock Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="premium-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Low Stock Alerts</h3>
        </div>
        
        {lowStockProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((product) => (
              <div 
                key={product.id}
                className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <div className="p-2 rounded-lg bg-amber-100">
                  <Package className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-amber-600">
                    Only {product.stock} left in stock
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <span className="text-green-500">✓</span>
              All products have sufficient stock
            </p>
            <p className="text-sm mt-1">
              (Add stock values to products in the admin panel to see alerts)
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
