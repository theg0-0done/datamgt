import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, ShoppingCart, Truck,
  Plus, Minus, Headphones, 
  ChevronRight, ChevronLeft, Heart, Share2
} from "lucide-react";
import { PRODUCTS } from "../data";
import { ContactSection } from "../components/ContactSection";

export function ProductDetailPage({
  productId,
  onBack,
  onAddToCart,
}: {
  productId: string;
  onBack: () => void;
  onAddToCart: (product: any, e: React.MouseEvent, quantity?: number) => void;
}) {
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const product: any = PRODUCTS.find((p) => p.id.toString() === productId);

  useEffect(() => {
    if (product) {
       setSelectedImage(product.image);
       if (product.colors && product.colors.length > 0) {
         setSelectedColor(product.colors[0]);
       }
       setQuantity(1);
       window.scrollTo(0,0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="px-[5%] mt-10 min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={onBack} className="text-m-red hover:underline font-bold flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to store
        </button>
      </div>
    );
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const priceValue = parseFloat(product.price.replace(/[^\d.]/g, ''));
    const total = (priceValue * quantity).toFixed(2);
    
    let offerInfo = "";
    if (product.oldPrice) {
      const oldPriceValue = parseFloat(product.oldPrice.replace(/[^\d.]/g, ''));
      const discountPercent = ((1 - (priceValue / oldPriceValue)) * 100).toFixed(0);
      offerInfo = `\nSpecial Offer: ${product.badge || 'Sale'} (${discountPercent}% OFF)`;
    }

    const text = encodeURIComponent(
      `Hello! I'd like to order:\n\n*${product.name}*${offerInfo}\nPrice: ${product.price}\nQuantity: ${quantity}\n*Total: $${total}*`
    );
    window.open(`https://wa.me/212762895481?text=${text}`, "_blank");
  };

  const scrollSimilar = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10);

  return (
    <div className="animation-fade-in bg-white dark:bg-m-bg transition-colors duration-300">
      {/* Breadcrumbs */}
      <div className="px-[5%] py-6 flex items-center gap-2 text-[13px] text-m-ink-muted border-b border-m-border mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button onClick={onBack} className="hover:text-m-ink">Home</button>
        <ChevronRight className="h-3 w-3" />
        <span className="cursor-default">Shop</span>
        <ChevronRight className="h-3 w-3" />
        <span className="cursor-default text-m-red font-medium">{product.category}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="cursor-default text-m-ink font-bold line-clamp-1">{product.name}</span>
      </div>

      <div className="px-[5%] mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT: Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-m-border/10 rounded-[32px] p-10 flex items-center justify-center relative group overflow-hidden border border-m-border/50">
                <img 
                  src={selectedImage || product.image} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                />

                {product.badge && (
                  <div className="absolute top-6 left-6 bg-m-red text-white font-bold text-[12px] px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    {product.badge}
                  </div>
                )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide py-4 px-1">
                {product.images.map((img: string, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`min-w-[80px] h-[80px] md:min-w-[100px] md:h-[100px] rounded-[16px] border-2 transition-all p-2 bg-m-card ${selectedImage === img ? 'border-m-ink shadow-md scale-105' : 'border-m-border opacity-60 hover:opacity-100 hover:border-m-ink-muted'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Information */}
          <div className="flex flex-col">
            <div className="text-m-red text-[13px] font-bold uppercase tracking-widest mb-2">
              {product.category}
            </div>
            <h1 className="text-[36px] md:text-[52px] font-black text-m-ink leading-[1.1] mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-m-border"/>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
               <div className="text-[32px] font-black text-m-red">{product.price}</div>
               {product.oldPrice && (
                 <div className="text-[20px] text-m-ink-muted line-through font-medium">{product.oldPrice}</div>
               )}
               {product.oldPrice && (
                 <div className="bg-m-green/10 text-m-green px-3 py-1 rounded-full text-[12px] font-bold">
                    -{(100 - (parseFloat(product.price.replace('$','')) / parseFloat(product.oldPrice.replace('$','')) * 100)).toFixed(0)}% OFF
                 </div>
               )}
            </div>

            {/* Description Short */}
            <p className="text-m-ink-muted text-[16px] leading-relaxed mb-8">
               {product.description || "Experience perfection in every detail. Designed to elevate your daily routine with premium materials and cutting-edge technology."}
            </p>

            {/* Options */}
            <div className="space-y-8 mb-10">
               {/* Quantity & Actions */}
               <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="flex items-center border-2 border-m-border rounded-full p-1 bg-white dark:bg-m-card h-[54px]">
                     <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-m-border/20 transition-colors"
                     >
                        <Minus className="h-4 w-4" />
                     </button>
                     <span className="w-12 text-center font-bold text-[18px]">{quantity}</span>
                     <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-m-border/20 transition-colors"
                     >
                        <Plus className="h-4 w-4" />
                     </button>
                  </div>

                  <div className="flex flex-1 w-full gap-3 h-[54px]">
                    <button 
                      onClick={handleBuyNow}
                      className="flex-[2] bg-m-red hover:bg-[#a11f24] text-white rounded-full font-bold text-[15px] transition-all hover:scale-[1.02] shadow-xl shadow-m-red/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      Buy Now
                    </button>
                    <button 
                      onClick={(e) => onAddToCart(product, e, quantity)}
                      className="flex-[1] border-2 border-m-ink rounded-full font-bold text-[15px] transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add
                    </button>
                  </div>
               </div>
            </div>

            {/* Benefits Mini Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex items-center gap-4 p-4 border border-m-border rounded-[20px] bg-m-card">
                  <div className="w-10 h-10 rounded-full bg-m-red/10 flex items-center justify-center text-m-red flex-shrink-0">
                     <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold">Free Delivery</div>
                    <div className="text-[12px] text-m-ink-muted">On all orders</div>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 border border-m-border rounded-[20px] bg-m-card">
                  <div className="w-10 h-10 rounded-full bg-m-red/10 flex items-center justify-center text-m-red flex-shrink-0">
                     <Headphones className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold">24/7 Support</div>
                    <div className="text-[12px] text-m-ink-muted">Every day 09:30-20:00</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="px-[5%] py-20 bg-m-bg/30 border-y border-m-border">
          <div className="max-w-6xl mx-auto">
             <div className="flex flex-wrap gap-8 md:gap-12 border-b border-m-border mb-10 overflow-x-auto scrollbar-hide">
                {['description', 'additional', 'reviews'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-bold text-[16px] md:text-[18px] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-m-red' : 'text-m-ink-muted hover:text-m-ink'}`}
                  >
                    {tab === 'description' ? 'Description' : tab === 'additional' ? 'Additional Information' : 'Reviews'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-m-red rounded-full" />}
                  </button>
                ))}
             </div>

             <div className="animation-fade-in bg-white dark:bg-m-card p-8 md:p-12 rounded-[32px] border border-m-border shadow-sm min-h-[300px]">
                {activeTab === 'description' && (
                  <div className="text-m-ink-muted text-[16px] md:text-[18px] leading-relaxed max-w-4xl">
                     <p className="mb-6">{product.description || "No description available for this product."}</p>
                     <ul className="space-y-4">
                        <li className="flex gap-3"><span className="text-m-red font-bold">✓</span> Premium quality materials and build.</li>
                        <li className="flex gap-3"><span className="text-m-red font-bold">✓</span> Advanced features tailored for modern users.</li>
                        <li className="flex gap-3"><span className="text-m-red font-bold">✓</span> Rigorously tested for performance and durability.</li>
                     </ul>
                  </div>
                )}

                {activeTab === 'additional' && (
                  <div>
                     {product.specs ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-0 gap-x-12 divide-y divide-m-border md:divide-none">
                           {Object.entries(product.specs).map(([key, val]: any, i) => (
                             <div key={key} className={`flex justify-between items-center py-4 border-b border-m-border group hover:bg-m-bg/50 px-4 transition-colors ${i % 2 === 0 ? '' : ''}`}>
                                <span className="text-m-ink-muted font-medium">{key}</span>
                                <span className="font-bold text-m-ink">{val}</span>
                             </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-m-ink-muted italic">No additional information available.</p>
                     )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="flex flex-col items-center justify-center py-10 opacity-60">
                     <div className="w-16 h-16 rounded-full bg-m-ink/10 flex items-center justify-center mb-4">
                        <MessageSquare className="h-8 w-8" />
                     </div>
                     <p className="text-m-ink font-bold">No reviews yet</p>
                     <p className="text-[14px]">Be the first to share your thoughts!</p>
                  </div>
                )}
             </div>
          </div>
      </div>

      {/* Similar Products (Related Posts) */}
      {relatedProducts.length > 0 && (
        <div className="px-[5%] py-24">
           <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-[32px] font-black text-m-ink">Similar Products</h2>
                <div className="w-20 h-1.5 bg-m-red rounded-full mt-2"></div>
              </div>

              {/* Scroll Controls */}
              <div className="flex gap-3">
                 <button 
                  onClick={() => scrollSimilar('left')}
                  className="w-12 h-12 rounded-full border-2 border-m-border flex items-center justify-center hover:bg-m-ink hover:text-white transition-all active:scale-95"
                 >
                    <ChevronLeft className="h-6 w-6" />
                 </button>
                 <button 
                  onClick={() => scrollSimilar('right')}
                  className="w-12 h-12 rounded-full border-2 border-m-border flex items-center justify-center hover:bg-m-ink hover:text-white transition-all active:scale-95"
                 >
                    <ChevronRight className="h-6 w-6" />
                 </button>
              </div>
           </div>

           <div 
             ref={scrollContainerRef}
             className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-1 scroll-smooth"
           >
              {relatedProducts.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => { window.location.href = `/product/${p.id}`; }}
                  className="w-[280px] group cursor-pointer"
                >
                   <div className="aspect-[4/5] bg-m-bg rounded-[24px] p-6 mb-4 relative overflow-hidden flex items-center justify-center border border-m-border hover:shadow-xl transition-all duration-300">
                      <img src={p.image} alt={p.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                      {p.badge && (
                        <div className="absolute top-4 left-4 bg-m-red text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                           {p.badge}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-m-ink/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                         <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-[12px] shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">View Details</span>
                      </div>
                   </div>
                   <div className="text-[12px] text-m-red font-bold uppercase tracking-wider mb-1">{p.category}</div>
                   <h3 className="font-bold text-[18px] text-m-ink mb-2 line-clamp-1 transition-colors">{p.name}</h3>
                   <div className="font-black text-[18px] text-m-ink">{p.price}</div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="border-t border-m-border">
         <ContactSection />
      </div>
    </div>
  );
}

// Internal Icon Fix
function MessageSquare({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
