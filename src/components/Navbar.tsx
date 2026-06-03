import { useState } from "react";
import { ShoppingCart, Sun, Moon, Menu, X, Home, Info, Package, Mail, ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import darkLogo from "../assets/datamgt_dark_logo_png.png";
import lightLogo from "../assets/datamgt_light_logo_png.png";
import { useLanguage } from "../i18n/LanguageContext";

export function Navbar({
  toggleTheme,
  isDark,
  onNavigate,
  cartCount,
  onCartClick,
}: {
  toggleTheme: () => void;
  isDark: boolean;
  onNavigate: (page: string) => void;
  cartCount: number;
  onCartClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { lang, t, changeLanguage } = useLanguage();

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
    { label: t("navbar.home"), icon: <Home className="h-5 w-5" />, action: () => { onNavigate("/"); setIsOpen(false); } },
    { label: t("navbar.about"), icon: <Info className="h-5 w-5" />, action: () => { onNavigate("/about"); setIsOpen(false); } },
    { label: t("navbar.products"), icon: <Package className="h-5 w-5" />, action: () => { onNavigate("/products"); setIsOpen(false); } },
    { label: t("navbar.contact"), icon: <Mail className="h-5 w-5" />, action: () => { onNavigate("/contact"); setIsOpen(false); } },
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
                src={isDark ? darkLogo : lightLogo}
                alt="Data Management Logo"
                className="h-[30px] md:h-[40px] w-auto object-contain"
              />
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex space-x-[30px] text-[14px] font-bold uppercase relative">
              <button onClick={() => onNavigate("/")} className="opacity-80 hover:opacity-100 transition-colors">{t("navbar.home")}</button>
              <button onClick={() => onNavigate("/about")} className="opacity-80 hover:opacity-100 transition-colors">{t("navbar.about")}</button>
              <button onClick={() => onNavigate("/products")} className="opacity-80 hover:opacity-100 transition-colors">{t("navbar.products")}</button>
              <button onClick={() => onNavigate("/contact")} className="opacity-80 hover:opacity-100 transition-colors">{t("navbar.contact")}</button>
            </div>

            {/* Desktop Right Controls */}
            <div className="hidden lg:flex items-center space-x-[20px] font-bold text-[14px]">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  onBlur={() => setTimeout(() => setIsLangOpen(false), 200)}
                  className="text-m-ink px-3 py-1.5 rounded-full bg-m-border hover:bg-m-card-hover opacity-80 hover:opacity-100 flex items-center gap-1.5 transition-all outline-none"
                >
                  <Globe className="h-4 w-4 opacity-75" />
                  <span>{lang === "fr" ? "Français" : "English"}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-32 rounded-xl bg-m-card border border-m-border shadow-xl py-1 z-50"
                    >
                      <button
                        onMouseDown={() => changeLanguage("fr")}
                        className={`w-full px-4 py-2 text-left text-[13px] font-semibold hover:bg-m-bg hover:text-m-red transition-colors ${lang === "fr" ? "text-m-red font-bold" : "text-m-ink"}`}
                      >
                        Français
                      </button>
                      <button
                        onMouseDown={() => changeLanguage("en")}
                        className={`w-full px-4 py-2 text-left text-[13px] font-semibold hover:bg-m-bg hover:text-m-red transition-colors ${lang === "en" ? "text-m-red font-bold" : "text-m-ink"}`}
                      >
                        English
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              {/* Language Dropdown for mobile */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  onBlur={() => setTimeout(() => setIsLangOpen(false), 200)}
                  className="text-m-ink p-2 rounded-full bg-m-border hover:bg-m-card-hover flex items-center gap-1.5 text-[12px] font-bold outline-none"
                >
                  <Globe className="h-4 w-4" />
                  <span>{lang === "fr" ? "FR" : "EN"}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-28 rounded-xl bg-m-card border border-m-border shadow-xl py-1 z-50"
                    >
                      <button
                        onMouseDown={() => changeLanguage("fr")}
                        className={`w-full px-4 py-2 text-left text-[13px] font-semibold hover:bg-m-bg hover:text-m-red transition-colors ${lang === "fr" ? "text-m-red font-bold" : "text-m-ink"}`}
                      >
                        Français
                      </button>
                      <button
                        onMouseDown={() => changeLanguage("en")}
                        className={`w-full px-4 py-2 text-left text-[13px] font-semibold hover:bg-m-bg hover:text-m-red transition-colors ${lang === "en" ? "text-m-red font-bold" : "text-m-ink"}`}
                      >
                        English
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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

            {/* Slide Panel */}
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
                  src={isDark ? darkLogo : lightLogo}
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

              {/* Mobile Slide-out Language Switcher */}
              <div className="px-6 py-6 border-t border-m-border">
                <p className="text-[11px] font-black uppercase tracking-wider text-m-ink-muted mb-3">Language / Langue</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { changeLanguage("fr"); setIsOpen(false); }}
                    className={`flex-1 py-2 px-3 rounded-lg border text-center font-bold text-[13px] transition-all ${lang === "fr" ? "bg-m-red text-white border-m-red" : "border-m-border text-m-ink hover:bg-m-bg"}`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => { changeLanguage("en"); setIsOpen(false); }}
                    className={`flex-1 py-2 px-3 rounded-lg border text-center font-bold text-[13px] transition-all ${lang === "en" ? "bg-m-red text-white border-m-red" : "border-m-border text-m-ink hover:bg-m-bg"}`}
                  >
                    English
                  </button>
                </div>
              </div>

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
