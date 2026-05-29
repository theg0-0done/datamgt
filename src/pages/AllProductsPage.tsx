import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Search, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useProducts } from "../context/ProductsContext";
import { fadeInUp, staggerContainer, fadeIn } from "../utils/animationUtils";

function ProductImage({ src, alt, children }: { src?: string; alt: string; children?: React.ReactNode }) {
  const [error, setError] = useState(false);
  const isUnavailable = !src || error;

  return (
    <div className={`aspect-square ${isUnavailable ? "" : "p-2"} bg-white relative overflow-hidden flex items-center justify-center`}>
      {isUnavailable ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-m-card to-m-bg">
          <div className="w-12 h-12 rounded-2xl bg-m-border/40 flex items-center justify-center mb-2 text-m-ink-muted">
            <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
          </div>
          <span className="text-[11px] font-bold text-m-ink-muted uppercase tracking-wider">
            No Image Available
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      )}
      {children}
    </div>
  );
}


export function AllProductsPage({
  categoryFilter,
  searchQuery: externalSearchQuery,
  currentPage,
  onCategoryChange,
  onPageChange,
  onProductClick,
  onAddToCart,
  onBuyNow,
  onSearchChange,
}: {
  categoryFilter: string;
  searchQuery: string;
  currentPage: number;
  onCategoryChange: (c: string) => void;
  onPageChange: (p: number) => void;
  onProductClick: (id: string) => void;
  onAddToCart: (product: any, e: React.MouseEvent) => void;
  onBuyNow: (product: any, e: React.MouseEvent) => void;
  onSearchChange: (q: string) => void;
}) {
  const { products, categories, loading } = useProducts();
  const ITEMS_PER_PAGE = 40;
  const scrollRef = useRef<HTMLDivElement>(null);

  let filtered = [...products];
  if (categoryFilter !== "All") {
    filtered = filtered.filter((p) => p.category === categoryFilter);
  }
  if (externalSearchQuery) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(externalSearchQuery.toLowerCase()),
    );
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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
        const activeBtn = scrollRef.current.querySelector(
          "[data-active='true']",
        ) as HTMLElement;
        if (activeBtn) {
          activeBtn.scrollIntoView({
            inline: "center",
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }, 50);
  };

  const handleBuyNow = (e: React.MouseEvent, product: any) => {
    onBuyNow(product, e);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="px-[5%] py-12 min-h-screen bg-m-bg"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Search Panel */}
        <motion.div
          variants={fadeInUp}
          className="max-w-md mx-auto mb-8 md:mb-12"
        >
          <div className="relative flex items-center bg-m-card border-2 border-m-border rounded-full px-5 py-3 shadow-sm hover:border-m-ink/30 focus-within:border-m-ink/50 focus-within:ring-2 focus-within:ring-m-red/10 transition-all">
            <Search className="h-5 w-5 text-m-ink-muted mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={externalSearchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none text-[15px] font-medium w-full placeholder:text-m-ink-muted/70 text-m-ink"
            />
          </div>
        </motion.div>

        {/* Categories Navigation with Scroll Arrows */}
        <motion.div
          variants={fadeInUp}
          className="relative flex items-center gap-2 mb-4 lg:mb-8"
        >
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
            {categories
              .filter((cat) => typeof cat === "string" && cat.trim() !== "" && /[a-zA-Z\u00C0-\u017F]/.test(cat))
              .map((cat) => (
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
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-12 w-full">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="border border-m-border rounded-[24px] overflow-hidden flex flex-col h-full bg-m-card animate-pulse"
                >
                  <div className="aspect-square bg-m-border/10 w-full" />
                  <div className="p-4 flex flex-col flex-grow gap-3">
                    <div className="h-3 bg-m-border/10 rounded w-1/4" />
                    <div className="h-5 bg-m-border/10 rounded w-3/4" />
                    <div className="h-4 bg-m-border/10 rounded w-1/2 mt-1" />
                    <div className="mt-auto pt-4 flex flex-col gap-3">
                      <div className="h-6 bg-m-border/10 rounded w-1/3" />
                      <div className="h-10 bg-m-border/10 rounded w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
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
                    className="group border border-m-border rounded-[24px] overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300"
                  >
                    <ProductImage src={product.image} alt={product.name}>
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
                    </ProductImage>

                    <div className="p-2 md:p-4 flex flex-col flex-grow">
                      <span className="text-[12px] text-m-ink-muted font-medium mb-1 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-[14px] md:text-[18px] text-m-ink leading-tight mb-2 transition-colors">
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
                  <p className="text-m-ink-muted">
                    Try adjusting your filters or search query.
                  </p>
                </motion.div>
              )}
            </>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <motion.div
              variants={fadeIn}
              className="flex justify-center items-center gap-2 mt-16 font-medium"
            >
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex justify-center items-center border border-m-border rounded-full disabled:opacity-50 hover:bg-m-border transition-colors bg-m-card"
              >
                <ChevronLeft />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPageChange(idx + 1)}
                    className={`w-10 h-10 rounded-full transition-colors border ${
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
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex justify-center items-center border border-m-border rounded-full disabled:opacity-50 hover:bg-m-border transition-colors bg-m-card"
              >
                <ChevronRight />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
