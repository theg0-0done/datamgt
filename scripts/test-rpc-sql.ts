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

async function testRpc() {
  const rpcs = ["exec_sql", "run_sql", "sql", "execute_sql"];
  for (const rpc of rpcs) {
    try {
      console.log(`Testing RPC: ${rpc}...`);
      const { data, error } = await supabase.rpc(rpc, { sql: "SELECT 1 as val;" });
      if (!error) {
        console.log(`✅ SUCCESS with ${rpc}:`, data);
        return;
      } else {
        console.log(`❌ Failed with ${rpc}:`, error.message);
      }
    } catch (e: any) {
      console.log(`❌ Error with ${rpc}:`, e.message);
    }
  }
}

testRpc();
