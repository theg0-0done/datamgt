import { 
  ShoppingCart, 
  Search, 
  Menu, 
  Truck, 
  ShieldCheck, 
  HeadphonesIcon, 
  CreditCard,
  Facebook,
  Instagram,
  ArrowRight,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Heart,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { PRODUCTS, BENTO_CATEGORIES, FAQS } from "./data";

function Navbar({ toggleTheme, isDark, onNavigate }: { toggleTheme: () => void, isDark: boolean, onNavigate: (page: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-m-card border-b-2 border-m-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-[40px]">
        <div className="flex justify-between h-[70px] items-center">
          {/* Logo */}
          <div onClick={() => onNavigate('/')} className="flex-shrink-0 flex items-center gap-[8px] cursor-pointer">
            <div className="w-[12px] h-[12px] bg-m-red rounded-full"></div>
            <span className="font-bold text-[24px] tracking-tight leading-none text-m-ink">MAROCTECH</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-[30px] text-[14px] font-bold uppercase relative">
            <a href="#" className="text-m-red transition-colors">Deals</a>
            <a href="#" className="opacity-80 hover:opacity-100 transition-colors">Gaming</a>
            <a href="#" className="opacity-80 hover:opacity-100 transition-colors">Components</a>
            <a href="#" className="opacity-80 hover:opacity-100 transition-colors">Laptops</a>
            <a href="#" className="opacity-80 hover:opacity-100 transition-colors">Audio</a>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-[20px] font-bold text-[14px]">
            <button className="opacity-80 hover:opacity-100 flex items-center gap-2">
              <Search className="h-4 w-4" /> Search
            </button>
            <button className="opacity-80 hover:opacity-100 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Cart (2)
            </button>
            <button onClick={toggleTheme} className="text-m-ink p-2 rounded-full bg-m-border hover:bg-m-card-hover transition-colors">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
             <button onClick={toggleTheme} className="text-m-ink p-2 rounded-full bg-m-border">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
             <button className="text-m-ink relative">
              <ShoppingCart className="h-6 w-6" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-m-ink p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-m-card border-t p-4 flex flex-col gap-4 shadow-lg absolute w-full font-bold uppercase text-[14px]">
            <a href="#" className="text-m-red">Deals</a>
            <a href="#" className="text-m-ink opacity-80">Gaming</a>
            <a href="#" className="text-m-ink opacity-80">Components</a>
            <a href="#" className="text-m-ink opacity-80">Laptops</a>
            <a href="#" className="text-m-ink opacity-80">Audio</a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-[40px] mt-6">
      <div className="bg-m-red rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(193,39,45,0.2)] relative min-h-[450px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
          {/* Text Content */}
          <div className="p-[50px] flex flex-col justify-center z-10 text-white">
            <span className="bg-m-yellow text-[#1a1a1a] px-[8px] py-[2px] rounded-[4px] uppercase font-bold text-[10px] w-fit mb-[15px]">Flash Offer - 40% OFF</span>
            <h1 className="font-bold text-[64px] tracking-tight leading-[0.9] mb-[15px]">
              Wireless<br />
              Headphone
            </h1>
            <p className="opacity-90 text-[18px] mb-[25px]">
              Premium sound for the modern gamer.<br/>
              Limited Edition Casablanca Red.
            </p>
            <div>
              <button className="bg-white hover:bg-gray-100 text-m-red px-[30px] py-[12px] rounded-full font-bold transition-transform hover:scale-105 active:scale-95 shadow-md">
                SHOP NOW
              </button>
            </div>
          </div>
          {/* Image */}
          <div className="relative h-64 lg:h-auto flex items-center justify-center lg:justify-end lg:pr-[40px] p-10">
             {/* White ring placeholder aesthetic directly translated through styling */}
            <div className="absolute right-[40px] w-[320px] h-[320px] rounded-full flex items-center justify-center opacity-70 border-[15px] border-white/20"></div>
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" 
              alt="Wireless Headphones" 
              className="object-cover max-w-full lg:max-w-[400px] rounded-3xl mix-blend-multiply z-10"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BentoCategory() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-[40px] mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {BENTO_CATEGORIES.map((cat) => (
          <div key={cat.id} className={`rounded-[24px] p-[25px] relative overflow-hidden group hover:shadow-xl transition-shadow cursor-pointer min-h-[220px] ${cat.color} ${cat.textColor} ${cat.colSpan}`}>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="opacity-80 text-sm font-medium mb-1 block">{cat.subtitle}</span>
                <span className="opacity-80 text-xl font-medium mb-1 block">{cat.subtitle2}</span>
                <h3 className="text-[24px] font-bold leading-tight">{cat.title}</h3>
              </div>
              <div className="mt-4">
                <button className={`bg-white/20 hover:bg-white text-inherit ${cat.textColor === 'text-white' ? 'hover:text-m-ink' : 'hover:text-m-ink'} text-sm px-5 py-2 rounded-full font-bold transition-colors backdrop-blur-sm shadow-sm inline-flex items-center gap-2`}>
                  Browse <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="absolute right-0 bottom-0 top-0 object-cover w-1/2 h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500 right-[0%]"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesBar() {
  const features = [
    { icon: Truck, title: "Free Shipping", subtitle: "Free Shipping On All Order" },
    { icon: ShieldCheck, title: "Money Guarantee", subtitle: "30 Day Money Back" },
    { icon: HeadphonesIcon, title: "Online Support 24/7", subtitle: "Technical Support 24/7" },
    { icon: CreditCard, title: "Secure Payment", subtitle: "All Cards Accepted" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="text-m-red bg-m-red/10 p-4 rounded-full">
              <item.icon className="h-8 w-8 text-m-red" strokeWidth={1.5} />
            </span>
            <div>
              <h4 className="font-bold text-m-ink">{item.title}</h4>
              <p className="text-sm text-m-ink-muted">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromoBannerRed() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-[40px] mt-20">
      <div className="bg-m-red rounded-[24px] p-8 lg:p-14 relative flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-[0_10px_30px_rgba(193,39,45,0.2)]">
        
        {/* Left Text */}
        <div className="z-10 text-white max-w-sm mb-8 md:mb-0">
          <p className="text-red-200 font-bold tracking-widest text-[14px] mb-2 uppercase">20% OFF</p>
          <h2 className="font-bold text-[48px] lg:text-[64px] leading-[0.9] mb-2">FINAL<br/>SMILE</h2>
          <p className="text-white text-[18px] mb-6 mt-4 opacity-90">15 Nov To 28 Nov</p>
        </div>

        {/* Center Image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 lg:w-[500px] lg:h-[500px] opacity-90 mix-blend-multiply z-0 pointer-events-none">
           <img 
            src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop" 
            className="w-full h-full object-contain"
            alt="Promo product" 
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Content */}
        <div className="z-10 text-white text-right flex flex-col items-end max-w-sm">
          <p className="font-bold text-[18px] mb-2">Beats Solo 3</p>
          <h3 className="font-bold text-[32px] mb-4 leading-tight">Summer Sale</h3>
          <p className="text-[14px] text-white mb-6 max-w-[250px] opacity-90">Upgrade your daily driver with premium sound and flawless isolation.</p>
          <button className="bg-white text-m-red px-[30px] py-[12px] rounded-full font-bold hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95 shadow-md">
            Shop Now
          </button>
        </div>

      </div>
    </div>
  );
}

function ProductGrid({ onProductClick }: { onProductClick: (id: number) => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-[40px] mt-24">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-bold text-[24px] text-m-ink mb-2">Featured Products</h2>
          <p className="text-m-ink-muted">Premium selection for our elite members.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="group relative bg-m-card p-[15px] rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col gap-[10px] cursor-pointer" onClick={() => onProductClick(product.id)}>
            <div className="bg-[#f0f0f0] dark:bg-[#1a1a1a] rounded-[12px] aspect-square p-4 flex flex-col justify-center items-center relative overflow-hidden">
              {product.badge && (
                <span className="absolute top-2 left-2 bg-m-yellow text-[#1a1a1a] text-[10px] font-bold px-[8px] py-[2px] rounded-[4px] uppercase z-10 w-fit">
                  {product.badge}
                </span>
              )}
              {/* Product Hover Actions overlay */}
              <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 z-10 duration-300">
                <button className="bg-white text-[#1a1a1a] p-2 rounded-full shadow-md hover:bg-m-red hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>

              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex flex-col gap-[2px]">
              <h3 className="font-bold text-m-ink text-[14px] truncate" title={product.name}>{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-m-red text-[18px]">{product.price}</span>
                {product.oldPrice && (
                  <span className="text-m-ink-muted line-through text-[12px] opacity-60">{product.oldPrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromoBannerGreen() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-[40px] mt-24">
        <div className="bg-m-green rounded-[24px] p-8 lg:p-14 relative flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-xl">
          
          {/* Left Text */}
          <div className="z-10 text-white max-w-sm mb-8 md:mb-0">
            <p className="text-emerald-200 font-bold tracking-widest text-[14px] mb-2 uppercase">20% OFF</p>
            <h2 className="font-bold text-[48px] lg:text-[64px] leading-[0.9] mb-2">HAPPY<br/>HOURS</h2>
            <p className="text-white text-[18px] mb-6 mt-4 opacity-80">15 Nov To 28 Nov</p>
          </div>
  
          {/* Center Image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 lg:w-[600px] lg:h-[600px] opacity-90 mix-blend-multiply z-0 pointer-events-none">
             <img 
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop" 
              className="w-full h-full object-contain mix-blend-color-burn grayscale-[30%] opacity-80"
              alt="Promo product" 
              referrerPolicy="no-referrer"
            />
          </div>
  
          {/* Right Content */}
          <div className="z-10 text-white text-right flex flex-col items-end max-w-sm">
            <p className="font-bold text-[18px] mb-2">Smart Watch</p>
            <h3 className="font-bold text-[32px] mb-4 leading-tight">Summer Sale</h3>
            <p className="text-[14px] text-white mb-6 max-w-[250px] opacity-90">Experience the future on your wrist while tracking health and answering calls effortlessly.</p>
            <button className="bg-white text-m-green px-[30px] py-[12px] rounded-full font-bold hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95 shadow-md">
              Shop Now
            </button>
          </div>
  
        </div>
      </div>
    );
}

function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleOpen = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-[40px] mt-24 mb-20">
      <div className="text-center mb-12">
        <h2 className="font-bold text-[32px] text-m-ink mb-4">Frequently Asked Questions</h2>
        <p className="text-m-ink-muted max-w-2xl mx-auto">Find answers to common questions about orders, shipping, and more.</p>
      </div>

      <div className="flex flex-col gap-4">
        {FAQS.map((faq) => (
          <div key={faq.id} className="bg-m-card rounded-[16px] overflow-hidden border border-m-border transition-colors">
            <button 
              className="w-full px-6 flex justify-between items-center py-5 text-left focus:outline-none"
              onClick={() => toggleOpen(faq.id)}
            >
              <h3 className="font-bold text-[16px] text-m-ink">{faq.question}</h3>
              {openId === faq.id ? (
                <ChevronUp className="h-5 w-5 text-m-red flex-shrink-0 ml-4" />
              ) : (
                <ChevronDown className="h-5 w-5 text-m-ink-muted flex-shrink-0 ml-4" />
              )}
            </button>
            
            <div 
              className={`px-6 pb-5 text-m-ink-muted text-[14px] transition-all duration-300 ease-in-out ${
                openId === faq.id ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0 pb-0 overflow-hidden'
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Product Details Page Component
function ProductDetail({ productId, onBack }: { productId: number, onBack: () => void }) {
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-[40px] py-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-m-ink-muted mb-6">
        <span className="cursor-pointer hover:text-m-red" onClick={onBack}>Home</span>
        <span>/</span>
        <span className="cursor-pointer hover:text-m-red">{product.category}</span>
        <span>/</span>
        <span className="text-m-ink font-bold truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-m-border mb-8 gap-8 font-bold text-sm text-m-ink-muted pb-4">
        <span className="text-m-red border-b-2 border-m-red pb-4 -mb-[18px] whitespace-nowrap">All about product</span>
        <span className="hover:text-m-ink cursor-pointer whitespace-nowrap">Characteristics</span>
        <span className="hover:text-m-ink cursor-pointer whitespace-nowrap">Reviews</span>
        <span className="hover:text-m-ink cursor-pointer whitespace-nowrap">Video</span>
        <span className="hover:text-m-ink cursor-pointer whitespace-nowrap">Buy together</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Col - Images */}
        <div className="flex flex-col gap-4">
          <div className="bg-m-card border border-m-border rounded-[24px] p-8 relative flex items-center justify-center aspect-video lg:aspect-square">
             <button className="absolute top-4 right-4 text-m-ink-muted hover:text-m-red">
               <Heart className="h-6 w-6" />
             </button>
             <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" alt={product.name} referrerPolicy="no-referrer" />
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-m-card border border-m-border rounded-[12px] p-4 aspect-square cursor-pointer flex items-center border-m-red border-2">
              <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
            </div>
            <div className="bg-m-card border border-m-border rounded-[12px] p-4 aspect-square cursor-pointer opacity-50 flex items-center">
              <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
            </div>
            <div className="bg-m-card border border-m-border rounded-[12px] p-4 aspect-square cursor-pointer opacity-50 flex items-center">
              <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
            </div>
          </div>
          
          <div className="mt-8 text-m-ink text-sm leading-relaxed">
            <h3 className="font-bold text-lg mb-4">All about product</h3>
            <p className="mb-4 text-m-ink-muted">The ideal balance of quiet, comfort, and sound. Our premium {product.category.toLowerCase()} utilizes advanced technology to deliver immersive audio experiences.</p>
            <p className="mb-4 text-m-ink-muted">Features active noise cancellation, deep rich bass profiles, and seamlessly pairs with all your ecosystem devices.</p>
          </div>
        </div>

        {/* Right Col - Details */}
        <div className="flex flex-col">
          <h1 className="font-bold text-[32px] text-m-ink leading-tight mb-4">{product.name} Space Edition</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-m-yellow text-sm">
               ★ ★ ★ ★ ★ <span className="text-m-ink-muted ml-2">(324)</span>
            </div>
            <span className="text-m-ink-muted text-sm border-l border-m-border pl-4">SKU: 32031209</span>
          </div>

          <div className="flex items-center justify-between mb-8 py-6 border-y border-m-border">
            <div>
               {product.oldPrice && <p className="text-m-ink-muted line-through text-sm">{product.oldPrice}</p>}
               <p className="font-bold text-m-red text-[36px]">{product.price}</p>
            </div>
            <div className="flex gap-4">
              <button className="bg-m-red text-white font-bold py-3 px-8 rounded-[12px] hover:bg-opacity-90 transition-opacity whitespace-nowrap">
                Buy Now
              </button>
              <button className="bg-m-card text-m-ink border-2 border-m-border font-bold py-3 px-6 rounded-[12px] hover:bg-m-border transition-colors whitespace-nowrap">
                Buy on Credit
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6 space-y-2">
            <p className="font-bold text-sm mb-4">Additional Services</p>
            <div className="flex justify-between items-center bg-m-card border border-m-border p-4 rounded-[12px] cursor-pointer hover:bg-m-card-hover transition-colors">
              <span className="text-sm font-bold">Extended Warranty 12 Months</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="flex justify-between items-center bg-m-card border border-m-border p-4 rounded-[12px] cursor-pointer hover:bg-m-card-hover transition-colors">
              <span className="text-sm font-bold">Screen Protection Plan</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          {/* Info Blocks */}
          <div className="space-y-4">
            <div className="flex gap-4 items-start bg-m-card border border-m-border p-4 rounded-[12px]">
              <Truck className="h-5 w-5 text-m-red flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm mb-1">Delivery Info</h4>
                <p className="text-[12px] text-m-ink-muted">Free standard delivery nationwide. Order before 2 PM for next-day dispatch.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start bg-m-card border border-m-border p-4 rounded-[12px]">
              <CreditCard className="h-5 w-5 text-m-red flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm mb-1">Payment Info</h4>
                <p className="text-[12px] text-m-ink-muted">Pay securely online with Visa, Mastercard, or opt for Cash on Delivery.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start bg-m-card border border-m-border p-4 rounded-[12px]">
              <ShieldCheck className="h-5 w-5 text-m-red flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm mb-1">Warranty Details</h4>
                <p className="text-[12px] text-m-ink-muted">Official 12-month manufacturer warranty covering manufacturing defects.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer before footer */}
      <div className="h-24"></div>
    </div>
  );
}


function SiteFooter({ isDark }: { isDark: boolean }) {
  return (
    // If not dark mode, the footer is white. If dark mode, the footer is dark.
    <footer className={`w-full pt-12 pb-6 border-t ${isDark ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-100 text-[#1a1a1a]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-[40px]">
        {/* Three Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10">
          
          {/* Column 1: Logo + Small Text */}
          <div className="flex flex-col">
            <div className="flex items-center gap-[8px] mb-4">
              <div className="w-[12px] h-[12px] bg-m-red rounded-full"></div>
              <span className="font-bold text-[24px] tracking-tight leading-none uppercase">MAROCTECH</span>
            </div>
            <p className={`text-[14px] leading-relaxed max-w-[280px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Your premium destination for modern tech. We bring the latest gadgets and computing power straight to your door in Casablanca and beyond.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
             <h4 className="font-bold text-[16px] mb-4">Quick Links</h4>
             <ul className={`space-y-3 font-medium text-[14px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <li><a href="#" className={`hover:text-m-red transition-colors`}>Shop Deals</a></li>
                <li><a href="#" className={`hover:text-m-red transition-colors`}>Gaming Setup</a></li>
                <li><a href="#" className={`hover:text-m-red transition-colors`}>Laptops & PCs</a></li>
                <li><a href="#" className={`hover:text-m-red transition-colors`}>Audio Gear</a></li>
                <li><a href="#" className={`hover:text-m-red transition-colors`}>Return Policy</a></li>
             </ul>
          </div>

          {/* Column 3: Social Media */}
          <div className="flex flex-col">
             <h4 className="font-bold text-[16px] mb-4">Connect With Us</h4>
             <ul className={`space-y-4 font-medium text-[14px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <li>
                  <a href="#" className={`flex items-center gap-3 hover:text-m-red transition-colors`}>
                    <Instagram className="h-5 w-5" /> @maroctech.official
                  </a>
                </li>
                <li>
                  <a href="#" className={`flex items-center gap-3 hover:text-m-red transition-colors`}>
                    <Facebook className="h-5 w-5" /> MarocTech Hub
                  </a>
                </li>
                <li>
                  <a href="#" className={`flex items-center gap-3 hover:text-m-red transition-colors`}>
                    <span className="font-bold text-lg leading-none pt-1">WA</span> +212 600 000 000
                  </a>
                </li>
             </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className={`flex flex-col md:flex-row justify-between pt-6 border-t font-medium text-[12px] opacity-80 items-center ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
          <div>&copy; 2026 MAROCTECH | Tech Hub Casablanca</div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [route, setRoute] = useState('/');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleNavigate = (page: string) => {
    setRoute(page);
    window.scrollTo(0, 0);
  };

  const handleProductClick = (id: number) => {
    setSelectedProductId(id);
    handleNavigate(`/product`);
  };

  return (
    <div className="min-h-screen bg-m-bg text-m-ink font-sans selection:bg-m-red selection:text-white transition-colors duration-300">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} onNavigate={handleNavigate} />
      
      {route === '/' && (
        <main className="animate-in fade-in duration-500">
          <Hero />
          <BentoCategory />
          <FeaturesBar />
          <PromoBannerRed />
          <ProductGrid onProductClick={handleProductClick} />
          <PromoBannerGreen />
          <FAQSection />
        </main>
      )}

      {route === '/product' && selectedProductId && (
        <main>
           <ProductDetail productId={selectedProductId} onBack={() => handleNavigate('/')} />
        </main>
      )}

      <SiteFooter isDark={isDark} />
    </div>
  );
}

