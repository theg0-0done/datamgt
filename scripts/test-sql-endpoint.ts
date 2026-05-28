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

async function testEndpoints() {
  const endpoints = [
    { url: `${supabaseUrl}/pg/query`, body: { query: "SELECT 1 as val;" } },
    { url: `${supabaseUrl}/pg/query`, body: { sql: "SELECT 1 as val;" } },
    { url: `${supabaseUrl}/sql`, body: { query: "SELECT 1 as val;" } },
    { url: `${supabaseUrl}/sql`, body: { sql: "SELECT 1 as val;" } },
  ];

  for (const ep of endpoints) {
    try {
      console.log(`Testing endpoint: ${ep.url}...`);
      const response = await fetch(ep.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${serviceKey}`,
          "apikey": serviceKey,
        },
        body: JSON.stringify(ep.body),
      });

      console.log(`Response status: ${response.status}`);
      const text = await response.text();
      console.log(`Response body: ${text.substring(0, 200)}`);
      console.log("-----------------------------------------");
    } catch (e: any) {
      console.log(`Error testing ${ep.url}:`, e.message);
      console.log("-----------------------------------------");
    }
  }
}

testEndpoints();
