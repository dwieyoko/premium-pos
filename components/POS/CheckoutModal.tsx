"use client";

import { useState, useMemo } from "react";
import { CartItem, Customer, PaymentMethodType, PaymentMethod, AppliedDiscount } from "@/types";
import Modal from "@/components/ui/Modal";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CouponInput from "./CouponInput";
import CustomerInput from "./CustomerInput";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Receipt, 
  Printer,
  Check,
  ArrowRight,
  SplitSquareHorizontal,
  X,
  Banknote,
  CreditCard,
  Smartphone
} from "lucide-react";
import { calculateAllDiscounts, useCoupon, validateCoupon } from "@/lib/discountStore";
import { soundEffects } from "@/lib/sounds";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onCheckoutComplete: () => void;
}

type CheckoutStep = "details" | "payment" | "confirmation";

const paymentIcons = {
  cash: Banknote,
  card: CreditCard,
  wallet: Smartphone,
};

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  items, 
  onCheckoutComplete 
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("details");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [splitPayments, setSplitPayments] = useState<PaymentMethod[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate totals with discounts
  const { subtotal, discounts, totalDiscount, finalTotal } = useMemo(() => {
    return calculateAllDiscounts(items, couponCode);
  }, [items, couponCode]);
  
  const taxRate = 0.1;
  const tax = finalTotal * taxRate;
  const grandTotal = finalTotal + tax;
  
  // Check if payment is complete
  const totalPaid = isSplitPayment 
    ? splitPayments.reduce((sum, p) => sum + p.amount, 0)
    : paymentMethod ? grandTotal : 0;
  const remainingAmount = grandTotal - totalPaid;
  const isPaymentComplete = remainingAmount <= 0.01;
  
  const handleApplyCoupon = (code: string, discount: number) => {
    setCouponCode(code);
    setCouponDiscount(discount);
  };
  
  const handleRemoveCoupon = () => {
    setCouponCode(undefined);
    setCouponDiscount(0);
  };
  
  const handleAddSplitPayment = () => {
    if (!paymentMethod || remainingAmount <= 0) return;
    
    setSplitPayments([...splitPayments, {
      type: paymentMethod,
      amount: remainingAmount,
    }]);
    setPaymentMethod(null);
  };
  
  const handleRemoveSplitPayment = (index: number) => {
    setSplitPayments(splitPayments.filter((_, i) => i !== index));
  };
  
  const handleProceedToPayment = () => {
    setStep("payment");
  };
  
  const handleCompletePayment = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      // Mark coupon as used
      if (couponCode) {
        const validation = validateCoupon(couponCode, subtotal);
        if (validation.coupon) {
          useCoupon(validation.coupon.id);
        }
      }
      
      soundEffects.success();
      setStep("confirmation");
      setIsProcessing(false);
    }, 1000);
  };
  
  const handlePrintReceipt = () => {
    onCheckoutComplete();
    handleClose();
    
    // Trigger print
    setTimeout(() => window.print(), 100);
  };
  
  const handleClose = () => {
    setStep("details");
    setCustomer(null);
    setCouponCode(undefined);
    setCouponDiscount(0);
    setPaymentMethod(null);
    setIsSplitPayment(false);
    setSplitPayments([]);
    onClose();
  };
  
  const handleNewOrder = () => {
    onCheckoutComplete();
    handleClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" size="lg">
      <div className="relative">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          {[
            { key: "details", label: "Details", icon: ShoppingBag },
            { key: "payment", label: "Payment", icon: Receipt },
            { key: "confirmation", label: "Done", icon: Check },
          ].map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.key;
            const isPast = ["details", "payment", "confirmation"].indexOf(step) > i;
            
            return (
              <div key={s.key} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-primary text-white" 
                    : isPast 
                      ? "bg-green-100 text-green-700" 
                      : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 2 && (
                  <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
                )}
              </div>
            );
          })}
        </div>
        
        <AnimatePresence mode="wait">
          {/* Step 1: Details */}
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Customer */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Customer</h3>
                <CustomerInput 
                  selectedCustomer={customer}
                  onSelect={setCustomer}
                />
              </div>
              
              {/* Coupon */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Discount Code</h3>
                <CouponInput
                  subtotal={subtotal}
                  appliedCode={couponCode}
                  onApply={handleApplyCoupon}
                  onRemove={handleRemoveCoupon}
                />
              </div>
              
              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discounts.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm text-green-600">
                    <span>{d.name}</span>
                    <span>-${d.amount.toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="gradient-text">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <motion.button
                onClick={handleProceedToPayment}
                className="w-full btn-gradient py-4 rounded-xl font-bold text-lg"
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Payment
              </motion.button>
            </motion.div>
          )}
          
          {/* Step 2: Payment */}
          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              {/* Amount due */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-4xl font-bold gradient-text">${grandTotal.toFixed(2)}</p>
              </div>
              
              {/* Split payment toggle */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setIsSplitPayment(!isSplitPayment);
                    setSplitPayments([]);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    isSplitPayment 
                      ? "bg-primary text-white" 
                      : "border-2 border-primary/20 text-primary hover:bg-primary/5"
                  }`}
                >
                  <SplitSquareHorizontal className="h-4 w-4" />
                  Split Payment
                </button>
              </div>
              
              {/* Payment methods */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  {isSplitPayment ? "Add Payment Method" : "Select Payment Method"}
                </h3>
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              </div>
              
              {/* Split payments list */}
              {isSplitPayment && splitPayments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Payments Added</h4>
                  {splitPayments.map((payment, index) => {
                    const Icon = paymentIcons[payment.type];
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="capitalize font-medium">{payment.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">${payment.amount.toFixed(2)}</span>
                          <button 
                            onClick={() => handleRemoveSplitPayment(index)}
                            className="p-1 hover:bg-red-100 rounded-full text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className={remainingAmount > 0 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                      ${Math.max(0, remainingAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Add split payment button */}
              {isSplitPayment && paymentMethod && remainingAmount > 0 && (
                <motion.button
                  onClick={handleAddSplitPayment}
                  className="w-full py-3 border-2 border-primary/20 text-primary rounded-xl font-medium hover:bg-primary/5"
                  whileTap={{ scale: 0.98 }}
                >
                  Add ${remainingAmount.toFixed(2)} via {paymentMethod}
                </motion.button>
              )}
              
              {/* Complete payment button */}
              <motion.button
                onClick={handleCompletePayment}
                disabled={!isPaymentComplete && !(!isSplitPayment && paymentMethod) || isProcessing}
                className="w-full btn-gradient py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.98 }}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Complete Payment"
                )}
              </motion.button>
              
              <button
                onClick={() => setStep("details")}
                className="w-full py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Details
              </button>
            </motion.div>
          )}
          
          {/* Step 3: Confirmation */}
          {step === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 text-center space-y-6"
            >
              {/* Success animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Check className="h-6 w-6 text-white" />
                </motion.div>
              </motion.div>
              
              <div>
                <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
                <p className="text-muted-foreground mt-1">Transaction completed</p>
              </div>
              
              {/* Receipt preview */}
              <div className="bg-muted/30 rounded-xl p-4 text-left space-y-3 max-h-60 overflow-y-auto">
                <div className="text-center border-b pb-3">
                  <h3 className="font-bold">Premium POS</h3>
                  <p className="text-xs text-muted-foreground">Receipt</p>
                </div>
                
                {customer && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Customer: </span>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                )}
                
                <div className="space-y-1 text-sm border-b pb-3">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handlePrintReceipt}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-primary/20 text-primary rounded-xl font-medium hover:bg-primary/5"
                  whileTap={{ scale: 0.98 }}
                >
                  <Printer className="h-5 w-5" />
                  Print Receipt
                </motion.button>
                <motion.button
                  onClick={handleNewOrder}
                  className="flex-1 btn-gradient py-3 rounded-xl font-bold"
                  whileTap={{ scale: 0.98 }}
                >
                  New Order
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
