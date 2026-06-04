import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabaseClient";

export interface TopProduct {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  category: string;
  brand?: string;
  image: string;       // mapped from base_image
  price: string;       // formatted "X.XX MAD"
  old_price?: string;  // formatted "X.XX MAD"
  badge?: string;
  quantity: number;
}

interface TopProductsContextType {
  topProducts: TopProduct[];
  loading: boolean;
  error: string | null;
}

const TopProductsContext = createContext<TopProductsContextType | undefined>(
  undefined
);

export function TopProductsProvider({ children }: { children: ReactNode }) {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const { data, error: fetchError } = await supabase
          .from("top_products")
          .select(
            "id, name, slug, description, category, brand, base_image, price, old_price, badge, quantity"
          )
          .order("id", { ascending: true });

        if (fetchError) throw fetchError;

        if (data) {
          const mapped: TopProduct[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description,
            category: row.category || "Uncategorized",
            brand: row.brand,
            image: row.base_image || "/assets/placeholder.png",
            price: row.price != null ? `${Number(row.price).toFixed(2)} MAD` : "0.00 MAD",
            old_price: row.old_price != null ? `${Number(row.old_price).toFixed(2)} MAD` : undefined,
            badge: row.badge ?? undefined,
            quantity: row.quantity ?? 0,
          }));
          setTopProducts(mapped);
        }
      } catch (err: any) {
        console.error("Error fetching top_products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTopProducts();
  }, []);

  return (
    <TopProductsContext.Provider value={{ topProducts, loading, error }}>
      {children}
    </TopProductsContext.Provider>
  );
}

export function useTopProducts() {
  const context = useContext(TopProductsContext);
  if (context === undefined) {
    throw new Error("useTopProducts must be used within a TopProductsProvider");
  }
  return context;
}
