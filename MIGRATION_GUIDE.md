# Product-Variant Schema Migration Guide

This guide walks you through implementing the Product-Variant pattern in your Supabase database.

## Overview

The new schema separates products from their variants (sizes, colors, storage capacity, etc.), enabling:

- Multiple product options without creating duplicate products
- Per-variant pricing and inventory
- Flexible attribute handling (future-proof)
- Better data integrity

## Architecture

### Old Schema (Products table only)

One row per variant:

```
Cable HDMI 3M 4K - $60
Cable HDMI 5M 4K - $80
Cable HDMI 10M 4K - $150
```

### New Schema (Products + Product Variants)

One product, multiple variants:

```
Product: Cable HDMI 4K
├── Variant 1: 3M - $60
├── Variant 2: 5M - $80
└── Variant 3: 10M - $150
```

## Step-by-Step Setup

### Step 1: Create New Tables in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of: `scripts/migrate-to-variants.sql`
6. Click **Run** (or Ctrl+Enter)

The SQL will create:

- `products` table (parent)
- `product_variants` table (children)
- Proper indexes and Row Level Security policies

### Step 2: Verify Tables Created

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
AND table_name IN ('products', 'product_variants');
```

You should see both tables listed.

### Step 3: Run Data Migration

Once tables are created, run the migration script:

```bash
cd datamgt

# Install dependencies if needed
npm install

# Run data migration
npm run migrate:products
```

This script will:

1. Read all products from your old `Products` table
2. Group them by base name (extracting specs like size, color, storage)
3. Create product records
4. Create variant records with pricing and inventory
5. Display migration summary

### Step 4: Verify Migration

After migration completes, check your data in Supabase:

```sql
-- View all products with variant count
SELECT
    p.id,
    p.name,
    p.slug,
    p.category,
    COUNT(pv.id) as variant_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
GROUP BY p.id, p.name, p.slug, p.category
ORDER BY p.id;

-- View a specific product with all variants
SELECT
    p.*,
    json_agg(
        json_build_object(
            'id', pv.id,
            'label', pv.variant_label,
            'price', pv.price,
            'stock', pv.stock_quantity
        )
    ) as variants
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.slug = 'cable-hdmi-4k'
GROUP BY p.id;
```

## Backend Changes Summary

### ProductsContext (src/context/ProductsContext.tsx)

- ✅ Updated to fetch from new `products` table with `product_variants` relations
- ✅ Fallback to old schema if new tables not found
- ✅ Maps variant data to ProductOption format

### ProductUtils (src/utils/productUtils.ts)

- ✅ Added `ProductVariant` interface
- ✅ Added `VariantData` interface with SKU/attributes
- ✅ Updated `Product` interface with `slug` field
- ✅ Backward compatible with old functions

## Frontend Components (No Changes Needed)

The existing components already support variants through the `ProductOption` structure:

- **TopProducts.tsx** - Shows products with options
- **QuickAddModal.tsx** - Handles variant selection
- **ProductDetailPage.tsx** - Displays all variants
- **AllProductsPage.tsx** - Lists products with v variants

## Data Format Examples

### Product Listing Query Result

```typescript
{
  id: 1,
  name: "Cable HDMI 4K",
  slug: "cable-hdmi-4k",
  category: "Cables",
  base_image: "/assets/cable.png",
  product_variants: [
    {
      id: 7,
      sku: "CABLE-HDMI-4K-1",
      variant_label: "3M",
      price: 6000,        // in cents
      stock_quantity: 10,
      is_default: true,
      attributes: { original_name: "Cable HDMI 3M 4K", spec_value: "3M" }
    },
    {
      id: 8,
      sku: "CABLE-HDMI-4K-2",
      variant_label: "5M",
      price: 8000,
      stock_quantity: 5,
      is_default: false,
      attributes: { original_name: "Cable HDMI 5M 4K", spec_value: "5M" }
    }
  ]
}
```

### Converted to Frontend Format

```typescript
{
  id: 1,
  name: "Cable HDMI 4K",
  slug: "cable-hdmi-4k",
  category: "Cables",
  price: "$60.00",
  image: "/assets/cable.png",
  options: [
    {
      id: 7,
      name: "Cable HDMI 4K",
      specValue: "3M",
      price: "$60.00",
      quantity: 10,
      image: "/assets/cable.png",
      variantData: { sku: "CABLE-HDMI-4K-1", attributes: {...}, product_variant_id: 7 }
    },
    // ... more variants
  ]
}
```

## Troubleshooting

### Tables Not Found Error

**Problem:** ProductsContext shows "New schema not available"

**Solution:**

1. Verify you ran the SQL migration
2. Check table permissions in Supabase dashboard
3. Ensure Row Level Security policies are set correctly

### Migration Script Errors

**Error: "Required tables not found"**

- You haven't run the SQL migration yet
- Run the SQL from `scripts/migrate-to-variants.sql` first

**Error: "No products found to migrate"**

- Your old `Products` table is empty
- Create some products in the old table first

### Data Not Showing

**Problem:** Products appear but no variants

**Solution:**

1. Check the product_variants table in Supabase
2. Verify products FK references: `SELECT * FROM product_variants WHERE product_id IS NULL;`
3. Look for null values in required fields

## Rollback Plan

If you need to revert to the old schema:

```bash
# Keep using the old Products table
# ProductsContext has automatic fallback logic
# No code changes needed - just comment out the new query in ProductsContext
```

## Next Steps

1. ✅ Run SQL migration (Step 1-2)
2. ✅ Run data migration script (Step 3)
3. ✅ Verify in Supabase (Step 4)
4. ✅ Test the app - should work exactly as before
5. Add new features like:
   - Image per variant
   - Variant-specific promotions
   - Multi-attribute combinations (size + color)
   - Inventory alerts

## SQL Queries for Common Tasks

### Add a new variant to existing product

```sql
INSERT INTO product_variants (
    product_id,
    sku,
    variant_label,
    attributes,
    price,
    stock_quantity
)
VALUES (
    1,                          -- product_id
    'CABLE-HDMI-4K-4',         -- sku (unique)
    '7M',                       -- display label
    '{"length": "7M"}'::jsonb,  -- attributes
    9000,                       -- price in cents
    8                           -- stock
);
```

### Update variant stock

```sql
UPDATE product_variants
SET stock_quantity = 15
WHERE sku = 'CABLE-HDMI-4K-1';
```

### Find products with low stock

```sql
SELECT p.name, pv.variant_label, pv.stock_quantity
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE pv.stock_quantity < 5
ORDER BY pv.stock_quantity ASC;
```

### Bulk update prices

```sql
-- Increase all cable prices by 10%
UPDATE product_variants pv
SET price = ROUND(price * 1.1)
FROM products p
WHERE pv.product_id = p.id
AND p.category = 'Cables';
```

## Support

For issues, check:

1. Supabase dashboard logs
2. Browser console for errors
3. Network tab for API calls
4. Supabase documentation: https://supabase.com/docs
