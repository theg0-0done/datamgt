import { useState } from "react";
import { Search, ShoppingCart, Sun, Moon, Menu } from "lucide-react";

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

  return (
    <nav className="sticky top-0 z-50 bg-m-card border-b-2 border-m-border">
      <div className="px-[5%]">
        <div className="flex justify-between h-[70px] items-center">
          <div
            onClick={() => onNavigate("/")}
            className="flex-shrink-0 flex items-center gap-[8px] cursor-pointer"
          >
            <img
              src="/src/assets/logo.png"
              alt="Data Management Logo"
              className="h-[40px] w-auto object-contain"
            />
          </div>

          <div className="hidden md:flex space-x-[30px] text-[14px] font-bold uppercase relative">
            <button
              onClick={() => onNavigate("/")}
              className="opacity-80 hover:opacity-100 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("/about")}
              className="opacity-80 hover:opacity-100 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => onNavigate("/products")}
              className="opacity-80 hover:opacity-100 transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="opacity-80 hover:opacity-100 transition-colors"
            >
              FAQ
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-[20px] font-bold text-[14px]">
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
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={toggleTheme}
              className="text-m-ink p-2 rounded-full bg-m-border"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <button onClick={onCartClick} className="text-m-ink relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-m-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-m-ink p-2"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-m-card border-t p-4 flex flex-col gap-4 shadow-lg absolute w-full font-bold uppercase text-[14px]">
          <button
            onClick={() => { setIsOpen(false); onNavigate("/"); }}
            className="text-left text-m-ink opacity-80"
          >
            Home
          </button>
          <button
            onClick={() => { setIsOpen(false); onNavigate("/about"); }}
            className="text-left text-m-ink opacity-80"
          >
            About
          </button>
          <button
            onClick={() => { setIsOpen(false); onNavigate("/products"); }}
            className="text-left text-m-ink opacity-80"
          >
            Products
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-left text-m-ink opacity-80"
          >
            FAQ
          </button>
        </div>
      )}
    </nav>
  );
}
