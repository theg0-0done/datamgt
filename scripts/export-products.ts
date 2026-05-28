import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function exportProducts() {
  const { data: variants } = await supabase
    .from("product_variants")
    .select("product_id, price");
    
  const { data: products } = await supabase
    .from("Products")
    .select("id, name, category, brand");
    
  if (!variants || !products) return;

  // Get min price per product
  const priceMap = new Map();
  for (const v of variants) {
    const currentPrice = priceMap.get(v.product_id) || Infinity;
    if (v.price < currentPrice) {
      priceMap.set(v.product_id, v.price);
    }
  }

  const exportData = products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price_mad: (priceMap.get(p.id) || 0) / 100 // converting minor units to MAD
  }));

  fs.writeFileSync(path.resolve(__dirname, "../products_export.json"), JSON.stringify(exportData, null, 2));
  console.log("Exported all products to products_export.json");
}

exportProducts();
