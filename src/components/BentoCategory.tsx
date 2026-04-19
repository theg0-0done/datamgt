import { ArrowRight } from "lucide-react";
import { BENTO_CATEGORIES } from "../data";

export function BentoCategory({ onCategoryClick }: { onCategoryClick: (category: string) => void }) {
  return (
    <div
      id="about"
      className="px-[5%] mt-10 scroll-mt-[100px]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {BENTO_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`rounded-[24px] p-[25px] relative overflow-hidden group hover:shadow-xl transition-shadow cursor-pointer min-h-[220px] ${cat.color} ${cat.textColor} ${cat.colSpan} ${cat.textColor === 'text-white' ? 'force-white-text' : ''}`}
          >
            <div className="relative z-10 flex flex-col h-full justify-between" style={{ color: 'inherit' }}>
              <div>
                <span className="opacity-80 text-sm font-medium mb-1 block" style={{ color: 'inherit' }}>
                  {cat.subtitle}
                </span>
                <span className="opacity-80 text-xl font-medium mb-1 block" style={{ color: 'inherit' }}>
                  {cat.subtitle2}
                </span>
                <h3 className="text-[24px] font-bold leading-tight" style={{ color: 'inherit' }}>
                  {cat.title}
                </h3>
              </div>
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryClick(cat.filterCategory);
                  }}
                  className={`bg-white/20 hover:bg-white text-inherit ${cat.textColor === "text-white" ? "hover:text-[#1a1a1a]" : "hover:text-[#1a1a1a]"} text-sm px-5 py-2 rounded-full font-bold transition-colors backdrop-blur-sm shadow-sm inline-flex items-center gap-2`}
                >
                  Browse <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <img
              src={cat.image}
              alt={cat.title}
              className="absolute right-0 bottom-0 top-0 object-contain w-[55%] h-full group-hover:scale-110 transition-transform duration-500 max-h-[160px] my-auto mr-[-5%] drop-shadow-2xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
