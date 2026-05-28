import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables relative to this scripts directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function applyRenames() {
  const renamesPath = path.resolve(__dirname, "../proposed_renames.json");
  if (!fs.existsSync(renamesPath)) {
    console.error("❌ proposed_renames.json not found! Please generate it first.");
    return;
  }

  const renames = JSON.parse(fs.readFileSync(renamesPath, "utf-8"));
  console.log(`Starting to update ${renames.length} products...`);

  let successProducts = 0;
  let successVariants = 0;
  let failures = 0;

  for (const item of renames) {
    console.log(`Updating ID ${item.id}: "${item.old_name}" -> "${item.new_name}"`);

    // 1. Update Products table
    const { error: pErr } = await supabase
      .from("Products")
      .update({ name: item.new_name })
      .eq("id", item.id);

    if (pErr) {
      console.error(`  [Products Error] ID ${item.id}:`, pErr.message);
      failures++;
      continue;
    }
    successProducts++;

    // 2. Update product_variants table
    // We need to fetch the variant first to update its attributes JSON correctly
    const { data: variants, error: vFetchErr } = await supabase
      .from("product_variants")
      .select("id, attributes")
      .eq("product_id", item.id);

    if (vFetchErr || !variants) {
      console.error(`  [Variants Fetch Error] Product ID ${item.id}:`, vFetchErr?.message);
      continue;
    }

    for (const v of variants) {
      const newAttributes = { ...v.attributes, original_name: item.new_name };
      
      const { error: vUpdateErr } = await supabase
        .from("product_variants")
        .update({ attributes: newAttributes })
        .eq("id", v.id);

      if (vUpdateErr) {
        console.error(`  [Variants Update Error] Variant ID ${v.id}:`, vUpdateErr.message);
      } else {
        successVariants++;
      }
    }
  }

  console.log("\n=== UPDATE SUMMARY ===");
  console.log(`Successfully updated Products (parent items): ${successProducts}/${renames.length}`);
  console.log(`Successfully updated product_variants (child items): ${successVariants}`);
  console.log(`Failed updates: ${failures}`);
  console.log(`Total untouched/unidentifiable products left as-is: ${341 - renames.length}`);
}

applyRenames();
