# FundN3xus ML Backend

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

**For production deployment:**
```bash
pip install -r requirements.txt
```

**For development with additional tools:**
```bash
pip install -r requirements-dev.txt
```

**For compatibility with Google GenAI (if you have conflicts):**
```bash
pip install -r requirements-compatible.txt
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

**Ready for production deployment! 🚀**
