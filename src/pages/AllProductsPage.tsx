import React from "react";
import { ShoppingCart } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "../data";

export function AllProductsPage({
  categoryFilter,
  searchQuery,
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

  let filtered = [...PRODUCTS];
  if (categoryFilter !== 'All') {
    filtered = filtered.filter(p => p.category === categoryFilter);
  }
  if (searchQuery) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleBuyNow = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const imageUrl = window.location.origin + product.image;
    const text = encodeURIComponent(
      `Hello! I'm interested in buying:\n\n*${product.name}*\nPrice: ${product.price}\nImage ID: ${imageUrl}`
    );
    window.open(`https://wa.me/212762895481?text=${text}`, "_blank");
  };

  return (
    <div className="px-[5%] py-16 animation-fade-in">
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {CATEGORIES.map((cat) => (
                <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-6 py-2 rounded-full font-bold text-[14px] transition-all shadow-sm ${
                    categoryFilter === cat
                    ? "bg-m-ink text-m-card shadow-md scale-105"
                    : "bg-m-card text-m-ink border border-m-border hover:border-m-ink"
                }`}
                >
                {cat}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
             {currentProducts.map((product: any) => (
                <div
                    key={product.id}
                    onClick={() => onProductClick(product.id)}
                    className="group cursor-pointer flex flex-col bg-m-card rounded-[16px] border border-m-border overflow-hidden hover:shadow-xl transition-all duration-300 relative"
                >
                    {product.badge && (
                    <span className="absolute top-[15px] left-[15px] z-10 bg-m-red text-white px-[10px] py-[4px] rounded-full text-[10px] font-bold tracking-wider uppercase tracking-tight shadow-sm">
                        {product.badge}
                    </span>
                    )}
                    
                    <div className="relative h-[220px] bg-m-border/30 p-[20px] flex items-center justify-center overflow-hidden">
                        <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md mix-blend-multiply dark:mix-blend-normal"
                        />
                        
                        <div className="absolute inset-0 bg-m-ink/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button 
                            onClick={(e) => onAddToCart(product, e)}
                            className="bg-m-ink text-m-card rounded-full p-3 shadow-lg hover:bg-m-red hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </button>
                        </div>
                    </div>

                    <div className="p-[20px] flex flex-col flex-grow">
                    <div className="text-[12px] text-m-ink-muted font-medium mb-1 uppercase tracking-wider">
                        {product.category}
                    </div>
                    <h3 className="font-bold text-[16px] text-m-ink leading-[1.3] mb-2 group-hover:text-m-red transition-colors line-clamp-2">
                        {product.name}
                    </h3>

                    <div className="mt-auto">
                        <div className="flex items-end justify-between">
                        <div className="font-bold text-[20px] text-m-red">
                            {product.price}
                        </div>
                        {product.oldPrice && (
                            <div className="text-[12px] text-m-ink-muted line-through mb-1">
                            {product.oldPrice}
                            </div>
                        )}
                        </div>
                        
                        <button 
                         onClick={(e) => handleBuyNow(e, product)}
                         className="w-full mt-4 bg-m-ink hover:bg-m-red text-m-card py-2 rounded-lg font-bold text-[12px] transition-colors"
                        >
                        BUY NOW
                        </button>
                    </div>
                    </div>
                </div>
            ))}
        </div>

        {currentProducts.length === 0 ? (
            <div className="text-center py-20 text-m-ink-muted">
                <p className="text-[18px] font-medium">No products found for this category/search.</p>
            </div>
        ) : (
            totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16 font-medium">
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
                                className={`w-10 h-10 rounded-lg transition-colors border ${currentPage === idx + 1 ? 'bg-m-ink text-m-card border-m-ink' : 'bg-m-card border-m-border hover:bg-m-border'}`}
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
                </div>
            )
        )}
    </div>
  );
}
