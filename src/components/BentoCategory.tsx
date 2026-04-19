import { motion } from "motion/react";
import { BENTO_CATEGORIES } from "../data";
import { fadeInUp, staggerContainer } from "../utils/animationUtils";

export function BentoCategory({ onCategoryClick }: { onCategoryClick: (category: string) => void }) {
  return (
    <div className="px-[5%] mt-12 bg-m-bg overflow-hidden">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[15px] md:gap-[25px]"
      >
        {BENTO_CATEGORIES.map((cat: any) => (
          <motion.div
            key={cat.id}
            variants={fadeInUp}
            onClick={() => onCategoryClick(cat.filterCategory)}
            className={`cursor-pointer group relative rounded-[32px] p-8 h-[220px] md:h-[260px] flex flex-col justify-end overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${cat.color} ${cat.colSpan}`}
          >
            {/* Background pattern/overlay for richness */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent)]"></div>

            <div className="relative z-10">
              <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-widest opacity-80 ${cat.textColor === 'text-white' ? 'text-white' : 'text-m-ink-muted'}`}>
                {cat.subtitle}
              </span>
              <h3 className={`text-[20px] md:text-[24px] font-bold leading-none mt-1 ${cat.textColor}`}>
                {cat.subtitle2}
              </h3>
              <h2 className={`text-[40px] md:text-[50px] font-black leading-none mb-4 tracking-tighter ${cat.textColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                {cat.title}
              </h2>
              
              <button 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold w-fit transition-all duration-300 transform group-hover:scale-105 active:scale-95 bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md`}
              >
                Browse Collection
              </button>
            </div>

            <img
              src={cat.image}
              alt={cat.title}
              className="absolute right-[-10px] bottom-0 top-0 object-contain h-[80%] md:w-[60%] h-[70%] md:h-[80%] group-hover:scale-110 transition-transform duration-700 my-auto drop-shadow-2xl brightness-[1.05]"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
