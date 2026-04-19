import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "../utils/animationUtils";

export function PromoBanners() {
  return (
    <div className="px-[5%] mt-12">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="flex flex-col lg:flex-row gap-6"
      >

        {/* Red Banner - Headphones */}
        <motion.div 
          variants={fadeInUp}
          className="w-full bg-m-red rounded-[24px] flex items-center justify-between overflow-visible shadow-[0_10px_30px_rgba(193,39,45,0.2)] relative min-h-[260px]"
        >
          {/* Text */}
          <div className="p-8 flex flex-col justify-center text-white z-10 flex-shrink-0 max-w-[55%] force-white-text">
            <span className="text-[11px] font-bold opacity-70 uppercase tracking-widest mb-3 block">
              Flash Offer
            </span>
            <h2 className="text-[32px] md:text-[38px] font-bold leading-tight mb-2 text-white">
              Wireless<br />Headphones
            </h2>
            <p className="text-white/70 text-[13px] mb-5">
              Premium sound. 40% OFF today only.
            </p>
            <button
              onClick={() => {
                const text = encodeURIComponent(`Hello! I'm interested in the *Wireless Headphones* flash offer!\nOffer: 40% OFF\nQuantity: 1\n*Total: (Flash Offer Price)*`);
                window.open(`https://wa.me/212762895481?text=${text}`, "_blank");
              }}
              className="bg-white hover:bg-gray-100 text-m-red px-6 py-2.5 rounded-full font-bold text-[13px] w-fit shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Shop Now
            </button>
          </div>

          {/* Overflowing image */}
          <div className="absolute right-0 bottom-0 top-0 flex items-center pr-4 overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
            <motion.img
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              whileInView={{ scale: 1.1, opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              src="/assets/headphones.png"
              alt="Wireless Headphones"
              className="w-[220px] md:w-[280px] object-contain drop-shadow-2xl md:translate-x-[-40px] lg:translate-x-[-0px] lg:translate-x-[-0px] hover:scale-125 transition-transform duration-500"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </motion.div>

        {/* Green Banner - Smartwatch */}
        <motion.div 
          variants={fadeInUp}
          className="w-full bg-[#2dcc70] rounded-[24px] flex items-center justify-between overflow-visible shadow-[0_10px_30px_rgba(45,204,112,0.2)] relative min-h-[260px]"
        >
          {/* Text */}
          <div className="p-8 flex flex-col justify-center text-white z-10 flex-shrink-0 max-w-[55%]">
            <span className="text-[11px] font-bold opacity-70 uppercase tracking-widest mb-3 block">
              Summer Sale
            </span>
            <h2 className="text-[32px] md:text-[38px] font-bold leading-tight mb-2 text-white w-full">
              Smart<br />Watches
            </h2>
            <p className="text-white/70 text-[13px] mb-5">
              Wearable tech. 20% OFF this week.
            </p>
            <button
              onClick={() => {
                const text = encodeURIComponent(`Hello! I'm interested in the *Smart Watches* summer sale!\nOffer: 20% OFF\nQuantity: 1\n*Total: (Summer Sale Price)*`);
                window.open(`https://wa.me/212762895481?text=${text}`, "_blank");
              }}
              className="bg-white hover:bg-gray-100 text-[#2dcc70] px-6 py-2.5 rounded-full font-bold text-[13px] w-fit shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Shop Now
            </button>
          </div>

          {/* Overflowing image */}
          <div className="absolute right-0 bottom-0 top-0 flex items-center pr-4 overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
            <motion.img
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              whileInView={{ scale: 1.1, opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              src="/assets/smartwatch.png"
              alt="Smartwatch"
              className="w-[220px] md:w-[280px] object-contain drop-shadow-2xl md:translate-x-[-40px] lg:translate-x-[-0px] hover:scale-125 transition-transform duration-500"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
