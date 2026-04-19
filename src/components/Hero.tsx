export function Hero() {
  return (
    <div id="home" className="px-[5%] mt-6 scroll-mt-[100px]">
      <div className="bg-m-red rounded-[24px] shadow-[0_10px_30px_rgba(193,39,45,0.2)] relative min-h-[450px] flex items-center">
        <div className="relative w-full">
          <div className="p-[50px] flex flex-col justify-center z-10 text-white force-white-text">
            <span className="bg-m-yellow text-[#1a1a1a] px-[8px] py-[2px] rounded-[4px] uppercase font-bold text-[10px] w-fit mb-[15px]">
              Flash Offer - 40% OFF
            </span>
            <h1 className="font-bold text-[64px] tracking-tight leading-[0.9] mb-[15px]">
              Wireless
              <br />
              Headphone
            </h1>
            <p className="opacity-90 text-[18px] mb-[25px]">
              Premium sound for the modern gamer.
              <br />
              Limited Edition Casablanca Red.
            </p>
            <div>
              <button
                onClick={() => {
                  const imageUrl =
                    window.location.origin + "/src/assets/headphones.png";
                  const text = encodeURIComponent(
                    `Hello, I'm interested in the offer: Wireless Headphone.\n\nImage: ${imageUrl}`,
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
            </div>
          </div>
          <img
            src="/src/assets/headphones.png"
            alt="Wireless Headphones"
            className="absolute right-[60px] top-[50%] translate-y-[-50%] object-contain max-w-[80%] lg:max-w-[500px] z-10 drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
