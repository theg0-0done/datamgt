# 🔑 How to Find Your Supabase Service Role Key

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard

- Navigate to: https://supabase.com/dashboard
- Click your project

### 2. Open Project Settings

- Click **Settings** (⚙️ gear icon at bottom left)
- Or use the URL: `https://supabase.com/dashboard/project/[PROJECT_ID]/settings/api`

### 3. Find API Keys Section

- In the left sidebar, click **API**
- You'll see two keys:
  - **`public` (anon)** - Public key (safe to share)
  - **`secret` (service_role)** - KEEP THIS SECRET

### 4. Copy Service Role Key

- Click the key icon next to "service_role"
- Click "Copy" button
- Add to your `.env` file:

```env
VITE_SUPABASE_URL=https://suakcjxujssalvdvwutz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_bowOM4KyYYclObrMDRXhjg_JniRSNEj
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # <- Add this line!
```

### 5. Run Migration

```bash
npm run migrate:products
```

---

## Alternative: Manual SQL Setup (No Service Key Needed)

If you don't want to share your service key, you can manually create the tables:

### 1. Open SQL Editor

- In your Supabase dashboard
- Click **SQL Editor** (left sidebar)
- Click **New Query**

### 2. Copy & Paste SQL

Copy everything from: `scripts/migrate-to-variants.sql`

### 3. Run It

- Click **Run** or Ctrl+Enter
- Wait for success message

### 4. Run Data Migration

- Back in your terminal, run:

```bash
npm run migrate:products
```

---

## ⚠️ Security Note

- **Service Role Key**: Keep this SECRET! Do NOT commit `.env` to git
- **Public Key**: This is safe to share (only allows reads)
- `.gitignore` already excludes `.env`

---

## Having Issues?

1. **Keys not showing?**
   - Make sure you have database access
   - Try logging out and back in

2. **Can't access SQL Editor?**
   - Check your project is "Active" (not paused)
   - Upgrade plan if needed

3. **Still stuck?**
   - Check Supabase docs: https://supabase.com/docs/guides/database/overview
   - Visit support: https://supabase.com/support
