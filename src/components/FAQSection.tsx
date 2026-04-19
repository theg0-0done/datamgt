import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied, simply return the product in its original condition.",
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship globally! International shipping times vary depending on the destination (usually 7-14 days).",
    },
  ];

  return (
    <div id="faq" className="max-w-3xl mx-auto px-[5%] mt-24 mb-16 scroll-mt-[100px]">
      <h2 className="text-[32px] font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-m-card border border-m-border rounded-[16px] overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-m-card-hover transition-colors"
            >
              <span className="font-bold text-[16px]">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-m-red" />
              ) : (
                <ChevronDown className="h-5 w-5 text-m-ink-muted" />
              )}
            </button>
            <div
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-40 py-4 border-t border-m-border opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-m-ink-muted text-[14px] leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
