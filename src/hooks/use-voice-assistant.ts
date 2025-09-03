'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

// Add Web Speech API type definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

interface VoiceAssistantConfig {
  language?: string;
  voiceRate?: number;
  voicePitch?: number;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

interface UseVoiceAssistantReturn {
  // Speech Recognition
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  
  // Speech Synthesis
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  
  // Controls
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  speak: (text: string, options?: SpeechSynthesisUtterance) => void;
  stopSpeaking: () => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
}

export function useVoiceAssistant(config: VoiceAssistantConfig = {}): UseVoiceAssistantReturn {
  const {
    language = 'en-US',
    voiceRate = 1,
    voicePitch = 1,
    continuous = true,
    interimResults = true,
    maxAlternatives = 1,
  } = config;

  // Speech Recognition states
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Speech Synthesis states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support and initialize
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      
      // Initialize Speech Recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = maxAlternatives;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
        setInterimTranscript(interimTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error);
        setIsListening(false);
        
        // Provide user-friendly error messages
        switch (event.error) {
          case 'network':
            setError('Network error occurred. Please check your connection.');
            break;
          case 'not-allowed':
            setError('Microphone access denied. Please allow microphone permissions.');
            break;
          case 'no-speech':
            setError('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            setError('Audio capture failed. Please check your microphone.');
            break;
          case 'service-not-allowed':
            setError('Speech recognition service not allowed.');
            break;
          default:
            setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognitionRef.current = recognition;

      // Initialize Speech Synthesis
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Set default voice to English if available
        const defaultVoice = availableVoices.find(voice => 
          voice.lang.startsWith('en') && voice.default
        ) || availableVoices.find(voice => 
          voice.lang.startsWith('en')
        ) || availableVoices[0];
        
        setSelectedVoice(defaultVoice || null);
      };

      // Load voices immediately and on voices change
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;

    } else {
      setIsSupported(false);
      setError('Speech recognition and/or synthesis not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language, continuous, interimResults, maxAlternatives]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not available.');
      return;
    }

    if (isListening) {
      return;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      setError('Failed to start speech recognition.');
      console.error('Speech recognition error:', error);
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const speak = useCallback((text: string, options?: Partial<SpeechSynthesisUtterance>) => {
    if (!window.speechSynthesis) {
      setError('Speech synthesis not supported.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set default properties
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;
    utterance.voice = selectedVoice;
    
    // Apply custom options
    if (options) {
      Object.assign(utterance, options);
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      setError(`Speech synthesis error: ${event.error}`);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [selectedVoice, voiceRate, voicePitch]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    // Speech Recognition
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    
    // Speech Synthesis
    isSpeaking,
    voices,
    selectedVoice,
    
    // Controls
    startListening,
    stopListening,
    resetTranscript,
    speak,
    stopSpeaking,
    setVoice,
  };
}

// Utility function to extract text content from React nodes
export function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === 'string') {
    return node;
  }
  
  if (typeof node === 'number') {
    return node.toString();
  }
  
  if (React.isValidElement(node)) {
    if (node.props.children) {
      return extractTextFromReactNode(node.props.children);
    }
  }
  
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join(' ');
  }
  
  return '';
}
