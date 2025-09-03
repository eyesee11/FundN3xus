# 💰 FiSight - AI-Powered Financial Advisor Platform

> **Your intelligent financial companion powered by Machine Learning and AI** 

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10-orange?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 **Quick Start**

Get FiSight running locally in 3 simple steps:

```bash
# 1. Clone and install dependencies
git clone https://github.com/deepanshusingla076/fisight.git
cd fisight
npm install

# 2. Set up ML backend (optional - auto-runs on first start)
cd ml && pip install -r requirements.txt

# 3. Start the application
npm run dev        # Frontend only (http://localhost:9002)
npm run dev:full   # Frontend + ML Backend (recommended)
```

**🌐 Access Points:**
- **Frontend**: http://localhost:9002
- **ML API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📋 **Table of Contents**

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Development](#-development)
- [ML Backend](#-ml-backend)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ **Features**

### 🤖 **AI-Powered Financial Analysis**
- **Machine Learning Predictions**: 4 trained ML models for comprehensive financial analysis
- **Investment Risk Assessment**: Personalized risk tolerance scoring
- **Affordability Calculator**: ML-powered purchase capacity analysis
- **Financial Health Scoring**: Real-time health assessment with recommendations
- **Scenario Planning**: AI-driven financial strategy recommendations

### 💻 **Modern Web Application**
- **Interactive Dashboard**: Real-time financial metrics and insights
- **Multilingual Support**: English/Hindi with seamless language switching
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Chat**: AI financial advisor with conversation memory
- **Firebase Authentication**: Secure login with Google Sign-In

### 📊 **Financial Management Tools**
- **Portfolio Analysis**: Investment performance tracking and insights
- **Transaction Management**: Categorized expense tracking
- **Goal Setting**: Financial target planning with progress tracking
- **Net Worth Calculator**: Complete wealth assessment
- **Rebalancing Suggestions**: AI-powered portfolio optimization

### 🔒 **Security & Privacy**
- **Bank-level Encryption**: Secure data handling and storage
- **Firebase Security Rules**: Protected user data access
- **Environment Configuration**: Secure API key management
- **Privacy-first**: No sensitive financial data stored permanently

## 🛠️ **Tech Stack**

### **Frontend**
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Context + Hooks
- **Charts**: Recharts for data visualization

### **Backend & AI**
- **ML Backend**: FastAPI + Python 3.13
- **ML Models**: XGBoost, Scikit-learn, Imbalanced-learn
- **AI Integration**: Google Genkit + Gemini API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Email**: Nodemailer with SMTP

### **Machine Learning**
- **Models**: 4 production-ready ML models
  - Investment Risk Predictor (XGBoost Regression)
  - Affordability Analyzer (XGBoost Regression) 
  - Financial Health Scorer (XGBoost Regression)
  - Scenario Planner (XGBoost Classification + SMOTE)
- **Dataset**: 15,000+ synthetic financial records
- **Performance**: >99% accuracy on core models

## 📁 **Project Structure**

```
FiSight/
├── 📁 src/                          # Next.js application source
│   ├── 📁 app/                      # App Router pages
│   │   ├── 📁 (main)/              # Main application routes
│   │   │   ├── 📁 dashboard/       # Financial dashboard
│   │   │   ├── 📁 investments/     # Portfolio management
│   │   │   ├── 📁 affordability/   # Purchase analysis
│   │   │   ├── 📁 scenarios/       # Financial planning
│   │   │   └── 📁 profile/         # User settings
│   │   ├── 📁 api/                 # API routes
│   │   └── 📁 login/               # Authentication
│   ├── 📁 components/              # React components
│   │   ├── 📁 ui/                  # Base UI components
│   │   ├── 📁 dashboard/           # Dashboard components
│   │   ├── 📁 investments/         # Investment tools
│   │   ├── 📁 landing/             # Landing page
│   │   └── 📁 shared/              # Shared components
│   ├── 📁 lib/                     # Utility functions
│   │   ├── 📄 ml-api.ts            # ML API client
│   │   ├── 📄 firebase.ts          # Firebase config
│   │   └── 📄 utils.ts             # Helper functions
│   ├── 📁 ai/                      # AI flows & configuration
│   ├── 📁 contexts/                # React contexts
│   └── 📁 hooks/                   # Custom hooks
│
├── 📁 ml/                          # 🤖 Machine Learning Backend
│   ├── 📄 server.py                # FastAPI ML server
│   ├── 📄 train_model.py           # ML training pipeline
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 dataset.csv              # Training dataset
│   └── 📁 models/                  # Trained ML models
│       ├── 📄 investment_risk_model.pkl
│       ├── 📄 affordability_model.pkl
│       ├── 📄 health_score_model.pkl
│       └── 📄 scenario_planner_model.pkl
│
├── 📁 public/                      # Static assets
├── 📁 docs/                        # Documentation
├── 📄 package.json                 # Node.js dependencies
├── 📄 next.config.ts               # Next.js configuration
├── 📄 tailwind.config.ts           # Tailwind configuration
└── 📄 .env.local                   # Environment variables
```

## 🔧 **Installation**

### **Prerequisites**
- Node.js 18+ 
- Python 3.10+ (for ML backend)
- npm or yarn
- Git

### **Step 1: Clone Repository**
```bash
git clone https://github.com/deepanshusingla076/fisight.git
cd fisight
```

### **Step 2: Install Frontend Dependencies**
```bash
npm install
```

### **Step 3: Set Up ML Backend**
```bash
cd ml
pip install -r requirements.txt
cd ..
```

### **Step 4: Configure Environment**
Create `.env.local` file in root directory (see [Configuration](#-configuration))

### **Step 5: Start Development**
```bash
# Option 1: Start both frontend and ML backend
npm run dev:full

# Option 2: Start individually
npm run dev        # Frontend: http://localhost:9002
npm run dev:ml     # ML Backend: http://localhost:8000
```

## ⚙️ **Configuration**

### **Environment Variables**

Create `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
GOOGLE_AI_API_KEY=your_gemini_api_key

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
SMTP_TO=contact@fisight.com

# ML API Configuration
NEXT_PUBLIC_ML_API_URL=http://localhost:8000

# App Configuration
NEXTAUTH_URL=http://localhost:9002
NEXTAUTH_SECRET=your_secret_key_here

# Feature Flags
FISIGHT_ENABLE_PRETRAINED_MODEL=false
FISIGHT_ENABLE_MCP_SERVER=false
```

### **Firebase Setup**
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password & Google Sign-in)
3. Create Firestore database
4. Copy configuration to `.env.local`

### **Google AI Setup**
1. Get Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Add to `.env.local` as `GEMINI_API_KEY`

## 👩‍💻 **Development**

### **Available Scripts**

```bash
# Frontend Development
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking

# ML Backend Development
npm run dev:ml           # Start ML API server
npm run train            # Train ML models
npm run setup:ml         # Install ML dependencies

# Full Stack Development
npm run dev:full         # Start both frontend and ML backend
```

### **Development Workflow**

1. **Frontend Development**: Work in `src/` directory
2. **ML Backend Development**: Work in `ml/` directory
3. **Component Development**: Use `src/components/` with shadcn/ui
4. **API Integration**: Use `src/lib/ml-api.ts` for ML predictions
5. **Styling**: Tailwind CSS with design system in `tailwind.config.ts`

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit linting (optional)

## 🧠 **ML Backend**

The ML backend provides production-ready financial prediction models via REST API.

### **ML Models Performance**
| Model | Type | Performance | Purpose |
|-------|------|-------------|---------|
| **Investment Risk** | XGBoost Regression | R² > 0.35 | Risk tolerance scoring |
| **Affordability** | XGBoost Regression | R² > 0.99 | Purchase capacity analysis |
| **Financial Health** | XGBoost Regression | R² > 0.99 | Health scoring & recommendations |
| **Scenario Planning** | XGBoost Classification | 99.9% accuracy | Strategy recommendations |

### **API Endpoints**
- `GET /health` - Health check & model status
- `POST /predict/investment-risk` - Investment risk assessment
- `POST /predict/affordability` - Affordability analysis  
- `POST /predict/financial-health` - Financial health scoring
- `POST /predict/scenario` - Scenario planning recommendations

### **Training Models**
```bash
cd ml
python train_model.py
```

Models are automatically trained on first server startup if not found.

## 🚀 **Deployment**

### **Vercel (Recommended for Frontend)**
```bash
npm install -g vercel
vercel
```

### **Railway/Heroku (For ML Backend)**
1. Create `Procfile`: `web: python ml/server.py`
2. Deploy `ml/` directory to Python hosting platform
3. Update `NEXT_PUBLIC_ML_API_URL` in frontend environment

### **Firebase Hosting**
```bash
npm run build
firebase deploy
```

### **Docker Deployment**
```dockerfile
# Multi-stage build for both frontend and ML backend
FROM node:18-alpine AS frontend
# ... frontend build steps

FROM python:3.11-alpine AS ml-backend  
# ... ML backend setup steps
```

## 🤝 **Contributing**

We welcome contributions! Here's how to get started:

### **Development Setup**
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/fisight.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `npm install && cd ml && pip install -r requirements.txt`
5. Start development: `npm run dev:full`

### **Contribution Guidelines**
- **Code Style**: Follow TypeScript and Python best practices
- **Commits**: Use conventional commit messages
- **Testing**: Ensure all features work before submitting
- **Documentation**: Update README if adding major features
- **Pull Requests**: Provide clear description of changes

### **Areas for Contribution**
- 🎨 **UI/UX Improvements**: Enhanced components and user experience
- 🧠 **ML Models**: Additional financial prediction models
- 🌐 **Integrations**: Bank APIs, financial data sources
- 🔧 **Infrastructure**: Performance optimizations, testing
- 📚 **Documentation**: Tutorials, guides, API documentation

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Next.js Team** - For the amazing React framework
- **Firebase Team** - For backend infrastructure
- **Google AI** - For Gemini AI capabilities
- **Tailwind CSS** - For utility-first CSS framework
- **shadcn/ui** - For beautiful UI components
- **XGBoost** - For high-performance ML models

## 📞 **Support & Contact**

- **🐛 Issues**: [GitHub Issues](https://github.com/deepanshusingla076/fisight/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/deepanshusingla076/fisight/discussions)
- **📧 Email**: singladeepanshu706@gmail.com
- **🔗 LinkedIn**: [Deepanshu Singla](https://linkedin.com/in/deepanshusingla076)

## 🎯 **Project Status**

**Current Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: September 2025

### **Recent Updates**
- ✅ Complete ML backend with 4 trained models
- ✅ Production-ready FastAPI server
- ✅ Firebase authentication integration
- ✅ Responsive dashboard with real-time predictions
- ✅ Clean project structure and documentation

### **Roadmap**
- 🔄 **In Progress**: Mobile app (React Native)
- 📅 **Planned**: Bank API integrations
- 📅 **Planned**: Advanced portfolio analytics
- 📅 **Planned**: Social features and sharing

---

**Built with ❤️ for better financial futures**

*Empowering individuals to make smarter financial decisions through AI and machine learning.*