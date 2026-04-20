import { useState } from "react";
import { Search, ShoppingCart, Sun, Moon, Menu, X, Home, Info, Package, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar({
  toggleTheme,
  isDark,
  onNavigate,
  cartCount,
  onCartClick,
  searchQuery,
  onSearchChange,
}: {
  toggleTheme: () => void;
  isDark: boolean;
  onNavigate: (page: string) => void;
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== "/" && id !== "home") {
      onNavigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { label: "Home", icon: <Home className="h-5 w-5" />, action: () => { onNavigate("/"); setIsOpen(false); } },
    { label: "About", icon: <Info className="h-5 w-5" />, action: () => { onNavigate("/about"); setIsOpen(false); } },
    { label: "Products", icon: <Package className="h-5 w-5" />, action: () => { onNavigate("/products"); setIsOpen(false); } },
    { label: "FAQ", icon: <HelpCircle className="h-5 w-5" />, action: () => scrollToSection("faq") },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-m-card border-b-2 border-m-border">
        <div className="px-[5%]">
          <div className="flex justify-between py-4 items-center">
            {/* Logo */}
            <div
              onClick={() => onNavigate("/")}
              className="flex-shrink-0 flex items-center gap-[8px] cursor-pointer"
            >
              <img
                src="/assets/logo.png"
                alt="Data Management Logo"
                className="h-[30px] md:h-[40px] w-auto object-contain"
              />
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex space-x-[30px] text-[14px] font-bold uppercase relative">
              <button onClick={() => onNavigate("/")} className="opacity-80 hover:opacity-100 transition-colors">Home</button>
              <button onClick={() => onNavigate("/about")} className="opacity-80 hover:opacity-100 transition-colors">About</button>
              <button onClick={() => onNavigate("/products")} className="opacity-80 hover:opacity-100 transition-colors">Products</button>
              <button onClick={() => scrollToSection("faq")} className="opacity-80 hover:opacity-100 transition-colors">FAQ</button>
            </div>

            {/* Desktop Right Controls */}
            <div className="hidden lg:flex items-center space-x-[20px] font-bold text-[14px]">
              <div className="relative flex items-center bg-m-border rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-m-red transition-all shadow-inner">
                <Search className="h-4 w-4 text-m-ink-muted mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent border-none outline-none text-[14px] font-medium w-[100px] focus:w-[160px] transition-all placeholder:text-m-ink-muted/70 text-m-ink"
                />
              </div>
              <button
                onClick={onCartClick}
                className="text-m-ink p-2 rounded-full bg-m-border hover:bg-m-card-hover opacity-80 hover:opacity-100 flex items-center gap-2 relative"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-m-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={toggleTheme}
                className="text-m-ink p-2 rounded-full bg-m-border hover:bg-m-card-hover transition-colors"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>

            {/* Mobile/Tablet Right Controls */}
            <div className="flex lg:hidden items-center gap-3">
              <button onClick={toggleTheme} className="text-m-ink p-2 rounded-full bg-m-border">
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button onClick={onCartClick} className="text-m-ink relative p-2">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-m-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(true)}
                className="text-m-ink p-2 rounded-full bg-m-border hover:bg-m-card-hover transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />

            {/* Slide Panel — full width on mobile, w-[320px] on md+ */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 z-[70] h-full w-full md:w-[320px] bg-m-card flex flex-col shadow-2xl"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-m-border">
                <img
                  src="/assets/logo.png"
                  alt="Logo"
                  className="h-[30px] w-auto object-contain"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-m-border hover:bg-m-card-hover text-m-ink transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-6 pt-5 pb-3">
                <div className="flex items-center bg-m-border rounded-xl px-4 py-3 gap-3 focus-within:ring-2 focus-within:ring-m-red transition-all">
                  <Search className="h-4 w-4 text-m-ink-muted flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-transparent border-none outline-none text-[14px] font-medium w-full placeholder:text-m-ink-muted/70 text-m-ink"
                  />
                </div>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col px-4 pt-2 gap-1 flex-grow">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.22 }}
                    onClick={link.action}
                    className="flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-[15px] uppercase tracking-wide text-m-ink hover:bg-m-bg hover:text-m-red transition-all text-left group"
                  >
                    <span className="text-m-ink-muted group-hover:text-m-red transition-colors">
                      {link.icon}
                    </span>
                    {link.label}
                  </motion.button>
                ))}
              </nav>

              {/* Bottom Accent */}
              <div className="px-6 py-6 border-t border-m-border">
                <p className="text-[12px] text-m-ink-muted text-center font-medium tracking-wider uppercase">
                  © 2025 DataMGT
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
