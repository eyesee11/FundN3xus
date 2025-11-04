# 🚀 Quick Pinecone Setup - You Have Credentials!

Since you already have your Pinecone credentials, here's what to do RIGHT NOW:

---

## ✅ Step 1: Install Pinecone Client (2 minutes)

```powershell
cd "C:\Users\91819\Desktop\Tor Browser\FundN3xus\ml"
pip install pinecone-client pinecone-text
```

---

## ✅ Step 2: Add Credentials to .env File

Create or edit `ml/.env` file and add:

```bash
# Pinecone Configuration
PINECONE_API_KEY=your_actual_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment  # e.g., us-west1-gcp, us-east-1-aws
PINECONE_INDEX_NAME=fundnexus-financial

# Gemini API Key (already have this)
GEMINI_API_KEY=your_gemini_key_here

# Embedding Model (default - don't change unless you know what you're doing)
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

**Where to find these:**

- **API Key**: Pinecone Console → API Keys tab
- **Environment**: Pinecone Console → Indexes → Your index → Environment column
- **Index Name**: You'll create this in next step

---

## ✅ Step 3: Create Pinecone Index

### **Option A: Via Pinecone Console (Recommended)**

1. Go to: https://app.pinecone.io/
2. Click **"Create Index"**
3. Fill in:
   ```
   Name: fundnexus-financial
   Dimensions: 384
   Metric: cosine
   Region: (Choose closest to you)
   ```
4. Click **"Create Index"**

**Why 384 dimensions?** That's the size of embeddings from `all-MiniLM-L6-v2` model.

### **Option B: Via Python Script**

```python
import pinecone
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Pinecone
pinecone.init(
    api_key=os.getenv('PINECONE_API_KEY'),
    environment=os.getenv('PINECONE_ENVIRONMENT')
)

# Create index
pinecone.create_index(
    name='fundnexus-financial',
    dimension=384,  # all-MiniLM-L6-v2 embedding size
    metric='cosine'
)

print("✅ Index created!")
```

---

## ✅ Step 4: Upload Your Data to Pinecone (5-10 minutes)

```powershell
cd ml
python train_rag_embeddings.py --database pinecone
```

**Expected Output:**

```
Loading dataset from dataset.csv...
Loaded 15,000 financial records
Preparing documents...
Created 15,000 documents
Initializing Pinecone...
✅ Connected to Pinecone index: fundnexus-financial
Creating embeddings and uploading to Pinecone...
Uploading batch 1/150...
Uploading batch 2/150...
...
✅ Successfully uploaded 15,000 vectors to Pinecone!
```

**Time:** About 5-10 minutes for 15,000 records

---

## ✅ Step 5: Update RAG Server to Use Pinecone

Open `ml/rag_server.py` and change **line 14** from:

```python
from rag_pipeline import FinancialRAGPipeline
```

To:

```python
from rag_pipeline_pinecone import PineconeRAGPipeline as FinancialRAGPipeline
```

---

## ✅ Step 6: Test Pinecone RAG Server

```powershell
cd ml
python rag_server.py
```

Expected output:

```
Initializing RAG pipeline...
Connecting to Pinecone...
✅ Connected to Pinecone index: fundnexus-financial
✅ RAG pipeline initialized successfully
INFO:     Uvicorn running on http://0.0.0.0:8001
```

---

## ✅ Step 7: Test a Query

Open browser: http://localhost:8001/docs

Try this query:

```json
{
  "question": "What are the characteristics of high-income earners in the dataset?",
  "return_sources": true,
  "max_sources": 5
}
```

---

## 🎯 Quick Commands Summary

```powershell
# 1. Install Pinecone
pip install pinecone-client pinecone-text

# 2. Configure .env (add your credentials)
# Edit ml/.env file

# 3. Upload data to Pinecone
cd ml
python train_rag_embeddings.py --database pinecone

# 4. Update rag_server.py (change import)
# Edit line 14 in rag_server.py

# 5. Start RAG server
python rag_server.py

# 6. Test at http://localhost:8001/docs
```

---

## 🔍 Verify Pinecone Index

Check if data uploaded successfully:

```python
import pinecone
import os
from dotenv import load_dotenv

load_dotenv()

pinecone.init(
    api_key=os.getenv('PINECONE_API_KEY'),
    environment=os.getenv('PINECONE_ENVIRONMENT')
)

index = pinecone.Index('fundnexus-financial')
stats = index.describe_index_stats()

print(f"✅ Total vectors in Pinecone: {stats['total_vector_count']}")
print(f"✅ Dimensions: {stats['dimension']}")
print(f"✅ Index fullness: {stats['index_fullness'] * 100:.2f}%")
```

**Expected:**

```
✅ Total vectors in Pinecone: 15000
✅ Dimensions: 384
✅ Index fullness: 30.00%
```

---

## 📊 Your Pinecone Usage

**Free Tier Limits:**

- ✅ 1 index
- ✅ 100,000 vectors (you're using 15,000)
- ✅ 5GB storage (you're using ~500MB)

**You're well within free tier! 🎉**

---

## 🚨 Troubleshooting

### Error: "Invalid API key"

```bash
# Check your .env file
cat ml/.env | grep PINECONE

# Make sure no extra spaces or quotes
PINECONE_API_KEY=abc123...  # ✅ Correct
PINECONE_API_KEY="abc123..."  # ❌ Remove quotes
PINECONE_API_KEY= abc123...  # ❌ Remove space
```

### Error: "Index not found"

```python
# List all your indexes
import pinecone
pinecone.init(api_key='your-key', environment='your-env')
print(pinecone.list_indexes())

# Create index if missing
pinecone.create_index('fundnexus-financial', dimension=384, metric='cosine')
```

### Error: "Dimension mismatch"

```
Problem: Index dimension (e.g., 768) doesn't match embeddings (384)
Solution: Delete index and recreate with dimension=384
```

### Slow Upload

```
Normal: 5-10 minutes for 15,000 records
If slower: Check internet connection
```

---

## 🎉 Next Steps

Once Pinecone is working:

1. **Keep ChromaDB for backup** (it still works locally)
2. **Deploy RAG server to Railway** with Pinecone credentials
3. **Update Vercel** with new RAG API URL
4. **Monitor usage** in Pinecone console

---

## 💡 Pro Tips

### 1. Use Metadata Filtering

```python
# Find high-income profiles
docs = rag.similarity_search(
    "investment strategies",
    k=10,
    filter_dict={"income": {"$gte": 100000}}
)
```

### 2. Use Namespaces for Organization

```python
# Separate production and test data
vectorstore = Pinecone.from_documents(
    documents,
    embeddings,
    index_name='fundnexus-financial',
    namespace='prod-2024'  # ← Organize data
)
```

### 3. Monitor Your Usage

Check Pinecone console regularly: https://app.pinecone.io/

---

## 🔗 Useful Links

- **Pinecone Console**: https://app.pinecone.io/
- **API Keys**: https://app.pinecone.io/ → API Keys
- **Usage Dashboard**: https://app.pinecone.io/ → Usage
- **Docs**: https://docs.pinecone.io/

---

## ✅ Checklist

- [ ] Install pinecone-client
- [ ] Add credentials to ml/.env
- [ ] Create Pinecone index (dimension=384)
- [ ] Upload data: `python train_rag_embeddings.py --database pinecone`
- [ ] Update rag_server.py import
- [ ] Start server: `python rag_server.py`
- [ ] Test at http://localhost:8001/docs
- [ ] Verify in Pinecone console

**Once all checked, you're fully on Pinecone! 🌲✨**
