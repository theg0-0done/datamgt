export function PromoBannerGreen() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-[40px] mt-24 mb-16">
      <div className="bg-[#2dcc70] rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-[0_10px_30px_rgba(45,204,112,0.2)] md:h-[300px]">
        <div className="p-[40px] flex flex-col justify-center text-white md:w-1/2 z-10 force-white-text">
          <span className="text-[14px] font-bold opacity-80 uppercase mb-2">
            20% OFF SUMMER SALE
          </span>
          <h2 className="text-[40px] md:text-[48px] font-bold leading-tight mb-4">
            Happy Hours
          </h2>
          <p className="text-white/80 text-[14px] mb-6">
            Get the best deals on smartwatches.
          </p>
          <button
            onClick={() => {
              const text = encodeURIComponent(`Hello! I'm interested in the *Summer Sale* (Smartwatches).\nOffer: 20% OFF\nQuantity: 1\n*Total: (Sale Price)*`);
              window.open(`https://wa.me/212762895481?text=${text}`, '_blank');
            }}
            className="bg-white hover:bg-gray-100 text-[#2dcc70] px-8 py-3 rounded-full font-bold text-[14px] w-fit shadow-md transition-transform hover:scale-105"
          >
            Check out
          </button>
        </div>
        <div className="md:w-1/2 relative bg-[#2dcc70] flex justify-center items-center p-8 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white/10 blur-2xl"></div>
          <div className="text-[120px] font-bold text-white/5 absolute top-1/2 left-[20%] -translate-y-1/2 select-none leading-none z-0">
            PRO
          </div>
          <img
            src="/assets/smartwatch.png"
            alt="Promotion Smartwatch"
            className="object-contain h-64 md:h-[120%] lg:h-[140%] z-10 drop-shadow-2xl hover:scale-110 transition-transform duration-700"
          />
        </div>
      </div>
    </div>
  );
}
