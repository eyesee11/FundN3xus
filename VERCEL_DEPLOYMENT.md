# 🚀 Vercel Deployment Guide - Environment Variables

## 🔐 Secret Keys (Set in Vercel Dashboard)

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these as **secrets** (they will be hidden after saving):

### 1. ⚠️ CRITICAL - AI/ML Keys

```bash
# Google Gemini API Key - Get from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key_here
GOOGLE_GENAI_API_KEY=your_actual_gemini_api_key_here
GOOGLE_AI_API_KEY=your_actual_gemini_api_key_here
```

**Why secret?** These keys provide access to paid Google AI services and cost money if abused.

---

### 2. 🔒 Authentication Secret

```bash
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_SECRET=your_randomly_generated_32_character_minimum_secret
```

**How to generate:**

```powershell
# Run this in your terminal to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Why secret?** Used to encrypt JWT tokens and session data. If exposed, attackers can forge sessions.

---

### 3. 📧 Email/SMTP Credentials

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ayushchauhan1164@gmail.com
SMTP_PASS=hmjsheqtsewrtboo
SMTP_FROM=ayushchauhan1164@gmail.com
SMTP_TO=ayushchauhan1164@gmail.com
```

**Why secret?** Your email password grants access to send emails from your account.

**Note:** For Gmail, use an [App Password](https://myaccount.google.com/apppasswords), not your real password.

---

### 4. 🗄️ Database/Backend URLs (When Deployed)

```bash
# After deploying your Python ML/RAG servers to Railway/Render:
NEXT_PUBLIC_ML_API_URL=https://your-ml-api.railway.app
NEXT_PUBLIC_RAG_API_URL=https://your-rag-api.railway.app
```

**Why important?** These URLs point to your backend services. Without them, ML features won't work.

---

### 5. 🎯 Optional - Pinecone (If Using Cloud Vector DB)

```bash
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
```

**Only needed if:** You chose Pinecone instead of ChromaDB for your RAG system.

---

## ✅ Public Variables (Safe to Include)

These can stay in your `.env.production` file or be set in Vercel - they're public anyway:

### Firebase Configuration (All start with NEXT*PUBLIC*)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=fisight-e4118.firebaseapp.com
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fisight-e4118.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fisight-e4118
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fisight-e4118.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=527958180171
NEXT_PUBLIC_FIREBASE_APP_ID=1:527958180171:web:bd69739fb42ce48cf2e8ce
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-TQK298H3C8
```

**Why public?** Firebase keys with `NEXT_PUBLIC_` prefix are designed to be exposed in browser. Security is enforced by Firebase Security Rules.

### App Configuration

```bash
NEXTAUTH_URL=https://fundn3xus.vercel.app
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_API_BASE_URL=https://fundn3xus.vercel.app/api
NEXT_PUBLIC_WEBAPP_URL=https://fundn3xus.vercel.app
```

**Why public?** These are just URLs and configuration flags visible to users anyway.

### Feature Flags

```bash
FISIGHT_ENABLE_PRETRAINED_MODEL=true
FISIGHT_ENABLE_MCP_SERVER=false
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

**Why public?** Just boolean flags that control features.

---

## 📋 Step-by-Step: Adding Secrets to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project: **FundN3xus**
3. Click **Settings** tab
4. Click **Environment Variables** in sidebar
5. For each secret variable:
   ```
   Key:   GEMINI_API_KEY
   Value: [paste your actual key]
   Environment: Production, Preview, Development (check all)
   ```
6. Click **Save**
7. **Redeploy** your app for changes to take effect

### Method 2: Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Set environment variables
vercel env add GEMINI_API_KEY
# Paste your key when prompted
# Select: Production, Preview, Development

# Repeat for all secret keys
```

---

## 🎯 Complete Checklist for Production

### Before Deploying to Vercel:

- [ ] Generate `NEXTAUTH_SECRET` using crypto.randomBytes
- [ ] Get your Gemini API key from https://aistudio.google.com/app/apikey
- [ ] Deploy Python ML server to Railway/Render and get URL
- [ ] Deploy Python RAG server to Railway/Render and get URL
- [ ] Ensure Firebase project is in production mode

### In Vercel Dashboard:

- [ ] Set `GEMINI_API_KEY` (secret)
- [ ] Set `GOOGLE_GENAI_API_KEY` (secret)
- [ ] Set `GOOGLE_AI_API_KEY` (secret)
- [ ] Set `NEXTAUTH_SECRET` (secret)
- [ ] Set `SMTP_HOST` (secret)
- [ ] Set `SMTP_PORT` (secret)
- [ ] Set `SMTP_USER` (secret)
- [ ] Set `SMTP_PASS` (secret)
- [ ] Set `SMTP_FROM` (secret)
- [ ] Set `SMTP_TO` (secret)
- [ ] Set `NEXT_PUBLIC_ML_API_URL` (after deploying ML server)
- [ ] Set `NEXT_PUBLIC_RAG_API_URL` (after deploying RAG server)
- [ ] Redeploy project

### After Deployment:

- [ ] Test authentication at https://fundn3xus.vercel.app/login
- [ ] Test ML predictions in dashboard
- [ ] Test RAG chat at https://fundn3xus.vercel.app/ai-chat
- [ ] Check email functionality (contact form)
- [ ] Monitor Vercel logs for errors

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:

- Commit `.env` or `.env.production` with secrets to GitHub
- Use development URLs in production environment variables
- Forget to redeploy after adding environment variables
- Share API keys publicly or in screenshots

### ✅ DO:

- Use Vercel Dashboard to set secrets
- Keep `.env.example` in repo (without actual values)
- Test locally with `.env.local` (gitignored)
- Rotate keys if accidentally exposed
- Use different keys for development vs production

---

## 🔍 Debugging Environment Variables

### Check if Variables are Set Correctly:

Create this temporary API route to debug (DELETE after testing):

```typescript
// src/app/api/debug/env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    // Only show which keys are set, not their values
    gemini_set: !!process.env.GEMINI_API_KEY,
    nextauth_secret_set: !!process.env.NEXTAUTH_SECRET,
    ml_url: process.env.NEXT_PUBLIC_ML_API_URL,
    rag_url: process.env.NEXT_PUBLIC_RAG_API_URL,
    environment: process.env.NODE_ENV,
  });
}
```

Visit: `https://fundn3xus.vercel.app/api/debug/env`

**⚠️ DELETE this route after debugging!**

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Generate Gemini API Key](https://aistudio.google.com/app/apikey)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [Railway Deployment Guide](https://docs.railway.app/)

---

## 🎉 Quick Summary

**Set these as SECRETS in Vercel Dashboard:**

1. `GEMINI_API_KEY`, `GOOGLE_GENAI_API_KEY`, `GOOGLE_AI_API_KEY`
2. `NEXTAUTH_SECRET`
3. `SMTP_*` (all email variables)
4. `NEXT_PUBLIC_ML_API_URL` (after deploying Python server)
5. `NEXT_PUBLIC_RAG_API_URL` (after deploying Python server)

**Everything else** can be in your `.env.production` file or set in Vercel as non-secret values.

After setting all variables, **REDEPLOY** your Vercel app for changes to take effect! 🚀
