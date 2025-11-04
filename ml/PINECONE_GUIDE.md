# 🌲 Pinecone Integration Guide for FundN3xus

## Why Pinecone?

### ChromaDB (Current - Local)

- ✅ Free
- ✅ Easy setup
- ✅ Good for development
- ❌ Local storage only
- ❌ Limited scalability
- ❌ No built-in backups

### Pinecone (Cloud - Production)

- ✅ Cloud-hosted (no local storage)
- ✅ Scales to billions of vectors
- ✅ Fast queries globally
- ✅ Built-in monitoring
- ✅ Automatic backups
- ✅ Multi-region support
- ⚠️ Paid (free tier available)

---

## 🚀 Setup Pinecone (5 minutes)

### Step 1: Sign Up for Pinecone

1. Go to: https://www.pinecone.io/
2. Click "Sign Up" (free tier available)
3. Verify your email
4. Log in to console: https://app.pinecone.io/

### Step 2: Create an Index

1. In Pinecone console, click "Create Index"
2. Fill in:
   - **Name**: `fundnexus-financial` (or your choice)
   - **Dimensions**: `384` (for all-MiniLM-L6-v2 model)
   - **Metric**: `cosine`
   - **Environment**: Choose closest region (e.g., `us-west1-gcp`)
3. Click "Create Index"

**Note**: If using different embedding model:

- `all-MiniLM-L6-v2` → 384 dimensions
- `all-mpnet-base-v2` → 768 dimensions
- OpenAI `text-embedding-ada-002` → 1536 dimensions

### Step 3: Get API Key

1. In Pinecone console, go to "API Keys"
2. Copy your API key (starts with something like `12345678-abcd...`)
3. Copy your environment (e.g., `us-west1-gcp`)

### Step 4: Install Pinecone Client

```powershell
cd "c:\Users\91819\Desktop\Tor Browser\FundN3xus\ml"
pip install pinecone-client
```

### Step 5: Configure Environment

Edit your `.env` file:

```env
# Pinecone Configuration
PINECONE_API_KEY=your_api_key_here
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=fundnexus-financial
```

---

## 📊 Upload Your Data to Pinecone

### Option 1: Using the Script

```powershell
# Upload all your financial data
python rag_pipeline_pinecone.py
```

This will:

1. Connect to Pinecone
2. Load your dataset.csv
3. Create embeddings
4. Upload to Pinecone index

### Option 2: Using Training Script

```powershell
python train_rag_embeddings.py --database pinecone
```

---

## 🔄 Migrate from ChromaDB to Pinecone

### Quick Migration

```powershell
# 1. Make sure Pinecone is configured in .env
# 2. Run Pinecone setup
python rag_pipeline_pinecone.py
```

Your data will be uploaded to Pinecone. ChromaDB data stays local.

### Switch RAG Server to Pinecone

Edit `rag_server.py` at the top:

```python
# Change this import
from rag_pipeline import FinancialRAGPipeline

# To this
from rag_pipeline_pinecone import PineconeRAGPipeline as FinancialRAGPipeline
```

Or create a new Pinecone-specific server:

```powershell
# Copy the server
copy rag_server.py rag_server_pinecone.py

# Edit rag_server_pinecone.py to use PineconeRAGPipeline
```

---

## 🎯 Using Pinecone RAG Pipeline

### Basic Usage

```python
from rag_pipeline_pinecone import PineconeRAGPipeline

# Initialize
rag = PineconeRAGPipeline(
    index_name='fundnexus-financial'
)

# Setup (first time or to update data)
rag.setup_pipeline(force_recreate=False)

# Query
result = rag.query("What is the average financial health score?")
print(result['answer'])

# Search with filters
docs = rag.similarity_search(
    query="high income profiles",
    k=10,
    filter_dict={
        "income": {"$gte": 100000},
        "age": {"$lte": 40}
    }
)
```

### Advanced Filtering

Pinecone supports rich metadata filtering:

```python
# Age range filter
filter_dict = {
    "age": {"$gte": 30, "$lte": 40}
}

# Multiple conditions (AND)
filter_dict = {
    "income": {"$gte": 80000},
    "scenario_category": {"$eq": "moderate_risk"},
    "credit_score": {"$gte": 700}
}

# OR conditions
filter_dict = {
    "$or": [
        {"scenario_category": "low_risk"},
        {"scenario_category": "moderate_risk"}
    ]
}

# Complex queries
filter_dict = {
    "$and": [
        {"age": {"$gte": 25, "$lte": 35}},
        {"income": {"$gte": 60000}},
        {
            "$or": [
                {"debt_to_income": {"$lte": 0.3}},
                {"financial_health_score": {"$gte": 70}}
            ]
        }
    ]
}
```

---

## 📈 Pinecone Index Management

### Check Index Stats

```python
import pinecone
from dotenv import load_dotenv
import os

load_dotenv()

pinecone.init(
    api_key=os.getenv('PINECONE_API_KEY'),
    environment=os.getenv('PINECONE_ENVIRONMENT')
)

index = pinecone.Index('fundnexus-financial')
stats = index.describe_index_stats()

print(f"Total vectors: {stats['total_vector_count']}")
print(f"Index fullness: {stats['index_fullness']}")
print(f"Dimension: {stats['dimension']}")
```

### Update Data

```powershell
# Add new data (keeps existing)
python rag_pipeline_pinecone.py

# Replace all data
python rag_pipeline_pinecone.py --force-rebuild
```

### Delete Index

```python
import pinecone
pinecone.init(api_key='your-key', environment='your-env')
pinecone.delete_index('fundnexus-financial')
```

---

## 💰 Pricing & Limits

### Free Tier (Starter)

- ✅ 1 index
- ✅ Up to 100K vectors
- ✅ Up to 5GB storage
- ✅ Community support
- **Perfect for development & small projects**

### Paid Tiers (Standard)

- Multiple indexes
- Unlimited vectors
- Higher performance
- Priority support
- Starting at ~$70/month

**Your 15,000 financial records** fit easily in free tier! 🎉

---

## 🔧 Performance Optimization

### 1. Batch Uploads

```python
# Upload in batches
batch_size = 100
for i in range(0, len(documents), batch_size):
    batch = documents[i:i+batch_size]
    vectorstore.add_documents(batch)
```

### 2. Use Namespaces

Organize your data:

```python
# Create vectors in namespace
vectorstore = Pinecone.from_documents(
    documents=documents,
    embedding=embeddings,
    index_name=index_name,
    namespace="financial-profiles-2024"
)

# Query specific namespace
docs = vectorstore.similarity_search(
    "high earners",
    namespace="financial-profiles-2024"
)
```

### 3. Hybrid Search

Combine vector search with metadata filtering:

```python
# Fast: Filter first, then search
docs = vectorstore.similarity_search(
    "investment strategies",
    k=10,
    filter={"scenario_category": "moderate_risk"}
)
```

---

## 🐛 Troubleshooting

### Error: "Invalid API Key"

- Check PINECONE_API_KEY in .env
- Ensure no extra spaces
- Verify key in Pinecone console

### Error: "Index not found"

- Check index name matches exactly
- Create index in Pinecone console
- Verify PINECONE_INDEX_NAME in .env

### Error: "Dimension mismatch"

- Index dimensions must match embedding model
- all-MiniLM-L6-v2 = 384 dims
- all-mpnet-base-v2 = 768 dims
- Delete and recreate index with correct dimensions

### Slow Upload

- Use batching (shown above)
- Check internet connection
- Choose closer Pinecone region

### Query Not Finding Results

- Check if data is uploaded: `index.describe_index_stats()`
- Verify embeddings are normalized
- Try different query phrasing

---

## 🔐 Security Best Practices

### 1. Protect API Keys

```powershell
# Never commit .env to git
echo ".env" >> .gitignore

# Use environment variables in production
# Don't hardcode keys
```

### 2. Use Read-Only Keys (if available)

For production apps, create read-only API keys for queries.

### 3. Implement Rate Limiting

```python
from time import sleep

# Avoid hitting rate limits
for batch in batches:
    upload_batch(batch)
    sleep(0.1)  # Small delay between batches
```

---

## 📊 Monitoring & Analytics

### Track Usage

```python
import pinecone

# Get usage stats
usage = pinecone.describe_index('fundnexus-financial')
print(f"Vector count: {usage['total_vector_count']}")
print(f"Storage used: {usage['index_fullness'] * 100}%")
```

### Query Performance

```python
import time

start = time.time()
docs = vectorstore.similarity_search("query", k=10)
duration = time.time() - start

print(f"Query took {duration:.3f} seconds")
```

---

## 🚀 Deployment Checklist

- [ ] Sign up for Pinecone account
- [ ] Create index with correct dimensions
- [ ] Get API key and environment
- [ ] Configure .env file
- [ ] Install pinecone-client
- [ ] Upload data: `python rag_pipeline_pinecone.py`
- [ ] Test queries
- [ ] Update server to use Pinecone
- [ ] Monitor usage in Pinecone console
- [ ] Set up alerts for quota limits

---

## 🎓 Next Steps

1. **Start with Free Tier**: Test everything locally
2. **Upload Your Data**: Run `python rag_pipeline_pinecone.py`
3. **Test Performance**: Compare with ChromaDB
4. **Monitor Usage**: Keep track of vector count
5. **Optimize Queries**: Use metadata filtering
6. **Scale Up**: Upgrade to paid tier if needed

---

## 📚 Resources

- **Pinecone Docs**: https://docs.pinecone.io/
- **LangChain + Pinecone**: https://python.langchain.com/docs/integrations/vectorstores/pinecone
- **Pricing**: https://www.pinecone.io/pricing/
- **Console**: https://app.pinecone.io/

---

## 🤝 Pinecone vs ChromaDB Comparison

| Feature         | ChromaDB    | Pinecone            |
| --------------- | ----------- | ------------------- |
| **Cost**        | Free        | Free tier + Paid    |
| **Hosting**     | Local       | Cloud               |
| **Scalability** | Limited     | Millions of vectors |
| **Speed**       | Good        | Excellent           |
| **Setup**       | Easy        | Easy                |
| **Maintenance** | Manual      | Automatic           |
| **Backups**     | Manual      | Automatic           |
| **Monitoring**  | None        | Built-in            |
| **Best For**    | Development | Production          |

---

## 💡 Recommendation

**For Your FundN3xus Project:**

1. **Development**: Use ChromaDB (free, fast setup)
2. **Production**: Switch to Pinecone when you deploy
3. **Hybrid**: Keep both - ChromaDB for local dev, Pinecone for production

Your 15,000 records work great on both! 🎉

---

**Made with ❤️ for FundN3xus**

Questions? Check the main RAG_GUIDE.md or Pinecone documentation.
