import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function checkColumns() {
  console.log("Checking columns of tables...\n");

  // Query metadata for Products and product_variants and products tables
  const { data: cols, error } = await supabase.rpc("check_schema_cols", {});
  
  if (error) {
    console.log("RPC check_schema_cols not found or error. Let's try raw SQL query using postgres if possible, or just select 1 row and check keys.");
    
    // Select one row from Products
    const { data: productsRow, error: pErr } = await supabase.from("Products").select("*").limit(1);
    if (!pErr && productsRow && productsRow.length > 0) {
      console.log("Products (uppercase P) columns:", Object.keys(productsRow[0]));
      console.log("Products sample row:", productsRow[0]);
    } else {
      console.log("Could not read Products or table is empty.", pErr);
    }

    // Select one row from products (lowercase p)
    const { data: lProductsRow, error: lpErr } = await supabase.from("products").select("*").limit(1);
    if (!lpErr && lProductsRow && lProductsRow.length > 0) {
      console.log("products (lowercase p) columns:", Object.keys(lProductsRow[0]));
    } else {
      console.log("Could not read products (lowercase p) or table is empty.", lpErr);
    }
  }
}

checkColumns();
