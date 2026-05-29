import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, ShoppingCart, Truck,
  Plus, Minus, Headphones, 
  ChevronRight, ChevronLeft, Heart, Share2, 
  Star, RotateCcw, ShieldCheck, MessageSquare,
  ShoppingBag
} from "lucide-react";
import { useProducts } from "../context/ProductsContext";
import { ContactSection } from "../components/ContactSection";
import { fadeInUp, staggerContainer, fadeIn } from "../utils/animationUtils";

export function ProductDetailPage({
  productId,
  onBack,
  onAddToCart,
  onBuyNow,
}: {
  productId: string;
  onBack: () => void;
  onAddToCart: (product: any, e: React.MouseEvent, quantity?: number) => void;
  onBuyNow: (product: any, e: React.MouseEvent) => void;
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageError, setImageError] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { products, loading } = useProducts();
  const product: any = products.find((p) => p.id.toString() === productId || (p.options && p.options.some((o: any) => o.id.toString() === productId)));

  const [selectedOption, setSelectedOption] = useState<any>(null);

  useEffect(() => {
    if (product) {
       let defaultOpt = null;
       if (product.options && product.options.length > 0) {
         defaultOpt = product.options.find((o: any) => o.id.toString() === productId) || product.options[0];
       }
        setSelectedOption(defaultOpt);
        setSelectedImage(defaultOpt ? defaultOpt.image : product.image);
        setImageError(false);
        window.scrollTo(0, 0);
    }
  }, [product, productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-m-red"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mt-10 min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={onBack} className="text-m-red hover:underline font-bold flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to store
        </button>
      </div>
    );
  }

  const currentPrice = selectedOption ? selectedOption.price : product.price;
  const currentOldPrice = selectedOption ? selectedOption.oldPrice : product.oldPrice;
  const currentImages = selectedOption ? selectedOption.images : product.images;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const targetProduct = selectedOption ? {
      ...product,
      id: selectedOption.id,
      name: product.name,
      price: selectedOption.price,
      oldPrice: selectedOption.oldPrice,
      badge: product.badge,
      image: selectedOption.image || product.image,
      options: product.options
    } : product;

    onBuyNow(targetProduct, e);
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

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-m-bg transition-colors duration-300 min-h-screen mt-8 px-[5%]"
    >
      <div className="mb-20  mx-auto">
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
        >
          {/* LEFT: Image Gallery */}
          <motion.div variants={fadeInUp} className="space-y-6 flex items-center justify-center w-full">
            <div className={`aspect-square w-[90%] ${(!selectedImage || imageError) ? "bg-gradient-to-br from-m-card to-m-bg" : "bg-white"} rounded-[32px] p-4 flex items-center justify-center relative group overflow-hidden border border-m-border/50`}>
              {(!selectedImage || imageError) ? (
                <div className="flex flex-col items-center justify-center p-10 text-center select-none bg-gradient-to-br from-m-card to-m-bg w-full h-full rounded-[24px]">
                  <div className="w-16 h-16 rounded-3xl bg-m-border/40 flex items-center justify-center mb-4 text-m-ink-muted">
                    <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                  </div>
                  <span className="text-[14px] font-bold text-m-ink-muted uppercase tracking-wider">
                    No Image Available
                  </span>
                </div>
              ) : (
                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  key={selectedImage}
                  src={selectedImage} 
                  alt={product.name} 
                  onError={() => setImageError(true)}
                  className="w-[80%] h-auto object-contain"
                />
              )}

              {product.badge && (
                <div className="absolute top-6 left-6 bg-m-red text-white font-bold text-[12px] px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {currentImages && currentImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide py-2">
                {currentImages.map((img: string, i: number) => (
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
               <div className="text-[36px] font-black text-m-ink">{currentPrice}</div>
               {currentOldPrice && (
                 <div className="text-[20px] text-m-ink-muted line-through font-medium">{currentOldPrice}</div>
               )}
            </div>

            <p className="text-m-ink-muted text-[17px] leading-relaxed mb-10">
               {product.description || "Experience perfection in every detail. Built with premium materials to ensure high performance and lasting durability."}
            </p>

            <div className="space-y-8 mb-12">
               {/* Options Selector */}
               {product.options && product.options.length > 1 && (
                 <div className="mb-4">
                   <h3 className="text-[13px] font-black uppercase tracking-wider text-m-ink-muted mb-3">
                     Select Specification
                   </h3>
                   <div className="flex flex-wrap gap-2.5">
                     {product.options.map((opt: any) => {
                       const isSelected = selectedOption?.id === opt.id;
                       return (
                         <button
                           key={opt.id}
                           onClick={() => {
                             setSelectedOption(opt);
                             if (opt.image) {
                               setSelectedImage(opt.image);
                               setImageError(false);
                             }
                           }}
                           className={`px-5 py-3 rounded-[16px] border-2 font-bold text-[14px] transition-all cursor-pointer ${
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

               {/* Actions */}
               <div className="flex flex-col sm:flex-row gap-4 w-full">
                 <button 
                   onClick={handleBuyNow}
                   className="flex-1 h-[60px] bg-m-red hover:bg-m-red/90 text-white rounded-full font-black text-[16px] transition-all hover:scale-[1.02] shadow-xl shadow-m-red/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer"
                 >
                   <ShoppingBag className="h-5 w-5" />
                   <span>Buy Now</span>
                 </button>
                 <button 
                   onClick={(e) => onAddToCart(product, e)}
                   className="flex-1 h-[60px] border-2 border-m-ink text-m-ink hover:bg-m-ink hover:text-m-card rounded-full font-black text-[16px] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                 >
                   <ShoppingCart className="h-5 w-5" />
                   <span>Add to Cart</span>
                 </button>
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
      <div className="py-24 bg-m-bg/50 border-y border-m-border">
          <div className="max-w-4xl">
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
        <div className="py-24">
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
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-[280px] group cursor-pointer"
                >
                   <div className="aspect-[3/4] bg-white rounded-[32px] mb-6 relative overflow-hidden flex items-center justify-center border border-m-border group-hover:shadow-2xl transition-all duration-500">
                      <img src={p.image} alt={p.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-m-ink shadow-inner opacity-0 group-hover:opacity-10 transition-opacity" />
                      <div className="absolute top-4 right-4 bg-m-red/20 rounded-full px-3 py-1 text-[13px] text-m-red font-bold uppercase tracking-widest mb-2">{p.category}</div>
                   </div>
                   <h3 className="font-bold text-[20px] text-m-ink mb-2 transition-colors line-clamp-1">{p.name}</h3>
                   <div className="font-black text-[22px] text-m-red">{p.price}</div>
                </div>
              ))}
            </div>
        </div>
      )}

      <ContactSection />
    </motion.div>
  );
}
