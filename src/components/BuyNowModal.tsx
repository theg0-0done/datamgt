import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Package,
  MapPin,
  CheckCircle,
  Loader2,
  ShoppingBag,
  User,
  Phone,
  Mail,
  Home,
  Building,
  Hash,
  FileText,
  Truck,
} from "lucide-react";
import {
  sendOrderConfirmationEmail,
  generateOrderId,
  getEstimatedDeliveryDate,
  type OrderItem,
  type ShippingInfo,
} from "../utils/emailService";

interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  /** If provided, these are cart items to order (for cart checkout) */
  cartItems?: any[];
  onOrderComplete?: () => void;
}

type Step = "config" | "shipping" | "success";

export function BuyNowModal({
  isOpen,
  onClose,
  product,
  cartItems,
  onOrderComplete,
}: BuyNowModalProps) {
  const [step, setStep] = useState<Step>("config");
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  // Shipping form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [notes, setNotes] = useState("");

  // Determine if we're in cart checkout mode
  const isCartMode = !!(cartItems && cartItems.length > 0);

  // Reset state when modal opens or product changes
  useEffect(() => {
    if (isOpen) {
      if (isCartMode) {
        // Skip config step for cart — go straight to shipping
        setStep("shipping");
      } else {
        setStep("config");
      }
      setSelectedOption(
        product?.options?.length > 0 ? product.options[0] : null,
      );
      setQuantity(1);
      setSending(false);
      setErrorMsg("");
      setOrderId("");
      setDeliveryDate("");
    }
  }, [isOpen, product, isCartMode]);

  if (!isOpen) return null;
  if (!product && !isCartMode) return null;

  // Current product details
  const currentOption = selectedOption || null;
  const currentPrice = currentOption
    ? currentOption.price
    : product?.price || "0.00 MAD";
  const currentOldPrice = currentOption
    ? currentOption.oldPrice
    : product?.oldPrice;
  const currentImage =
    currentOption && currentOption.image
      ? currentOption.image
      : product?.image || "";

  // Calculate price number
  const priceNum = parseFloat(currentPrice.replace(/[^\d.]/g, "")) || 0;
  const totalPrice = isCartMode
    ? cartItems!
        .reduce((sum, item) => {
          const p = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
          return sum + p * item.quantity;
        }, 0)
        .toFixed(2)
    : (priceNum * quantity).toFixed(2);

  // Build order items
  const getOrderItems = (): OrderItem[] => {
    if (isCartMode) {
      return cartItems!.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));
    }
    const targetProduct = currentOption
      ? {
          name: `${product.name} (${currentOption.specValue})`,
          price: currentOption.price,
        }
      : { name: product.name, price: product.price };
    return [
      {
        name: targetProduct.name,
        price: targetProduct.price,
        quantity,
        image: currentImage,
      },
    ];
  };

  const handleContinue = () => {
    setStep("shipping");
  };

  const validateShipping = (): boolean => {
    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address");
      return false;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter your phone number");
      return false;
    }
    if (!address.trim()) {
      setErrorMsg("Please enter your address");
      return false;
    }
    if (!city.trim()) {
      setErrorMsg("Please enter your city");
      return false;
    }
    return true;
  };

  const handleMakeOrder = async () => {
    setErrorMsg("");
    if (!validateShipping()) return;

    setSending(true);
    try {
      const newOrderId = generateOrderId();
      const newDeliveryDate = getEstimatedDeliveryDate();
      const items = getOrderItems();
      const shipping: ShippingInfo = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        zipCode: zipCode.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      await sendOrderConfirmationEmail({
        orderId: newOrderId,
        items,
        totalPrice,
        shipping,
        deliveryDate: newDeliveryDate,
      });

      setOrderId(newOrderId);
      setDeliveryDate(newDeliveryDate);
      setStep("success");
      onOrderComplete?.();
    } catch (err: any) {
      console.error("Order email error:", err);
      setErrorMsg(
        err?.message || "Failed to send confirmation email. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    // Reset form fields on close
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
    setZipCode("");
    setNotes("");
    onClose();
  };

  // Step indicator
  const steps = isCartMode
    ? [
        { key: "shipping", label: "Shipping", icon: MapPin },
        { key: "success", label: "Done", icon: CheckCircle },
      ]
    : [
        { key: "config", label: "Product", icon: Package },
        { key: "shipping", label: "Shipping", icon: MapPin },
        { key: "success", label: "Done", icon: CheckCircle },
      ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 md:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step !== "success" ? handleClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            className="relative w-full max-w-[520px] max-h-[92vh] bg-m-card border border-m-border rounded-[28px] shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                {step === "shipping" && !isCartMode && (
                  <button
                    onClick={() => setStep("config")}
                    className="p-1.5 rounded-full hover:bg-m-bg transition-colors text-m-ink-muted hover:text-m-ink"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-[20px] font-black text-m-ink">
                  {step === "config" && "Choose Options"}
                  {step === "shipping" && "Shipping Details"}
                  {step === "success" && "Order Confirmed!"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-m-bg text-m-ink-muted hover:text-m-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-1">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = i === currentStepIndex;
                  const isDone = i < currentStepIndex;
                  return (
                    <React.Fragment key={s.key}>
                      {i > 0 && (
                        <div
                          className={`flex-1 h-[2px] rounded-full transition-colors duration-500 ${isDone ? "bg-m-red" : "bg-m-border"}`}
                        />
                      )}
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all duration-300 ${
                          isActive
                            ? "bg-m-red/10 text-m-red"
                            : isDone
                              ? "bg-m-red/5 text-m-red/70"
                              : "text-m-ink-muted"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{s.label}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <AnimatePresence mode="wait">
                {/* STEP 1: Product Config */}
                {step === "config" && product && (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    {/* Product Summary */}
                    <div className="flex gap-4 items-start p-4 bg-m-bg/60 border border-m-border rounded-[20px]">
                      <div className="w-20 h-20 rounded-[14px] bg-white border border-m-border flex-shrink-0 overflow-hidden flex items-center justify-center p-1.5">
                        <img
                          src={currentImage}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        {product.badge && (
                          <span className="inline-block text-[10px] uppercase font-black tracking-widest bg-m-red/10 text-m-red px-2 py-0.5 rounded-full mb-1">
                            {product.badge}
                          </span>
                        )}
                        <h3 className="text-[17px] font-extrabold text-m-ink leading-tight truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-[22px] font-black text-m-red">
                            {currentPrice}
                          </span>
                          {currentOldPrice && (
                            <span className="text-[13px] text-m-ink-muted line-through">
                              {currentOldPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Options Selector */}
                    {product.options && product.options.length > 0 && (
                      <div>
                        <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2.5 block">
                          Select Option
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.options.map((opt: any) => {
                            const isSelected = selectedOption?.id === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => setSelectedOption(opt)}
                                className={`px-4 py-2.5 rounded-[14px] border-2 font-bold text-[13px] transition-all cursor-pointer ${
                                  isSelected
                                    ? "border-m-red bg-m-red/5 text-m-red scale-[1.03] shadow-sm"
                                    : "border-m-border hover:border-m-ink-muted bg-m-card text-m-ink"
                                }`}
                              >
                                {opt.specValue}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quantity */}
                    <div className="bg-m-bg/60 border border-m-border rounded-[18px] p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted">
                          Quantity
                        </h4>
                        <p className="text-[11px] text-m-ink-muted mt-0.5">
                          How many items do you need?
                        </p>
                      </div>
                      <div className="flex items-center border border-m-border rounded-full p-1 bg-m-card h-[44px] w-[124px] justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(Math.max(1, quantity - 1))
                          }
                          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-m-bg text-m-ink-muted hover:text-m-ink transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-extrabold text-[16px] text-m-ink min-w-[20px] text-center select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-m-bg text-m-ink-muted hover:text-m-ink transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between p-4 bg-m-red/5 border border-m-red/20 rounded-[18px]">
                      <span className="text-[14px] font-bold text-m-ink">
                        Total
                      </span>
                      <span className="text-[24px] font-black text-m-red">
                        {totalPrice} MAD
                      </span>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={handleContinue}
                      className="w-full h-[54px] rounded-full bg-m-ink hover:bg-m-red text-m-card font-black text-[15px] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: Shipping Details */}
                {step === "shipping" && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* Cart summary (if cart mode) */}
                    {isCartMode && (
                      <div className="p-4 bg-m-bg/60 border border-m-border rounded-[18px] mb-2">
                        <h4 className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-3">
                          Order Summary
                        </h4>
                        <div className="space-y-2 max-h-[120px] overflow-y-auto">
                          {cartItems!.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 text-[13px]"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white border border-m-border flex items-center justify-center p-0.5 flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <span className="flex-1 font-medium text-m-ink truncate">
                                {item.name}
                              </span>
                              <span className="text-m-ink-muted">
                                ×{item.quantity}
                              </span>
                              <span className="font-bold text-m-ink">
                                {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-m-border">
                          <span className="text-[13px] font-bold text-m-ink">
                            Total
                          </span>
                          <span className="text-[18px] font-black text-m-red">
                            {totalPrice} MAD
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Single product summary (if NOT cart mode) */}
                    {!isCartMode && product && (
                      <div className="flex items-center gap-3 p-3 bg-m-bg/60 border border-m-border rounded-[16px]">
                        <div className="w-12 h-12 rounded-lg bg-white border border-m-border flex items-center justify-center p-1 flex-shrink-0">
                          <img
                            src={currentImage}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-m-ink truncate">
                            {currentOption
                              ? `${product.name} (${currentOption.specValue})`
                              : product.name}
                          </p>
                          <p className="text-[12px] text-m-ink-muted">
                            Qty: {quantity} · Total:{" "}
                            <span className="font-bold text-m-red">
                              {totalPrice} MAD
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-3">
                      {/* Full Name */}
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-m-ink-muted" />
                        <input
                          type="text"
                          placeholder="Full Name *"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-[50px] pl-11 pr-4 rounded-[14px] border-2 border-m-border bg-m-bg/40 text-m-ink text-[14px] font-medium placeholder:text-m-ink-muted/50 focus:outline-none focus:border-m-red/50 focus:bg-m-card transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-m-ink-muted" />
                        <input
                          type="email"
                          placeholder="Email Address *"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-[50px] pl-11 pr-4 rounded-[14px] border-2 border-m-border bg-m-bg/40 text-m-ink text-[14px] font-medium placeholder:text-m-ink-muted/50 focus:outline-none focus:border-m-red/50 focus:bg-m-card transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-m-ink-muted" />
                        <input
                          type="tel"
                          placeholder="Phone Number *"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full h-[50px] pl-11 pr-4 rounded-[14px] border-2 border-m-border bg-m-bg/40 text-m-ink text-[14px] font-medium placeholder:text-m-ink-muted/50 focus:outline-none focus:border-m-red/50 focus:bg-m-card transition-all"
                        />
                      </div>

                      {/* Address */}
                      <div className="relative">
                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-m-ink-muted" />
                        <input
                          type="text"
                          placeholder="Street Address *"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full h-[50px] pl-11 pr-4 rounded-[14px] border-2 border-m-border bg-m-bg/40 text-m-ink text-[14px] font-medium placeholder:text-m-ink-muted/50 focus:outline-none focus:border-m-red/50 focus:bg-m-card transition-all"
                        />
                      </div>

                      {/* City + Zip */}
                      <div className="flex gap-3">
                        <div className="relative flex-[2]">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-m-ink-muted" />
                          <input
                            type="text"
                            placeholder="City *"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full h-[50px] pl-11 pr-4 rounded-[14px] border-2 border-m-border bg-m-bg/40 text-m-ink text-[14px] font-medium placeholder:text-m-ink-muted/50 focus:outline-none focus:border-m-red/50 focus:bg-m-card transition-all"
                          />
                        </div>
                        <div className="relative flex-[1]">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-m-ink-muted" />
                          <input
                            type="text"
                            placeholder="Zip"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="w-full h-[50px] pl-11 pr-4 rounded-[14px] border-2 border-m-border bg-m-bg/40 text-m-ink text-[14px] font-medium placeholder:text-m-ink-muted/50 focus:outline-none focus:border-m-red/50 focus:bg-m-card transition-all"
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 w-4 h-4 text-m-ink-muted" />
                        <textarea
                          placeholder="Order Notes (optional)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={2}
                          className="w-full pl-11 pr-4 py-3 rounded-[14px] border-2 border-m-border bg-m-bg/40 text-m-ink text-[14px] font-medium placeholder:text-m-ink-muted/50 focus:outline-none focus:border-m-red/50 focus:bg-m-card transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Delivery info */}
                    <div className="flex items-center gap-3 p-3 bg-m-green/5 border border-m-green/20 rounded-[14px]">
                      <Truck className="w-5 h-5 text-m-green flex-shrink-0" />
                      <p className="text-[12px] text-m-ink-muted">
                        Estimated delivery:{" "}
                        <span className="font-bold text-m-ink">3 days</span>{" "}
                        after order confirmation
                      </p>
                    </div>

                    {/* Error */}
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-m-red/10 border border-m-red/20 rounded-[14px] text-[13px] text-m-red font-medium text-center"
                      >
                        {errorMsg}
                      </motion.div>
                    )}

                    {/* Make Order Button */}
                    <button
                      onClick={handleMakeOrder}
                      disabled={sending}
                      className="w-full h-[54px] rounded-full bg-m-red hover:bg-[#a11f24] disabled:opacity-60 disabled:hover:bg-m-red text-white font-black text-[15px] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-m-red/25"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          Make Order
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {/* STEP 3: Success */}
                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="text-center py-4 space-y-5"
                  >
                    {/* Animated checkmark */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        duration: 0.6,
                        delay: 0.15,
                      }}
                      className="w-20 h-20 rounded-full bg-m-green/10 flex items-center justify-center mx-auto"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          duration: 0.5,
                          delay: 0.3,
                        }}
                      >
                        <CheckCircle className="w-10 h-10 text-m-green" />
                      </motion.div>
                    </motion.div>

                    <div>
                      <h3 className="text-[22px] font-black text-m-ink mb-1">
                        Order Placed!
                      </h3>
                      <p className="text-[14px] text-m-ink-muted">
                        A confirmation email has been sent to{" "}
                        <span className="font-bold text-m-ink">{email}</span>
                      </p>
                    </div>

                    {/* Order details card */}
                    <div className="bg-m-bg/60 border border-m-border rounded-[20px] p-5 text-left space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted">
                          Order ID
                        </span>
                        <span className="text-[14px] font-bold text-m-ink bg-m-card border border-m-border px-3 py-1 rounded-full">
                          {orderId}
                        </span>
                      </div>
                      <div className="h-[1px] bg-m-border" />
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted">
                          Total Paid
                        </span>
                        <span className="text-[18px] font-black text-m-red">
                          {totalPrice} MAD
                        </span>
                      </div>
                      <div className="h-[1px] bg-m-border" />
                      <div>
                        <span className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted block mb-1.5">
                          Estimated Delivery
                        </span>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-m-green" />
                          <span className="text-[14px] font-bold text-m-ink">
                            {deliveryDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleClose}
                      className="w-full h-[50px] rounded-full border-2 border-m-border font-bold text-[14px] text-m-ink hover:bg-m-bg transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
