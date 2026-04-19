'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; name: string; nativeName: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// translation object
const translations = {
  en: {
    // landing page stuff
    'hero.title': 'Navigate Your Financial Future with AI-Powered Clarity',
    'hero.subtitle': 'FundN3xus combines cutting-edge AI with your financial data to provide actionable insights, helping you make smarter decisions and achieve your goals faster.',
    'hero.dashboard': 'Explore Your Dashboard',
    'hero.learnMore': 'Learn More',
    'hero.features.security': 'Bank-Level Security',
    'hero.features.securityDesc': 'Your data is protected with military-grade encryption',
    'hero.features.ai': 'AI-Powered Insights',
    'hero.features.aiDesc': 'Get personalized recommendations from advanced AI',
    'hero.features.planning': 'Smart Planning',
    'hero.features.planningDesc': 'Achieve your financial goals with intelligent planning',
    'hero.stats.users': 'Active Users',
    'hero.stats.managed': 'Assets Managed',
    'hero.stats.satisfaction': 'Satisfaction',
    'hero.stats.support': 'AI Support',
    
    // about section
    'about.title': 'Our Mission: Financial Empowerment for All',
    'about.description': 'We believe that everyone deserves access to high-quality financial guidance. FundN3xus was born from a desire to democratize financial planning, using the power of artificial intelligence to make expert-level insights accessible and affordable.',
    'about.privacy': "We're committed to your privacy and security. Your data is always encrypted, anonymized, and never shared.",
    
    // Services
    'services.title': 'Our Services',
    'services.investment.title': 'Investment Analysis',
    'services.investment.description': 'Monitor your portfolio and get AI-powered rebalancing suggestions to stay on track with your goals.',
    'services.affordability.title': 'Affordability Simulation',
    'services.affordability.description': 'Considering a big purchase? Simulate its impact on your long-term financial health before you commit.',
    'services.scenario.title': 'Scenario Planning',
    'services.scenario.description': 'Explore potential financial futures. See how major life events or investment choices could play out.',
    
    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Have questions? We\'d love to hear from you.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.success': 'Message sent successfully!',
    'contact.successDesc': 'Your message has been sent. We\'ll get back to you soon.',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'Is my financial data secure?',
    'faq.a1': 'Absolutely. We use bank-level encryption (AES-256) for all your data. We do not store your bank credentials, and all analysis is done on anonymized data. Your privacy and security are our top priorities.',
    'faq.q2': 'How does the AI work?',
    'faq.a2': 'Our AI uses advanced large language models (LLMs) trained on vast amounts of financial data and strategies. It analyzes your specific financial situation to provide personalized insights and recommendations, similar to a human financial advisor.',
    'faq.q3': 'Do I need to link my bank accounts?',
    'faq.a3': 'For the most accurate and automated insights, linking your accounts is recommended. However, we also offer the ability to input your financial data manually if you prefer.',
    'faq.q4': 'Is FundN3xus a replacement for a human financial advisor?',
    'faq.a4': 'FundN3xus is a powerful tool to help you understand and manage your finances. While it provides expert-level analysis, it is not a certified financial planner. We recommend consulting with a qualified human advisor for complex financial decisions.',
    
    // Footer
    'footer.services': 'Services',
    'footer.about': 'About Us',
    'footer.faq': 'FAQ',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': 'All rights reserved.',
    
    // Dashboard
    'dashboard.title': 'Financial Dashboard',
    'dashboard.netWorth': 'Net Worth',
    'dashboard.monthlyIncome': 'Monthly Income',
    'dashboard.monthlyExpenses': 'Monthly Expenses',
    'dashboard.portfolioValue': 'Portfolio Value',
    'dashboard.recentTransactions': 'Recent Transactions',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile Settings',
    'settings.security': 'Security',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    
    // Navigation & Buttons
    'nav.getStarted': 'Get Started',
    'nav.contact': 'Contact',
    
    // Chat Bot
    'chat.welcome': '👋 Welcome! I\'m your AI Financial Advisor. I can help with budgeting, investing, debt management, and tax planning.',
    'chat.limitReached': 'You\'ve tried {count} sample responses! To get personalized financial advice based on your actual income, expenses, and goals:',
    'chat.placeholder': 'Ask about budgeting, investing, or financial planning...',
    'chat.tryFundN3xus': 'Try FundN3xus AI Advisor',
    'chat.sampleOnly': 'Sample responses only',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
  },
  hi: {
    // Landing Page
    'hero.title': 'अपने वित्तीय भविष्य को AI की शक्ति से संवारें',
    'hero.subtitle': 'FundN3xus आपके वित्तीय डेटा को अत्याधुनिक AI तकनीक के साथ जोड़कर व्यावहारिक सुझाव देता है, जो आपको बेहतर निर्णय लेने और अपने लक्ष्यों को तेज़ी से हासिल करने में मदद करता है।',
    'hero.dashboard': 'अपना डैशबोर्ड देखें',
    'hero.learnMore': 'और जानें',
    'hero.features.security': 'बैंक-स्तरीय सुरक्षा',
    'hero.features.securityDesc': 'आपका डेटा सैन्य-ग्रेड एन्क्रिप्शन से सुरक्षित है',
    'hero.features.ai': 'AI-संचालित अंतर्दृष्टि',
    'hero.features.aiDesc': 'उन्नत AI से व्यक्तिगत सुझाव प्राप्त करें',
    'hero.features.planning': 'स्मार्ट योजना',
    'hero.features.planningDesc': 'बुद्धिमान योजना के साथ अपने वित्तीय लक्ष्य हासिल करें',
    'hero.stats.users': 'सक्रिय उपयोगकर्ता',
    'hero.stats.managed': 'प्रबंधित संपत्ति',
    'hero.stats.satisfaction': 'संतुष्टि',
    'hero.stats.support': 'AI सहायता',
    
    // About Section
    'about.title': 'हमारा मिशन: सभी के लिए वित्तीय सशक्तिकरण',
    'about.description': 'हमारा मानना है कि हर भारतीय को उच्च गुणवत्ता वाली वित्तीय सलाह का अधिकार है। FundN3xus का जन्म वित्तीय योजना को लोकतांत्रिक बनाने की इच्छा से हुआ है, जो कृत्रिम बुद्धिमत्ता की शक्ति का उपयोग करके विशेषज्ञ स्तर की जानकारी को सुलभ और किफायती बनाता है।',
    'about.privacy': 'हम आपकी गोपनीयता और सुरक्षा के लिए प्रतिबद्ध हैं। आपका डेटा हमेशा एन्क्रिप्टेड, गुमनाम रहता है और कभी साझा नहीं किया जाता है।',
    
    // Services
    'services.title': 'हमारी सेवाएं',
    'services.investment.title': 'निवेश विश्लेषण',
    'services.investment.description': 'अपने पोर्टफोलियो की निगरानी करें और अपने लक्ष्यों के साथ तालमेल बनाए रखने के लिए AI-संचालित रीबैलेंसिंग सुझाव प्राप्त करें।',
    'services.affordability.title': 'क्रय शक्ति सिमुलेशन',
    'services.affordability.description': 'कोई बड़ी खरीदारी पर विचार कर रहे हैं? प्रतिबद्ध होने से पहले अपने दीर्घकालिक वित्तीय स्वास्थ्य पर इसके प्रभाव का अनुकरण करें।',
    'services.scenario.title': 'परिदृश्य योजना',
    'services.scenario.description': 'संभावित वित्तीय भविष्य का अन्वेषण करें। देखें कि प्रमुख जीवन घटनाएं या निवेश विकल्प कैसे सामने आ सकते हैं।',
    
    // Contact
    'contact.title': 'संपर्क करें',
    'contact.subtitle': 'कोई प्रश्न है? हमें आपसे सुनना अच्छा लगेगा।',
    'contact.name': 'नाम',
    'contact.email': 'ईमेल',
    'contact.message': 'संदेश',
    'contact.send': 'संदेश भेजें',
    'contact.success': 'संदेश सफलतापूर्वक भेजा गया!',
    'contact.successDesc': 'आपका संदेश भेजा गया है। हम जल्द ही आपसे संपर्क करेंगे।',
    
    // FAQ
    'faq.title': 'अक्सर पूछे जाने वाले प्रश्न',
    'faq.q1': 'क्या मेरा वित्तीय डेटा सुरक्षित है?',
    'faq.a1': 'बिल्कुल। हम आपके सभी डेटा के लिए बैंक-स्तरीय एन्क्रिप्शन (AES-256) का उपयोग करते हैं। हम आपकी बैंक साख संग्रहीत नहीं करते हैं, और सभी विश्लेषण गुमनाम डेटा पर किया जाता है। आपकी गोपनीयता और सुरक्षा हमारी शीर्ष प्राथमिकताएं हैं।',
    'faq.q2': 'AI कैसे काम करता है?',
    'faq.a2': 'हमारा AI वित्तीय डेटा और रणनीतियों की विशाल मात्रा पर प्रशिक्षित उन्नत बड़े भाषा मॉडल (LLMs) का उपयोग करता है। यह आपकी विशिष्ट वित्तीय स्थिति का विश्लेषण करके व्यक्तिगत अंतर्दृष्टि और सुझाव प्रदान करता है, एक मानव वित्तीय सलाहकार के समान।',
    'faq.q3': 'क्या मुझे अपने बैंक खाते लिंक करने होंगे?',
    'faq.a3': 'सबसे सटीक और स्वचालित अंतर्दृष्टि के लिए, आपके खातों को लिंक करना अनुशंसित है। हालांकि, यदि आप चाहें तो हम आपको अपने वित्तीय डेटा को मैन्युअल रूप से इनपुट करने की सुविधा भी प्रदान करते हैं।',
    'faq.q4': 'क्या FundN3xus एक मानव वित्तीय सलाहकार का विकल्प है?',
    'faq.a4': 'FundN3xus आपके वित्त को समझने और प्रबंधित करने में मदद करने के लिए एक शक्तिशाली उपकरण है। जबकि यह विशेषज्ञ-स्तरीय विश्लेषण प्रदान करता है, यह एक प्रमाणित वित्तीय योजनाकार नहीं है। हम जटिल वित्तीय निर्णयों के लिए एक योग्य मानव सलाहकार से परामर्श करने की सलाह देते हैं।',
    
    // Footer
    'footer.services': 'सेवाएं',
    'footer.about': 'हमारे बारे में',
    'footer.faq': 'प्रश्न उत्तर',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.rights': 'सभी अधिकार सुरक्षित।',
    
    // Dashboard
    'dashboard.title': 'वित्तीय डैशबोर्ड',
    'dashboard.netWorth': 'कुल संपत्ति',
    'dashboard.monthlyIncome': 'मासिक आय',
    'dashboard.monthlyExpenses': 'मासिक खर्च',
    'dashboard.portfolioValue': 'पोर्टफोलियो मूल्य',
    'dashboard.recentTransactions': 'हाल की लेनदेन',
    
    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.profile': 'प्रोफाइल सेटिंग्स',
    'settings.security': 'सुरक्षा',
    'settings.language': 'भाषा',
    'settings.notifications': 'सूचनाएं',
    
    // Navigation & Buttons
    'nav.getStarted': 'शुरू करें',
    'nav.contact': 'संपर्क',
    
    // Chat Bot
    'chat.welcome': '👋 स्वागत! मैं आपका AI वित्तीय सलाहकार हूं। मैं बजटिंग, निवेश, ऋण प्रबंधन और कर योजना में मदद कर सकता हूं।',
    'chat.limitReached': 'आपने {count} नमूना प्रतिक्रियाएं आज़माई हैं! अपनी वास्तविक आय, खर्च और लक्ष्यों के आधार पर व्यक्तिगत वित्तीय सलाह प्राप्त करने के लिए:',
    'chat.placeholder': 'बजटिंग, निवेश या वित्तीय योजना के बारे में पूछें...',
    'chat.tryFundN3xus': 'FundN3xus AI सलाहकार आज़माएं',
    'chat.sampleOnly': 'केवल नमूना प्रतिक्रियाएं',
    
    // Common
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.loading': 'लोड हो रहा है...',
  },
  es: {
    // Spanish translations - basic set
    'hero.title': 'Navega Tu Futuro Financiero con Claridad Impulsada por IA',
    'hero.subtitle': 'FundN3xus combina IA de vanguardia con tus datos financieros para brindar información procesable.',
    'hero.dashboard': 'Explorar Tu Panel',
    'hero.learnMore': 'Saber Más',
    'nav.getStarted': 'Comenzar',
    'nav.contact': 'Contacto',
    'services.title': 'Nuestros Servicios',
    'about.title': 'Nuestra Misión',
    'contact.title': 'Ponerse en Contacto',
    'faq.title': 'Preguntas Frecuentes',
    'common.loading': 'Cargando...',
  },
  fr: {
    // French translations - basic set
    'hero.title': 'Naviguez Votre Avenir Financier avec la Clarté de l\'IA',
    'hero.subtitle': 'FundN3xus combine l\'IA de pointe avec vos données financières pour fournir des informations exploitables.',
    'hero.dashboard': 'Explorer Votre Tableau de Bord',
    'hero.learnMore': 'En Savoir Plus',
    'nav.getStarted': 'Commencer',
    'nav.contact': 'Contact',
    'services.title': 'Nos Services',
    'about.title': 'Notre Mission',
    'contact.title': 'Contactez-nous',
    'faq.title': 'Questions Fréquemment Posées',
    'common.loading': 'Chargement...',
  },
  de: {
    // German translations - basic set
    'hero.title': 'Navigiere Deine Finanzielle Zukunft mit KI-gestützter Klarheit',
    'hero.subtitle': 'FundN3xus kombiniert modernste KI mit Ihren Finanzdaten, um verwertbare Einblicke zu bieten.',
    'hero.dashboard': 'Dashboard Erkunden',
    'hero.learnMore': 'Mehr Erfahren',
    'nav.getStarted': 'Beginnen',
    'nav.contact': 'Kontakt',
    'services.title': 'Unsere Dienstleistungen',
    'about.title': 'Unsere Mission',
    'contact.title': 'Kontakt Aufnehmen',
    'faq.title': 'Häufig Gestellte Fragen',
    'common.loading': 'Laden...',
  },
  ja: {
    // Japanese translations - basic set
    'hero.title': 'AI駆動の明確性で金融の未来をナビゲート',
    'hero.subtitle': 'FundN3xusは最先端のAIと金融データを組み合わせて実用的な洞察を提供します。',
    'hero.dashboard': 'ダッシュボードを探索',
    'hero.learnMore': 'もっと詳しく',
    'nav.getStarted': '始める',
    'nav.contact': 'お問い合わせ',
    'services.title': '私たちのサービス',
    'about.title': '私たちの使命',
    'contact.title': 'お問い合わせ',
    'faq.title': 'よくある質問',
    'common.loading': '読み込み中...',
  },
  zh: {
    // Chinese translations - basic set
    'hero.title': '用AI驱动的洞察力导航您的财务未来',
    'hero.subtitle': 'FundN3xus将尖端AI与您的财务数据结合，提供可操作的洞察。',
    'hero.dashboard': '探索您的仪表板',
    'hero.learnMore': '了解更多',
    'nav.getStarted': '开始',
    'nav.contact': '联系',
    'services.title': '我们的服务',
    'about.title': '我们的使命',
    'contact.title': '联系我们',
    'faq.title': '常见问题',
    'common.loading': '加载中...',
  },
  ar: {
    // Arabic translations - basic set
    'hero.title': 'اشتر مستقبلك المالي بوضوح مدعوم بالذكاء الاصطناعي',
    'hero.subtitle': 'يجمع FundN3xus بين الذكاء الاصطناعي المتطور وبياناتك المالية لتقديم رؤى قابلة للتنفيذ.',
    'hero.dashboard': 'استكشف لوحة القيادة',
    'hero.learnMore': 'تعلم أكثر',
    'nav.getStarted': 'ابدأ',
    'nav.contact': 'اتصال',
    'services.title': 'خدماتنا',
    'about.title': 'مهمتنا',
    'contact.title': 'تواصل معنا',
    'faq.title': 'الأسئلة الشائعة',
    'common.loading': 'جاري التحميل...',
  }
};

const availableLanguages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'es' as Language, name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de' as Language, name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja' as Language, name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh' as Language, name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en'); // Default to English

  useEffect(() => {
    const savedLanguage = typeof window !== 'undefined' ? window.localStorage.getItem('language') as Language : null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') window.localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const languageTranslations = translations[language];
    if (languageTranslations && key in languageTranslations) {
      return (languageTranslations as any)[key];
    }
    // Fallback to English if translation not found
    const englishTranslations = translations.en;
    if (englishTranslations && key in englishTranslations) {
      return (englishTranslations as any)[key];
    }
    return key; // Return key if no translation found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
