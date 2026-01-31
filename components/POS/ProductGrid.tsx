"use client";

import { Product } from "@/types";
import { useProducts } from "@/contexts/ProductContext";
import { Plus, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounceWithLoading } from "@/hooks/useDebounce";
import { soundEffects } from "@/lib/sounds";
import NoProductsIllustration from "@/components/illustrations/NoProductsIllustration";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

// Highlight matching text in search results
function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-accent/30 text-foreground rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const { products, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Debounce search with loading state
  const { debouncedValue: debouncedSearch, isDebouncing } = useDebounceWithLoading(searchQuery, 300);
  
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    let filtered = activeCategory === "All" 
      ? products 
      : products.filter(p => p.category === activeCategory);
    
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [products, activeCategory, debouncedSearch]);

  const handleAddToCart = (product: Product) => {
    soundEffects.addToCart();
    onAddToCart(product);
  };

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
      <motion.div 
        className="flex flex-col items-center justify-center h-64 text-center premium-card rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <NoProductsIllustration className="w-40 h-40 mb-4" />
        <p className="text-lg font-semibold text-foreground">No products yet</p>
        <p className="text-sm text-muted-foreground mt-1">Add products using Quick Add or the Admin panel.</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
        {isDebouncing && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
        )}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
        />
      </div>
      
      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => {
              soundEffects.click();
              setActiveCategory(category);
            }}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
              activeCategory === category
                ? "btn-gradient"
                : "bg-white border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* No results state */}
      {filteredProducts.length === 0 && debouncedSearch && (
        <motion.div 
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-primary/50" />
          </div>
          <p className="text-lg font-semibold text-foreground">No results found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try searching for something else or clear the filter.
          </p>
        </motion.div>
      )}

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
                  <h3 className="font-bold text-lg text-foreground leading-tight">
                    <HighlightedText text={product.name} highlight={debouncedSearch} />
                  </h3>
                  <span className={`inline-block mt-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    product.category === 'Beverages' ? 'badge-beverages' :
                    product.category === 'Bakery' ? 'badge-bakery' :
                    'badge-food'
                  }`}>
                    <HighlightedText text={product.category} highlight={debouncedSearch} />
                  </span>
                </div>
                
                <motion.button
                  onClick={() => handleAddToCart(product)}
                  className="w-full flex items-center justify-center gap-2 btn-gradient py-3 rounded-xl font-medium group/btn"
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-5 w-5 transition-transform group-hover/btn:rotate-90" />
                  <span>Add to Order</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
