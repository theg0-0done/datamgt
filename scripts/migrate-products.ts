import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
  throw new Error("Missing Supabase environment variables");
}

const clientKey = supabaseServiceKey || supabaseAnonKey;
const supabase = createClient(supabaseUrl, clientKey);

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

async function runMigration() {
  try {
    console.log("🚀 Starting product-variant migration...\n");

    // Step 1: Verify tables exist (they need to be created via Supabase SQL editor first)
    console.log("📋 Verifying tables exist...");
    const { data: testProducts, error: testError } = await supabase
      .from("products")
      .select("id")
      .limit(1);

    const { data: testVariants, error: testVariantsError } = await supabase
      .from("product_variants")
      .select("id")
      .limit(1);

    if (testError || testVariantsError) {
      console.error("❌ Required tables not found!");
      console.error(
        "⚠️  Please run the following SQL in your Supabase dashboard first:",
      );
      console.error("   1. Go to SQL Editor in Supabase dashboard");
      console.error("   2. Run the SQL from: scripts/migrate-to-variants.sql");
      console.error("   3. Then run this script again");
      process.exit(1);
    }

    console.log("✅ Tables verified\n");

    // Step 2: Fetch existing products from old table
    console.log("📥 Fetching existing products...");
    const { data: oldProducts, error: fetchError } = await supabase
      .from("Products")
      .select("*")
      .order("id", { ascending: true });

    if (fetchError) {
      console.error("❌ Error fetching products:", fetchError);
      return;
    }

    if (!oldProducts || oldProducts.length === 0) {
      console.log("ℹ️  No products found to migrate");
      return;
    }

    console.log(`✅ Found ${oldProducts.length} products\n`);

    // Step 3: Group products by base name
    console.log("🔄 Grouping products by base name...");
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
    console.log("💾 Migrating data to new schema...");
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
        console.error("❌ Error creating product:", productError);
        continue;
      }

      if (!newProduct || newProduct.length === 0) {
        console.error("❌ No product data returned");
        continue;
      }

      const productId = newProduct[0].id;
      productCount++;

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
            is_default: idx === 0, // First item is default
          });

        if (variantError) {
          console.error("❌ Error creating variant:", variantError);
          continue;
        }

        variantCount++;
      }
    }

    console.log(`✅ Migration complete!`);
    console.log(`   📦 Created ${productCount} products`);
    console.log(`   🔢 Created ${variantCount} variants\n`);

    // Step 5: Verify migration
    console.log("🔍 Verifying migration...");
    const { data: productsCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    const { data: variantsCount } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true });

    console.log(`✅ Database verification:`);
    console.log(`   📦 Total products: ${productsCount?.length || 0}`);
    console.log(`   🔢 Total variants: ${variantsCount?.length || 0}\n`);

    console.log("🎉 Migration successful!\n");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
