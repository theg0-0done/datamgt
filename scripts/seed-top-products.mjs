import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://suakcjxujssalvdvwutz.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YWtjanh1anNzYWx2ZHZ3dXR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg0OTI5MywiZXhwIjoyMDk0NDI1MjkzfQ.z7YYppgsNaNwi3hvAWbFF8JLm5Iyec6imMYZaBok5-Q';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ─── 1. Create the table via RPC (raw SQL through Supabase) ──────────────────
const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS top_products (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  slug        TEXT        UNIQUE,
  description TEXT,
  category    TEXT,
  brand       TEXT,
  base_image  TEXT,
  price       NUMERIC(10,2) DEFAULT 0,
  old_price   NUMERIC(10,2),
  badge       TEXT,
  quantity    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
`;

// ─── 2. Sample top-products rows ─────────────────────────────────────────────
const TOP_PRODUCTS = [
  {
    name: 'Logitech G Pro X Superlight 2',
    slug: 'logitech-g-pro-x-superlight-2',
    description: 'Ultra-lightweight wireless gaming mouse built for esports pros, featuring the HERO 2 sensor and 95-hour battery life.',
    category: 'Mouses',
    brand: 'Logitech',
    base_image: 'https://resource.logitech.com/w_386,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/pro-x-superlight-2/gallery/pro-x-superlight-2-black-gallery-1.png',
    price: 149.99,
    old_price: 179.99,
    badge: 'Best Seller',
    quantity: 45,
  },
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise cancellation headphones with Auto NC Optimizer, 30-hour battery, and multipoint connection.',
    category: 'Headphones',
    brand: 'Sony',
    base_image: 'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=440',
    price: 329.99,
    old_price: 399.99,
    badge: 'Sale',
    quantity: 30,
  },
  {
    name: 'Samsung 65" QLED 4K Q80C',
    slug: 'samsung-65-qled-4k-q80c',
    description: 'Quantum Dot technology with 4K upscaling, 120Hz refresh rate, and built-in Google Assistant & Alexa.',
    category: 'TVs',
    brand: 'Samsung',
    base_image: 'https://image-us.samsung.com/SamsungUS/home/televisions-and-home-theater/tvs/qled-4k-tvs/04252023/QN65Q80CAFXZA_001_Front_Black.jpg',
    price: 1099.99,
    old_price: null,
    badge: null,
    quantity: 12,
  },
  {
    name: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    description: 'Titanium build with dual-frequency GPS, S9 SiP chip, up to 60-hour battery, and Action button.',
    category: 'Watches',
    brand: 'Apple',
    base_image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra2-titanium-natural-49mm-black-trail-loop-MF-L?wid=400&hei=400&fmt=png-alpha',
    price: 799.99,
    old_price: null,
    badge: 'New',
    quantity: 20,
  },
  {
    name: 'JBL Charge 5',
    slug: 'jbl-charge-5',
    description: 'Powerful portable speaker with IP67 waterproof rating, 20-hour playtime, and built-in power bank.',
    category: 'Speaker',
    brand: 'JBL',
    base_image: 'https://www.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwfba4ffb1/JBL_CHARGE5_HERO_BLK_001.png?sw=400&sfrm=png',
    price: 179.99,
    old_price: 199.99,
    badge: null,
    quantity: 60,
  },
  {
    name: 'ASUS ROG Strix G16 Gaming Laptop',
    slug: 'asus-rog-strix-g16',
    description: 'Intel Core i9-14900HX, RTX 4080 GPU, 32GB DDR5 RAM, 1TB SSD — built for maximum gaming performance.',
    category: 'PCs',
    brand: 'ASUS',
    base_image: 'https://dlcdnwebimgs.asus.com/gain/3dfa7ac3-c49e-4888-ab78-2d71b13de86e/w800/fwebp',
    price: 2299.99,
    old_price: 2599.99,
    badge: 'Hot',
    quantity: 8,
  },
  {
    name: 'Meta Quest 3',
    slug: 'meta-quest-3',
    description: 'Next-gen mixed reality headset with Snapdragon XR2 Gen 2, 4K+ Infinite Display, and depth-sensor passthrough.',
    category: 'VR Headset',
    brand: 'Meta',
    base_image: 'https://about.fb.com/wp-content/uploads/2023/09/Meta-Quest-3-Hero-Shot.jpg',
    price: 499.99,
    old_price: null,
    badge: 'New',
    quantity: 25,
  },
  {
    name: 'Razer BlackShark V2 Pro',
    slug: 'razer-blackshark-v2-pro',
    description: 'Wireless esports headset with THX Spatial Audio, HyperClear Super Wideband Mic, and 70-hour battery.',
    category: 'Headphones',
    brand: 'Razer',
    base_image: 'https://assets2.razerzone.com/images/pnx.assets/a57e87dc09e5f68d7bef6e0b0f6e0f79/razer-blackshark-v2-pro-500x500.png',
    price: 199.99,
    old_price: 229.99,
    badge: 'Sale',
    quantity: 35,
  },
];

async function main() {
  console.log('⚙️  Creating top_products table...');

  const { error: rpcError } = await supabase.rpc('exec_sql', { sql: CREATE_TABLE_SQL }).single();

  if (rpcError) {
    // exec_sql RPC may not exist – try direct approach via REST
    console.warn('exec_sql RPC not available, attempting direct insert (table must already exist).');
    console.warn('If the table does not exist yet, run the SQL below manually in the Supabase SQL Editor:\n');
    console.log(CREATE_TABLE_SQL);
  } else {
    console.log('✅  Table ready.');
  }

  console.log('\n📦  Inserting 8 top products...');

  const { data, error: insertError } = await supabase
    .from('top_products')
    .upsert(TOP_PRODUCTS, { onConflict: 'slug' })
    .select();

  if (insertError) {
    console.error('❌  Insert failed:', insertError.message);
    console.log('\nIf the table does not exist yet, create it first with this SQL:\n');
    console.log(CREATE_TABLE_SQL);
    process.exit(1);
  }

  console.log(`✅  Inserted/updated ${data?.length ?? 0} rows successfully.`);
  console.log('\nRows:');
  data?.forEach((row) => console.log(`  [${row.id}] ${row.name} — ${row.category} — ${row.price} MAD`));
}

main();
