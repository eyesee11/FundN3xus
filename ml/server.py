#!/usr/bin/env python3
"""
FiSight ML API Server - Production Ready
FastAPI server serving ML models for FiSight hackathon project.

Usage: python ml/server.py
Access: http://localhost:8000
Docs: http://localhost:8000/docs

Endpoints:
- GET /health - Health check
- POST /predict/investment-risk - Investment risk scoring
- POST /predict/affordability - Affordability analysis
- POST /predict/financial-health - Financial health scoring
- POST /predict/scenario - Scenario planning recommendations
"""

import os
import logging
from typing import Dict, Any, List, Optional
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="FiSight ML API",
    description="Production ML API for financial predictions and analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002", "http://127.0.0.1:9002", "http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model storage
models = {}
models_dir = "models"

# Request/Response Models
class FinancialProfile(BaseModel):
    """Standard financial profile input for predictions"""
    age: int = Field(..., ge=18, le=100, description="Age in years")
    income: float = Field(..., ge=0, description="Annual income")
    expenses: float = Field(..., ge=0, description="Monthly expenses")
    savings: float = Field(..., ge=0, description="Current savings")
    debt: float = Field(..., ge=0, description="Total debt amount")
    employment_years: int = Field(..., ge=0, le=50, description="Years of employment")
    credit_score: int = Field(..., ge=300, le=850, description="Credit score")
    num_dependents: int = Field(..., ge=0, le=10, description="Number of dependents")
    investment_amount: Optional[float] = Field(0, ge=0, description="Current investments")
    property_value: Optional[float] = Field(0, ge=0, description="Property value")

class InvestmentRiskResponse(BaseModel):
    """Investment risk prediction response"""
    risk_score: float = Field(..., description="Risk tolerance score (0-100)")
    risk_category: str = Field(..., description="Risk category (conservative, moderate, aggressive)")
    confidence: float = Field(..., description="Prediction confidence (0-1)")

class AffordabilityResponse(BaseModel):
    """Affordability analysis response"""
    affordability_amount: float = Field(..., description="Maximum affordable amount")
    monthly_payment_capacity: float = Field(..., description="Monthly payment capacity")
    confidence: float = Field(..., description="Prediction confidence (0-1)")

class FinancialHealthResponse(BaseModel):
    """Financial health score response"""
    health_score: float = Field(..., description="Financial health score (0-100)")
    health_category: str = Field(..., description="Health category")
    recommendations: List[str] = Field(..., description="Improvement recommendations")
    confidence: float = Field(..., description="Prediction confidence (0-1)")

class ScenarioResponse(BaseModel):
    """Scenario planning response"""
    recommended_scenario: str = Field(..., description="Recommended financial scenario")
    scenario_confidence: float = Field(..., description="Scenario confidence (0-1)")
    alternative_scenarios: List[str] = Field(..., description="Alternative scenarios")
    rationale: str = Field(..., description="Reasoning for recommendation")

# Startup event to load models
@app.on_event("startup")
async def load_models():
    """Load ML models on server startup"""
    try:
        logger.info("Loading FiSight ML models...")
        
        # Check if models directory exists
        if not os.path.exists(models_dir):
            logger.warning(f"Models directory {models_dir} not found. Training models first...")
            # Run training script from the correct directory
            os.system("python train_model.py")
        
        # Load each model
        model_files = {
            'investment_risk': 'investment_risk_model.pkl',
            'affordability': 'affordability_model.pkl',
            'health_score': 'health_score_model.pkl',
            'scenario_planner': 'scenario_planner_model.pkl'
        }
        
        for model_name, filename in model_files.items():
            model_path = os.path.join(models_dir, filename)
            if os.path.exists(model_path):
                models[model_name] = joblib.load(model_path)
                logger.info(f"Successfully loaded {model_name} model")
            else:
                logger.error(f"Model file {model_path} not found")
        
        logger.info(f"Successfully loaded {len(models)} models")
        
    except Exception as e:
        logger.error(f"Failed to load models: {str(e)}")
        raise

def create_feature_dataframe(profile: FinancialProfile) -> pd.DataFrame:
    """Convert financial profile to feature DataFrame"""
    
    # Calculate derived features
    savings_rate = profile.savings / (profile.income + 1)
    debt_to_income = profile.debt / (profile.income + 1)
    expense_ratio = (profile.expenses * 12) / (profile.income + 1)
    
    # Create feature dictionary
    features = {
        'age': profile.age,
        'income': profile.income,
        'expenses': profile.expenses * 12,  # Convert to annual
        'savings': profile.savings,
        'debt': profile.debt,
        'employment_years': profile.employment_years,
        'credit_score': profile.credit_score,
        'num_dependents': profile.num_dependents,
        'investment_amount': profile.investment_amount or 0,
        'property_value': profile.property_value or 0,
        'savings_rate': savings_rate,
        'debt_to_income': debt_to_income,
        'expense_ratio': expense_ratio
    }
    
    return pd.DataFrame([features])

# API Endpoints

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": len(models),
        "available_models": list(models.keys())
    }

@app.post("/predict/investment-risk", response_model=InvestmentRiskResponse)
async def predict_investment_risk(profile: FinancialProfile):
    """Predict investment risk tolerance"""
    
    try:
        if 'investment_risk' not in models:
            raise HTTPException(status_code=503, detail="Investment risk model not available")
        
        # Prepare features
        features_df = create_feature_dataframe(profile)
        
        # Select relevant features for this model
        model_features = ['age', 'income', 'savings', 'debt', 'employment_years', 
                         'credit_score', 'num_dependents', 'property_value', 
                         'savings_rate', 'debt_to_income']
        
        X = features_df[model_features]
        
        # Make prediction
        risk_score = float(models['investment_risk'].predict(X)[0])
        risk_score = max(0, min(100, risk_score))  # Clamp to 0-100
        
        # Determine risk category
        if risk_score >= 70:
            risk_category = "aggressive"
        elif risk_score >= 40:
            risk_category = "moderate"
        else:
            risk_category = "conservative"
        
        # Simple confidence based on model certainty (mock for now)
        confidence = 0.85
        
        return InvestmentRiskResponse(
            risk_score=risk_score,
            risk_category=risk_category,
            confidence=confidence
        )
        
    except Exception as e:
        logger.error(f"Investment risk prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/affordability", response_model=AffordabilityResponse)
async def predict_affordability(profile: FinancialProfile):
    """Predict affordability capacity"""
    
    try:
        if 'affordability' not in models:
            raise HTTPException(status_code=503, detail="Affordability model not available")
        
        # Prepare features
        features_df = create_feature_dataframe(profile)
        
        # Select relevant features
        model_features = ['age', 'income', 'expenses', 'savings', 'debt', 
                         'employment_years', 'credit_score', 'num_dependents',
                         'savings_rate', 'debt_to_income']
        
        X = features_df[model_features]
        
        # Make prediction
        affordability_amount = float(models['affordability'].predict(X)[0])
        affordability_amount = max(0, affordability_amount)
        
        # Calculate monthly payment capacity (rough estimate)
        monthly_payment_capacity = affordability_amount / 60  # 5-year assumption
        
        confidence = 0.82
        
        return AffordabilityResponse(
            affordability_amount=affordability_amount,
            monthly_payment_capacity=monthly_payment_capacity,
            confidence=confidence
        )
        
    except Exception as e:
        logger.error(f"Affordability prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/financial-health", response_model=FinancialHealthResponse)
async def predict_financial_health(profile: FinancialProfile):
    """Predict financial health score"""
    
    try:
        if 'health_score' not in models:
            raise HTTPException(status_code=503, detail="Financial health model not available")
        
        # Prepare features
        features_df = create_feature_dataframe(profile)
        
        # Select relevant features
        model_features = ['age', 'income', 'savings', 'debt', 'investment_amount',
                         'employment_years', 'credit_score', 'savings_rate', 
                         'debt_to_income', 'expense_ratio']
        
        X = features_df[model_features]
        
        # Make prediction
        health_score = float(models['health_score'].predict(X)[0])
        health_score = max(0, min(100, health_score))
        
        # Determine health category
        if health_score >= 80:
            health_category = "excellent"
        elif health_score >= 60:
            health_category = "good"
        elif health_score >= 40:
            health_category = "fair"
        else:
            health_category = "needs_improvement"
        
        # Generate recommendations based on score
        recommendations = []
        if features_df['savings_rate'].iloc[0] < 0.1:
            recommendations.append("Increase your savings rate to at least 10% of income")
        if features_df['debt_to_income'].iloc[0] > 0.3:
            recommendations.append("Work on reducing debt-to-income ratio below 30%")
        if profile.credit_score < 700:
            recommendations.append("Focus on improving credit score through timely payments")
        if not recommendations:
            recommendations.append("Maintain your excellent financial habits!")
        
        confidence = 0.88
        
        return FinancialHealthResponse(
            health_score=health_score,
            health_category=health_category,
            recommendations=recommendations,
            confidence=confidence
        )
        
    except Exception as e:
        logger.error(f"Financial health prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/scenario", response_model=ScenarioResponse)
async def predict_scenario(profile: FinancialProfile):
    """Predict recommended financial scenario"""
    
    try:
        if 'scenario_planner' not in models:
            raise HTTPException(status_code=503, detail="Scenario planner model not available")
        
        # Prepare features - need to include financial health and risk scores
        features_df = create_feature_dataframe(profile)
        
        # Calculate additional features needed for scenario model
        # Mock financial health and investment risk for scenario prediction
        mock_health_score = 75.0  # Could use actual health model prediction
        mock_risk_score = 50.0   # Could use actual risk model prediction
        
        features_df['financial_health_score'] = mock_health_score
        features_df['investment_risk_score'] = mock_risk_score
        
        # Select relevant features
        model_features = ['age', 'income', 'savings', 'debt', 'investment_amount',
                         'employment_years', 'credit_score', 'num_dependents',
                         'savings_rate', 'debt_to_income', 'financial_health_score',
                         'investment_risk_score']
        
        X = features_df[model_features]
        
        # Get model prediction
        model_data = models['scenario_planner']
        scenario_model = model_data['model']
        label_encoder = model_data['label_encoder']
        
        # Make prediction
        scenario_pred = scenario_model.predict(X)[0]
        scenario_proba = scenario_model.predict_proba(X)[0]
        
        # Decode prediction
        recommended_scenario = label_encoder.inverse_transform([scenario_pred])[0]
        scenario_confidence = float(max(scenario_proba))
        
        # Get alternative scenarios (top 2 other predictions)
        scenario_probabilities = list(zip(label_encoder.classes_, scenario_proba))
        scenario_probabilities.sort(key=lambda x: x[1], reverse=True)
        alternative_scenarios = [s[0] for s in scenario_probabilities[1:3]]
        
        # Generate rationale
        rationale_map = {
            'conservative': 'Based on your financial profile, a conservative approach will help build stability',
            'low_risk': 'Your stable financial situation supports a low-risk investment strategy',
            'moderate_risk': 'Your balanced profile suggests moderate risk investments are appropriate',
            'high_risk': 'Your strong financial position can handle higher-risk, higher-reward investments'
        }
        
        rationale = rationale_map.get(recommended_scenario, 'Recommendation based on your financial profile analysis')
        
        return ScenarioResponse(
            recommended_scenario=recommended_scenario,
            scenario_confidence=scenario_confidence,
            alternative_scenarios=alternative_scenarios,
            rationale=rationale
        )
        
    except Exception as e:
        logger.error(f"Scenario prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# Development server
def main():
    """Run development server"""
    logger.info("Starting FiSight ML API Server...")
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
