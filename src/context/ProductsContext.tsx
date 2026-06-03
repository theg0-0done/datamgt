import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { Product, ProductOption, ProductVariant } from "../utils/productUtils";

export type { Product, ProductOption, ProductVariant };

interface ProductsContextType {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from("Products")
          .select(
            `
            id,
            name,
            slug,
            description,
            category,
            brand,
            base_image,
            price,
            quantity,
            product_variants (
              product_name,
              options,
              prices,
              stocks
            )
          `,
          )
          .order("id", { ascending: true });

        if (productsError) {
          throw productsError;
        }

        if (productsData && productsData.length > 0) {
          const mappedProducts = productsData.map((product: any) => {
            const variantsData = product.product_variants;
            const variantsObj = Array.isArray(variantsData) ? variantsData[0] : variantsData;

            const hasOptions = variantsObj && variantsObj.options && variantsObj.options.length > 0;

            let displayPrice = "0.00 MAD";
            let quantity = 0;
            let options: any[] = [];

            if (hasOptions) {
              const opts = variantsObj.options;
              const prices = variantsObj.prices || [];
              const stocks = variantsObj.stocks || [];

              // Map options
              options = opts.map((opt: string, index: number) => {
                const optPrice = prices[index] || 0;
                const optStock = stocks[index] || 0;
                return {
                  id: `${product.id}-${index}`,
                  name: product.name,
                  specValue: opt,
                  price: `${optPrice.toFixed(2)} MAD`,
                  quantity: optStock,
                  image: product.base_image || "/assets/placeholder.png",
                  images: [product.base_image || "/assets/placeholder.png"],
                  variantData: {
                    sku: `${product.slug || product.id}-${opt}`,
                    attributes: { spec_value: opt },
                    is_default: index === 0,
                    product_variant_id: `${product.id}-${index}`,
                    image_urls: [product.base_image || "/assets/placeholder.png"],
                  },
                };
              });

              displayPrice = options[0] ? options[0].price : "0.00 MAD";
              quantity = stocks.reduce((sum: number, s: number) => sum + s, 0);
            } else {
              // No options - use base product values
              const basePrice = product.price || 0;
              displayPrice = `${basePrice.toFixed(2)} MAD`;
              quantity = product.quantity || 0;
            }

            const defaultImages = [product.base_image || "/assets/placeholder.png"];

            return {
              id: product.id,
              name: product.name,
              slug: product.slug,
              category: product.category || "Uncategorized",
              price: displayPrice,
              image: defaultImages[0],
              images: defaultImages,
              colors: ["#1a1a1a", "#ffffff"],
              description: product.description,
              quantity: quantity,
              options: options,
            };
          });

          setProducts(mappedProducts);
          setCategories([
            "All",
            ...(new Set(
              mappedProducts.map((p: Product) => p.category),
            ) as Set<string>),
          ]);
        }
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, categories, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
