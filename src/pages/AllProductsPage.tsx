import React, { useRef } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "../data";
import { fadeInUp, staggerContainer, fadeIn } from "../utils/animationUtils";

export function AllProductsPage({
  categoryFilter,
  searchQuery: externalSearchQuery,
  currentPage,
  onCategoryChange,
  onPageChange,
  onProductClick,
  onAddToCart,
}: {
  categoryFilter: string;
  searchQuery: string;
  currentPage: number;
  onCategoryChange: (c: string) => void;
  onPageChange: (p: number) => void;
  onProductClick: (id: string) => void;
  onAddToCart: (product: any, e: React.MouseEvent) => void;
}) {
  const ITEMS_PER_PAGE = 40;
  const scrollRef = useRef<HTMLDivElement>(null);

  let filtered = [...PRODUCTS];
  if (categoryFilter !== "All") {
    filtered = filtered.filter((p) => p.category === categoryFilter);
  }
  if (externalSearchQuery) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(externalSearchQuery.toLowerCase())
    );
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const scrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleCategoryChange = (cat: string) => {
    onCategoryChange(cat);
    // Auto-scroll active category button into view
    setTimeout(() => {
      if (scrollRef.current) {
        const activeBtn = scrollRef.current.querySelector("[data-active='true']") as HTMLElement;
        if (activeBtn) {
          activeBtn.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
        }
      }
    }, 50);
  };

  const handleBuyNow = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();

    const priceValue = parseFloat(product.price.replace(/[^\d.]/g, ""));

    let offerInfo = "";
    if (product.oldPrice) {
      const oldPriceValue = parseFloat(product.oldPrice.replace(/[^\d.]/g, ""));
      const discountPercent = ((1 - priceValue / oldPriceValue) * 100).toFixed(0);
      offerInfo = `\nSpecial Offer: ${product.badge || "Sale"} (${discountPercent}% OFF)`;
    }

    const text = encodeURIComponent(
      `Hello! I'd like to order:\n\n*${product.name}*${offerInfo}\nPrice: ${product.price}\nQuantity: 1\n*Total: ${product.price}*`
    );
    window.open(`https://wa.me/212762895481?text=${text}`, "_blank");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="px-[5%] py-12 min-h-screen bg-m-bg"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Categories Navigation with Scroll Arrows */}
        <motion.div variants={fadeInUp} className="relative flex items-center gap-2 mb-4 lg:mb-8">
          {/* Left Arrow */}
          <button
            onClick={() => scrollBy(-240)}
            className="flex-shrink-0 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-m-card border-2 border-m-border text-m-ink hover:bg-m-ink hover:text-m-card transition-all shadow-sm active:scale-90"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Scrollable pill list */}
          <div
            ref={scrollRef}
            className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar scroll-smooth flex-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                data-active={categoryFilter === cat ? "true" : "false"}
                onClick={() => handleCategoryChange(cat)}
                className={`px-8 py-2.5 rounded-full font-bold text-[14px] transition-all whitespace-nowrap border-2 flex-shrink-0 ${
                  categoryFilter === cat
                    ? "bg-m-ink text-m-card border-m-ink shadow-lg shadow-m-ink/10"
                    : "bg-m-card text-m-ink-muted border-m-border hover:bg-m-bg hover:text-m-ink hover:border-m-ink/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollBy(240)}
            className="flex-shrink-0 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-m-card border-2 border-m-border text-m-ink hover:bg-m-ink hover:text-m-card transition-all shadow-sm active:scale-90"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Product Grid - Full Width */}
        <div className="w-full">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            key={categoryFilter + externalSearchQuery}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-12"
          >
            {currentProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                onClick={() => onProductClick(product.id.toString())}
                className="group bg-m-card border border-m-border rounded-[24px] overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square bg-m-bg relative overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-m-red text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Add to Cart Overlay */}
                  <div className="hidden lg:flex absolute inset-0 bg-m-ink/5 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center backdrop-blur-[2px]">
                    <button
                      onClick={(e) => onAddToCart(product, e)}
                      className="bg-white text-black p-4 rounded-full shadow-lg hover:bg-m-red hover:text-white transition-all transform hover:scale-110 active:scale-95"
                    >
                      <ShoppingCart className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="p-2 md:p-4 flex flex-col flex-grow">
                  <span className="text-[12px] text-m-ink-muted font-medium mb-1 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-[14px] md:text-[18px] text-m-ink leading-tight mb-2 group-hover:text-m-red transition-colors">
                    {product.name}
                  </h3>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-black text-[18px] md:text-[22px] text-m-red/80">
                        {product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-m-ink-muted text-[14px] line-through">
                          {product.oldPrice}
                        </span>
                      )}
                    </div>
                    <div className="w-full flex justify-center items-center gap-2">
                    <button
                      onClick={(e) => handleBuyNow(e, product)}
                      className="w-full bg-m-ink hover:bg-m-red text-m-card py-2 md:py-3 rounded-xl font-bold text-[13px] transition-all transform active:scale-95"
                    >
                      BUY NOW
                    </button>
                    <button
                      onClick={(e) => onAddToCart(product, e)}
                      className="lg:hidden bg-m-red text-white p-2 rounded-full shadow-lg hover:bg-m-red hover:text-white transition-all transform hover:scale-110 active:scale-95"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {currentProducts.length === 0 && (
            <motion.div
              variants={fadeIn}
              className="text-center py-24 bg-m-card border border-m-border rounded-[24px]"
            >
              <div className="bg-m-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-m-ink-muted" />
              </div>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-m-ink-muted">Try adjusting your filters or search query.</p>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              variants={fadeIn}
              className="flex justify-center items-center gap-2 mt-16 font-medium"
            >
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-m-border rounded-lg disabled:opacity-50 hover:bg-m-border transition-colors bg-m-card"
              >
                &lt; Prev
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPageChange(idx + 1)}
                    className={`w-10 h-10 rounded-lg transition-colors border ${
                      currentPage === idx + 1
                        ? "bg-m-ink text-m-card border-m-ink"
                        : "bg-m-card border-m-border hover:bg-m-border"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-m-border rounded-lg disabled:opacity-50 hover:bg-m-border transition-colors bg-m-card"
              >
                Next &gt;
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
