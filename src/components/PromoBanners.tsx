import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { fadeInUp, staggerContainer } from "../utils/animationUtils";
import { useLanguage } from "../i18n/LanguageContext";

export function PromoBanners() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  return (
    <div className="px-[5%] mt-12">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="flex flex-col lg:flex-row gap-6"
      >

        {/* Gaming Banner - Console */}
        <motion.div 
          variants={fadeInUp}
          className="w-full bg-[#003791] rounded-[24px] flex items-center justify-between overflow-visible shadow-[0_10px_30px_rgba(0,55,145,0.2)] relative min-h-[260px]"
        >
          {/* Text */}
          <div className="p-8 flex flex-col justify-center text-white z-10 flex-shrink-0 max-w-[55%] force-white-text">
            <span className="text-[11px] font-bold opacity-70 uppercase tracking-widest mb-3 block">
              {t("promo.flashOffer")}
            </span>
            <h2 className="text-[32px] md:text-[38px] font-bold leading-tight mb-2 text-white whitespace-pre-line">
              {t("promo.consoleTitle")}
            </h2>
            <p className="text-white/70 text-[13px] mb-5">
              {t("promo.consoleDesc")}
            </p>
            <button
              onClick={() => {
                navigate(`/${lang}/products`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-white hover:bg-gray-100 text-[#003791] px-6 py-2.5 rounded-full font-bold text-[13px] w-fit shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              {t("promo.shopNow")}
            </button>
          </div>

          {/* Overflowing image */}
          <div className="absolute right-0 bottom-0 top-0 flex items-center pr-4 overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
            <motion.img
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              whileInView={{ scale: 1.1, opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              src="/assets/playstation-controller.png"
              alt="PlayStation Controller"
              className="w-[220px] md:w-[280px] object-contain drop-shadow-2xl md:translate-x-[-40px] lg:translate-x-[-0px] hover:scale-125 transition-transform duration-500"
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
              {t("promo.summerSale")}
            </span>
            <h2 className="text-[32px] md:text-[38px] font-bold leading-tight mb-2 text-white w-full whitespace-pre-line">
              {t("promo.watchesTitle")}
            </h2>
            <p className="text-white/70 text-[13px] mb-5">
              {t("promo.watchesDesc")}
            </p>
            <button
              onClick={() => {
                navigate(`/${lang}/products`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-white hover:bg-gray-100 text-[#2dcc70] px-6 py-2.5 rounded-full font-bold text-[13px] w-fit shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              {t("promo.shopNow")}
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

