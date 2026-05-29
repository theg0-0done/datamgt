import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onAddToCart: (product: any, e: React.MouseEvent, quantity: number) => void;
  onBuyNow: (product: any, e: React.MouseEvent) => void;
}

export function QuickAddModal({ isOpen, onClose, product, onAddToCart, onBuyNow }: QuickAddModalProps) {
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  // Initialize selected option when product changes or modal opens
  useEffect(() => {
    if (product) {
      if (product.options && product.options.length > 0) {
        setSelectedOption(product.options[0]);
      } else {
        setSelectedOption(null);
      }
      setQuantity(1);
    }
  }, [product, isOpen]);

  if (!product) return null;

  const currentOption = selectedOption || null;
  const currentPrice = currentOption ? currentOption.price : product.price;
  const currentOldPrice = currentOption ? currentOption.oldPrice : product.oldPrice;
  const currentImage = (currentOption && currentOption.image) ? currentOption.image : product.image;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    const targetProduct = currentOption ? {
      ...product,
      id: currentOption.id,
      name: `${product.name} (${currentOption.specValue})`,
      price: currentOption.price,
      image: currentOption.image || product.image
    } : product;

    onAddToCart(targetProduct, e, quantity);
    onClose();
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const targetProduct = currentOption ? {
      ...product,
      id: currentOption.id,
      name: product.name,
      price: currentOption.price,
      oldPrice: currentOption.oldPrice,
      badge: product.badge,
      image: currentOption.image || product.image,
      options: product.options
    } : product;

    onClose();
    onBuyNow(targetProduct, e);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg bg-m-card border border-m-border rounded-[24px] shadow-2xl overflow-hidden z-10 p-6 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-m-card-hover text-m-ink-muted hover:text-m-ink transition-colors animate-pulse-subtle"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Summary */}
            <div className="flex gap-4 items-start mb-6">
              <div className="w-24 h-24 rounded-[16px] bg-m-bg border border-m-border flex-shrink-0 overflow-hidden relative flex items-center justify-center">
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
                <h2 className="text-[20px] font-extrabold text-m-ink leading-tight truncate">
                  {product.name}
                </h2>
                <p className="text-[13px] text-m-ink-muted mt-1 mb-2 line-clamp-2">
                  {product.description || "Experience perfection in every detail. Built with premium materials to ensure high performance."}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[22px] font-black text-m-ink">
                    {currentPrice}
                  </span>
                  {currentOldPrice && (
                    <span className="text-[14px] text-m-ink-muted line-through">
                      {currentOldPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Specification Selection */}
            {product.options && product.options.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2">
                  Select Option
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.options.map((opt: any) => {
                    const isSelected = selectedOption?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOption(opt)}
                        className={`px-4 py-2 rounded-[14px] border-2 font-bold text-[13px] transition-all cursor-pointer ${
                          isSelected
                            ? "border-m-red bg-m-red/5 text-m-red scale-[1.03]"
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

            {/* Quantity Selector */}
            <div className="mb-8 bg-m-bg border border-m-border rounded-[20px] p-4 flex items-center justify-between">
              <div>
                <h3 className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted">
                  Quantity
                </h3>
                <p className="text-[11px] text-m-ink-muted mt-0.5">
                  Decide how many items you need
                </p>
              </div>
              <div className="flex items-center border border-m-border rounded-full p-1 bg-m-card h-[46px] w-[130px] justify-between">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-m-card-hover text-m-ink-muted hover:text-m-ink transition-colors cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-extrabold text-[16px] text-m-ink min-w-[20px] text-center select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-m-card-hover text-m-ink-muted hover:text-m-ink transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 h-[54px] rounded-full border-2 border-m-border font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-m-card-hover transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-m-ink" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 h-[54px] rounded-full bg-m-red hover:bg-m-red/90 text-white font-bold text-[15px] flex items-center justify-center shadow-lg shadow-m-red/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
