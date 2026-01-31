"use client";

import { useState, useEffect } from "react";
import { Customer } from "@/types";
import { User, Phone, Search, X, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecentCustomers, searchCustomers, getOrCreateCustomer } from "@/lib/customerStore";
import { useDebounce } from "@/hooks/useDebounce";

interface CustomerInputProps {
  onSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
}

export default function CustomerInput({ onSelect, selectedCustomer }: CustomerInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  useEffect(() => {
    setRecentCustomers(getRecentCustomers());
  }, [isOpen]);
  
  useEffect(() => {
    if (debouncedSearch.trim()) {
      setSearchResults(searchCustomers(debouncedSearch));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);
  
  const handleSelectCustomer = (customer: Customer) => {
    onSelect(customer);
    setIsOpen(false);
    setSearchQuery("");
  };
  
  const handleCreateCustomer = () => {
    if (!name.trim()) return;
    
    const customer = getOrCreateCustomer(name.trim(), phone.trim() || undefined);
    onSelect(customer);
    setIsOpen(false);
    setName("");
    setPhone("");
    setSearchQuery("");
  };
  
  const handleRemoveCustomer = () => {
    onSelect(null);
  };
  
  if (selectedCustomer) {
    return (
      <motion.div 
        className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{selectedCustomer.name}</p>
            {selectedCustomer.phone && (
              <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleRemoveCustomer}
          className="p-1.5 hover:bg-primary/10 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-primary" />
        </button>
      </motion.div>
    );
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-3 border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all text-primary"
      >
        <UserPlus className="h-4 w-4" />
        <span className="font-medium">Add Customer (Optional)</span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary/10 rounded-xl shadow-xl z-10 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Search existing */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            {/* Search results or recent */}
            <div className="max-h-40 overflow-y-auto">
              {(searchQuery ? searchResults : recentCustomers).length > 0 ? (
                <>
                  <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                    {searchQuery ? "Search Results" : "Recent Customers"}
                  </p>
                  {(searchQuery ? searchResults : recentCustomers).map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary/5 transition-colors text-left"
                    >
                      <div className="p-1.5 bg-primary/10 rounded-full">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{customer.name}</p>
                        {customer.phone && (
                          <p className="text-xs text-muted-foreground">{customer.phone}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </>
              ) : searchQuery ? (
                <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                  No customers found
                </p>
              ) : null}
            </div>
            
            {/* Create new */}
            <div className="p-3 border-t bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground mb-2">Or create new customer</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCreateCustomer}
                  disabled={!name.trim()}
                  className="w-full py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50 hover:opacity-90 transition-all text-sm"
                >
                  Add Customer
                </button>
              </div>
            </div>
            
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
