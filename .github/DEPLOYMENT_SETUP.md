# 🚀 Setting Up Automated Deployment

Panduan untuk mengaktifkan automated deployment ke Vercel via GitHub Actions.

## Prerequisites

1. Project sudah terhubung dengan Vercel
2. Punya akses ke Vercel Dashboard
3. Punya akses ke GitHub Repository Settings

---

## Step 1: Dapatkan Vercel Credentials

### 1.1 Vercel Token

1. Login ke [Vercel Dashboard](https://vercel.com)
2. Klik avatar → **Settings**
3. Pilih **Tokens** di sidebar
4. Click **Create Token**
5. Beri nama: `GitHub Actions - fe-pemesanan-menu`
6. Set scope sesuai kebutuhan
7. **Copy token** (hanya muncul sekali!)

### 1.2 Vercel Org ID & Project ID

**Option A: Via Vercel CLI**
```bash
cd fe-pemesanan-menu
vercel link
```
File `.vercel/project.json` akan berisi:
```json
{
  "orgId": "team_xxxxx",
  "projectId": "prj_xxxxx"
}
```

**Option B: Via Vercel Dashboard**
1. Buka project di Vercel Dashboard
2. Settings → General
3. Copy **Project ID**
4. Settings → General → Team ID (untuk orgId)

---

## Step 2: Tambahkan Secrets ke GitHub

1. Buka GitHub Repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Tambahkan 3 secrets berikut:

| Name | Value | Deskripsi |
|------|-------|-----------|
| `VERCEL_TOKEN` | `abc123...` | Token dari Step 1.1 |
| `VERCEL_ORG_ID` | `team_xxxxx` | Org ID dari Step 1.2 |
| `VERCEL_PROJECT_ID` | `prj_xxxxx` | Project ID dari Step 1.2 |

**Optional secrets:**

| Name | Value | Deskripsi |
|------|-------|-----------|
| `VITE_API_BASE_URL` | `https://api.domain.com/api` | URL backend API |

---

## Step 3: Aktifkan Deployment di Workflow

Edit file `.github/workflows/ci-cd.yml`:

**Uncomment deployment jobs:**

1. Cari section `# DEPLOY TO STAGING`
2. Uncomment (hapus `#`) semua baris deployment
3. Cari section `# DEPLOY TO PRODUCTION`
4. Uncomment (hapus `#`) semua baris deployment

**Sebelum:**
```yaml
# deploy-production:
#   name: Deploy to Production
#   ...
```

**Sesudah:**
```yaml
deploy-production:
  name: Deploy to Production
  ...
```

---

## Step 4: Test Deployment

### Auto Deploy

**Push ke main branch:**
```bash
git push origin main
```
→ Akan deploy ke **Production**

**Push ke develop branch:**
```bash
git push origin develop
```
→ Akan deploy ke **Staging**

### Manual Deploy

Alternatif deploy manual via Vercel CLI:
```bash
# Deploy preview
vercel

# Deploy production
vercel --prod
```

---

## Branch Strategy

| Branch | Environment | URL | Auto Deploy |
|--------|-------------|-----|-------------|
| `main` | Production | umkmordering.com | ✅ Yes |
| `develop` | Staging | staging.umkmordering.com | ✅ Yes |
| PR branches | Preview | pr-123.vercel.app | ❌ Build only |

---

## Troubleshooting

### Error: Input required and not supplied: vercel-token

**Penyebab:** Secrets belum dikonfigurasi di GitHub

**Solusi:**
1. Pastikan secrets sudah ditambahkan (Step 2)
2. Nama secrets harus **EXACT MATCH**:
   - `VERCEL_TOKEN` (bukan `vercel-token`)
   - `VERCEL_ORG_ID` (bukan `VERCEL_ORGANIZATION_ID`)
   - `VERCEL_PROJECT_ID` (bukan `VERCEL_PROJECT`)

### Build Succeeds but Deployment Fails

**Check:**
1. Vercel token masih valid (tidak expired)
2. Project ID benar
3. Org ID benar
4. User memiliki permission untuk deploy

### Environment Variables Not Working

**Solusi:**
1. Tambahkan env vars di GitHub Secrets (untuk build time)
2. Atau configure di Vercel Dashboard → Settings → Environment Variables (untuk runtime)

---

## Security Notes

⚠️ **JANGAN COMMIT SECRETS:**
- Jangan commit `.vercel/` folder
- Jangan commit tokens atau credentials
- Gunakan GitHub Secrets untuk sensitive data

✅ **BEST PRACTICES:**
- Rotate tokens secara berkala
- Gunakan minimum required scope
- Monitor deployment logs
- Setup alerts untuk failed deployments

---

## Monitoring

### Vercel Dashboard

Akses deployment logs:
1. Vercel Dashboard → Project → Deployments
2. Click deployment untuk melihat logs
3. Monitor build time, bundle size, errors

### GitHub Actions

Monitor CI/CD:
1. GitHub Repository → Actions tab
2. Lihat workflow runs
3. Check job logs untuk debugging

---

## Rolling Back

**Via Vercel Dashboard:**
1. Deployments → Find previous successful deployment
2. Click **...** → **Promote to Production**

**Via Vercel CLI:**
```bash
vercel rollback
```

---

## Next Steps

Setelah deployment aktif:

1. ✅ Setup custom domain (optional)
2. ✅ Configure environment variables
3. ✅ Setup monitoring (Vercel Analytics, Sentry)
4. ✅ Test production deployment
5. ✅ Setup staging environment
6. ✅ Configure deployment notifications (Slack, Discord)

---

**Ready to deploy!** 🚀
