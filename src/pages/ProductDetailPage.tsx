import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, ShoppingCart, Truck,
  Plus, Minus, Headphones, 
  ChevronRight, ChevronLeft, Heart, Share2, 
  Star, RotateCcw, ShieldCheck, MessageSquare
} from "lucide-react";
import { PRODUCTS } from "../data";
import { ContactSection } from "../components/ContactSection";
import { fadeInUp, staggerContainer, fadeIn } from "../utils/animationUtils";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const product: any = PRODUCTS.find((p) => p.id.toString() === productId);

  useEffect(() => {
    if (product) {
       setSelectedImage(product.image);
       setQuantity(1);
       window.scrollTo(0, 0);
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
      `Hello! I'd like to order:\n\n*${product.name}*${offerInfo}\nPrice: ${product.price}\nQuantity: ${quantity}\n*Total: ${total} DH*`
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
    <motion.div 
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-m-bg transition-colors duration-300 min-h-screen mt-8"
    >
      <div className="px-[5%] mb-20 max-w-[1400px] mx-auto">
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
        >
          {/* LEFT: Image Gallery */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="aspect-square bg-m-border/10 rounded-[32px] p-10 flex items-center justify-center relative group overflow-hidden border border-m-border/50">
                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  key={selectedImage}
                  src={selectedImage} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain drop-shadow-2xl"
                />

                {product.badge && (
                  <div className="absolute top-6 left-6 bg-m-red text-white font-bold text-[12px] px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    {product.badge}
                  </div>
                )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide py-2">
                {product.images.map((img: string, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`min-w-[80px] h-[80px] rounded-[16px] border-2 transition-all p-2 bg-m-card ${selectedImage === img ? 'border-m-red bg-m-red/5 scale-105 shadow-md' : 'border-m-border opacity-70 hover:opacity-100 hover:border-m-ink-muted'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT: Product Information */}
          <motion.div variants={fadeInUp} className="flex flex-col">
            <div className="text-m-red text-[13px] font-bold uppercase tracking-widest mb-2">
              {product.category}
            </div>
            <h1 className="text-[36px] md:text-[48px] font-black text-m-ink leading-tight mb-6">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="text-[36px] font-black text-m-ink">{product.price}</div>
               {product.oldPrice && (
                 <div className="text-[20px] text-m-ink-muted line-through font-medium">{product.oldPrice}</div>
               )}
            </div>

            <p className="text-m-ink-muted text-[17px] leading-relaxed mb-10">
               {product.description || "Experience perfection in every detail. Built with premium materials to ensure high performance and lasting durability."}
            </p>

            <div className="space-y-8 mb-12">
               {/* Quantity & Actions */}
               <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="flex items-center border-2 border-m-border rounded-full p-1 bg-m-card h-[60px]">
                     <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-m-bg transition-colors"
                     >
                        <Minus className="h-4 w-4" />
                     </button>
                     <span className="w-12 text-center font-bold text-[20px]">{quantity}</span>
                     <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-m-bg transition-colors"
                     >
                        <Plus className="h-4 w-4" />
                     </button>
                  </div>

                  <div className="flex flex-1 w-full gap-4 h-[60px]">
                    <button 
                      onClick={handleBuyNow}
                      className="flex-[2] bg-m-red hover:bg-[#a11f24] text-white rounded-full font-black text-[16px] transition-all hover:scale-[1.02] shadow-xl shadow-m-red/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                      Buy Now
                    </button>
                    <button 
                      onClick={(e) => onAddToCart(product, e, quantity)}
                      className="flex-[1] border-2 border-m-ink rounded-full font-black text-[16px] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 hover:bg-m-ink hover:text-m-bg"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
               </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex items-center gap-4 p-5 border border-m-border rounded-[24px] bg-m-card">
                  <div className="w-12 h-12 rounded-full bg-m-red/10 flex items-center justify-center text-m-red flex-shrink-0">
                     <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold">Fast Delivery</div>
                    <div className="text-[13px] text-m-ink-muted">48h Delivery</div>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-5 border border-m-border rounded-[24px] bg-m-card">
                  <div className="w-12 h-12 rounded-full bg-m-red/10 flex items-center justify-center text-m-red flex-shrink-0">
                     <RotateCcw className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold">Easy Returns</div>
                    <div className="text-[13px] text-m-ink-muted">14 Days Return</div>
                  </div>
               </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Tabs Section */}
      <div className="px-[5%] py-24 bg-m-bg/50 border-y border-m-border">
          <div className="max-w-4xl mx-auto">
             <div className="flex justify-center gap-8 md:gap-16 border-b border-m-border mb-12">
                {['description', 'specs', 'reviews'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-5 font-bold text-[17px] transition-all relative capitalize ${activeTab === tab ? 'text-m-red' : 'text-m-ink-muted hover:text-m-ink'}`}
                  >
                    {tab}
                    {activeTab === tab && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 w-full h-1 bg-m-red rounded-full" />}
                  </button>
                ))}
             </div>

             <div className="min-h-[200px]">
                {activeTab === 'description' && (
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" className="text-m-ink-muted text-[17px] leading-relaxed">
                     <p className="mb-8">{product.description || "The product features sophisticated engineering and elegant design. Every component has been selected for both its performance and its contribution to the overall aesthetic."}</p>
                     <div className="flex flex-col gap-6">
                        <div className="flex gap-4 items-start">
                           <ShieldCheck className="h-5 w-5 text-m-red flex-shrink-0 mt-1" />
                           <p><span className="font-bold text-m-ink">Genuine Product</span> - All our stock comes directly from certified manufacturers.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                           <Headphones className="h-5 w-5 text-m-red flex-shrink-0 mt-1" />
                           <p><span className="font-bold text-m-ink">Technical Support</span> - Our experts are available every day to assist you.</p>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'specs' && (
                  <motion.div variants={fadeIn} initial="hidden" animate="visible">
                     {product.specs ? (
                        <div className="grid grid-cols-1 gap-1 border border-m-border rounded-3xl overflow-hidden bg-m-card shadow-sm">
                           {Object.entries(product.specs).map(([key, val]: any, i) => (
                             <div key={key} className={`flex justify-between items-center py-5 px-8 ${i % 2 === 0 ? 'bg-m-bg/50' : 'bg-transparent'}`}>
                                <span className="text-m-ink-muted font-bold text-[14px] uppercase tracking-wider">{key}</span>
                                <span className="font-bold text-m-ink">{val}</span>
                             </div>
                           ))}
                        </div>
                     ) : (
                        <div className="text-center py-12 text-m-ink-muted italic">Specs details coming soon.</div>
                     )}
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" className="flex flex-col items-center justify-center py-12 opacity-60">
                     <MessageSquare className="h-12 w-12 mb-4 text-m-ink-muted" />
                     <p className="font-bold text-m-ink">No reviews yet</p>
                     <p className="text-[14px]">Purchase this product to leave the first review.</p>
                  </motion.div>
                )}
             </div>
          </div>
      </div>

      {/* Similar Products */}
      {relatedProducts.length > 0 && (
        <div className="px-[5%] py-24 max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center mb-12">
               <h2 className="text-[32px] font-black text-m-ink">Discover More</h2>
               <div className="flex gap-3">
                  <button 
                  onClick={() => scrollSimilar('left')}
                  className="w-12 h-12 rounded-full border border-m-border flex items-center justify-center hover:bg-m-ink hover:text-white transition-all shadow-sm"
                  >
                     <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                  onClick={() => scrollSimilar('right')}
                  className="w-12 h-12 rounded-full border border-m-border flex items-center justify-center hover:bg-m-ink hover:text-white transition-all shadow-sm"
                  >
                     <ChevronRight className="h-6 w-6" />
                  </button>
               </div>
            </div>

            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide scroll-smooth px-1"
            >
               {relatedProducts.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => { window.location.href = `/product/${p.id}`; }}
                  className="min-w-[280px] md:min-w-[320px] group cursor-pointer"
                >
                   <div className="aspect-[4/5] bg-m-bg rounded-[32px] p-8 mb-6 relative overflow-hidden flex items-center justify-center border border-m-border group-hover:shadow-2xl transition-all duration-500">
                      <img src={p.image} alt={p.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-m-ink shadow-inner opacity-0 group-hover:opacity-10 transition-opacity" />
                   </div>
                   <div className="text-[13px] text-m-red font-bold uppercase tracking-widest mb-2">{p.category}</div>
                   <h3 className="font-bold text-[20px] text-m-ink mb-2 group-hover:text-m-red transition-colors line-clamp-1">{p.name}</h3>
                   <div className="font-black text-[22px] text-m-ink">{p.price}</div>
                </div>
              ))}
            </div>
        </div>
      )}

      <ContactSection />
    </motion.div>
  );
}
