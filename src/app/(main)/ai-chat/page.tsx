'use client';

import { useState, useRef, useEffect } from 'react';
import { User, CornerDownLeft, Sparkles, AlertTriangle, Brain, Send, Trash2, Mic, MicOff, Loader2, AlertCircle, VolumeX, Volume2 } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { useProfile, profileToFinancialSituation } from '@/hooks/use-profile';
import { useToast } from '@/hooks/use-toast';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { queryRAG } from '@/lib/rag-api';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'financial' | 'rejected' | 'normal';
}

// Enhanced system prompt for better financial NLP handling
const SYSTEM_PROMPT = `You are FundN3xus AI, an advanced financial advisor and assistant. Your role is to help users with their personal finance management, investment decisions, and financial planning.

CORE CAPABILITIES:
- Personal finance analysis and budgeting
- Investment portfolio management and recommendations
- Loan and debt management strategies
- Tax planning and optimization
- Retirement and pension planning
- Financial goal setting and tracking
- Market analysis and trends
- Banking and account management
- Insurance and risk management

RESPONSE GUIDELINES:
1. ONLY respond to finance-related queries
2. For non-financial questions, politely redirect to financial topics
3. Always provide actionable, personalized advice based on user's financial profile
4. Use clear, professional language avoiding jargon when possible
5. Include specific numbers, percentages, and calculations when relevant
6. Suggest concrete next steps or actions
7. Reference current market conditions when applicable

REJECTION CRITERIA - Politely decline to answer:
- Personal questions unrelated to finance
- General knowledge queries outside finance
- Technical support for non-financial software
- Health, relationship, or lifestyle advice
- Political opinions or news commentary
- Entertainment or sports discussions

SAMPLE RESPONSES:
✅ Good: "Based on your monthly income of ₹80,000 and expenses of ₹55,000, I recommend allocating ₹15,000 for investments..."
❌ Reject: "I'm a financial advisor AI. I can help with budgeting, investments, loans, and financial planning. How can I assist with your finances today?"

Always maintain a helpful, professional tone while staying strictly within financial advisory scope.`;

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm FundN3xus AI, your personal financial advisor. I can help you with budgeting, investments, loans, taxes, retirement planning, and more. What financial topic would you like to discuss today?",
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('fundnexus_chat_history');
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        // Re-hydrate the date objects
        const hydrated = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(hydrated);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    // Only save if we have more than the welcome message, to avoid saving empty sessions constantly
    if (messages.length > 1) {
      localStorage.setItem('fundnexus_chat_history', JSON.stringify(messages));
    }
  }, [messages]);
  
  // Voice Assistant for input
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    speak,
    stopSpeaking,
    isSpeaking,
    error,
  } = useVoiceAssistant({
    continuous: false,
    interimResults: true,
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle transcript changes from voice input
  useEffect(() => {
    if (transcript) {
      console.log('Voice transcript received:', transcript);
      setInput(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const isFinancialQuery = (query: string): boolean => {
    const financialKeywords = [
      'money', 'budget', 'invest', 'save', 'loan', 'debt', 'bank', 'account', 'credit', 'debit',
      'mutual fund', 'stock', 'equity', 'bond', 'sip', 'emi', 'interest', 'tax', 'income',
      'expense', 'salary', 'pf', 'epf', 'ppf', 'nps', 'insurance', 'retirement', 'pension',
      'portfolio', 'asset', 'liability', 'cash flow', 'financial', 'finance', 'economic',
      'wealth', 'profit', 'loss', 'return', 'dividend', 'inflation', 'market', 'trading',
      'rupee', 'dollar', 'currency', 'payment', 'transaction', 'balance', 'fd', 'rd',
      'gold', 'real estate', 'property', 'mortgage', 'housing loan', 'car loan', 'personal loan',
      'credit card', 'credit score', 'cibil', 'kyc', 'pan', 'aadhar', 'gst', 'tds'
    ];

    const queryLower = query.toLowerCase();
    return financialKeywords.some(keyword => queryLower.includes(keyword));
  };

  const generateFinancialResponse = async (query: string): Promise<string> => {
    try {
      const response = await queryRAG(query, { returnSources: true, maxSources: 3 });
      
      if (response && response.answer) {
        return response.answer;
      }
      
      return "I'm sorry, I couldn't get a proper response from the financial model right now. Please try again.";
    } catch (error) {
      console.error('Error querying RAG:', error);
      return "Server Error: I'm currently unable to connect to the backend.\n\nMake sure your deployed RAG_API_URL is correct and the HF space is awake.";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      id: Date.now(), 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date(),
      type: 'normal'
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateFinancialResponse(currentInput);
      
      const assistantMessage: Message = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: response,
        timestamp: new Date(),
        type: isFinancialQuery(currentInput) ? 'financial' : 'rejected'
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      // Note: Auto-speak removed - users can now click the speak button on each message

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties. Please try asking your financial question again in a moment.",
        timestamp: new Date(),
        type: 'normal'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem('fundnexus_chat_history');
    setMessages([{
      id: 1,
      role: 'assistant',
      content: "Hello! I'm FundN3xus AI, your personal financial advisor. I can help you with budgeting, investments, loans, taxes, retirement planning, and more. What financial topic would you like to discuss today?",
      timestamp: new Date(),
      type: 'normal'
    }]);
    toast({
      title: "Chat cleared",
      description: "Starting a fresh conversation with FundN3xus AI."
    });
  };

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
  };

  const handleSpeakResponse = (text: string) => {
    speak(text);
  };

  const handleVoiceToggle = () => {
    console.log('Voice button clicked! Current state:', { isListening, isSupported });
    
    if (!isSupported) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input. Please try Chrome, Edge, or Safari.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      console.log('Stopping voice input...');
      stopListening();
    } else {
      console.log('Starting voice input...');
      startListening();
    }
  };

  // Get the last assistant message for voice controls
  const lastAssistantMessage = messages.length > 1 
    ? messages.slice().reverse().find(msg => msg.role === 'assistant')?.content || ''
    : '';

  const suggestionQueries = [
    "How should I start investing with ₹10,000 monthly?",
    "Help me create a budget for ₹75,000 salary",
    "Should I prepay my home loan or invest in SIP?",
    "What are the best tax saving options under 80C?",
    "How much emergency fund do I need?",
    "Compare ELSS vs PPF for tax saving"
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto" data-tour="ai-chat">
      <div className="flex items-center justify-between mb-6">
        <PageHeader 
          title="AI Financial Assistant" 
          description="Get personalized financial advice powered by AI"
        />
        <Button variant="outline" onClick={clearChat} className="shrink-0">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            FundN3xus AI Chat
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              Financial Expert
            </Badge>
          </CardTitle>
          <CardDescription>
            Ask me anything about budgeting, investments, loans, taxes, and financial planning
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col h-[600px] space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-primary/10">
                        <Logo className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`rounded-lg p-3 max-w-[80%] relative ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : message.type === 'rejected'
                      ? 'bg-orange-500/10 border border-orange-500/20 text-orange-50'
                      : 'bg-muted text-foreground'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      
                      {/* Speak Button for Assistant Messages */}
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => {
                            if (isSpeaking) {
                              stopSpeaking();
                            } else {
                              speak(message.content);
                            }
                          }}
                          className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 hover:scale-105 ${
                            isSpeaking 
                              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                          title={isSpeaking ? 'Stop speaking' : 'Speak this message'}
                        >
                          {isSpeaking ? (
                            <VolumeX className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary/10">
                      <Logo className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted text-foreground rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="ml-2">Analyzing your financial question...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
              <div className="grid gap-2">
                {suggestionQueries.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-3 whitespace-normal"
                    onClick={() => setInput(suggestion)}
                  >
                    <Sparkles className="h-3 w-3 mr-2 shrink-0 text-primary" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about investments, budgeting, loans, taxes... or use voice input"
                disabled={isLoading}
                className="pr-12"
              />
              
              {/* Voice Control Buttons */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  disabled={isLoading}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm border-2 ${
                    isListening 
                      ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive animate-pulse' 
                      : 'bg-card hover:bg-muted text-foreground border-border'
                  }`}
                  title={isListening ? 'Stop voice input (recording...)' : 'Start voice input'}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={isLoading || !input.trim()} className="shrink-0">
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Voice Status Display */}
          {(isListening || isSpeaking || error) && (
            <div className="flex items-center gap-2 text-xs">
              {isListening && (
                <Badge variant="secondary" className="text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Listening...
                  </div>
                </Badge>
              )}
              {isSpeaking && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    AI Speaking...
                  </div>
                </Badge>
              )}
              {error && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {error}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
