import React from "react";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import { PRODUCTS } from "../data";

export function TopProducts({
  onProductClick,
  onAddToCart,
  searchQuery,
}: {
  onProductClick: (id: string) => void;
  onAddToCart: (product: any, e: React.MouseEvent) => void;
  searchQuery: string;
}) {
  // Limit to exactly 12 products for a clean 3x4 grid on desktop/tablet
  const displayedProducts = PRODUCTS.slice(0, 8);

  const handleBuyNow = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    
    const priceValue = parseFloat(product.price.replace(/[^\d.]/g, ''));
    
    let offerInfo = "";
    if (product.oldPrice) {
      const oldPriceValue = parseFloat(product.oldPrice.replace(/[^\d.]/g, ''));
      const discountPercent = ((1 - (priceValue / oldPriceValue)) * 100).toFixed(0);
      offerInfo = `\nSpecial Offer: ${product.badge || 'Sale'} (${discountPercent}% OFF)`;
    }

    const text = encodeURIComponent(
      `Hello! I'd like to order:\n\n*${product.name}*${offerInfo}\nPrice: ${product.price}\nQuantity: 1\n*Total: ${product.price}*`
    );
    window.open(`https://wa.me/212762895481?text=${text}`, "_blank");
  };

  return (
    <div id="products" className="px-[5%] mt-16 scroll-mt-[100px]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8">
        <div>
          <h2 className="text-[28px] md:text-[34px] font-bold text-m-ink leading-tight">
            Top Deals <span className="text-m-red">For You</span>
          </h2>
          <p className="text-m-ink-muted text-[14px] mt-2">
            Handpicked premium electronics at unbeatable prices.
          </p>
        </div>
        <a 
          href="/products"
          className="text-m-red font-bold flex items-center gap-2 hover:underline text-[14px]"
        >
          View All Products <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px]">
        {displayedProducts.map((product: any) => (
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
              <h3 className="font-bold text-[16px] text-m-ink leading-[1.3] mb-2 transition-colors line-clamp-2">
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
      
      {displayedProducts.length === 0 && (
         <div className="text-center py-20 text-m-ink-muted">
            <p className="text-[18px] font-medium">No products found matching your search.</p>
         </div>
      )}
    </div>
  );
}
