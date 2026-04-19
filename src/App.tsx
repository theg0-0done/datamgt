import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { SiteFooter } from "./components/SiteFooter";
import { CartMenu } from "./components/CartMenu";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { AllProductsPage } from "./pages/AllProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
      if (window.location.pathname !== "/products") {
        navigate(`/products?${newParams.toString()}`);
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
    if (window.location.pathname !== "/products") {
      navigate(`/products?${newParams.toString()}`);
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

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}?${searchParams.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
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
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <main className="flex-grow flex flex-col relative w-full">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                onCategoryClick={handleCategoryChange}
                onProductClick={handleProductClick}
                onAddToCart={addToCart}
                searchQuery={searchQuery}
              />
            } 
          />
          <Route 
            path="/about" 
            element={<AboutPage />} 
          />
          <Route 
            path="/products" 
            element={
              <AllProductsPage 
                categoryFilter={categoryFilter}
                searchQuery={searchQuery}
                currentPage={paginationPage}
                onCategoryChange={handleCategoryChange}
                onPageChange={handlePageChange}
                onProductClick={handleProductClick}
                onAddToCart={addToCart}
              />
            } 
          />
          <Route
            path="/product/:id"
            element={
              <React.Fragment key={window.location.pathname}>
                <ProductDetailPageWrapper 
                   onAddToCart={addToCart}
                />
              </React.Fragment>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <SiteFooter />

      <CartMenu
        isOpen={isCartOpen}
        onClose={() => toggleCart(false)}
        cart={cart}
        onRemoveFromCart={removeFromCart}
      />
    </div>
  );
}

// Helper wrapper for the detail page to extract route parameter and history
import { useParams } from "react-router-dom";
function ProductDetailPageWrapper({ onAddToCart }: { onAddToCart: (p: any, e: any, qty?: number) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <ProductDetailPage 
      productId={id || ""} 
      onBack={() => navigate(-1)} 
      onAddToCart={onAddToCart}
    />
  );
}

export default App;
