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
            product_variants (
              id,
              sku,
              variant_label,
              attributes,
              price,
              stock_quantity,
              is_default,
              image_urls
            )
          `,
          )
          .order("id", { ascending: true });

        if (productsError) {
          throw productsError;
        }

        if (productsData && productsData.length > 0) {
          const mappedProducts = productsData.map((product: any) => {
            // Find default variant or first variant
            const variants = product.product_variants || [];
            const defaultVariant = variants.find((v: any) => v.is_default) || variants[0];
            const displayPrice = defaultVariant 
                ? `${defaultVariant.price.toFixed(2)} MAD` 
                : "0.00 MAD";

            const defaultVariantImages = defaultVariant && defaultVariant.image_urls && defaultVariant.image_urls.length > 0
              ? defaultVariant.image_urls
              : [product.base_image || "/assets/placeholder.png"];

            return {
              id: product.id,
              name: product.name,
              slug: product.slug,
              category: product.category || "Uncategorized",
              price: displayPrice,
              image: defaultVariantImages[0],
              images: defaultVariantImages,
              colors: ["#1a1a1a", "#ffffff"],
              description: product.description,
              quantity: variants.reduce(
                (sum: number, v: any) => sum + v.stock_quantity,
                0,
              ),
              options: variants.map((variant: any) => {
                const variantImages = variant.image_urls && variant.image_urls.length > 0
                  ? variant.image_urls
                  : [product.base_image || "/assets/placeholder.png"];

                return {
                  id: variant.id,
                  name: product.name,
                  specValue: variant.variant_label,
                  price: `${variant.price.toFixed(2)} MAD`,
                  quantity: variant.stock_quantity,
                  image: variantImages[0],
                  images: variantImages,
                  variantData: {
                    sku: variant.sku,
                    attributes: variant.attributes,
                    is_default: variant.is_default,
                    product_variant_id: variant.id,
                    image_urls: variant.image_urls || [],
                  },
                };
              }),
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
