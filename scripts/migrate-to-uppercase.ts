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
  console.error("❌ Missing Supabase environment variables in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Utility to convert name to slug
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Extract spec value from product name (sizes, capacities, lengths, colors, etc.)
function extractSpecValue(name: string): string {
  const lengthRegex = /\b(\d+(?:\.\d+)?\s*(?:[mM]\b|metre|metres|meters|Meters))\b/i;
  const capacityRegex = /\b(\d+\s*(?:GB|Gb|gb|TB|Tb|tb|ML|Ml|ml|pouce|pouces|inch|inches|"))\b/i;
  const resolutionRegex = /\b(\d+\s*[mM][pP](?:\/\d+[mM])?)\b/i;
  const modelRegex = /\b([eE]\d{3})\b/i;
  const colorRegex = /\b(Noir|Bleu|Jaune|Rouge|Vert|Blanc|Black|Blue|Yellow|Red|Green|White|Couleur)\b/i;

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

// Clean product name to get a base product name (removing details)
function cleanBaseName(name: string): string {
  const lengthRegex = /\b(\d+(?:\.\d+)?\s*(?:[mM]\b|metre|metres|meters|Meters))\b/i;
  const capacityRegex = /\b(\d+\s*(?:GB|Gb|gb|TB|Tb|tb|ML|Ml|ml|pouce|pouces|inch|inches|"))\b/i;
  const resolutionRegex = /\b(\d+\s*[mM][pP](?:\/\d+[mM])?)\b/i;
  const modelRegex = /\b([eE]\d{3})\b/i;
  const colorRegex = /\b(Noir|Bleu|Jaune|Rouge|Vert|Blanc|Black|Blue|Yellow|Red|Green|White|Couleur)\b/i;

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
    console.log("🚀 Starting Product-Variant Migration to Uppercase 'Products' Schema...\n");

    // 1. Fetch current data in Products (uppercase P)
    console.log("📥 Fetching raw products from 'Products' table...");
    const { data: rawProducts, error: fetchError } = await supabase
      .from("Products")
      .select("*")
      .order("id", { ascending: true });

    if (fetchError) {
      console.error("❌ Error fetching from Products table:", fetchError.message);
      process.exit(1);
    }

    if (!rawProducts || rawProducts.length === 0) {
      console.log("ℹ️ No products found in 'Products' table to migrate.");
      process.exit(0);
    }

    console.log(`✅ Found ${rawProducts.length} raw products. Grouping by base name...\n`);

    // 2. Group products by base name to identify variants of the same product
    const productGroups: Record<string, any[]> = {};
    rawProducts.forEach((product) => {
      const baseName = cleanBaseName(product.name || "Unnamed Product");
      const category = product.category || "Uncategorized";
      const key = `${category}::${baseName}`.toLowerCase();

      if (!productGroups[key]) {
        productGroups[key] = [];
      }
      productGroups[key].push(product);
    });

    console.log(`📋 Grouped into ${Object.keys(productGroups).length} unique parent products.`);

    let migratedParents = 0;
    let createdVariants = 0;

    // 3. For each group, we keep ONE product in "Products" and drop the rest, linking all as variants
    for (const [groupKey, items] of Object.entries(productGroups)) {
      // Sort items by price (ascending) to choose default variant
      items.sort((a, b) => {
        const priceA = parseFloat(String(a.price || 0)) || 0;
        const priceB = parseFloat(String(b.price || 0)) || 0;
        return priceA - priceB;
      });

      const parentItem = items[0]; // Choose first one as the parent model
      const baseName = cleanBaseName(parentItem.name || "Unnamed Product");
      const slug = toSlug(baseName);

      console.log(`\n🔄 Processing product group: "${baseName}"`);

      // Update the parent item columns in the "Products" table
      console.log(`   📝 Upgrading parent product record (ID: ${parentItem.id})...`);
      const { error: updateError } = await supabase
        .from("Products")
        .update({
          name: baseName,
          slug: slug,
          description: parentItem.description || `High quality ${parentItem.category || "product"} - ${baseName}`,
          brand: parentItem.brand || "Generic",
          base_image: parentItem.image_urls || parentItem.images?.[0] || "/assets/placeholder.png",
          updated_at: new Date().toISOString()
        })
        .eq("id", parentItem.id);

      if (updateError) {
        console.error(`   ❌ Failed to update parent product ${parentItem.id}:`, updateError.message);
        continue;
      }

      migratedParents++;

      // Create variants for each item in the group
      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx];
        const specValue = extractSpecValue(item.name || "");
        
        // Convert price to cents (price in old DB is stored as e.g., 200, representing either cents or dollars.
        // Let's assume standard price stored is in base currency, so we multiply by 100 for cents).
        const priceInCents = Math.round((parseFloat(String(item.price || 0)) || 0) * 100);
        const stockQuantity = parseInt(String(item.quantity || 10), 10);

        console.log(`   📦 Adding variant: "${specValue || 'Default'}" - SKU: ${slug.toUpperCase()}-${idx + 1}`);

        const { error: variantError } = await supabase
          .from("product_variants")
          .insert({
            product_id: parentItem.id, // References uppercase Products
            sku: `${slug.toUpperCase()}-${idx + 1}`,
            variant_label: specValue || `Standard`,
            attributes: {
              original_name: item.name,
              spec_value: specValue || null,
            },
            price: priceInCents,
            stock_quantity: stockQuantity,
            is_default: idx === 0,
          });

        if (variantError) {
          console.error(`   ❌ Failed to create variant:`, variantError.message);
        } else {
          createdVariants++;
        }
      }

      // If there were other redundant product rows in the group, delete them from "Products"
      const extraIds = items.slice(1).map(item => item.id);
      if (extraIds.length > 0) {
        console.log(`   🗑️ Deleting redundant product records (IDs: ${extraIds.join(", ")})...`);
        const { error: deleteError } = await supabase
          .from("Products")
          .delete()
          .in("id", extraIds);

        if (deleteError) {
          console.error(`   ❌ Error deleting extra product records:`, deleteError.message);
        }
      }
    }

    console.log("\n🎉 Database data migration completed successfully!");
    console.log(`   📦 Parent products configured: ${migratedParents}`);
    console.log(`   🔢 Variants created: ${createdVariants}\n`);

  } catch (error: any) {
    console.error("❌ Migration process failed:", error.message || error);
    process.exit(1);
  }
}

runMigration();
