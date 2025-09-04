'use client';

import { useState, useEffect, useRef } from 'react';
import { User, CornerDownLeft, Sparkles, Brain, LogIn, ArrowRight, Mic, Loader2, Volume2, VolumeX, TrendingUp, Shield, Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  role: 'user' | 'advisor';
  content: React.ReactNode;
  timestamp: string;
}

// Enhanced AI response formatting with React components
const getSampleFinancialResponse = (query: string): React.ReactNode => {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('budget') || queryLower.includes('save money')) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Proven Budgeting Strategy
          </h3>
          <div className="space-y-3">
            <div className="bg-white/70 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">The 50/30/20 Rule:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>50%</strong> for needs (rent, utilities, groceries)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span><strong>30%</strong> for wants (entertainment, dining out)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>20%</strong> for savings and debt repayment</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                Quick Tips:
              </h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Track expenses for 30 days to understand spending patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Use apps like Mint or YNAB for automated tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Set up automatic transfers to savings accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Review and adjust monthly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border-l-4 border-green-500">
          <p className="text-green-800 text-sm font-medium">
            💡 <strong>Pro Tip:</strong> Start with one category at a time for sustainable habit building!
          </p>
        </div>
      </div>
    );
  }
  
  if (queryLower.includes('invest') || queryLower.includes('mutual fund') || queryLower.includes('sip')) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border-l-4 border-purple-500">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Smart Investment Strategy for Beginners
          </h3>
          
          <div className="grid gap-3">
            <div className="bg-white/70 p-3 rounded-md">
              <h4 className="font-medium text-purple-800 mb-2">Mutual Fund SIP Approach:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span>Monthly SIP Amount:</span>
                  <Badge variant="secondary">₹2,000-5,000</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Large-cap funds for stability (60%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Mid-cap funds for growth (30%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded"></div>
                    <span>Debt funds for safety (10%)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 p-3 rounded-md">
              <h4 className="font-medium text-purple-800 mb-2">Recommended Timeline:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">Step 1</span>
                  <span>Emergency fund first (6 months expenses)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Step 2</span>
                  <span>Then start SIP investments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Step 3</span>
                  <span>Increase SIP by 10% annually</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 p-3 rounded-md">
              <h4 className="font-medium text-purple-800 mb-2">Popular Beginner Funds:</h4>
              <div className="space-y-1 text-sm">
                {['HDFC Top 100 Fund', 'ICICI Prudential Bluechip Fund', 'SBI Small Cap Fund'].map((fund, index) => (
                  <div key={fund} className="flex items-center gap-2 p-1">
                    <span className="w-5 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{fund}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border-l-4 border-amber-500">
          <p className="text-amber-800 text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <strong>Remember:</strong> Time in market beats timing the market!
          </p>
        </div>
      </div>
    );
  }
  
  // Default response for other financial queries
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 rounded-lg border-l-4 border-slate-500">
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          General Financial Wellness Tips
        </h3>
        
        <div className="grid gap-3">
          <div className="bg-white/70 p-3 rounded-md">
            <h4 className="font-medium text-slate-800 mb-2">Monthly Financial Checklist:</h4>
            <div className="grid grid-cols-1 gap-1 text-sm">
              {[
                'Track income vs expenses',
                'Review and categorize spending', 
                'Ensure emergency fund growth',
                'Check investment performance',
                'Pay all bills on time'
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 p-1">
                  <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/70 p-3 rounded-md">
            <h4 className="font-medium text-slate-800 mb-2">Long-term Wealth Building:</h4>
            <div className="space-y-1 text-sm">
              {[
                'Start investing early (compound interest magic)',
                'Diversify across asset classes',
                'Increase investments with income growth', 
                'Stay invested during market volatility',
                'Review and rebalance annually'
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-2 p-1">
                  <span className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/70 p-3 rounded-md">
            <h4 className="font-medium text-slate-800 mb-2">Financial Goals Framework:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3 p-2 bg-blue-50 rounded">
                <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">1-3 years</div>
                <div>
                  <div className="font-medium text-blue-800">Short-term</div>
                  <div className="text-blue-600">Emergency fund, vacation</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 bg-purple-50 rounded">
                <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">3-7 years</div>
                <div>
                  <div className="font-medium text-purple-800">Medium-term</div>
                  <div className="text-purple-600">House down payment, car</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 bg-green-50 rounded">
                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">7+ years</div>
                <div>
                  <div className="font-medium text-green-800">Long-term</div>
                  <div className="text-green-600">Retirement, children's education</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border-l-4 border-blue-500">
        <p className="text-blue-800 text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <strong>Want personalized advice?</strong> Sign up for detailed analysis of your financial situation!
        </p>
      </div>
    </div>
  );
};

const sampleQuestions = [
  "How should I start budgeting my money?",
  "What's the best way to begin investing?", 
  "How much emergency fund do I need?",
  "How to manage credit card debt?",
  "What are the best tax saving options?"
];

export function LandingFinancialChatWidget() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Aurora floating icons for chat button
  const floatingIcons = [Sparkles, TrendingUp, Shield, Target, Brain];
  const iconColors = ['text-primary', 'text-accent', 'text-blue-400', 'text-green-400', 'text-purple-400'];
  
  const MAX_FREE_RESPONSES = 5;

  // Voice Assistant
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    speak,
    isSpeaking,
    stopSpeaking,
  } = useVoiceAssistant({
    continuous: false,
    interimResults: true,
  });
  
  // Add speech enabled state
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle transcript changes from voice input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  // Initialize with welcome message using useEffect
  useEffect(() => {
    setMessages([{
      id: 1,
      role: 'advisor',
      content: (
        <div className="space-y-3">
          <p>{t('chat.welcome')}</p>
          <p className="text-sm text-muted-foreground">Try asking one of these sample questions:</p>
          <div className="space-y-2">
            {sampleQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left h-auto p-2 text-xs"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      ),
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check if user has reached the limit
    if (responseCount >= MAX_FREE_RESPONSES) {
      const limitMessage: Message = {
        id: Date.now(),
        role: 'advisor',
        content: (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Free Sample Limit Reached
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{t('chat.limitReached').replace('{count}', MAX_FREE_RESPONSES.toString())}</p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login" target="_blank">
                    <LogIn className="h-4 w-4 mr-2" />
                    {t('chat.tryFundN3xus')}
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Get unlimited AI advice • Portfolio analysis • Goal tracking
                </p>
              </div>
            </CardContent>
          </Card>
        ),
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, limitMessage]);
      setInput('');
      return;
    }

    const userMessage: Message = { 
      id: Date.now(), 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const response = getSampleFinancialResponse(currentInput);
      const newResponseCount = responseCount + 1;
      
      let advisorContent: React.ReactNode = response;
      
      // Add sign-up prompt after a few responses
      if (newResponseCount >= 3) {
        advisorContent = (
          <div className="space-y-4">
            <div>{response}</div>
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Sample Responses Used
                  </span>
                  <Badge variant="secondary" className="bg-white/80 text-blue-800 border-blue-200">
                    {newResponseCount}/{MAX_FREE_RESPONSES}
                  </Badge>
                </div>
                <Progress 
                  value={(newResponseCount / MAX_FREE_RESPONSES) * 100} 
                  className="h-3 mb-3 bg-blue-100" 
                />
                <div className="space-y-3">
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {newResponseCount < MAX_FREE_RESPONSES 
                      ? `🎯 ${MAX_FREE_RESPONSES - newResponseCount} more sample responses available. Sign up for unlimited access!`
                      : "🚀 Sign up now for unlimited personalized financial advice!"
                    }
                  </p>
                  {newResponseCount >= MAX_FREE_RESPONSES - 1 && (
                    <Button asChild size="sm" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Link href="/login" target="_blank">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Get Full Access
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }
      
      const advisorMessage: Message = { 
        id: Date.now() + 1, 
        role: 'advisor', 
        content: advisorContent,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, advisorMessage]);
      setResponseCount(newResponseCount);
      setIsLoading(false);

      // Auto-speak the response if enabled
      if (isSpeechEnabled) {
        setTimeout(() => {
          // Extract text content from React component for speech
          const speechText = typeof response === 'string' ? response : currentInput.includes('budget') 
            ? "Here's a proven budgeting strategy with the 50-30-20 rule. 50% for needs, 30% for wants, and 20% for savings. Track your expenses and set up automatic transfers."
            : currentInput.includes('invest') 
            ? "Smart investment strategy for beginners: Start with monthly SIP of 2000 to 5000 rupees. Choose large-cap funds for stability, mid-cap for growth, and debt funds for safety."
            : "General financial wellness tips: Track income versus expenses, ensure emergency fund growth, check investment performance, and pay bills on time.";
          speak(speechText);
        }, 500);
      }
    }, 1500);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeechToggle = () => {
    setIsSpeechEnabled(prev => {
      const newState = !prev;
      if (!newState && isSpeaking) {
        stopSpeaking();
      }
      return newState;
    });
  };

  const handleChatToggle = () => {
    console.log('Chat button clicked, current state:', isOpen);
    const newState = !isOpen;
    console.log('Setting new state:', newState);
    setIsOpen(newState);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Aurora Background Effects */}
      <div className="absolute inset-0 -m-8 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-accent/30 rounded-full blur-xl animate-pulse transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating Icons Animation */}
      {floatingIcons.map((Icon, index) => (
        <motion.div
          key={`chat-float-${index}`}
          className="absolute pointer-events-none z-0"
          initial={{ 
            opacity: 0,
            x: 0,
            y: 0,
            scale: 0.5,
            rotate: 0
          }}
          animate={{
            opacity: [0, 0.6, 0],
            x: [0, 30 * Math.cos(index * 2), -20 * Math.sin(index * 2), 0],
            y: [0, -40 * Math.sin(index * 1.5), 30 * Math.cos(index * 1.5), 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 6,
            delay: index * 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            left: `${20 + index * 5}%`,
            top: `${20 + index * 8}%`
          }}
        >
          <Icon className={`w-4 h-4 ${iconColors[index % iconColors.length]}`} />
        </motion.div>
      ))}

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 border-2 border-primary/20 backdrop-blur-sm relative overflow-hidden group cursor-pointer z-10"
        onClick={handleChatToggle}
        aria-label="Open Financial AI Chat"
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
        
        {/* Pulsing ring effect */}
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        
        <div className="relative z-10 flex items-center justify-center">
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-7 w-7 text-white drop-shadow-lg" />
          </motion.div>
        </div>
        
        {/* Sparkle effects */}
        <motion.div
          className="absolute top-2 right-2"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-3 w-3 text-white/80" />
        </motion.div>
        
        <span className="sr-only">Open Financial AI Chat</span>
      </motion.button>

      {/* Custom Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, x: "100%", scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: "100%", scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute right-4 top-4 bottom-4 w-full sm:w-96 bg-background shadow-2xl border border-border rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Aurora Background Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 via-accent/5 to-transparent" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
                <div className="absolute top-1/3 left-0 w-48 h-48 bg-gradient-to-r from-accent/10 via-transparent to-transparent rounded-full blur-2xl" />
              </div>

              {/* Floating Background Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`bg-sparkle-${i}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${10 + (i % 4) * 25}%`,
                    top: `${15 + Math.floor(i / 4) * 30}%`,
                    zIndex: 1
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 0.5,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Sparkles className="w-3 h-3 text-primary/40" />
                </motion.div>
              ))}

              <div className="flex flex-col h-full relative z-10">
                {/* Header */}
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/90 to-background/90 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-sm opacity-50" />
                        <Brain className="h-6 w-6 text-primary relative z-10" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          Financial AI Assistant
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Try our AI with sample financial questions!
                        </p>
                      </div>
                    </motion.div>
                    
                    <div className="flex items-center gap-2">
                      {/* <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Sample Mode
                      </Badge> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 flex flex-col space-y-4 min-h-0">
                  <ScrollArea className="flex-1 px-6 max-h-[60vh]">
                    <div className="space-y-4 py-4">
                      {messages.map((message, index) => (
                        <motion.div 
                          key={message.id} 
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                        >
                          {message.role === 'advisor' && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="relative"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-sm opacity-50" />
                              <Avatar className="h-9 w-9 border-2 border-primary/20 bg-gradient-to-r from-primary via-accent to-primary relative">
                                <AvatarFallback className="bg-transparent text-white">
                                  <Brain className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                          )}
                          
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className={`rounded-2xl p-4 max-w-[85%] relative overflow-hidden backdrop-blur-sm ${
                              message.role === 'user' 
                                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg border border-primary/20' 
                                : 'bg-gradient-to-br from-card/90 to-muted/50 border border-border/50 shadow-md'
                            }`}
                          >
                            {/* Aurora effect for message bubbles */}
                            {message.role === 'advisor' && (
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                            )}
                            
                            <div className="text-sm relative z-10">
                              {message.content}
                            </div>
                            <div className="flex items-center justify-between mt-3 relative z-10">
                              <div className="text-xs opacity-70 font-medium">
                                {message.timestamp}
                              </div>
                              {/* Speak button for advisor messages */}
                              {message.role === 'advisor' && isSupported && typeof message.content === 'string' && (
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (isSpeaking) {
                                        stopSpeaking();
                                      } else {
                                        speak(message.content as string);
                                      }
                                    }}
                                    className="ml-2 h-7 w-7 p-0 opacity-60 hover:opacity-100 hover:bg-primary/10 rounded-full"
                                    title={isSpeaking ? "Stop speaking" : "Read aloud"}
                                  >
                                    <Volume2 className={`h-3 w-3 ${isSpeaking ? 'text-primary animate-pulse' : ''}`} />
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                          
                          {message.role === 'user' && (
                            <motion.div whileHover={{ scale: 1.1 }}>
                              <Avatar className="h-9 w-9 border-2 border-accent/20 bg-gradient-to-r from-accent to-primary">
                                <AvatarFallback className="bg-transparent text-white">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                      
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-start gap-3"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-sm opacity-50" />
                            <Avatar className="h-9 w-9 border-2 border-primary/20 bg-gradient-to-r from-primary via-accent to-primary relative">
                              <AvatarFallback className="bg-transparent text-white">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <Brain className="h-4 w-4" />
                                </motion.div>
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div className="bg-gradient-to-br from-card/90 to-muted/50 border border-border/50 shadow-md rounded-2xl p-4 space-y-3 relative overflow-hidden backdrop-blur-sm">
                            {/* Aurora loading effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 animate-pulse pointer-events-none" />
                            
                            <div className="flex items-center gap-3 relative z-10">
                              <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="h-2 w-2 bg-primary rounded-full"
                                    animate={{
                                      scale: [1, 1.5, 1],
                                      opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                      duration: 1.5,
                                      delay: i * 0.2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground font-medium">Analyzing your financial question...</span>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="h-3 w-3 text-primary/60" />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Scroll to bottom reference */}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  {/* Input Area */}
                  <div className="p-6 border-t border-border/50 bg-gradient-to-r from-card/50 to-background/50 backdrop-blur-sm">
                    <div className="space-y-3">
                      {responseCount < MAX_FREE_RESPONSES && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Sample responses: {responseCount}/{MAX_FREE_RESPONSES}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {MAX_FREE_RESPONSES - responseCount} remaining
                            </Badge>
                            {/* Voice Toggle Control */}
                            {isSupported && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleSpeechToggle}
                                className={`h-6 w-6 p-0 ${isSpeechEnabled ? 'bg-primary/10' : ''}`}
                                title={isSpeechEnabled ? 'Turn off auto-speech' : 'Turn on auto-speech'}
                              >
                                {isSpeechEnabled ? (
                                  <Volume2 className={`h-3 w-3 ${isSpeaking ? 'text-green-600 animate-pulse' : 'text-primary'}`} />
                                ) : (
                                  <VolumeX className="h-3 w-3 text-muted-foreground" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <motion.form 
                        onSubmit={handleSendMessage} 
                        className="flex gap-3 relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="relative flex-1">
                          {/* Aurora glow effect for input */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-lg blur-sm opacity-50" />
                          
                          <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={responseCount >= MAX_FREE_RESPONSES ? t('nav.getStarted') : "Ask about finances or use voice input..."}
                            disabled={isLoading || responseCount >= MAX_FREE_RESPONSES}
                            className="pr-12 h-12 bg-gradient-to-r from-card/90 to-muted/50 border-2 border-primary/20 focus:border-primary/40 backdrop-blur-sm relative z-10 text-foreground placeholder:text-muted-foreground/70"
                          />
                          {isSupported && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleVoiceToggle}
                                disabled={isLoading || responseCount >= MAX_FREE_RESPONSES}
                                className={`h-8 w-8 p-0 rounded-full transition-all duration-300 ${
                                  isListening 
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                                    : 'hover:bg-primary/10 hover:text-primary'
                                }`}
                              >
                                {isListening ? (
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  >
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  </motion.div>
                                ) : (
                                  <Mic className="h-4 w-4" />
                                )}
                              </Button>
                            </motion.div>
                          )}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            type="submit" 
                            disabled={isLoading || !input.trim() || responseCount >= MAX_FREE_RESPONSES}
                            className="shrink-0 h-12 px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg relative overflow-hidden group"
                          >
                            {/* Button inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {isLoading ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Loader2 className="h-4 w-4" />
                              </motion.div>
                            ) : (
                              <CornerDownLeft className="h-4 w-4 relative z-10" />
                            )}
                          </Button>
                        </motion.div>
                      </motion.form>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
