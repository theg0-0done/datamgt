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

async function runBatchedMigration() {
  try {
    console.log("🚀 Starting Batched Product-Variant Migration to Uppercase 'Products' Schema...\n");

    // 1. Clean out the product_variants table first to avoid foreign key or key constraint errors
    console.log("🧹 Clearing old variants in product_variants table...");
    const { error: clearVariantsError } = await supabase
      .from("product_variants")
      .delete()
      .neq("id", 0); // deletes all rows

    if (clearVariantsError) {
      console.error("❌ Failed to clear product_variants:", clearVariantsError.message);
      process.exit(1);
    }
    console.log("✅ Cleared product_variants table.\n");

    // 2. Fetch all products from Products (uppercase P)
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

    console.log(`✅ Found ${rawProducts.length} raw products. Grouping by base name...`);

    // 3. Group products by base name to identify variants of the same product
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

    console.log(`📋 Grouped into ${Object.keys(productGroups).length} unique parent products.\n`);

    const productsToUpdate: any[] = [];
    const variantsToInsert: any[] = [];
    const redundantProductIds: number[] = [];
    const usedSlugs = new Set<string>();

    // 4. For each group, prepare parent updates, variants, and redundant IDs
    for (const [groupKey, items] of Object.entries(productGroups)) {
      // Sort items by price (ascending) to choose default variant
      items.sort((a, b) => {
        const priceA = parseFloat(String(a.price || 0)) || 0;
        const priceB = parseFloat(String(b.price || 0)) || 0;
        return priceA - priceB;
      });

      const parentItem = items[0]; // Choose first one as the parent model
      const baseName = cleanBaseName(parentItem.name || "Unnamed Product");
      
      // Ensure slug uniqueness
      let slug = toSlug(baseName);
      const originalSlug = slug;
      let counter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
      usedSlugs.add(slug);

      // Prepare parent update data (we must pass all required columns to upsert correctly)
      productsToUpdate.push({
        id: parentItem.id,
        name: baseName,
        slug: slug,
        description: parentItem.description || `High quality ${parentItem.category || "product"} - ${baseName}`,
        brand: parentItem.brand || "Generic",
        base_image: parentItem.image_urls || parentItem.images?.[0] || "/assets/placeholder.png",
        category: parentItem.category || "Uncategorized",
        price: parentItem.price || 0, // keep legacy columns for safety
        quantity: parentItem.quantity || 0,
        updated_at: new Date().toISOString()
      });

      // Prepare variants
      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx];
        const specValue = extractSpecValue(item.name || "");
        const priceInCents = Math.round((parseFloat(String(item.price || 0)) || 0) * 100);
        const stockQuantity = parseInt(String(item.quantity || 10), 10);

        variantsToInsert.push({
          product_id: parentItem.id,
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
      }

      // Prepare redundant IDs to delete
      const extraIds = items.slice(1).map(item => item.id);
      redundantProductIds.push(...extraIds);
    }

    // 5. Perform the batched DB Operations
    console.log("💾 Running batched database operations...");

    // Bulk upsert updated parent products
    console.log(`   📝 Bulk updating ${productsToUpdate.length} parent products...`);
    const { error: upsertError } = await supabase
      .from("Products")
      .upsert(productsToUpdate);

    if (upsertError) {
      console.error("   ❌ Upsert failed:", upsertError.message);
      process.exit(1);
    }
    console.log("   ✅ Bulk updates completed.");

    // Bulk insert all product variants (in chunks of 100 rows to prevent query payload limits)
    console.log(`   📦 Bulk inserting ${variantsToInsert.length} variants...`);
    const chunkSize = 100;
    for (let i = 0; i < variantsToInsert.length; i += chunkSize) {
      const chunk = variantsToInsert.slice(i, i + chunkSize);
      const { error: insertError } = await supabase
        .from("product_variants")
        .insert(chunk);

      if (insertError) {
        console.error(`   ❌ Variant chunk insertion failed [index ${i}]:`, insertError.message);
        process.exit(1);
      }
    }
    console.log("   ✅ Bulk variant insertion completed.");

    // Bulk delete redundant product rows
    if (redundantProductIds.length > 0) {
      console.log(`   🗑️ Bulk deleting ${redundantProductIds.length} redundant products...`);
      // Chunk deleting just to be ultra safe
      for (let i = 0; i < redundantProductIds.length; i += chunkSize) {
        const chunk = redundantProductIds.slice(i, i + chunkSize);
        const { error: deleteError } = await supabase
          .from("Products")
          .delete()
          .in("id", chunk);

        if (deleteError) {
          console.error(`   ❌ Redundant deletion failed [index ${i}]:`, deleteError.message);
          process.exit(1);
        }
      }
      console.log("   ✅ Bulk redundant deletion completed.");
    }

    console.log("\n🎉 Batched database data migration completed successfully!");
    console.log(`   📦 Parent products configured: ${productsToUpdate.length}`);
    console.log(`   🔢 Variants created: ${variantsToInsert.length}`);
    console.log(`   🗑️ Redundant products deleted: ${redundantProductIds.length}\n`);

  } catch (error: any) {
    console.error("❌ Batched migration process failed:", error.message || error);
    process.exit(1);
  }
}

runBatchedMigration();
