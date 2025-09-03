'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseTextToSpeechOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  autoSpeakEnabled?: boolean;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const {
    voice = null,
    rate = 1,
    pitch = 1,
    volume = 1,
    lang = 'en-US',
    autoSpeakEnabled = false
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported || !isSpeechEnabled || !text) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = lang;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  }, [isSupported, isSpeechEnabled, voice, rate, pitch, volume, lang]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      speechSynthesis.pause();
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      speechSynthesis.resume();
    }
  }, [isSupported, isPaused]);

  const cancel = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  const toggleSpeech = useCallback(() => {
    setIsSpeechEnabled(prev => !prev);
    if (isSpeaking) {
      cancel();
    }
  }, [isSpeaking, cancel]);

  const autoSpeak = useCallback((text: string) => {
    if (autoSpeakEnabled && isSpeechEnabled) {
      speak(text);
    }
  }, [speak, autoSpeakEnabled, isSpeechEnabled]);

  return {
    speak,
    pause,
    resume,
    cancel,
    toggleSpeech,
    autoSpeak,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    isSpeechEnabled,
    setIsSpeechEnabled
  };
}
