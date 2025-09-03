# FiSight ML Backend

Production-ready machine learning backend for financial predictions and analysis.

## 📁 Structure

```
ml/
├── train_model.py          # Main training script
├── server.py              # FastAPI production server
├── requirements.txt       # Python dependencies
├── dataset.csv           # Training dataset (generated automatically)
└── models/               # Trained ML models
    ├── investment_risk_model.pkl
    ├── affordability_model.pkl
    ├── health_score_model.pkl
    └── scenario_planner_model.pkl
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Train Models (Optional - auto-runs on first server start)
```bash
python train_model.py
```

### 3. Start ML API Server
```bash
python server.py
```

Server runs on: **http://localhost:8000**
API Documentation: **http://localhost:8000/docs**

## 🧠 ML Models

| Model | Purpose | Performance |
|-------|---------|-------------|
| **Investment Risk** | Risk tolerance scoring | R² > 0.35 |
| **Affordability** | Purchase capacity analysis | R² > 0.99 |
| **Financial Health** | Overall health scoring | R² > 0.99 |
| **Scenario Planning** | Strategy recommendations | 99.9% accuracy |

## 🌐 API Endpoints

- `GET /health` - Health check
- `POST /predict/investment-risk` - Investment risk analysis
- `POST /predict/affordability` - Affordability prediction
- `POST /predict/financial-health` - Financial health scoring
- `POST /predict/scenario` - Scenario planning

## 🔧 Development

The ML backend automatically:
- Generates synthetic training data if dataset is missing
- Trains all models on first startup
- Serves predictions via REST API
- Handles CORS for frontend integration

**Ready for production deployment! 🚀**
