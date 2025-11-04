# 🎯 Vercel Deployment - Quick Reference

## 🔐 SECRET KEYS (Set in Vercel Dashboard)

**⚠️ NEVER commit these to GitHub!**

```bash
# 1. AI Keys (REQUIRED for Gemini/AI features)
GEMINI_API_KEY=your_actual_key
GOOGLE_GENAI_API_KEY=your_actual_key
GOOGLE_AI_API_KEY=your_actual_key

# 2. Auth Secret (REQUIRED for login/sessions)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_SECRET=your_generated_secret

# 3. Email Credentials (REQUIRED for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
SMTP_TO=your_email@gmail.com

# 4. Backend URLs (REQUIRED after deploying Python servers)
NEXT_PUBLIC_ML_API_URL=https://your-ml-api.railway.app
NEXT_PUBLIC_RAG_API_URL=https://your-rag-api.railway.app
```

---

## ✅ HOW TO ADD SECRETS TO VERCEL

### Step 1: Go to Vercel Dashboard

1. https://vercel.com/dashboard
2. Select project: **FundN3xus**
3. Settings → Environment Variables

### Step 2: Add Each Secret

For each variable above:

- **Key**: Variable name (e.g., `GEMINI_API_KEY`)
- **Value**: Your actual secret
- **Environments**: Check all (Production, Preview, Development)
- Click **Save**

### Step 3: Redeploy

- Go to **Deployments** tab
- Click **⋮** → **Redeploy**
- Your app will restart with new environment variables

---

## 📝 WHAT NOT TO SET IN VERCEL

These are already in your code or `.env.production`:

```bash
# Firebase (already public in your code)
NEXT_PUBLIC_FIREBASE_*

# App URLs
NEXT_PUBLIC_API_BASE_URL=https://fundn3xus.vercel.app/api
NEXT_PUBLIC_WEBAPP_URL=https://fundn3xus.vercel.app
NEXTAUTH_URL=https://fundn3xus.vercel.app

# Feature flags
FISIGHT_ENABLE_PRETRAINED_MODEL=true
NODE_ENV=production
```

---

## 🚨 BEFORE DEPLOYMENT CHECKLIST

- [ ] Get Gemini API key from https://aistudio.google.com/app/apikey
- [ ] Generate NEXTAUTH_SECRET (run command above)
- [ ] Get Gmail App Password from https://myaccount.google.com/apppasswords
- [ ] Deploy ML server to Railway and get URL
- [ ] Deploy RAG server to Railway and get URL

---

## 💡 QUICK TIP

**Test locally first:**

1. Copy `.env.example` to `.env.local`
2. Fill in your actual values
3. Run `npm run dev`
4. Test all features work locally
5. Then deploy to Vercel with same values

---

## 🔗 USEFUL LINKS

- **Add Secrets**: https://vercel.com/eyesee11/fundn3xus/settings/environment-variables
- **Get Gemini Key**: https://aistudio.google.com/app/apikey
- **Gmail App Password**: https://myaccount.google.com/apppasswords
- **Deploy to Railway**: https://railway.app
- **Full Guide**: See `VERCEL_DEPLOYMENT.md`

---

## ⚡ TLDR

**8 secrets to set in Vercel:**

1. `GEMINI_API_KEY`
2. `GOOGLE_GENAI_API_KEY`
3. `GOOGLE_AI_API_KEY`
4. `NEXTAUTH_SECRET`
5. `SMTP_USER`
6. `SMTP_PASS`
7. `NEXT_PUBLIC_ML_API_URL` (after deploying Python)
8. `NEXT_PUBLIC_RAG_API_URL` (after deploying Python)

Plus SMTP config: `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM`, `SMTP_TO`

**After setting all → REDEPLOY!** 🚀
