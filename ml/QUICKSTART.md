# RAG Pipeline - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```powershell
cd "c:\Users\91819\Desktop\Tor Browser\FundN3xus\ml"
pip install -r requirements-rag.txt
```

### 2. Get Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Create API key
3. Copy it

### 3. Configure Environment

```powershell
# Copy the example file
copy .env.example .env

# Edit and add your API key
notepad .env
```

Update this line:

```
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Build Vector Database

```powershell
python rag_pipeline.py
```

Wait for it to complete (1-2 minutes).

### 5. Start RAG Server

```powershell
python rag_server.py
```

### 6. Test It!

Open: http://localhost:8001/docs

Try this query in the `/query` endpoint:

```json
{
  "question": "What is the average financial health score for people in their 30s?",
  "return_sources": true,
  "max_sources": 3
}
```

---

## ✅ Integration with Your App

### Add to .env

```env
NEXT_PUBLIC_RAG_API_URL=http://localhost:8001
```

### Use in Your Components

```typescript
import { ragAPI } from "@/lib/rag-api";

// In your AI chat component
const response = await ragAPI.query(userQuestion);
console.log(response.answer);

// Get financial insights
const insights = await ragAPI.getFinancialInsights({
  age: 30,
  income: 75000,
  savings: 20000,
  debt: 15000,
});

// Find similar profiles
const similar = await ragAPI.findSimilarProfiles({
  age: 35,
  income: 100000,
  scenario: "moderate_risk",
});
```

---

## 🎯 What You Get

### 1. Intelligent Q&A

Ask natural language questions about your financial data:

- "What's the average income for people in their 30s?"
- "Show me profiles with low debt and high savings"
- "What investment strategies work for high earners?"

### 2. Semantic Search

Find relevant financial profiles by meaning, not just keywords:

- Search: "wealthy young professionals"
- Finds: High income, low age, good credit score profiles

### 3. Data-Driven Insights

LLM generates answers based on YOUR dataset:

- No hallucination (making things up)
- Backed by real data
- Shows source profiles

### 4. Contextual Recommendations

Combine with your ML predictions:

- ML: "Your risk score is 65"
- RAG: "People like you typically choose..."

---

## 📊 Example Queries to Try

```
1. "What are common characteristics of financially healthy profiles?"

2. "Compare financial health between different age groups"

3. "Show me profiles with excellent credit scores and their traits"

4. "What's the relationship between savings rate and financial health?"

5. "Find profiles similar to: age 35, income $80k, moderate risk"

6. "What investment amounts do people with $100k income typically have?"

7. "How does debt-to-income ratio affect financial health scores?"

8. "Show me the best performing profiles in the dataset"
```

---

## 🔧 Troubleshooting

### Error: Module not found

```powershell
pip install -r requirements-rag.txt
```

### Error: API key invalid

- Check .env file exists in ml/ directory
- Verify API key is correct
- Ensure no extra spaces

### Error: Vector store not found

```powershell
python rag_pipeline.py
```

### Server won't start

- Check port 8001 is not in use
- Look at error message in terminal
- Ensure all dependencies installed

---

## 📚 Full Documentation

See `RAG_GUIDE.md` for:

- Detailed architecture explanation
- Advanced features
- Performance optimization
- Integration examples
- API reference

---

## 💡 Use Cases in Your App

### 1. AI Financial Advisor

Enhance your `/ai-chat` page with intelligent responses backed by data.

### 2. Dashboard Insights

Add contextual insights to your dashboard based on similar profiles.

### 3. Personalized Recommendations

Compare users with dataset and provide data-driven suggestions.

### 4. Financial Education

Answer "how-to" questions with real examples from your dataset.

---

## 🎉 You're Ready!

Your RAG pipeline is now set up and ready to use. Start integrating it into your Next.js app using the `rag-api.ts` client!

Questions? Check the full guide in `RAG_GUIDE.md` or review the API docs at http://localhost:8001/docs
