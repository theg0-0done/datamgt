import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyDatabase() {
  try {
    console.log("📊 Verifying Updated Database Schema...\n");

    // 1. Query Products (uppercase P) and check columns and total records
    console.log("🔍 Checking 'Products' table...");
    const { data: products, error: pError } = await supabase
      .from("Products")
      .select("id, name, slug, description, category, brand, base_image")
      .limit(5);

    if (pError) {
      console.error("❌ Error querying 'Products' table:", pError.message);
      process.exit(1);
    }

    const { count: totalProducts, error: pCountError } = await supabase
      .from("Products")
      .select("id", { count: "exact", head: true });

    if (pCountError) {
      console.error("❌ Error getting products count:", pCountError.message);
      process.exit(1);
    }

    console.log(`✅ 'Products' table is fully accessible.`);
    console.log(`   📦 Total parent products: ${totalProducts}`);
    console.log("   📝 Sample Products:");
    products?.forEach(p => {
      console.log(`      - ID ${p.id}: "${p.name}" (Slug: ${p.slug}, Category: ${p.category})`);
    });

    console.log("");

    // 2. Query product_variants table and check total records
    console.log("🔍 Checking 'product_variants' table...");
    const { data: variants, error: vError } = await supabase
      .from("product_variants")
      .select("id, product_id, sku, variant_label, price, stock_quantity, is_default")
      .limit(5);

    if (vError) {
      console.error("❌ Error querying 'product_variants' table:", vError.message);
      process.exit(1);
    }

    const { count: totalVariants, error: vCountError } = await supabase
      .from("product_variants")
      .select("id", { count: "exact", head: true });

    if (vCountError) {
      console.error("❌ Error getting variants count:", vCountError.message);
      process.exit(1);
    }

    console.log(`✅ 'product_variants' table is fully accessible.`);
    console.log(`   🔢 Total product variants: ${totalVariants}`);
    console.log("   📝 Sample Variants:");
    variants?.forEach(v => {
      console.log(`      - ID ${v.id}: SKU "${v.sku}" (Label: ${v.variant_label}, Price: $${(v.price / 100).toFixed(2)}, Stock: ${v.stock_quantity})`);
    });

    console.log("");

    // 3. Verify standard product-variant relation join query
    console.log("🔍 Testing product-variant relation join...");
    const { data: joinData, error: joinError } = await supabase
      .from("Products")
      .select(`
        id,
        name,
        product_variants (
          id,
          sku,
          variant_label,
          price
        )
      `)
      .limit(3);

    if (joinError) {
      console.error("❌ Relation join query failed:", joinError.message);
      process.exit(1);
    }

    console.log("✅ Relation join query succeeded!");
    joinData?.forEach(p => {
      const vCount = p.product_variants ? (p.product_variants as any[]).length : 0;
      console.log(`      - "${p.name}" has ${vCount} variants configured.`);
    });

    console.log("\n🎉 SCHEMA VERIFICATION SUCCESSFUL!");
  } catch (err: any) {
    console.error("❌ Verification failed:", err.message || err);
  }
}

verifyDatabase();
