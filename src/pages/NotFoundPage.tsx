import { motion } from "motion/react";
import { Home, AlertCircle } from "lucide-react";
import { fadeInUp, fadeIn } from "../utils/animationUtils";

export function NotFoundPage() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[90vh] px-[5%] text-center overflow-hidden"
    >
      <motion.div 
        variants={fadeInUp}
        className="w-24 h-24 bg-m-red/10 rounded-full flex items-center justify-center text-m-red mb-8"
      >
        <AlertCircle className="w-12 h-12" />
      </motion.div>
      
      <motion.h1 
        variants={fadeInUp}
        className="text-[124px] font-black text-m-ink leading-none mb-4"
      >
        404
      </motion.h1>
      
      <motion.h2 
        variants={fadeInUp}
        className="text-[24px] font-bold text-m-ink mb-10"
      >
        Page Not Found
      </motion.h2>

      <motion.div variants={fadeIn}>
        <a
          href="/"
          className="flex items-center gap-2 bg-m-red hover:bg-m-red/90 text-white px-8 py-3 rounded-full font-bold text-[14px] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-m-red/20"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </a>
      </motion.div>
    </motion.div>
  );
}
