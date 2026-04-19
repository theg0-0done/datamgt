import { motion } from "motion/react";
import { fadeInUp, RevealText } from "../utils/animationUtils";

export function Hero() {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      id="home" 
      className="px-[5%] mt-6 scroll-mt-[100px]"
    >
      <div className="relative w-full bg-m-red rounded-[24px] shadow-[0_10px_30px_rgba(193,39,45,0.2)] relative min-h-[450px] flex items-center">
        <div className="relative w-full">
          <div className="p-6 md:p-[50px] flex flex-col justify-center z-10 text-white force-white-text">
            <motion.span 
              variants={fadeInUp}
              className="bg-m-yellow text-[#1a1a1a] px-[8px] py-[2px] rounded-[4px] uppercase font-bold text-[10px] w-fit mb-[15px]"
            >
              Flash Offer - 40% OFF
            </motion.span>
            
            <RevealText 
              text="Wireless Headphone" 
              className="font-black text-[64px] tracking-tight leading-[0.9] mb-[15px]" 
            />

            <motion.p 
              variants={fadeInUp}
              className="opacity-90 text-[18px] mb-[25px]"
            >
              Premium sound for the modern gamer.
              <br />
              Limited Edition Sefrou Red.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <button
                onClick={() => {
                  const text = encodeURIComponent(
                    `Hello! I'm interested in the *Wireless Headphone* Flash Offer.\nOffer: 40% OFF\nQuantity: 1\n*Total: (Special Offer Price)*`,
                  );
                  window.open(
                    `https://wa.me/212762895481?text=${text}`,
                    "_blank",
                  );
                }}
                className="bg-white hover:bg-gray-100 text-m-red px-[30px] py-[12px] rounded-full font-bold transition-transform hover:scale-105 active:scale-95 shadow-md"
              >
                SHOP NOW
              </button>
            </motion.div>
          </div>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            src="/assets/headphones.png"
            alt="Wireless Headphones"
            className="md:absolute md:right-0 lg:right-[60px] md:top-[50%] md:translate-y-[-50%] object-contain w-full md:max-w-[60%] lg:max-w-[500px] z-10 drop-shadow-xl"
          />
        </div>
      </div>
    </motion.div>
  );
}
