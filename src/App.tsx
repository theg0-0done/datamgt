import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useSearchParams, Navigate, useParams } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { SiteFooter } from "./components/SiteFooter";
import { CartMenu } from "./components/CartMenu";
import { QuickAddModal } from "./components/QuickAddModal";
import { BuyNowModal } from "./components/BuyNowModal";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AllProductsPage } from "./pages/AllProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { TopProductsProvider } from "./context/TopProductsContext";

function NavigateToDefaultLanguage() {
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  return <Navigate to={`/fr${currentPath}${currentSearch}`} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/fr" replace />} />
      <Route path="/:lang/*" element={<MainLayout />} />
      <Route path="*" element={<NavigateToDefaultLanguage />} />
    </Routes>
  );
}

function MainLayout() {
  const { lang } = useParams<{ lang?: string }>();

  if (lang !== "fr" && lang !== "en") {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    // Strip dynamic prefix if it's invalid, and prepend /fr
    const cleanPath = currentPath.replace(/^\/(?:fr|en)/, '');
    return <Navigate to={`/fr${cleanPath}${currentSearch}`} replace />;
  }

  return (
    <LanguageProvider>
      <TopProductsProvider>
        <MainLayoutContent />
      </TopProductsProvider>
    </LanguageProvider>
  );
}

function MainLayoutContent() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang } = useLanguage();

  // Root State: Theme (localStorage)
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const isDark = theme === "dark";

  // Root States synchronized with URL (Remaining ones)
  const isCartOpen = searchParams.get("cart") === "open";
  const searchQuery = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "All";
  const paginationPage = parseInt(searchParams.get("p") || "1", 10);

  // Cart State
  const [cart, setCart] = useState<any[]>(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Quick Add State
  const [quickAddProduct, setQuickAddProduct] = useState<any>(null);

  // Buy Now State
  const [buyNowProduct, setBuyNowProduct] = useState<any>(null);
  const [buyNowCartItems, setBuyNowCartItems] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Apply Theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, isDark]);

  // Handlers
  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const handleSearchChange = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set("q", query);
      if (window.location.pathname !== `/${lang}/products`) {
        navigate(`/${lang}/products?${newParams.toString()}`);
        return;
      }
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    newParams.set("p", "1"); // reset page
    if (window.location.pathname !== `/${lang}/products`) {
      navigate(`/${lang}/products?${newParams.toString()}`);
    } else {
      setSearchParams(newParams);
    }
  };

  const handlePageChange = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (p === 1) {
      newParams.delete("p");
    } else {
      newParams.set("p", p.toString());
    }
    setSearchParams(newParams);
  };

  const toggleCart = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("cart", "open");
    } else {
      newParams.delete("cart");
    }
    setSearchParams(newParams);
  };

  const addToCart = (product: any, e: React.MouseEvent, qty: number = 1) => {
    e.stopPropagation();
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: qty }];
      }
    });
  };

  const handleQuickAddOpen = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickAddProduct(product);
  };

  const handleBuyNowOpen = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setBuyNowCartItems(undefined);
    setBuyNowProduct(product);
  };

  const handleCartCheckout = () => {
    if (cart.length === 0) return;
    toggleCart(false);
    setBuyNowCartItems(cart);
    setBuyNowProduct(cart[0]);
  };

  const handleOrderComplete = () => {
    if (buyNowCartItems && buyNowCartItems.length > 0) {
      setCart([]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleProductClick = (id: string) => {
    navigate(`/${lang}/product/${id}?${searchParams.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (path: string) => {
    let targetPath = path;
    if (!path.startsWith("/fr") && !path.startsWith("/en") && !path.startsWith("/fr/") && !path.startsWith("/en/")) {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      targetPath = `/${lang}${cleanPath}`;
    }
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-m-bg text-m-ink selection:bg-m-red selection:text-white flex flex-col font-sans transition-colors duration-300">
      <Navbar
        toggleTheme={toggleTheme}
        isDark={isDark}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => toggleCart(true)}
      />

      <main className="flex-grow flex flex-col relative w-full">
        <Routes>
          <Route
            path=""
            element={
              <HomePage
                onCategoryClick={handleCategoryChange}
                onProductClick={handleProductClick}
                onAddToCart={handleQuickAddOpen}
                onBuyNow={handleBuyNowOpen}
                searchQuery={searchQuery}
              />
            }
          />
          <Route
            path="about"
            element={<AboutPage />}
          />
          <Route
            path="contact"
            element={<ContactPage />}
          />
          <Route
            path="products"
            element={
              <AllProductsPage
                categoryFilter={categoryFilter}
                searchQuery={searchQuery}
                currentPage={paginationPage}
                onCategoryChange={handleCategoryChange}
                onPageChange={handlePageChange}
                onProductClick={handleProductClick}
                onAddToCart={handleQuickAddOpen}
                onBuyNow={handleBuyNowOpen}
                onSearchChange={handleSearchChange}
              />
            }
          />
          <Route
            path="product/:id"
            element={
              <React.Fragment key={window.location.pathname}>
                <ProductDetailPageWrapper
                  onAddToCart={(p, e) => {
                    addToCart(p, e);
                    toggleCart(true);
                  }}
                  onBuyNow={handleBuyNowOpen}
                />
              </React.Fragment>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <SiteFooter isDark={isDark} />

      <CartMenu
        isOpen={isCartOpen}
        onClose={() => toggleCart(false)}
        cart={cart}
        onRemoveFromCart={removeFromCart}
        onCheckout={handleCartCheckout}
      />

      <QuickAddModal
        isOpen={quickAddProduct !== null}
        onClose={() => setQuickAddProduct(null)}
        product={quickAddProduct}
        onAddToCart={addToCart}
        onBuyNow={handleBuyNowOpen}
      />

      <BuyNowModal
        isOpen={buyNowProduct !== null}
        onClose={() => { setBuyNowProduct(null); setBuyNowCartItems(undefined); }}
        product={buyNowProduct}
        cartItems={buyNowCartItems}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
}

function ProductDetailPageWrapper({ onAddToCart, onBuyNow }: { onAddToCart: (p: any, e: any, qty?: number) => void; onBuyNow: (p: any, e: any) => void }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <ProductDetailPage
      productId={id || ""}
      onBack={() => navigate(-1)}
      onAddToCart={onAddToCart}
      onBuyNow={onBuyNow}
    />
  );
}

export default App;
