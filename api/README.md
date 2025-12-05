# Finance Dashboard - Backend API

Backend sederhana untuk keep-alive Supabase project dan prevent auto-pause.

## 📁 Structure

```
api/
├── health.js           # Health check endpoint
├── ping-supabase.js    # Supabase ping endpoint (cron job)
├── generate-secret.js  # Generate CRON_SECRET
└── README.md          # Documentation
```

## 🚀 Endpoints

### 1. Health Check

- **URL:** `/api/health`
- **Method:** `GET`
- **Description:** Check if API is running
- **Response:**

```json
{
  "status": "ok",
  "message": "Finance Dashboard API is running",
  "timestamp": "2025-12-05T10:00:00.000Z"
}
```

### 2. Ping Supabase (Cron Job)

- **URL:** `/api/ping-supabase`
- **Method:** `POST` (dari Vercel Cron)
- **Schedule:** Setiap 2 hari sekali (00:00 UTC)
- **Description:** Ping Supabase database untuk prevent auto-pause
- **Headers Required:**
  - `Authorization: Bearer [CRON_SECRET]`
- **Response:**

```json
{
  "success": true,
  "message": "Supabase database pinged successfully",
  "timestamp": "2025-12-05T10:00:00.000Z",
  "dataCount": 1
}
```

### 3. Generate Secret

- **URL:** `/api/generate-secret`
- **Method:** `GET`
- **Description:** Generate random CRON_SECRET
- **Response:**

```json
{
  "secret": "aBcDeFgHiJkLmNoPqRsTuVwXyZ123456",
  "message": "Copy this secret and add as CRON_SECRET environment variable in Vercel",
  "instructions": [...]
}
```

## ⚙️ Environment Variables

Tambahkan environment variables di Vercel Dashboard:

1. **VITE_SUPABASE_URL**

   - Value: `https://uojytelohqxfbwnyxqut.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**

   - Value: `your_supabase_anon_key`

3. **CRON_SECRET** (untuk security)
   - Generate dengan: `/api/generate-secret`
   - Contoh: `aBcDeFgHiJkLmNoPqRsTuVwXyZ123456`

## 📅 Cron Schedule

Format: `0 0 */2 * *`

- `0 0` = Jam 00:00 (midnight UTC)
- `*/2` = Setiap 2 hari
- `* *` = Setiap bulan dan hari dalam seminggu

### Alternatif Schedule:

- **Setiap hari:** `0 0 * * *`
- **Setiap 3 hari:** `0 0 */3 * *`
- **Setiap minggu:** `0 0 * * 0`
- **Setiap 12 jam:** `0 */12 * * *`

## 🔧 Setup di Vercel

### 1. Deploy Backend

```bash
# Push ke GitHub
git add .
git commit -m "Add serverless keep-alive API"
git push origin main
```

### 2. Generate CRON_SECRET

Setelah deploy, buka:

```
https://your-vercel-url.vercel.app/api/generate-secret
```

Copy secret yang di-generate.

### 3. Configure Environment Variables

Di Vercel Dashboard:

1. Go to project settings
2. Environment Variables tab
3. Add semua environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `CRON_SECRET` (dari step 2)
4. Redeploy project

### 4. Verify Cron Job

1. Go to project di Vercel Dashboard
2. Tab "Cron Jobs"
3. Pastikan cron job muncul: `ping-supabase` scheduled setiap 2 hari

### 5. Manual Test (Optional)

Test endpoint secara manual:

```bash
# Health check
curl https://your-vercel-url.vercel.app/api/health

# Generate secret
curl https://your-vercel-url.vercel.app/api/generate-secret

# Ping Supabase (butuh Authorization header)
curl -X POST https://your-vercel-url.vercel.app/api/ping-supabase \
  -H "Authorization: Bearer your-cron-secret"
```

## 📊 Monitoring

### Check Cron Logs

1. Vercel Dashboard → Your Project
2. Tab "Deployments"
3. Click latest deployment
4. Tab "Functions" → pilih `ping-supabase`
5. View logs untuk melihat execution history

### Expected Logs

```
✅ Supabase pinged successfully
{
  "success": true,
  "message": "Supabase database pinged successfully",
  "timestamp": "2025-12-05T10:00:00.000Z",
  "dataCount": 1
}
```

## 🛡️ Security

1. **CRON_SECRET** - Protect ping endpoint dari unauthorized access
2. **Rate Limiting** - Vercel automatically limits function invocations
3. **Authorization Header** - Verify requests are from Vercel Cron
4. **Environment Variables** - Sensitive data stored securely

## 🔄 How It Works

1. **Vercel Cron** memanggil `/api/ping-supabase` setiap 2 hari
2. Function verify authorization dengan CRON_SECRET
3. Connect ke Supabase dengan credentials
4. Execute simple query (select 1 row from categories)
5. Return success response
6. **Supabase tetap aktif** karena ada database activity

## 💡 Benefits

- ✅ **Free** - Vercel Hobby plan includes cron jobs
- ✅ **Reliable** - Automatic scheduled execution
- ✅ **Lightweight** - Simple query, minimal resource usage
- ✅ **Monitoring** - Built-in logs di Vercel Dashboard
- ✅ **Prevent Pause** - Keep Supabase project active
- ✅ **Secure** - Protected dengan authorization

## 🚨 Important Notes

1. **Vercel Hobby Plan** mendukung cron jobs
2. **Execution limits:**

   - Hobby: 100 hours/month function execution
   - Ping function hanya butuh ~1 second per execution
   - 2 hari sekali = ~15 executions/month ≈ 15 seconds/month
   - Sangat aman untuk free tier!

3. **Supabase Free Tier:**
   - Auto-pause setelah 1 minggu tidak aktif
   - Ping setiap 2 hari mencegah auto-pause
   - Tidak menghitung sebagai heavy usage

## 📞 Troubleshooting

### Cron tidak jalan?

- Check environment variables sudah benar
- Verify cron schedule di `vercel.json`
- Check function logs di Vercel Dashboard
- Pastikan redeploy setelah tambah environment variables

### Unauthorized error?

- Pastikan CRON_SECRET di environment variables
- Pastikan Authorization header benar di request
- Generate secret baru jika lupa

### Supabase connection error?

- Verify SUPABASE_URL dan SUPABASE_ANON_KEY
- Check Supabase project masih active
- Test connection manual dengan Supabase client

### Function timeout?

- Check Supabase database connection
- Verify network connectivity
- Check function logs untuk error details

## 🎯 Quick Start Checklist

- [ ] Deploy project ke Vercel
- [ ] Buka `/api/generate-secret` untuk generate CRON_SECRET
- [ ] Add environment variables di Vercel:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] CRON_SECRET
- [ ] Redeploy project
- [ ] Verify cron job di Vercel Dashboard
- [ ] Test `/api/health` endpoint
- [ ] Wait 2 hari untuk first cron execution
- [ ] Check logs untuk verify success

---

**Made with ❤️ for Finance Dashboard**
