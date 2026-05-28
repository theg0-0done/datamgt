#!/bin/bash

# Production-variant Schema Migration Setup Script
# This script helps you set up the new product-variant schema in Supabase

set -e

echo "🚀 Product-Variant Schema Migration Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check dependencies
echo -e "${BLUE}Step 1: Checking dependencies...${NC}"
if ! command -v tsx &> /dev/null; then
    echo -e "${RED}❌ tsx not found. Installing...${NC}"
    npm install
fi
echo -e "${GREEN}✅ Dependencies check complete${NC}\n"

# Step 2: Display setup instructions
echo -e "${BLUE}Step 2: Manual Table Creation${NC}"
echo "=================================="
echo ""
echo -e "${YELLOW}⚠️  Important: You need to create the tables first${NC}"
echo ""
echo "Follow these steps:"
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Open SQL Editor from the left sidebar"
echo "4. Click 'New Query'"
echo "5. Open this file: scripts/migrate-to-variants.sql"
echo "6. Copy ALL the SQL content"
echo "7. Paste it into the SQL editor"
echo "8. Click 'Run' (or Ctrl+Enter)"
echo ""
echo -e "${YELLOW}⏸️  Press Enter once you've created the tables...${NC}"
read -r

# Step 3: Verify tables exist
echo ""
echo -e "${BLUE}Step 3: Verifying tables...${NC}"
echo ""
echo "Checking if tables were created successfully..."
echo ""

# Try to run a simple query
VERIFY_RESULT=$(npx tsx -e "
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('MISSING_ENV');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  try {
    const { error: pError } = await supabase.from('products').select('id').limit(1);
    const { error: vError } = await supabase.from('product_variants').select('id').limit(1);
    
    if (pError || vError) {
      console.log('TABLES_MISSING');
    } else {
      console.log('TABLES_EXIST');
    }
  } catch (e) {
    console.log('ERROR');
  }
}

verify();
" 2>/dev/null || true)

if [ "$VERIFY_RESULT" = "MISSING_ENV" ]; then
    echo -e "${RED}❌ Missing environment variables${NC}"
    echo "Make sure .env file has:"
    echo "  VITE_SUPABASE_URL"
    echo "  VITE_SUPABASE_ANON_KEY"
    echo ""
    exit 1
elif [ "$VERIFY_RESULT" = "TABLES_EXIST" ]; then
    echo -e "${GREEN}✅ Tables verified!${NC}"
elif [ "$VERIFY_RESULT" = "TABLES_MISSING" ]; then
    echo -e "${RED}❌ Tables not found${NC}"
    echo "Please make sure you ran the SQL from scripts/migrate-to-variants.sql"
    exit 1
else
    echo -e "${YELLOW}⚠️  Unable to verify (this is OK if it's your first time)${NC}"
fi

echo ""

# Step 4: Run data migration
echo -e "${BLUE}Step 4: Running data migration...${NC}"
echo ""

if npm run migrate:products; then
    echo ""
    echo -e "${GREEN}✅ Migration complete!${NC}"
    echo ""
    echo "📊 Next steps:"
    echo "1. Your data has been migrated successfully"
    echo "2. The app will automatically use the new schema"
    echo "3. You can now test the app with: npm run dev"
    echo ""
    echo "📖 For more info, see: MIGRATION_GUIDE.md"
else
    echo ""
    echo -e "${RED}❌ Migration failed${NC}"
    echo "Check the error message above and try again"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All done! Your product-variant schema is ready.${NC}"
