# 🐍 PythonAnywhere Deployment Guide (Not Recommended)

## ⚠️ WARNING: Read This First

**PythonAnywhere is NOT ideal for your ML API because:**

1. Free tier blocks external HTTPS → **RAG server won't work** (needs Gemini API)
2. WSGI-only on free tier → FastAPI runs slower
3. Limited resources → ML predictions may timeout
4. Complex setup → More things can break

**Recommended instead:** Railway, Render, or Fly.io (see `DEPLOY_ML_TO_RAILWAY.md`)

---

## If You Still Want to Try PythonAnywhere:

### **Step 1: Sign Up**

1. Go to https://www.pythonanywhere.com
2. Create a free account
3. Go to **Dashboard**

### **Step 2: Upload Your Code**

**Option A: Via Git (Recommended)**

```bash
# In PythonAnywhere Bash console:
cd ~
git clone https://github.com/eyesee11/FundN3xus.git
cd FundN3xus/ml
```

**Option B: Upload Files**

- Use **Files** tab to upload `ml` directory

### **Step 3: Create Virtual Environment**

```bash
# In PythonAnywhere Bash console:
cd ~/FundN3xus/ml
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### **Step 4: Convert FastAPI to WSGI**

Create `wsgi.py` in `ml` directory:

```python
# ml/wsgi.py
import sys
import os

# Add your project directory to Python path
path = '/home/YOUR_USERNAME/FundN3xus/ml'
if path not in sys.path:
    sys.path.insert(0, path)

# Set environment variables
os.environ['MODELS_DIR'] = '/home/YOUR_USERNAME/FundN3xus/ml/models'
os.environ['DATASET_PATH'] = '/home/YOUR_USERNAME/FundN3xus/ml/dataset.csv'

# Import FastAPI app
from server import app

# Create WSGI application
application = app
```

### **Step 5: Configure Web App**

1. Go to **Web** tab
2. Click **Add a new web app**
3. Select **Manual configuration**
4. Choose **Python 3.10**
5. Configure:
   ```
   Source code: /home/YOUR_USERNAME/FundN3xus/ml
   Working directory: /home/YOUR_USERNAME/FundN3xus/ml
   WSGI configuration file: /home/YOUR_USERNAME/FundN3xus/ml/wsgi.py
   Virtualenv: /home/YOUR_USERNAME/FundN3xus/ml/venv
   ```

### **Step 6: Edit WSGI Configuration**

Click **WSGI configuration file** link and replace content with:

```python
import sys
import os

# Add project directory
project_home = '/home/YOUR_USERNAME/FundN3xus/ml'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Activate virtualenv
activate_this = project_home + '/venv/bin/activate_this.py'
exec(open(activate_this).read(), {'__file__': activate_this})

# Import application
from wsgi import application
```

### **Step 7: Reload Web App**

Click **Reload YOUR_USERNAME.pythonanywhere.com**

Your URL will be: `https://YOUR_USERNAME.pythonanywhere.com`

---

## 🚨 **Critical Issues You'll Face:**

### **Issue 1: RAG Server Won't Work**

```
Problem: Free tier blocks external HTTPS
Impact: Can't call Gemini API
Solution: Upgrade to paid tier ($5/mo) OR use Railway instead
```

### **Issue 2: Slow ML Predictions**

```
Problem: Limited CPU resources
Impact: Predictions may take 5-10 seconds
Solution: Use Railway/Render with better resources
```

### **Issue 3: Daily Restarts**

```
Problem: Free apps sleep after 3 months inactivity
Impact: First request after sleep takes 30+ seconds
Solution: Paid tier OR use Railway
```

### **Issue 4: File Upload Limits**

```
Problem: 512MB total storage on free tier
Impact: Large models may not fit
Solution: Paid tier OR use cloud hosting
```

---

## 💰 **Cost Comparison:**

| Platform       | Free Tier                  | Paid Tier                | Best For          |
| -------------- | -------------------------- | ------------------------ | ----------------- |
| PythonAnywhere | Limited, no external HTTPS | $5/mo                    | Simple Flask apps |
| Railway        | $5 credit                  | Pay as you go (~$3-5/mo) | Modern APIs, ML   |
| Render         | 750 hrs/mo                 | $7/mo                    | Production apps   |

---

## ✅ **Better Alternative: Railway (5 min setup)**

Instead of PythonAnywhere's complex setup, use Railway:

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy (from your project root)
cd ml
railway up

# Done! Get your URL immediately
```

**Result:** `https://fundnexus-ml-production.railway.app` 🎉

---

## 🎯 **Recommendation**

**DON'T use PythonAnywhere for this project because:**

1. Your RAG server needs Gemini API (blocked on free tier)
2. FastAPI runs better on ASGI platforms
3. ML models need better resources
4. Setup is 10x more complex

**DO use Railway because:**

1. 5-minute deployment
2. No restrictions on external APIs
3. Better performance for ML
4. $5 free credit (enough for testing)
5. Auto-deploy from GitHub

---

## 📚 **See Instead:**

- `DEPLOY_ML_TO_RAILWAY.md` - Easy Railway deployment
- `SETUP_ML_SERVER.md` - Local setup guide
- `VERCEL_DEPLOYMENT.md` - Full production guide
