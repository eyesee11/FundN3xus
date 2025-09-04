#!/usr/bin/env python3
"""
FundN3xus ML Training Pipeline - Production Ready
Hackathon-optimized clean training script for financial AI models.

Usage: python ml/train_model.py

Creates 4 production models:
- Investment Risk (XGBoost Regression)
- Affordability (XGBoost Regression) 
- Financial Health Score (XGBoost Regression)
- Scenario Planner (XGBoost Classification + SMOTE)

Requirements: Run `pip install -r            logger.info("\n" + "="*60)
            logger.info("FISIGHT ML TRAINING COMPLETED SUCCESSFULLY!")
            logger.info("="*60)
            logger.info(f"Training duration: {duration:.1f} seconds")
            logger.info(f"Models saved in: {self.models_dir}/")
            logger.info("Generated models:")
            logger.info("  - investment_risk_model.pkl")
            logger.info("  - affordability_model.pkl") 
            logger.info("  - health_score_model.pkl")
            logger.info("  - scenario_planner_model.pkl")
            logger.info(f"\nConfiguration used:")
            logger.info(f"  - GPU Enabled: {USE_GPU}")
            logger.info(f"  - Models Directory: {self.models_dir}")
            logger.info(f"  - Dataset Path: {self.dataset_path}")
            logger.info("\nYour ML backend is ready! 🚀")ments.txt` first
"""

import os
import logging
import warnings
from datetime import datetime
from typing import Tuple, Dict, Any
from dotenv import load_dotenv

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
from xgboost import XGBRegressor, XGBClassifier

# Load environment variables from .env file
load_dotenv()

# Get configuration from environment variables
MODELS_DIR = os.getenv('MODELS_DIR', 'models')
DATASET_PATH = os.getenv('DATASET_PATH', 'dataset.csv')
USE_GPU = os.getenv('USE_GPU', 'false').lower() == 'true'
CUDA_VISIBLE_DEVICES = os.getenv('CUDA_VISIBLE_DEVICES', '0')
LOG_LEVEL = os.getenv('LOG_LEVEL', 'info').upper()
ENABLE_VERBOSE_LOGGING = os.getenv('ENABLE_VERBOSE_LOGGING', 'true').lower() == 'true'
DEVELOPMENT_MODE = os.getenv('DEVELOPMENT_MODE', 'true').lower() == 'true'

# Set CUDA device if specified
if USE_GPU and CUDA_VISIBLE_DEVICES:
    os.environ['CUDA_VISIBLE_DEVICES'] = CUDA_VISIBLE_DEVICES

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

# Configure logging based on environment variables
log_level = getattr(logging, LOG_LEVEL, logging.INFO)
logging.basicConfig(
    level=log_level,
    format='%(asctime)s - %(levelname)s - %(message)s' if ENABLE_VERBOSE_LOGGING else '%(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)

class FundN3xusMLTrainer:
    """Clean, production-ready ML trainer for FundN3xus hackathon project"""
    
    def __init__(self):
        self.models_dir = MODELS_DIR
        self.dataset_path = DATASET_PATH
        self.models = {}
        
        # Ensure models directory exists
        os.makedirs(self.models_dir, exist_ok=True)
        
        # Log configuration if in development mode
        if DEVELOPMENT_MODE:
            logger.info(f"🔧 Training Configuration:")
            logger.info(f"   Models Directory: {self.models_dir}")
            logger.info(f"   Dataset Path: {self.dataset_path}")
            logger.info(f"   GPU Enabled: {USE_GPU}")
            logger.info(f"   CUDA Device: {CUDA_VISIBLE_DEVICES}")
        
        # Check for GPU support
        try:
            import xgboost as xgb
            if USE_GPU:
                self.gpu_available = xgb.cuda.cuda_visible_devices() is not None
                if self.gpu_available:
                    logger.info("✅ GPU acceleration enabled for XGBoost")
                else:
                    logger.warning("⚠️  GPU requested but not available, using CPU")
            else:
                self.gpu_available = False
                logger.info("🖥️  Using CPU for XGBoost training (GPU disabled in config)")
        except Exception as e:
            self.gpu_available = False
            logger.warning(f"⚠️  GPU acceleration not available: {e}")
            logger.info("🖥️  Using CPU for XGBoost training")
    
    def generate_synthetic_dataset(self, n_samples: int = 15000) -> pd.DataFrame:
        """Generate realistic synthetic financial dataset"""
        
        logger.info(f"Generating {n_samples} synthetic financial records...")
        
        np.random.seed(42)  # For reproducibility
        
        # Generate base demographics
        age = np.random.randint(18, 80, n_samples)
        employment_years = np.minimum(age - 18, np.random.randint(0, 45, n_samples))
        num_dependents = np.random.choice([0, 1, 2, 3, 4], n_samples, p=[0.3, 0.25, 0.25, 0.15, 0.05])
        
        # Generate income based on age and experience
        base_income = 25000 + (age - 18) * 1500 + employment_years * 800
        income_noise = np.random.normal(0, 15000, n_samples)
        income = np.maximum(15000, base_income + income_noise)
        
        # Generate expenses (60-85% of income)
        expense_ratio = np.random.uniform(0.6, 0.85, n_samples)
        expenses = income * expense_ratio
        
        # Calculate savings
        savings = income - expenses
        
        # Generate debt (some correlation with income and age)
        debt_probability = np.random.random(n_samples)
        debt = np.where(debt_probability > 0.3, 
                       np.random.uniform(0, income * 2, n_samples), 0)
        
        # Generate other financial metrics
        investment_amount = np.maximum(0, savings * np.random.uniform(0.1, 0.8, n_samples))
        
        # Credit score (correlated with debt-to-income and age)
        debt_to_income = debt / (income + 1)
        credit_base = 750 - (debt_to_income * 200) + (age - 25) * 2
        credit_noise = np.random.normal(0, 50, n_samples)
        credit_score = np.clip(credit_base + credit_noise, 300, 850)
        
        # Property value (some people own property)
        property_probability = np.where(age > 25, 0.4, 0.1)
        has_property = np.random.random(n_samples) < property_probability
        property_value = np.where(has_property, 
                                 np.random.uniform(income * 2, income * 5, n_samples), 0)
        
        # Calculate derived metrics
        savings_rate = savings / income
        expense_ratio_calc = expenses / income
        
        # Target variables
        # Investment risk score (0-100, higher = more risk tolerance)
        risk_base = np.clip(100 - age + (income / 1000) - (num_dependents * 10), 0, 100)
        investment_risk_score = risk_base + np.random.normal(0, 10, n_samples)
        investment_risk_score = np.clip(investment_risk_score, 0, 100)
        
        # Affordability amount (what they can afford for major purchase)
        affordability_amount = (savings * 12 + investment_amount) * 0.8
        
        # Financial health score (0-100)
        health_components = [
            np.clip(savings_rate * 100, 0, 25),  # Savings rate component
            np.clip(25 - (debt_to_income * 25), 0, 25),  # Debt component  
            np.clip((credit_score - 300) / 550 * 25, 0, 25),  # Credit component
            np.clip(investment_amount / (income + 1) * 100, 0, 25)  # Investment component
        ]
        financial_health_score = np.sum(health_components, axis=0)
        
        # Scenario categories
        scenario_conditions = [
            (financial_health_score >= 80) & (investment_risk_score >= 60),  # high_risk
            (financial_health_score >= 60) & (investment_risk_score >= 40),  # moderate_risk  
            (debt_to_income <= 0.3) & (savings_rate >= 0.1),                # low_risk
            (financial_health_score < 40) | (debt_to_income > 0.5)          # conservative
        ]
        scenario_labels = ['high_risk', 'moderate_risk', 'low_risk', 'conservative']
        
        # Create scenario mapping
        scenario_category = np.full(n_samples, 'conservative', dtype=object)
        for i, condition in enumerate(scenario_conditions[:-1]):  # Exclude last (default)
            scenario_category[condition] = scenario_labels[i]
        
        # Create DataFrame
        df = pd.DataFrame({
            'age': age,
            'income': income,
            'expenses': expenses, 
            'savings': savings,
            'debt': debt,
            'investment_amount': investment_amount,
            'employment_years': employment_years,
            'credit_score': credit_score,
            'num_dependents': num_dependents,
            'property_value': property_value,
            'savings_rate': savings_rate,
            'debt_to_income': debt_to_income,
            'expense_ratio': expense_ratio_calc,
            'investment_risk_score': investment_risk_score,
            'affordability_amount': affordability_amount,
            'financial_health_score': financial_health_score,
            'scenario_category': scenario_category
        })
        
        logger.info(f"Dataset generated: {df.shape[0]} samples, {df.shape[1]} features")
        return df
    
    def load_or_create_dataset(self) -> pd.DataFrame:
        """Load existing dataset or create synthetic one"""
        
        if os.path.exists(self.dataset_path):
            logger.info(f"Loading dataset from {self.dataset_path}")
            df = pd.read_csv(self.dataset_path)
            logger.info(f"Loaded {len(df)} records from existing dataset")
        else:
            logger.info("Dataset file not found, generating synthetic data")
            df = self.generate_synthetic_dataset()
            # Save generated dataset
            df.to_csv(self.dataset_path, index=False)
            logger.info(f"Saved synthetic dataset to {self.dataset_path}")
            
        return df
    
    def get_xgb_params(self, task_type: str = 'regression') -> Dict[str, Any]:
        """Get optimized XGBoost parameters"""
        
        base_params = {
            'random_state': 42,
            'n_jobs': -1,
            'verbosity': 0
        }
        
        # Add GPU support if available and enabled
        if self.gpu_available and USE_GPU:
            base_params['tree_method'] = 'gpu_hist'
            base_params['gpu_id'] = int(CUDA_VISIBLE_DEVICES.split(',')[0]) if ',' in CUDA_VISIBLE_DEVICES else int(CUDA_VISIBLE_DEVICES)
        
        if task_type == 'regression':
            return {
                **base_params,
                'n_estimators': 200,
                'max_depth': 6,
                'learning_rate': 0.1,
                'subsample': 0.8,
                'colsample_bytree': 0.8
            }
        else:  # classification
            return {
                **base_params,
                'n_estimators': 300,
                'max_depth': 8, 
                'learning_rate': 0.1,
                'subsample': 0.9,
                'colsample_bytree': 0.8
            }
    
    def train_investment_risk_model(self, df: pd.DataFrame) -> None:
        """Train investment risk prediction model"""
        
        logger.info("Training Investment Risk Model...")
        
        # Select features
        features = ['age', 'income', 'savings', 'debt', 'employment_years', 
                   'credit_score', 'num_dependents', 'property_value', 
                   'savings_rate', 'debt_to_income']
        
        X = df[features]
        y = df['investment_risk_score']
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train XGBoost model
        model = XGBRegressor(**self.get_xgb_params('regression'))
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        logger.info(f"Investment Risk Model - MSE: {mse:.2f}, R²: {r2:.3f}")
        
        # Save model
        model_path = os.path.join(self.models_dir, "investment_risk_model.pkl")
        joblib.dump(model, model_path)
        self.models['investment_risk'] = model
        logger.info(f"Investment risk model saved to {model_path}")
    
    def train_affordability_model(self, df: pd.DataFrame) -> None:
        """Train affordability prediction model"""
        
        logger.info("Training Affordability Model...")
        
        # Select features
        features = ['age', 'income', 'expenses', 'savings', 'debt', 
                   'employment_years', 'credit_score', 'num_dependents',
                   'savings_rate', 'debt_to_income']
        
        X = df[features]
        y = df['affordability_amount']
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train XGBoost model
        model = XGBRegressor(**self.get_xgb_params('regression'))
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        logger.info(f"Affordability Model - MSE: {mse:.2f}, R²: {r2:.3f}")
        
        # Save model
        model_path = os.path.join(self.models_dir, "affordability_model.pkl")
        joblib.dump(model, model_path)
        self.models['affordability'] = model
        logger.info(f"Affordability model saved to {model_path}")
    
    def train_health_score_model(self, df: pd.DataFrame) -> None:
        """Train financial health score model"""
        
        logger.info("Training Financial Health Score Model...")
        
        # Select features
        features = ['age', 'income', 'savings', 'debt', 'investment_amount',
                   'employment_years', 'credit_score', 'savings_rate', 
                   'debt_to_income', 'expense_ratio']
        
        X = df[features]
        y = df['financial_health_score']
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train XGBoost model
        model = XGBRegressor(**self.get_xgb_params('regression'))
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        logger.info(f"Health Score Model - MSE: {mse:.2f}, R²: {r2:.3f}")
        
        # Save model
        model_path = os.path.join(self.models_dir, "health_score_model.pkl")
        joblib.dump(model, model_path)
        self.models['health_score'] = model
        logger.info(f"Health score model saved to {model_path}")
    
    def train_scenario_planner_model(self, df: pd.DataFrame) -> None:
        """Train scenario planning classification model with SMOTE"""
        
        logger.info("Training Scenario Planner Model...")
        
        # Select features
        features = ['age', 'income', 'savings', 'debt', 'investment_amount',
                   'employment_years', 'credit_score', 'num_dependents',
                   'savings_rate', 'debt_to_income', 'financial_health_score',
                   'investment_risk_score']
        
        X = df[features]
        y = df['scenario_category']
        
        # Encode target variable
        le = LabelEncoder()
        y_encoded = le.fit_transform(y)
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
        )
        
        # Apply SMOTE for class balancing
        logger.info("Applying SMOTE for class balancing...")
        smote = SMOTE(random_state=42)
        X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)
        
        # Train XGBoost classifier
        model = XGBClassifier(**self.get_xgb_params('classification'))
        model.fit(X_train_balanced, y_train_balanced)
        
        # Evaluate
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        logger.info(f"Scenario Planner Model - Accuracy: {accuracy:.3f}")
        
        # Classification report
        target_names = le.classes_
        report = classification_report(y_test, y_pred, target_names=target_names)
        logger.info(f"Classification Report:\n{report}")
        
        # Save model with label encoder
        model_data = {
            'model': model,
            'label_encoder': le,
            'feature_names': features
        }
        
        model_path = os.path.join(self.models_dir, "scenario_planner_model.pkl")
        joblib.dump(model_data, model_path)
        self.models['scenario_planner'] = model_data
        logger.info(f"Scenario planner model saved to {model_path}")
    
    def train_all_models(self) -> None:
        """Train all FundN3xus ML models"""
        
        logger.info("Starting FundN3xus ML training pipeline...")
        start_time = datetime.now()
        
        # Load dataset
        df = self.load_or_create_dataset()
        logger.info(f"Dataset loaded with shape: {df.shape}")
        
        # Train all models
        try:
            self.train_investment_risk_model(df)
            self.train_affordability_model(df)
            self.train_health_score_model(df)
            self.train_scenario_planner_model(df)
            
            # Training summary
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            logger.info("\n" + "="*60)
            logger.info("FundN3xus ML TRAINING COMPLETED SUCCESSFULLY!")
            logger.info("="*60)
            logger.info(f"Training duration: {duration:.1f} seconds")
            logger.info(f"Models saved in: {self.models_dir}/")
            logger.info("Generated models:")
            logger.info("  - investment_risk_model.pkl")
            logger.info("  - affordability_model.pkl") 
            logger.info("  - health_score_model.pkl")
            logger.info("  - scenario_planner_model.pkl")
            logger.info("\nYour hackathon ML backend is ready! 🚀")
            
        except Exception as e:
            logger.error(f"Training failed: {str(e)}")
            raise

def main():
    """Main execution function"""
    
    print("🚀 FundN3xus ML Training Pipeline")
    print("=" * 50)
    
    trainer = FundN3xusMLTrainer()
    trainer.train_all_models()

if __name__ == "__main__":
    main()
