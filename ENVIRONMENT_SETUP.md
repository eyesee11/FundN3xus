# FiSight Environment Setup Guide

## 🔧 Environment Variables Setup

This guide will help you configure all the necessary environment variables for FiSight to work properly.

## 📁 Environment Files

- **`.env.example`** - Template with all possible environment variables
- **`.env.local`** - Your local development configuration (Next.js)
- **`ml/.env`** - ML backend specific configuration (Python FastAPI)

## 🚀 Quick Setup

### 1. Copy the Template
```bash
cp .env.example .env.local
```

### 2. Configure Required Variables

#### 🔥 Firebase Configuration (Required)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > General > Your apps
4. Copy the config values to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

#### 🤖 Google Gemini AI (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Optional Configurations

#### 📧 Email Configuration (Optional)
For Gmail SMTP:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not regular password
```

#### 🔒 Security (Production)
Generate a secure secret:
```bash
openssl rand -base64 32
```

```env
NEXTAUTH_SECRET=your-generated-secret
```

## 🐍 ML Backend Setup

The ML backend (Python FastAPI) uses `ml/.env` for configuration. Default values should work for development.

## 🛠 Development vs Production

### Development (.env.local)
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:9002
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
DEBUG_MODE=true
```

### Production (Deploy to Vercel/etc.)
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ML_API_URL=https://your-ml-api.com
DEBUG_MODE=false
```

## 🔍 Verification

### Test Firebase Connection
```bash
npm run dev
# Visit http://localhost:9002 and try to sign up/login
```

### Test Gemini AI
```bash
# Visit the AI Chat page and send a message
```

### Test ML Backend
```bash
npm run dev:ml
# Check http://localhost:8000/health
```

### Test Email (Optional)
```bash
# Try the contact form or user registration
```

## 🆘 Troubleshooting

### Firebase Issues
- ✅ Check that all Firebase config values are correct
- ✅ Ensure Firebase project has Authentication enabled
- ✅ Verify Firestore database is created

### Gemini AI Issues
- ✅ Verify API key is valid
- ✅ Check if API key has proper permissions
- ✅ Ensure you haven't exceeded quota

### ML Backend Issues
- ✅ Make sure Python dependencies are installed: `pip install -r ml/requirements.txt`
- ✅ Train models first: `npm run train`
- ✅ Check if port 8000 is available

### Email Issues
- ✅ For Gmail, use App Passwords instead of regular password
- ✅ Enable 2-factor authentication on Gmail account
- ✅ Generate App Password in Google Account settings

## 📝 Environment Variables Reference

### Required for Basic Functionality
- `NEXT_PUBLIC_FIREBASE_*` - Authentication and database
- `GEMINI_API_KEY` - AI chat functionality

### Required for Full Functionality
- `SMTP_*` - Email sending
- `NEXTAUTH_SECRET` - Security (especially for production)

### Optional
- All other variables have sensible defaults for development

## 🔐 Security Notes

1. **Never commit `.env.local`** to version control
2. **Use different API keys** for development and production
3. **Rotate secrets regularly** in production
4. **Use environment-specific Firebase projects**
5. **Restrict API keys** to specific domains/IPs in production

## 🚀 Production Deployment

For Vercel deployment:
1. Add environment variables in Vercel dashboard
2. Use production Firebase project
3. Use production domain URLs
4. Generate secure secrets

For other platforms:
- Set environment variables in your hosting platform
- Ensure all required variables are configured
- Test thoroughly before going live

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
