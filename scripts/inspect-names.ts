import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function inspectNames() {
  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, product_id, sku, price, variant_label, attributes");
    
  const { data: products } = await supabase
    .from("Products")
    .select("id, name, category, brand, description");
    
  if (!variants || !products) return;

  console.log(`Total Variants: ${variants.length}`);
  console.log(`Total Products: ${products.length}`);
  
  // Create a map for fast lookup
  const productMap = new Map(products.map(p => [p.id, p]));
  
  console.log("\nSample of products to rename:");
  for (let i = 0; i < Math.min(20, variants.length); i++) {
    const v = variants[i];
    const p = productMap.get(v.product_id);
    if (!p) continue;
    
    console.log(`\n--- Product ${p.id} / Variant ${v.id} ---`);
    console.log(`Current Product Name: ${p.name}`);
    console.log(`Variant Original Name: ${v.attributes?.original_name}`);
    console.log(`Category: ${p.category}`);
    console.log(`Price: ${v.price} MAD (assuming minor units, so ${v.price / 100} MAD)`);
  }
}

inspectNames();
