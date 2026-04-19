import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fadeInUp, staggerContainer } from "../utils/animationUtils";

const FAQS = [
  {
    question: "Do you offer genuine products?",
    answer: "Yes, every single product in our catalog is 100% authentic and sourced directly from authorized manufacturers or distributors. We take quality and authenticity extremely seriously."
  },
  {
    question: "How long does delivery take?",
    answer: "We offer express 48-hour delivery for major cities. For remote areas, delivery typically takes between 3 to 5 business days. You'll receive a tracking number once your order is dispatched."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 14-day hassle-free return policy for any manufacturing defects or if the product arrives damaged. The item must be in its original packaging and condition."
  },
  {
    question: "Is there a warranty on electronics?",
    answer: "Absolutely. All electronic products come with a standard 12-month manufacturer warranty. Some premium brands offer extended warranties which will be specified on the product page."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-[5%] py-24 bg-m-bg overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[32px] md:text-[42px] font-black text-m-ink mb-4">FAQ</h2>
          <div className="w-16 h-1.5 bg-m-red mx-auto rounded-full"></div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {FAQS.map((faq, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              className="bg-m-card border border-m-border rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(index === openIndex ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-m-bg/50 transition-colors"
                id={`faq-btn-${index}`}
              >
                <span className="font-bold text-[16px] md:text-[18px] text-m-ink">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-m-red" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-m-ink-muted" />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-6 text-m-ink-muted leading-relaxed text-[15px] md:text-[16px] border-t border-m-border/50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
