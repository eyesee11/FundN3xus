---
title: FundN3xus RAG API
emoji: 💰
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# FundN3xus ML Backend

Production-ready machine learning backend for financial predictions and AI-powered insights.

## 🎯 Two Powerful Systems

### 1. Traditional ML (Predictions)

Fast, accurate predictions using XGBoost models

### 2. RAG System (Insights) ⭐ NEW!

Intelligent Q&A and insights powered by your dataset

## 📁 Structure

```
ml/
├── 🤖 Traditional ML
│   ├── train_model.py              # Train XGBoost models
│   ├── server.py                   # ML API server (port 8000)
│   ├── requirements.txt            # ML dependencies
│   └── models/                     # Trained models
│       ├── investment_risk_model.pkl
│       ├── affordability_model.pkl
│       ├── health_score_model.pkl
│       └── scenario_planner_model.pkl
│
├── 🧠 RAG System (NEW!)
│   ├── rag_pipeline.py             # RAG with ChromaDB (local)
│   ├── rag_pipeline_pinecone.py    # RAG with Pinecone (cloud)
│   ├── rag_server.py               # RAG API server (port 8001)
│   ├── train_rag_embeddings.py     # Create embeddings
│   ├── requirements-rag.txt        # RAG dependencies
│   ├── requirements-pinecone.txt   # Pinecone dependencies
│   └── vector_db/                  # Local vector database
│
├── 📚 Documentation
│   ├── README_RAG_SETUP.md         # Complete RAG overview
│   ├── QUICKSTART.md               # 5-minute RAG setup
│   ├── TRAINING_GUIDE.md           # Understanding RAG training
│   ├── RAG_GUIDE.md                # Full RAG documentation
│   ├── PINECONE_GUIDE.md           # Cloud deployment guide
│   ├── WORKFLOW_VISUAL.md          # Visual workflows
│   └── DECISION_GUIDE.md           # ChromaDB vs Pinecone
│
└── 📊 Data
    └── dataset.csv                 # Financial dataset (15,000 records)
```

## 🚀 Quick Start

### Option 1: Traditional ML Only

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Train models (optional - auto-runs on first start)
python train_model.py

# 3. Start ML server
python server.py
```

**Server:** http://localhost:8000  
**Docs:** http://localhost:8000/docs

---

### Option 2: ML + RAG (Recommended!) ⭐

```bash
# 1. Install ML dependencies
pip install -r requirements.txt

# 2. Install RAG dependencies
pip install -r requirements-rag.txt

# 3. Setup environment
copy .env.example .env
notepad .env  # Add GEMINI_API_KEY

# 4. Create RAG embeddings (1-2 minutes)
python train_rag_embeddings.py

# 5. Start both servers
python server.py       # ML on port 8000
python rag_server.py   # RAG on port 8001
```

**ML Server:** http://localhost:8000/docs  
**RAG Server:** http://localhost:8001/docs

📖 **New to RAG?** Start with `QUICKSTART.md` for a 5-minute setup guide!

## 🧠 Traditional ML Models

| Model                 | Purpose                    | Performance    |
| --------------------- | -------------------------- | -------------- |
| **Investment Risk**   | Risk tolerance scoring     | R² > 0.35      |
| **Affordability**     | Purchase capacity analysis | R² > 0.99      |
| **Financial Health**  | Overall health scoring     | R² > 0.99      |
| **Scenario Planning** | Strategy recommendations   | 99.9% accuracy |

### ML API Endpoints (Port 8000)

- `GET /health` - Health check
- `POST /predict/investment-risk` - Investment risk analysis
- `POST /predict/affordability` - Affordability prediction
- `POST /predict/financial-health` - Financial health scoring
- `POST /predict/scenario` - Scenario planning

---

## 🤖 RAG System (NEW!)

### What is RAG?

**RAG (Retrieval-Augmented Generation)** combines:

1. **Retrieval**: Find relevant data from your dataset
2. **Generation**: Use AI (Gemini) to generate intelligent answers

### RAG Features

- ✅ **Natural Language Q&A**: Ask questions in plain English
- ✅ **Semantic Search**: Find by meaning, not just keywords
- ✅ **Data-Driven Insights**: Answers backed by your dataset
- ✅ **Contextual Recommendations**: Compare with similar profiles
- ✅ **Source Attribution**: See which data influenced the answer

### RAG API Endpoints (Port 8001)

- `GET /health` - Health check
- `POST /query` - Ask questions in natural language
- `POST /search` - Semantic similarity search
- `GET /search/by-criteria` - Filter by financial metrics
- `GET /stats` - RAG pipeline statistics
- `POST /rebuild` - Rebuild vector database

### Example RAG Queries

```json
{
  "question": "What is the average financial health score for people in their 30s?",
  "return_sources": true,
  "max_sources": 5
}
```

```json
{
  "question": "Show me profiles with high savings rates and low debt",
  "return_sources": true
}
```

```json
{
  "question": "What investment strategies work for someone with $80k income?",
  "return_sources": true
}
```

### Vector Database Options

#### ChromaDB (Local - Recommended for Start)

- ✅ FREE
- ✅ Fast setup (5 minutes)
- ✅ Perfect for development
- ❌ Local storage only

#### Pinecone (Cloud - For Production)

- ✅ Cloud-hosted
- ✅ Scales to millions
- ✅ Automatic backups
- ⚠️ Paid (free tier available)

See `DECISION_GUIDE.md` for detailed comparison.

## 🔧 Development

The ML backend automatically:

- Generates synthetic training data if dataset is missing
- Trains all models on first startup
- Serves predictions via REST API
- Handles CORS for frontend integration

## 📦 Dependencies

### Core Dependencies (`requirements.txt`)

- **scikit-learn==1.5.2**: Core machine learning algorithms
- **xgboost==2.1.1**: Gradient boosting models for high performance
- **imbalanced-learn==0.12.4**: SMOTE for handling class imbalance
- **joblib==1.4.2**: Model serialization and parallel processing
- **pandas>=2.0.0**: Data manipulation and analysis
- **numpy>=1.24.0**: Numerical computing foundation
- **fastapi>=0.104.0**: Modern web framework for APIs
- **uvicorn[standard]>=0.24.0**: ASGI server for FastAPI
- **pydantic>=2.0.0**: Data validation and settings management
- **requests>=2.25.0**: HTTP library for API testing

### Development Dependencies (`requirements-dev.txt`)

Includes production dependencies plus:

- Testing tools (pytest, pytest-asyncio, pytest-cov)
- Code quality tools (black, flake8, isort)
- Data science tools (jupyter, matplotlib, seaborn)
- Model monitoring (tensorboard, mlflow)
- Model explanation (shap, lime)

### Compatibility Dependencies (`requirements-compatible.txt`)

Resolves conflicts with Google GenAI and other packages by using compatible versions of FastAPI, uvicorn, and related dependencies.

## 🐛 Troubleshooting

### Dependency Conflicts

If you encounter conflicts with other packages (like google-genai), use:

```bash
pip install -r requirements-compatible.txt
```

### GPU Support

For GPU acceleration, ensure CUDA is installed and XGBoost can detect your GPU.

### Model Training Issues

If models fail to load, retrain them:

```bash
python train_model.py
```

## 📚 Documentation

### Getting Started

- **`QUICKSTART.md`** - 5-minute RAG setup guide
- **`README_RAG_SETUP.md`** - Complete RAG overview
- **`DECISION_GUIDE.md`** - Choose ChromaDB or Pinecone

### Learning

- **`TRAINING_GUIDE.md`** - Understand RAG "training"
- **`RAG_GUIDE.md`** - Comprehensive RAG documentation
- **`WORKFLOW_VISUAL.md`** - Visual workflows and diagrams

### Production

- **`PINECONE_GUIDE.md`** - Deploy to Pinecone cloud

## 🎯 Use Cases

### Traditional ML: Fast Predictions

```typescript
const riskScore = await mlAPI.predictRisk(userProfile);
// Result: 65 (in milliseconds)
```

### RAG: Intelligent Insights

```typescript
const insights = await ragAPI.query(
  "Why is my risk score 65? What do similar profiles do?"
);
// Result: "Your risk score of 65 is typical for professionals
//          in your age group. 89% of similar profiles chose..."
```

### Combined Power! 🚀

```typescript
// Get prediction
const prediction = await mlAPI.predictHealth(profile);

// Get explanation
const explanation = await ragAPI.compareWithBenchmarks(profile);

// Show both: Fast prediction + Data-driven explanation
```

## 🔄 When to "Retrain"

### Traditional ML

```bash
# Retrain when:
# - Adding new data patterns
# - Model performance degrades
# - Changing features
python train_model.py
```

### RAG System

```bash
# "Retrain" (create embeddings) when:
# - Adding new records to dataset.csv
# - Changing embedding model
# - Switching vector databases
python train_rag_embeddings.py --force-rebuild
```

**Note:** RAG doesn't "train" like ML. It creates searchable embeddings of your data.

## 🌐 Frontend Integration

```typescript
// ML predictions
import { mlAPI } from "@/lib/ml-api";
const prediction = await mlAPI.predictRisk(profile);

// RAG insights
import { ragAPI } from "@/lib/rag-api";
const insights = await ragAPI.getFinancialInsights(profile);
const similar = await ragAPI.findSimilarProfiles(profile);
```

See `src/lib/rag-api.ts` for complete TypeScript client.

## 🎓 Architecture

```
Dataset (15,000 financial records)
        ↓
    ┌───┴────┐
    │        │
    ▼        ▼
 XGBoost   RAG Pipeline
 Models    (Embeddings)
    │        │
    ▼        ▼
ML Server  RAG Server
(Port 8000) (Port 8001)
    │        │
    └────┬───┘
         ▼
   Next.js App
```

**Ready for production deployment! 🚀**
