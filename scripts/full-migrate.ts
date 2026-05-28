import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utility to convert name to slug
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Extract spec value from product name
function extractSpecValue(name: string): string {
  const lengthRegex =
    /\b(\d+(?:\.\d+)?\s*(?:[mM]\b|metre|metres|meters|Meters))\b/i;
  const capacityRegex =
    /\b(\d+\s*(?:GB|Gb|gb|TB|Tb|tb|ML|Ml|ml|pouce|pouces|inch|inches|"))\b/i;
  const resolutionRegex = /\b(\d+\s*[mM][pP](?:\/\d+[mM])?)\b/i;
  const modelRegex = /\b([eE]\d{3})\b/i;
  const colorRegex =
    /\b(Noir|Bleu|Jaune|Rouge|Vert|Blanc|Black|Blue|Yellow|Red|Green|White|Couleur)\b/i;

  const lengthMatch = name.match(lengthRegex);
  if (lengthMatch) return lengthMatch[1];

  const capacityMatch = name.match(capacityRegex);
  if (capacityMatch) return capacityMatch[1];

  const resolutionMatch = name.match(resolutionRegex);
  if (resolutionMatch) return resolutionMatch[1];

  const modelMatch = name.match(modelRegex);
  if (modelMatch) return modelMatch[1];

  const colorMatch = name.match(colorRegex);
  if (colorMatch) return colorMatch[1];

  return "";
}

// Clean base name
function cleanBaseName(name: string): string {
  const lengthRegex =
    /\b(\d+(?:\.\d+)?\s*(?:[mM]\b|metre|metres|meters|Meters))\b/i;
  const capacityRegex =
    /\b(\d+\s*(?:GB|Gb|gb|TB|Tb|tb|ML|Ml|ml|pouce|pouces|inch|inches|"))\b/i;
  const resolutionRegex = /\b(\d+\s*[mM][pP](?:\/\d+[mM])?)\b/i;
  const modelRegex = /\b([eE]\d{3})\b/i;
  const colorRegex =
    /\b(Noir|Bleu|Jaune|Rouge|Vert|Blanc|Black|Blue|Yellow|Red|Green|White|Couleur)\b/i;

  let cleaned = name
    .replace(lengthRegex, "")
    .replace(capacityRegex, "")
    .replace(resolutionRegex, "")
    .replace(modelRegex, "")
    .replace(colorRegex, "")
    .replace(/\s+/g, " ")
    .replace(/[-–—/()]+$/, "")
    .replace(/^[-–—/()]+/, "")
    .trim();

  if (cleaned.length < 3) {
    cleaned = name.trim();
  }

  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

async function runFullMigration() {
  try {
    console.log("🚀 Starting Product-Variant Full Migration\n");

    // Step 1: Check if new tables exist, if not we can't proceed without service role
    console.log("📋 Checking table availability...");
    const { error: checkError } = await supabase
      .from("products")
      .select("id")
      .limit(1);

    if (
      checkError &&
      !checkError.message.includes("Could not find the table")
    ) {
      // Different error, might be RLS
      console.log("⚠️  Note: Tables might exist but have RLS restrictions");
    }

    if (checkError && checkError.message.includes("Could not find the table")) {
      console.log("❌ New tables not found!\n");
      console.log("📌 You need to create the tables first:");
      console.log("");
      console.log("   Option 1 (Recommended): Use Supabase Dashboard");
      console.log("   ────────────────────────────────────────────");
      console.log("   1. Go to: https://supabase.com/dashboard");
      console.log("   2. Select your project");
      console.log('   3. Click "SQL Editor" (left menu)');
      console.log('   4. Click "New Query"');
      console.log("   5. Copy SQL from: scripts/migrate-to-variants.sql");
      console.log('   6. Paste and click "Run"');
      console.log("   7. Run this script again");
      console.log("");
      console.log("   Option 2: Provide a service role key");
      console.log("   ──────────────────────────────────────────");
      console.log("   Add to .env:");
      console.log("   SUPABASE_SERVICE_KEY=<your-service-role-key>");
      console.log("   Then I can run the SQL automatically");
      console.log("");
      process.exit(1);
    }

    console.log("✅ Tables exist\n");

    // Step 2: Fetch all products from old schema
    console.log("📥 Fetching existing products...");
    const { data: oldProducts, error: fetchError } = await supabase
      .from("Products")
      .select("*")
      .order("id", { ascending: true });

    if (fetchError) {
      console.error("❌ Error fetching products:", fetchError);
      process.exit(1);
    }

    if (!oldProducts || oldProducts.length === 0) {
      console.log("ℹ️  No products found to migrate");
      return;
    }

    console.log(`✅ Found ${oldProducts.length} products\n`);

    // Step 3: Group products by base name
    console.log("🔄 Processing products...");
    const productGroups: Record<string, any[]> = {};

    oldProducts.forEach((product) => {
      const baseName = cleanBaseName(product.name || "Unnamed");
      const key =
        `${product.category || "Uncategorized"}::${baseName}`.toLowerCase();

      if (!productGroups[key]) {
        productGroups[key] = [];
      }
      productGroups[key].push(product);
    });

    console.log(
      `✅ Grouped into ${Object.keys(productGroups).length} product groups\n`,
    );

    // Step 4: Migrate data
    console.log("💾 Inserting products and variants...\n");
    let productCount = 0;
    let variantCount = 0;

    for (const [groupKey, items] of Object.entries(productGroups)) {
      // Sort by price to determine default
      items.sort((a, b) => {
        const priceA =
          parseFloat(String(a.price || 0).replace(/[^\d.]/g, "")) || 0;
        const priceB =
          parseFloat(String(b.price || 0).replace(/[^\d.]/g, "")) || 0;
        return priceA - priceB;
      });

      const defaultItem = items[0];
      const baseName = cleanBaseName(defaultItem.name || "Unnamed Product");
      const slug = toSlug(baseName);

      try {
        // Insert product
        const { data: newProduct, error: productError } = await supabase
          .from("products")
          .insert({
            name: baseName,
            slug: slug,
            description:
              defaultItem.description ||
              `High quality ${defaultItem.category || "product"}`,
            category: defaultItem.category || "Uncategorized",
            brand: defaultItem.brand || null,
            base_image:
              defaultItem.image_urls ||
              defaultItem.images?.[0] ||
              "/assets/placeholder.png",
          })
          .select();

        if (productError) {
          console.error(
            `⚠️  Error creating product "${baseName}":`,
            productError.message,
          );
          continue;
        }

        if (!newProduct || newProduct.length === 0) {
          console.error(`⚠️  No product data returned for "${baseName}"`);
          continue;
        }

        const productId = newProduct[0].id;
        productCount++;
        console.log(`✅ Product: ${baseName} (ID: ${productId})`);

        // Insert variants
        for (let idx = 0; idx < items.length; idx++) {
          const item = items[idx];
          const specValue = extractSpecValue(item.name || "");
          const price = Math.round(
            parseFloat(String(item.price || 0).replace(/[^\d.]/g, "")) * 100,
          );
          const stock = item.quantity || 0;

          const { error: variantError } = await supabase
            .from("product_variants")
            .insert({
              product_id: productId,
              sku: `${slug.toUpperCase()}-${idx + 1}`,
              variant_label: specValue || `Variant ${idx + 1}`,
              attributes: {
                original_name: item.name,
                spec_value: specValue,
              },
              price: price,
              stock_quantity: stock,
              is_default: idx === 0,
            });

          if (variantError) {
            console.error(
              `   ⚠️  Error creating variant:`,
              variantError.message,
            );
            continue;
          }

          variantCount++;
          console.log(
            `   📦 Variant: ${specValue || `Variant ${idx + 1}`} - $${(price / 100).toFixed(2)} (${stock} in stock)`,
          );
        }

        console.log("");
      } catch (error) {
        console.error(`❌ Error processing product group:`, error);
      }
    }

    console.log("\n✅ Migration Complete!");
    console.log(`   📦 Created ${productCount} products`);
    console.log(`   🔢 Created ${variantCount} variants\n`);

    // Step 5: Verify
    console.log("🔍 Verifying migration...");
    const { data: productsCheck } = await supabase.from("products").select("*");

    const { data: variantsCheck } = await supabase
      .from("product_variants")
      .select("*");

    console.log(`✅ Database state:`);
    console.log(`   📦 Total products: ${productsCheck?.length || 0}`);
    console.log(`   🔢 Total variants: ${variantsCheck?.length || 0}\n`);

    console.log("🎉 Ready to use!");
    console.log("   Start the app: npm run dev");
    console.log("   The app will automatically use the new schema.\n");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runFullMigration();
