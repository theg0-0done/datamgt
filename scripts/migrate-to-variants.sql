-- Drop existing tables if they exist
-- DROP TABLE IF EXISTS product_variants CASCADE;
-- DROP TABLE IF EXISTS "Products" CASCADE;

-- Create Products table (uppercase P)
CREATE TABLE IF NOT EXISTS "Products" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    category TEXT,
    brand TEXT,
    base_image TEXT,
    price INT, -- legacy field from old schema (can be null/ignored in new variants layout)
    quantity INT, -- legacy field from old schema
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES "Products"(id) ON DELETE CASCADE,
    sku TEXT UNIQUE,
    variant_label TEXT,
    image_urls TEXT[], -- array of image URLs for the variant
    price INT NOT NULL, -- price in cents
    stock_quantity INT DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON "Products"(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON "Products"(category);

-- Enable Row Level Security
ALTER TABLE "Products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read on Products" ON "Products" FOR SELECT USING (true);
CREATE POLICY "Allow public read on product_variants" ON product_variants FOR SELECT USING (true);

-- Create policies for authenticated write access
CREATE POLICY "Allow authenticated users to insert Products" ON "Products" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update Products" ON "Products" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert variants" ON product_variants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update variants" ON product_variants FOR UPDATE USING (auth.role() = 'authenticated');
