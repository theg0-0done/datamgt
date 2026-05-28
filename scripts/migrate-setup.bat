@echo off
REM Product-Variant Schema Migration Setup Script for Windows
REM This script helps you set up the new product-variant schema in Supabase

setlocal enabledelayedexpansion

echo.
echo 🚀 Product-Variant Schema Migration Setup
echo ==========================================
echo.

REM Step 1: Check dependencies
echo Step 1: Checking dependencies...
where tsx >nul 2>nul
if %errorlevel% neq 0 (
    echo tsx not found. Installing dependencies...
    call npm install
)
echo ✅ Dependencies check complete
echo.

REM Step 2: Display setup instructions
echo Step 2: Manual Table Creation
echo ============================
echo.
echo ⚠️  Important: You need to create the tables first
echo.
echo Follow these steps:
echo 1. Go to: https://supabase.com/dashboard
echo 2. Select your project
echo 3. Open SQL Editor from the left sidebar
echo 4. Click 'New Query'
echo 5. Open this file: scripts/migrate-to-variants.sql
echo 6. Copy ALL the SQL content
echo 7. Paste it into the SQL editor
echo 8. Click 'Run' (or Ctrl+Enter)
echo.
echo ⏸️  Press any key once you've created the tables...
pause >nul

REM Step 3: Run data migration
echo.
echo Step 3: Running data migration...
echo.

call npm run migrate:products
if %errorlevel% neq 0 (
    echo.
    echo ❌ Migration failed
    echo Check the error message above and try again
    exit /b 1
)

echo.
echo ✅ Migration complete!
echo.
echo 📊 Next steps:
echo 1. Your data has been migrated successfully
echo 2. The app will automatically use the new schema
echo 3. You can now test the app with: npm run dev
echo.
echo 📖 For more info, see: MIGRATION_GUIDE.md
echo.
echo 🎉 All done! Your product-variant schema is ready.
echo.

pause
