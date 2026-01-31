"use client";

import { Product } from "@/types";
import { useProducts } from "@/contexts/ProductContext";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const { products, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="font-medium">Loading products...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center premium-card rounded-2xl p-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Plus className="h-8 w-8 text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground">No products yet</p>
        <p className="text-sm text-muted-foreground mt-1">Add products using Quick Add or the Admin panel.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
              activeCategory === category
                ? "btn-gradient"
                : "bg-white border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="premium-card rounded-2xl overflow-hidden group"
            >
              {/* Image Container */}
              <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <span className="font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-foreground leading-tight">{product.name}</h3>
                  <span className={`inline-block mt-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    product.category === 'Beverages' ? 'badge-beverages' :
                    product.category === 'Bakery' ? 'badge-bakery' :
                    'badge-food'
                  }`}>
                    {product.category}
                  </span>
                </div>
                
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full flex items-center justify-center gap-2 btn-gradient py-3 rounded-xl font-medium group/btn"
                >
                  <Plus className="h-5 w-5 transition-transform group-hover/btn:rotate-90" />
                  <span>Add to Order</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
