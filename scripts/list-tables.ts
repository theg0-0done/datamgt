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

async function listTables() {
  try {
    console.log("Checking table accessibility...");
    const { error: pError } = await supabase.from("Products").select("id").limit(1);
    const { error: vError } = await supabase.from("product_variants").select("id").limit(1);

    console.log("Products Table:", pError ? `❌ Unaccessible: ${pError.message}` : "✅ Accessible");
    console.log("product_variants Table:", vError ? `❌ Unaccessible: ${vError.message}` : "✅ Accessible");
  } catch (err: any) {
    console.error("❌ Error listTables:", err.message || err);
  }
}

listTables();

