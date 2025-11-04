# 🚂 Deploy ML Server to Railway - Quick Guide

## 🎯 **Goal: Get Your ML API URL for Production**

Your webapp is on Vercel: `https://fundn3xus.vercel.app` ✅  
Your ML server needs its own hosting: `https://your-ml-api.railway.app` ⏳

---

## 🚀 **Step-by-Step: Deploy to Railway**

### **Step 1: Sign Up for Railway**

1. Go to https://railway.app
2. Click **"Start a New Project"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub

**Free Tier:** $5 credit/month (enough for testing)

---

### **Step 2: Deploy from GitHub**

1. Click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: **`eyesee11/FundN3xus`**
4. Click **"Deploy Now"**

---

### **Step 3: Configure Railway Project**

Railway will deploy your entire repo, but we only want the `ml` directory.

1. Go to your Railway project dashboard
2. Click **"Settings"** tab
3. Under **"Service Settings"**:
   ```
   Root Directory: ml
   Build Command: pip install -r requirements.txt
   Start Command: python server.py
   ```
4. Click **"Save"**

---

### **Step 4: Add Environment Variables in Railway**

In Railway dashboard → **"Variables"** tab, add:

```bash
PORT=8000
MODELS_DIR=models
DATASET_PATH=dataset.csv
CORS_ORIGINS=https://fundn3xus.vercel.app,http://localhost:9002
DEVELOPMENT_MODE=false
ENABLE_DEBUG_ENDPOINTS=false
LOG_LEVEL=info
```

**Important:** Add your Vercel URL to `CORS_ORIGINS` so your frontend can access the API!

---

### **Step 5: Get Your Railway URL**

After deployment completes (2-3 minutes):

1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Railway will give you a URL like:

```
https://fundnexus-ml-production.railway.app
```

**This is your `NEXT_PUBLIC_ML_API_URL`!** 🎉

---

### **Step 6: Test Your Railway ML API**

Open in browser:

```
https://fundnexus-ml-production.railway.app/health
```

Should return:

```json
{
  "status": "healthy",
  "models_loaded": 4,
  "available_models": [
    "investment_risk",
    "affordability",
    "health_score",
    "scenario_planner"
  ]
}
```

---

### **Step 7: Update Vercel Environment Variables**

1. Go to https://vercel.com/dashboard
2. Select project: **FundN3xus**
3. Go to **Settings** → **Environment Variables**
4. Add new variable:

```
Key:   NEXT_PUBLIC_ML_API_URL
Value: https://fundnexus-ml-production.railway.app
Environments: ✓ Production ✓ Preview ✓ Development
```

5. Click **"Save"**

---

### **Step 8: Redeploy Vercel App**

1. Go to **"Deployments"** tab
2. Click **⋮** (three dots) next to latest deployment
3. Click **"Redeploy"**

**Wait 1-2 minutes for redeployment.**

---

### **Step 9: Verify Everything Works**

1. Visit: https://fundn3xus.vercel.app/dashboard
2. ML predictions should now load! 🎉
3. Check browser console for errors (should be none)

---

## 🔍 **Troubleshooting Railway Deployment**

### **Problem: Build Fails**

**Error:** `Could not find requirements.txt`

**Solution:**
Make sure **Root Directory** is set to `ml` in Railway settings.

---

### **Problem: Server Crashes**

**Error:** `ModuleNotFoundError: No module named 'xgboost'`

**Solution:**
Check Railway logs. Add missing packages to `ml/requirements.txt`:

```bash
xgboost>=1.7.0
```

---

### **Problem: CORS Error**

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
Update Railway environment variables:

```bash
CORS_ORIGINS=https://fundn3xus.vercel.app
```

Redeploy Railway app.

---

### **Problem: Models Not Loading**

**Error:** `Model file models/investment_risk_model.pkl not found`

**Solution:**
Your models need to be in Git:

```powershell
# On your computer:
cd "C:\Users\91819\Desktop\Tor Browser\FundN3xus"
git add ml/models/*.pkl
git commit -m "Add trained ML models"
git push
```

Then redeploy Railway.

---

## 🎯 **Expected Configuration After Setup**

### **Your Production .env.production:**

```bash
NEXT_PUBLIC_ML_API_URL=https://fundnexus-ml-production.railway.app
```

### **Your Vercel Environment Variables:**

```bash
NEXT_PUBLIC_ML_API_URL=https://fundnexus-ml-production.railway.app
```

### **Your Local .env (unchanged):**

```bash
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
```

---

## 💰 **Railway Pricing**

- **Starter Plan:** $5 free credit/month
- **Usage:** ~$0.30-0.50/day for small apps
- **Billing:** Only pay for what you use

**For testing:** The free credit is enough!

---

## 🔄 **Alternative: Deploy to Render**

If Railway doesn't work, try Render (also has free tier):

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Configure:
   ```
   Root Directory: ml
   Build Command: pip install -r requirements.txt
   Start Command: python server.py
   Environment: Python 3
   ```
5. Add environment variables (same as Railway)
6. Deploy!

Your URL will be: `https://fundnexus-ml.onrender.com`

---

## ✅ **Verification Checklist**

- [ ] Railway project created
- [ ] Root directory set to `ml`
- [ ] Environment variables added in Railway
- [ ] Railway domain generated
- [ ] Railway health endpoint returns OK
- [ ] Vercel environment variable updated
- [ ] Vercel app redeployed
- [ ] Production dashboard loads predictions

---

## 🎉 **Summary**

**Before:** ML server only on your computer  
**After:** ML server on Railway → Accessible from Vercel production app

**Your final URLs:**

```
Frontend:  https://fundn3xus.vercel.app
ML API:    https://fundnexus-ml-production.railway.app
```

Both deployed, both working! 🚀
