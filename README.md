# 💰 FiSight - AI-Powered Financial Advisor

> Your personal AI financial guru that revolutionizes personal finance management

## 🚀 Project Overview

FiSight is a cutting-edge, AI-powered financial advisory platform that combines advanced machine learning, real-time data processing, and intelligent automation to provide personalized financial guidance. Built with modern web technologies, FiSight serves as your comprehensive financial command center.

## 📋 Quick Start

```bash
# Install dependencies
npm install

# Set up Python ML environment (optional)
python -m venv fisight-env
fisight-env\Scripts\activate  # Windows
pip install -r requirements.txt

# Start development server
npm run dev  # http://localhost:9002
```

## 📚 Documentation

- **📄 [Project Description](./description.txt)** - Comprehensive project overview and future roadmap
- **⚙️ [Requirements Guide](./REQUIREMENTS_GUIDE.md)** - Detailed installation and setup instructions
- **📦 [Requirements Summary](./REQUIREMENTS_SUMMARY.md)** - Quick overview of all dependencies
- **🤖 [AI Setup Guide](./docs/ai-setup-guide.md)** - AI model integration instructions
- **🔥 [AI Implementation](./docs/ai-implementation-summary.md)** - Complete AI features overview

## ✨ key features

### 🏠 landing page
- **multilingual support** - english/hindi with smooth switching
- **interactive AI chat demo** - try before you dive in
- **modern design** - clean, responsive, and mobile-first
- **smooth scrolling navigation** - because why not?

### 📊 dashboard
- **financial health score** - get a quick snapshot of your money situation
- **net worth tracking** - see your total wealth at a glance
- **recent transactions** - keep tabs on where your money goes
- **AI-powered insights** - personalized tips based on your spending

### 💡 AI advisor chat
- **real-time advice** - ask anything about your finances
- **personalized recommendations** - tailored to your actual data
- **financial health scoring** - track your progress over time
- **multiple conversation contexts** - remembers your previous chats

### 💼 investment tools
- **portfolio analysis** - see how your investments are performing
- **rebalancing suggestions** - AI tells you when to buy/sell
- **risk assessment** - understand your investment risk level
- **performance tracking** - monitor gains and losses

### 🏦 affordability calculator
- **big purchase planning** - can you afford that new car?
- **scenario simulation** - what if you take that loan?
- **long-term impact analysis** - see how decisions affect your future

### 📈 scenario planner
- **financial future modeling** - explore different life paths
- **goal tracking** - set and monitor financial targets
- **what-if analysis** - test major life decisions

### 👤 profile management
- **financial data input** - securely store your info
- **bank account linking** - connect your accounts (coming soon)
- **investment portfolio setup** - track all your assets
- **goal setting** - define what you're working toward

## 🛠 Tech Stack

**Frontend**: Next.js 15 + React 18 + TypeScript + Tailwind CSS + Radix UI
**Backend**: Node.js + Firebase + Google Genkit AI + TensorFlow.js
**ML/AI**: TensorFlow + Keras + Scikit-learn + Financial APIs
**Database**: Firebase Firestore + Authentication
**Deployment**: Firebase Hosting + Cloud Functions

## 📋 Complete Requirements

All dependencies are consolidated in [`requirements.txt`](./requirements.txt):
- **Frontend**: Next.js, React, TypeScript, UI components
- **Backend**: Firebase, AI integration, Node.js services  
- **Python/ML**: TensorFlow, financial APIs, data science libraries

See [`REQUIREMENTS_GUIDE.md`](./REQUIREMENTS_GUIDE.md) for detailed setup instructions.

- **framework**: Next.js 15.3.3 with App Router
- **ui**: Tailwind CSS + shadcn/ui components
- **animations**: Framer Motion for smooth interactions
- **ai**: Google Genkit for AI flows
- **language**: TypeScript throughout
- **email**: Nodemailer for contact forms
- **charts**: Recharts for data visualization

## 🚀 getting started

### prerequisites
- Node.js 18+ 
- npm or yarn

### installation

```bash
# clone the repo
git clone https://github.com/eyesee11/FiSight.git
cd FiSight

# install dependencies
npm install

# set up environment variables
cp .env.local.example .env.local
# edit .env.local with your keys

# run development server
npm run dev
```

### environment setup

create a `.env.local` file:

```env
# AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_TO=contact@fisight.com

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 features breakdown

### ai financial advisor
- natural language processing for financial queries
- personalized advice based on user financial data
- multi-turn conversations with context awareness
- financial health scoring and tracking

### bilingual support
- seamless english/hindi language switching
- localized content and cultural context
- indian financial scenarios and examples
- region-specific financial advice

### responsive design
- mobile-first approach
- works on all screen sizes
- touch-friendly interactions
- fast loading times

### security & privacy
- bank-level encryption for financial data
- no storage of sensitive banking credentials
- anonymized data processing
- gdpr compliant data handling

## 🔧 development

### project structure
```
src/
├── app/                 # next.js app router pages
├── components/          # reusable react components
│   ├── ui/             # base ui components
│   ├── landing/        # landing page components
│   ├── dashboard/      # dashboard components
│   └── shared/         # shared components
├── ai/                 # ai flows and configuration
├── lib/                # utility functions and types
├── contexts/           # react contexts
└── hooks/              # custom react hooks
```

### available scripts

```bash
npm run dev          # start development server
npm run build        # build for production
npm run start        # start production server
npm run lint         # run eslint
npm run type-check   # run typescript compiler
```

## 🔐 firebase authentication setup

FiSight includes complete Firebase authentication with sample configuration. Here's how to set it up:

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Sign-in method: Email/Password & Google)
4. Get your configuration from Project Settings

### 2. Update Environment Variables
Replace the sample values in `.env.local` with your actual Firebase config:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Demo Credentials
For quick testing with sample config:
- **Email**: demo@fisight.com
- **Password**: demo123

### 4. Features Included
- ✅ Email/Password Authentication
- ✅ Google Sign-In
- ✅ Protected Routes
- ✅ User Profile Management
- ✅ Automatic Redirects
- ✅ Loading States & Error Handling
- ✅ Responsive Auth Forms

## 🎨 design system

- **colors**: modern blue/purple gradient theme
- **typography**: clean, readable fonts
- **spacing**: consistent 8px grid system
- **components**: shadcn/ui component library
- **animations**: subtle framer motion effects

## 🌐 deployment

### vercel (recommended)
```bash
# deploy to vercel
npm i -g vercel
vercel
```

### other platforms
- works with any node.js hosting platform
- docker support available
- static export possible for some features

## 🤝 contributing

we welcome contributions! here's how:

1. fork the repo
2. create a feature branch
3. make your changes
4. test thoroughly
5. submit a pull request

### development guidelines
- follow typescript best practices
- use meaningful commit messages
- test on multiple screen sizes
- ensure accessibility compliance

## 📄 license

MIT License - see [LICENSE](LICENSE) for details

## 🙋‍♀️ support

- 📧 email: support@fisight.com
- 🐛 bugs: [GitHub Issues](https://github.com/eyesee11/FiSight/issues)
- 💬 discussions: [GitHub Discussions](https://github.com/eyesee11/FiSight/discussions)

## 🔮 roadmap

- [ ] bank account integration
- [ ] cryptocurrency tracking
- [ ] tax planning features
- [ ] goal achievement gamification
- [ ] social sharing of progress
- [ ] mobile app (react native)

---

built with ❤️ for better financial futures