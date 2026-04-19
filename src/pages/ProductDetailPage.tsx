import React, { useState } from "react";
import { ArrowLeft, Star, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { PRODUCTS } from "../data";

export function ProductDetailPage({
  productId,
  onBack,
  onAddToCart,
}: {
  productId: string;
  onBack: () => void;
  onAddToCart: (product: any, e: React.MouseEvent) => void;
}) {
  const [activeTab, setActiveTab] = useState('description');
  const product: any = PRODUCTS.find((p) => p.id.toString() === productId);

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
    const imageUrl = window.location.origin + product.image;
    const text = encodeURIComponent(
      `Hello! I'm interested in buying:\n\n*${product.name}*\nPrice: ${product.price}\nImage ID: ${imageUrl}`
    );
    window.open(`https://wa.me/212762895481?text=${text}`, "_blank");
  };

  return (
    <div className="px-[5%] py-10 animation-fade-in">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-m-ink-muted hover:text-m-red font-bold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to catalog
      </button>

      <div className="bg-m-card rounded-[24px] border border-m-border p-6 md:p-12 shadow-sm mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery area */}
          <div className="bg-white/5 dark:bg-white/5 rounded-[16px] p-8 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
             <img 
               src={product.image} 
               alt={product.name} 
               className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
             />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
             <div className="text-[12px] opacity-60 font-medium mb-2 uppercase tracking-wider text-m-red">
                {product.category}
             </div>
             <h1 className="text-[32px] md:text-[40px] font-bold leading-tight mb-4">
                {product.name}
             </h1>

             <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-[16px] w-[16px] fill-[#f1c40f] text-[#f1c40f]" />
                  <Star className="h-[16px] w-[16px] fill-[#f1c40f] text-[#f1c40f]" />
                  <Star className="h-[16px] w-[16px] fill-[#f1c40f] text-[#f1c40f]" />
                  <Star className="h-[16px] w-[16px] fill-[#f1c40f] text-[#f1c40f]" />
                  <Star className="h-[16px] w-[16px] fill-[#f1c40f] text-[#f1c40f] opacity-50" />
                </div>
                <span className="text-[14px] font-bold">{product.rating || 4.8}</span>
                <span className="text-[14px] text-m-ink-muted underline">({product.reviews || 124} reviews)</span>
             </div>

             <div className="flex items-end gap-4 mb-8">
                 <div className="font-bold text-[32px] text-m-red">
                    {product.price}
                 </div>
                 {product.oldPrice && (
                    <div className="text-[18px] text-m-ink-muted line-through mb-1.5">
                      {product.oldPrice}
                    </div>
                 )}
             </div>

             <p className="text-m-ink-muted text-[16px] leading-relaxed mb-8">
                 Experience the best in class with the {product.name}. Designed for professionals and enthusiasts alike, this device brings unprecedented power and efficiency to your daily workflow. Features advanced cooling, ultra-fast charging, and premium build quality.
             </p>

             <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="flex items-center gap-3 p-4 bg-m-border/30 rounded-[12px]">
                    <Truck className="h-6 w-6 text-m-red" />
                    <div>
                        <div className="text-[12px] text-m-ink-muted">Delivery</div>
                        <div className="text-[14px] font-bold">2-3 Days</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-m-border/30 rounded-[12px]">
                    <ShieldCheck className="h-6 w-6 text-m-red" />
                    <div>
                        <div className="text-[12px] text-m-ink-muted">Warranty</div>
                        <div className="text-[14px] font-bold">1 Year</div>
                    </div>
                 </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-m-border">
                 <button 
                  onClick={(e) => onAddToCart(product, e)}
                  className="flex-[1] flex items-center justify-center gap-2 border-[2px] border-m-ink hover:bg-m-ink hover:text-m-card text-m-ink py-4 rounded-[12px] font-bold text-[16px] transition-colors"
                 >
                     <ShoppingCart className="h-5 w-5" /> Add to Cart
                 </button>
                 <button 
                  onClick={handleBuyNow}
                  className="flex-[2] bg-m-red hover:bg-[#a11f24] text-white py-4 rounded-[12px] font-bold text-[16px] transition-colors shadow-lg shadow-m-red/20"
                 >
                     Buy it Now
                 </button>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
          <div className="flex gap-8 border-b border-m-border mb-8">
             <button 
                onClick={() => setActiveTab('description')}
                className={`pb-4 font-bold text-[16px] transition-colors border-b-2 ${activeTab === 'description' ? 'border-m-red text-m-red' : 'border-transparent text-m-ink-muted hover:text-m-ink'}`}
             >
                Description
             </button>
             <button 
                onClick={() => setActiveTab('specs')}
                className={`pb-4 font-bold text-[16px] transition-colors border-b-2 ${activeTab === 'specs' ? 'border-m-red text-m-red' : 'border-transparent text-m-ink-muted hover:text-m-ink'}`}
             >
                Specifications
             </button>
          </div>

          <div>
             {activeTab === 'description' ? (
                 <div className="text-m-ink-muted text-[16px] leading-relaxed max-w-3xl">
                     <p className="mb-4">
                         Push the boundaries of what's possible. This device is meticulously crafted using aerospace-grade materials, ensuring it's both incredibly durable and surprisingly lightweight.
                     </p>
                     <p>
                         Whether you're gaming at high frame rates, rendering complex 3D scenes, or simply enjoying your favorite high-fidelity media, the custom-tuned components deliver a stutter-free, immersive experience. The intuitive interface ensures that all this power is easily accessible right out of the box.
                     </p>
                 </div>
             ) : (
                 <div className="max-w-2xl">
                     <ul className="divide-y divide-m-border">
                         <li className="py-3 flex justify-between"><span className="text-m-ink-muted">Brand</span><span className="font-bold">Data Management</span></li>
                         <li className="py-3 flex justify-between"><span className="text-m-ink-muted">Model</span><span className="font-bold">{product.name}</span></li>
                         <li className="py-3 flex justify-between"><span className="text-m-ink-muted">Color</span><span className="font-bold">Phantom Black</span></li>
                         <li className="py-3 flex justify-between"><span className="text-m-ink-muted">Weight</span><span className="font-bold">1.2 kg</span></li>
                         <li className="py-3 flex justify-between"><span className="text-m-ink-muted">Connectivity</span><span className="font-bold">Bluetooth 5.2 / Wi-Fi 6E</span></li>
                     </ul>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
}
