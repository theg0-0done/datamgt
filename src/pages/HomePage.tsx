import React from "react";
import { Hero } from "../components/Hero";
import { BentoCategory } from "../components/BentoCategory";
import { FeaturesBar } from "../components/FeaturesBar";
import { PromoBanners } from "../components/PromoBanners";
import { TopProducts } from "../components/TopProducts";
import { FAQSection } from "../components/FAQSection";
import { ContactSection } from "../components/ContactSection";

export function HomePage({
  onCategoryClick,
  onProductClick,
  onAddToCart,
  onBuyNow,
  searchQuery,
}: {
  onCategoryClick: (category: string) => void;
  onProductClick: (id: string) => void;
  onAddToCart: (product: any, e: React.MouseEvent) => void;
  onBuyNow: (product: any, e: React.MouseEvent) => void;
  searchQuery: string;
}) {
  return (
    <>
      <Hero onBuyNow={onBuyNow} />
      <BentoCategory onCategoryClick={onCategoryClick} />
      <FeaturesBar />
      <PromoBanners onBuyNow={onBuyNow} />
      <TopProducts
        onProductClick={onProductClick}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
        searchQuery={searchQuery}
      />
      <FAQSection />
      <ContactSection />
    </>
  );
}
