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

async function inspect() {
  console.log("Checking if we can run custom RPCs...");
  // Let's see if there is any RPC we can find by checking common names
  const testQueries = [
    { name: "exec", args: { sql: "SELECT 1;" } },
    { name: "execute", args: { sql: "SELECT 1;" } },
    { name: "run", args: { sql: "SELECT 1;" } },
    { name: "sql", args: { query: "SELECT 1;" } },
  ];

  for (const q of testQueries) {
    const { data, error } = await supabase.rpc(q.name, q.args);
    if (!error) {
      console.log(`✅ Success: ${q.name}`, data);
    } else {
      console.log(`❌ Failed ${q.name}:`, error.message);
    }
  }
}

inspect();
