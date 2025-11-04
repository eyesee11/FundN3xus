# 🚀 How to Create NEXT_PUBLIC_ML_API_URL - Complete Guide

## 📋 **What Is NEXT_PUBLIC_ML_API_URL?**

It's **NOT** something you create - it's the **URL** where your Python ML server is running!

```
┌─────────────────┐         NEXT_PUBLIC_ML_API_URL          ┌─────────────────┐
│   Next.js App   │  ────────────────────────────────────▶  │  Python ML API  │
│  (Frontend)     │         "Where to find ML API?"         │   (Backend)     │
│  Port 9002      │                                          │   Port 8000     │
└─────────────────┘                                          └─────────────────┘
```

---

## 🎯 **Two Scenarios**

| Scenario              | URL Value                         | When To Use              |
| --------------------- | --------------------------------- | ------------------------ |
| **Local Development** | `http://localhost:8000`           | Testing on your computer |
| **Production**        | `https://your-ml-api.railway.app` | After deploying to cloud |

---

## 🔧 **OPTION 1: Local Development (Do This First)**

### **Step 1: Start Your Python ML Server**

Open a **NEW PowerShell terminal** (keep your Next.js dev server running in the other one):

```powershell
# Navigate to ml directory
cd "C:\Users\91819\Desktop\Tor Browser\FundN3xus\ml"

# Check Python version
python --version
# Should show: Python 3.8+ (3.10 or 3.11 recommended)

# Install required packages (first time only)
pip install -r requirements.txt

# Train the ML models (first time only - takes 2-3 minutes)
python train_model.py

# Start the ML API server
python server.py
```

**Expected Output:**

```
INFO:     Started server process
INFO:     Waiting for application startup.
Loading FundN3xus ML models...
Successfully loaded investment_risk model
Successfully loaded affordability model
Successfully loaded health_score model
Successfully loaded scenario_planner model
Successfully loaded 4 models
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
🚀 Server URL: http://0.0.0.0:8000
📖 API Docs: http://0.0.0.0:8000/docs
```

### **Step 2: Verify ML Server Is Running**

Open your browser and go to:

```
http://localhost:8000/docs
```

You should see the **FastAPI Swagger Documentation** with all endpoints.

### **Step 3: Set Environment Variable**

Your `.env` file should already have:

```bash
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
```

If not, add it:

```powershell
# Open .env file and add:
echo "NEXT_PUBLIC_ML_API_URL=http://localhost:8000" >> .env
```

### **Step 4: Restart Next.js Dev Server**

```powershell
# Stop your current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### **Step 5: Test the Connection**

1. Open your app: http://localhost:9002
2. Go to Dashboard
3. You should see ML predictions loading!

---

## 🚀 **OPTION 2: Production Deployment (After Local Works)**

Once your ML server works locally, deploy it to the cloud:

### **Method A: Deploy to Railway (Recommended)**

#### **Step 1: Sign Up for Railway**

- Go to https://railway.app
- Sign up with GitHub
- Free tier: $5 credit (enough for testing)

#### **Step 2: Create New Project**

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your `FundN3xus` repository
4. Select the `ml` directory as root

#### **Step 3: Configure Railway**

Add these environment variables in Railway:

```bash
PORT=8000
MODELS_DIR=models
CORS_ORIGINS=https://fundn3xus.vercel.app
DEVELOPMENT_MODE=false
```

#### **Step 4: Get Your Railway URL**

After deployment, Railway will give you a URL like:

```
https://fundnexus-ml-production.railway.app
```

#### **Step 5: Update Your .env.production**

```bash
# In .env.production file:
NEXT_PUBLIC_ML_API_URL=https://fundnexus-ml-production.railway.app
```

#### **Step 6: Add to Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Select your project: **FundN3xus**
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   Key:   NEXT_PUBLIC_ML_API_URL
   Value: https://fundnexus-ml-production.railway.app
   ```
5. Click **Save**
6. **Redeploy** your app

---

### **Method B: Deploy to Render**

#### **Step 1: Sign Up**

- Go to https://render.com
- Sign up (free tier available)

#### **Step 2: Create Web Service**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Configure:
   ```
   Name: fundnexus-ml
   Root Directory: ml
   Build Command: pip install -r requirements.txt
   Start Command: python server.py
   ```

#### **Step 3: Add Environment Variables**

```bash
PORT=8000
MODELS_DIR=models
CORS_ORIGINS=https://fundn3xus.vercel.app
```

#### **Step 4: Get Render URL**

```
https://fundnexus-ml.onrender.com
```

#### **Step 5: Update Vercel**

Same as Railway steps 5-6 above.

---

## 🧪 **Testing Your ML API URL**

### **Test Locally:**

```powershell
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","models_loaded":4,"available_models":["investment_risk","affordability","health_score","scenario_planner"]}
```

### **Test Production:**

```powershell
# Test your Railway/Render URL
curl https://your-ml-api.railway.app/health
```

### **Test from Next.js App:**

```typescript
// Test in browser console on your app
fetch("http://localhost:8000/health")
  .then((r) => r.json())
  .then(console.log);
```

---

## 🔍 **Troubleshooting**

### **Problem: "ML server won't start"**

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**

```powershell
cd ml
pip install -r requirements.txt
```

---

### **Problem: "Models not found"**

**Error:** `Model file models/investment_risk_model.pkl not found`

**Solution:**

```powershell
cd ml
python train_model.py  # Takes 2-3 minutes
```

---

### **Problem: "CORS error in browser"**

**Error:** `Access to fetch blocked by CORS policy`

**Solution:** Update `ml/.env` or `ml/server.py`:

```bash
CORS_ORIGINS=http://localhost:9002,http://localhost:3000,https://fundn3xus.vercel.app
```

---

### **Problem: "Connection refused"**

**Error:** `Failed to fetch: net::ERR_CONNECTION_REFUSED`

**Checklist:**

- [ ] Is ML server running? Check terminal for `Uvicorn running on...`
- [ ] Is it on port 8000? Check with `netstat -ano | findstr :8000`
- [ ] Is URL correct in `.env`? Should be `http://localhost:8000`
- [ ] Did you restart Next.js after changing `.env`? Run `npm run dev` again

---

### **Problem: "Works locally but not in production"**

**Checklist:**

- [ ] Did you deploy ML server to Railway/Render?
- [ ] Did you update Vercel environment variables?
- [ ] Did you redeploy Vercel app after adding variables?
- [ ] Is Railway/Render app awake? (Free tier sleeps after inactivity)

---

## 📝 **Quick Setup Commands**

### **For Local Development:**

```powershell
# Terminal 1 - Next.js Frontend
cd "C:\Users\91819\Desktop\Tor Browser\FundN3xus"
npm run dev

# Terminal 2 - ML Backend
cd "C:\Users\91819\Desktop\Tor Browser\FundN3xus\ml"
pip install -r requirements.txt
python train_model.py
python server.py

# Terminal 3 - RAG Backend (optional)
cd "C:\Users\91819\Desktop\Tor Browser\FundN3xus\ml"
pip install -r requirements-rag.txt
python train_rag_embeddings.py
python rag_server.py
```

### **For Production:**

```bash
# 1. Deploy ML server to Railway
railway up

# 2. Get Railway URL (e.g., https://fundnexus-ml-production.railway.app)

# 3. Add to Vercel Dashboard:
# NEXT_PUBLIC_ML_API_URL=https://fundnexus-ml-production.railway.app

# 4. Redeploy Vercel app
```

---

## ✅ **Verification Checklist**

- [ ] Python 3.8+ installed
- [ ] ML dependencies installed (`pip install -r requirements.txt`)
- [ ] Models trained (`python train_model.py` completed)
- [ ] ML server running on port 8000
- [ ] Can access http://localhost:8000/docs in browser
- [ ] `.env` has `NEXT_PUBLIC_ML_API_URL=http://localhost:8000`
- [ ] Next.js restarted after `.env` change
- [ ] Dashboard shows predictions

---

## 🎯 **What Happens Under the Hood**

### **1. Your Code Reads the Variable:**

```typescript
// src/lib/ml-api.ts
const ML_API_BASE_URL =
  process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000";
```

### **2. Frontend Makes API Calls:**

```typescript
// When user views dashboard:
const response = await fetch(`${ML_API_BASE_URL}/predict/investment-risk`, {
  method: 'POST',
  body: JSON.stringify({ age: 30, income: 50000, ... })
});
```

### **3. Python Server Responds:**

```python
# ml/server.py receives request at:
@app.post("/predict/investment-risk")
async def predict_investment_risk(profile: FinancialProfile):
    # Returns: {"risk_score": 65, "risk_category": "moderate", ...}
```

### **4. Frontend Shows Results:**

```tsx
// Dashboard displays the prediction
<div>Risk Score: {data.risk_score}</div>
```

---

## 🚨 **Common Mistakes**

### ❌ **WRONG:**

```bash
# Trying to "create" the URL
NEXT_PUBLIC_ML_API_URL=create_new_url

# URL with typo
NEXT_PUBLIC_ML_API_URL=http://localhost:800  # Missing 0

# Using localhost in production
# In Vercel: NEXT_PUBLIC_ML_API_URL=http://localhost:8000  # Won't work!
```

### ✅ **CORRECT:**

```bash
# Local development
NEXT_PUBLIC_ML_API_URL=http://localhost:8000

# Production
NEXT_PUBLIC_ML_API_URL=https://your-ml-api.railway.app
```

---

## 📚 **Related Guides**

- **`ml/README.md`** - ML server documentation
- **`VERCEL_DEPLOYMENT.md`** - Full deployment guide
- **`ENV_FILES_GUIDE.md`** - All environment variables explained

---

## 🎉 **Summary**

**To "create" `NEXT_PUBLIC_ML_API_URL`, you need to:**

1. ✅ **Start your Python ML server** (`python ml/server.py`)
2. ✅ **Get the URL** where it's running (`http://localhost:8000`)
3. ✅ **Put that URL in `.env`** (`NEXT_PUBLIC_ML_API_URL=http://localhost:8000`)
4. ✅ **Restart Next.js** (`npm run dev`)

**For production:**

1. ✅ **Deploy ML server to Railway/Render**
2. ✅ **Get cloud URL** (`https://your-app.railway.app`)
3. ✅ **Update Vercel environment variables**
4. ✅ **Redeploy Vercel app**

**The URL isn't "created" - it's WHERE your ML server lives! 🏠**
