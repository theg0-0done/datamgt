import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  try {
    console.log("📊 Checking database...\n");

    // Check for products in old schema
    const { data: oldProducts, error: oldError } = await supabase
      .from("Products")
      .select("*")
      .limit(5);

    if (!oldError) {
      console.log(
        `✅ Old schema (Products table): Found ${oldProducts?.length || 0} products`,
      );
      if (oldProducts && oldProducts.length > 0) {
        console.log("   Sample:", {
          name: oldProducts[0].name,
          category: oldProducts[0].category,
          price: oldProducts[0].price,
        });
      }
    } else {
      console.log("❌ Old schema (Products table): Not accessible");
    }

    console.log("");

    // Check for new schema
    const { data: newProducts, error: newProductsError } = await supabase
      .from("products")
      .select("id, name")
      .limit(1);

    const { data: newVariants, error: newVariantsError } = await supabase
      .from("product_variants")
      .select("id")
      .limit(1);

    if (!newProductsError && !newVariantsError) {
      console.log("✅ New schema (products/product_variants tables): EXISTS");
      console.log(`   Products: ${newProducts?.length || 0} records`);
      console.log(`   Variants: ${newVariants?.length || 0} records`);
    } else {
      console.log("❌ New schema: Tables not found or not accessible");
      if (newProductsError)
        console.log("   products error:", newProductsError.message);
      if (newVariantsError)
        console.log("   product_variants error:", newVariantsError.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkDatabase();
