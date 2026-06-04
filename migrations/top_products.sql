-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Project: suakcjxujssalvdvwutz
-- ============================================================

-- 1. Create the top_products table
CREATE TABLE IF NOT EXISTS top_products (
  id          SERIAL PRIMARY KEY,
  name        TEXT           NOT NULL,
  slug        TEXT           UNIQUE,
  description TEXT,
  category    TEXT,
  brand       TEXT,
  base_image  TEXT,
  price       NUMERIC(10,2)  DEFAULT 0,
  old_price   NUMERIC(10,2),
  badge       TEXT,
  quantity    INTEGER        DEFAULT 0,
  created_at  TIMESTAMPTZ    DEFAULT NOW()
);

-- 2. Seed with 8 top products (safe to re-run)
INSERT INTO top_products (name, slug, description, category, brand, base_image, price, old_price, badge, quantity)
VALUES
  (
    'Logitech G Pro X Superlight 2',
    'logitech-g-pro-x-superlight-2',
    'Ultra-lightweight wireless gaming mouse built for esports pros, featuring the HERO 2 sensor and 95-hour battery life.',
    'Mouses', 'Logitech',
    'https://resource.logitech.com/w_386,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/pro-x-superlight-2/gallery/pro-x-superlight-2-black-gallery-1.png',
    149.99, 179.99, 'Best Seller', 45
  ),
  (
    'Sony WH-1000XM5',
    'sony-wh-1000xm5',
    'Industry-leading noise cancellation headphones with Auto NC Optimizer, 30-hour battery, and multipoint connection.',
    'Headphones', 'Sony',
    'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=440',
    329.99, 399.99, 'Sale', 30
  ),
  (
    'Samsung 65 QLED 4K Q80C',
    'samsung-65-qled-4k-q80c',
    'Quantum Dot technology with 4K upscaling, 120Hz refresh rate, and built-in Google Assistant & Alexa.',
    'TVs', 'Samsung',
    'https://image-us.samsung.com/SamsungUS/home/televisions-and-home-theater/tvs/qled-4k-tvs/04252023/QN65Q80CAFXZA_001_Front_Black.jpg',
    1099.99, NULL, NULL, 12
  ),
  (
    'Apple Watch Ultra 2',
    'apple-watch-ultra-2',
    'Titanium build with dual-frequency GPS, S9 SiP chip, up to 60-hour battery, and Action button.',
    'Watches', 'Apple',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra2-titanium-natural-49mm-black-trail-loop-MF-L?wid=400&hei=400&fmt=png-alpha',
    799.99, NULL, 'New', 20
  ),
  (
    'JBL Charge 5',
    'jbl-charge-5',
    'Powerful portable speaker with IP67 waterproof rating, 20-hour playtime, and built-in power bank.',
    'Speaker', 'JBL',
    'https://www.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwfba4ffb1/JBL_CHARGE5_HERO_BLK_001.png?sw=400&sfrm=png',
    179.99, 199.99, NULL, 60
  ),
  (
    'ASUS ROG Strix G16 Gaming Laptop',
    'asus-rog-strix-g16',
    'Intel Core i9-14900HX, RTX 4080 GPU, 32GB DDR5 RAM, 1TB SSD built for maximum gaming performance.',
    'PCs', 'ASUS',
    'https://dlcdnwebimgs.asus.com/gain/3dfa7ac3-c49e-4888-ab78-2d71b13de86e/w800/fwebp',
    2299.99, 2599.99, 'Hot', 8
  ),
  (
    'Meta Quest 3',
    'meta-quest-3',
    'Next-gen mixed reality headset with Snapdragon XR2 Gen 2, 4K+ Infinite Display, and depth-sensor passthrough.',
    'VR Headset', 'Meta',
    'https://about.fb.com/wp-content/uploads/2023/09/Meta-Quest-3-Hero-Shot.jpg',
    499.99, NULL, 'New', 25
  ),
  (
    'Razer BlackShark V2 Pro',
    'razer-blackshark-v2-pro',
    'Wireless esports headset with THX Spatial Audio, HyperClear Super Wideband Mic, and 70-hour battery.',
    'Headphones', 'Razer',
    'https://assets2.razerzone.com/images/pnx.assets/a57e87dc09e5f68d7bef6e0b0f6e0f79/razer-blackshark-v2-pro-500x500.png',
    199.99, 229.99, 'Sale', 35
  )
ON CONFLICT (slug) DO NOTHING;

-- 3. Verify
SELECT id, name, category, price, badge FROM top_products ORDER BY id;
