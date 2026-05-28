import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const main = async () => {
  const [prodRes, varRes, oldRes] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('product_variants').select('id', { count: 'exact', head: true }),
    supabase.from('Products').select('id', { count: 'exact', head: true })
  ]);

  console.log('products count:', prodRes.count, 'error:', prodRes.error ? prodRes.error.message : 'ok');
  console.log('product_variants count:', varRes.count, 'error:', varRes.error ? varRes.error.message : 'ok');
  console.log('old Products count:', oldRes.count, 'error:', oldRes.error ? oldRes.error.message : 'ok');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
