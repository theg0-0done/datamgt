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

async function inspect() {
  const url = `${supabaseUrl}/rest/v1/?apikey=${serviceKey}`;
  try {
    const res = await fetch(url);
    const schema = await res.json();
    console.log("All paths in REST API:");
    console.log(Object.keys(schema.paths || {}));
  } catch (err) {
    console.error("Error inspecting:", err);
  }
}

inspect();
