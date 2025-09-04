'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { Volume2, VolumeX, Play, Pause, Square, Mic, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export function TextToSpeechDemo() {
  const [inputText, setInputText] = useState('Hello! This is a demonstration of text-to-speech functionality. Try typing something and clicking the speak button, or enable auto-speak mode!');
  const [demoMessages, setDemoMessages] = useState<Array<{id: number, text: string, timestamp: string}>>([]);
  
  const {
    speak,
    pause,
    resume,
    cancel,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    isSpeechEnabled,
    setIsSpeechEnabled
  } = useTextToSpeech({
    rate: 1,
    pitch: 1,
    volume: 0.8,
    autoSpeakEnabled: true
  });

  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(0.8);

  const handleSpeak = () => {
    if (inputText.trim()) {
      // Create custom utterance with current settings
      const utterance = new SpeechSynthesisUtterance(inputText);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = speechVolume;
      
      speak(inputText);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputText,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setDemoMessages(prev => [...prev, newMessage]);
    
    // Auto-speak if enabled
    if (isSpeechEnabled) {
      setTimeout(() => {
        const responseText = `Message received: ${inputText}. This response is automatically spoken because auto-speech is enabled.`;
        speak(responseText);
      }, 500);
    }
    
    setInputText('');
  };

  const predefinedTexts = [
    "Welcome to FundN3xus! Your AI-powered financial assistant.",
    "Your financial health score is 85 out of 100, which is excellent!",
    "Based on your profile, we recommend a moderate investment risk strategy.",
    "You can afford up to $250,000 for your next major purchase.",
    "Thank you for using our text-to-speech demonstration!"
  ];

  if (!isSupported) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-red-600">
            Text-to-Speech Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Your browser doesn't support text-to-speech functionality. Please try a modern browser like Chrome, Firefox, or Safari.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-6 w-6 text-primary" />
            Text-to-Speech Demo
            <Badge variant={isSpeechEnabled ? "default" : "outline"}>
              {isSpeechEnabled ? "Speech Enabled" : "Speech Disabled"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              variant={isSpeechEnabled ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {isSpeechEnabled ? (
                <>
                  <Volume2 className="h-4 w-4" />
                  Auto-Speech On
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" />
                  Auto-Speech Off
                </>
              )}
            </Button>
            
            {isSpeaking && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">Speaking...</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Button
                onClick={pause}
                disabled={!isSpeaking || isPaused}
                size="sm"
                variant="outline"
              >
                <Pause className="h-4 w-4" />
              </Button>
              <Button
                onClick={resume}
                disabled={!isPaused}
                size="sm"
                variant="outline"
              >
                <Play className="h-4 w-4" />
              </Button>
              <Button
                onClick={cancel}
                disabled={!isSpeaking}
                size="sm"
                variant="outline"
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Text Input & Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Text Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type or paste text here to convert to speech..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[120px]"
            />
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleSpeak}
                disabled={!inputText.trim() || isSpeaking}
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Speak Text
              </Button>
              <Button
                onClick={handleSendMessage}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Send Message
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Text Examples:</p>
              <div className="grid gap-2">
                {predefinedTexts.map((text, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputText(text)}
                    className="justify-start text-left h-auto p-2 text-xs"
                  >
                    {text}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Voice Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Voice Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Voice</label>
              <Select
                value={selectedVoice?.name || ''}
                onValueChange={(value) => {
                  const voice = voices.find(v => v.name === value) || null;
                  setSelectedVoice(voice);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices
                    .filter(voice => voice.lang.startsWith('en'))
                    .map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speech Rate */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Speech Rate: {speechRate.toFixed(1)}x</label>
              <Slider
                value={[speechRate]}
                onValueChange={([value]) => setSpeechRate(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Speech Pitch */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Speech Pitch: {speechPitch.toFixed(1)}</label>
              <Slider
                value={[speechPitch]}
                onValueChange={([value]) => setSpeechPitch(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Speech Volume */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Volume: {Math.round(speechVolume * 100)}%</label>
              <Slider
                value={[speechVolume]}
                onValueChange={([value]) => setSpeechVolume(value)}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Demo */}
      {demoMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Message Responses (Auto-Speech Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {demoMessages.map((message) => (
                <div key={message.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speak(`Message: ${message.text}`)}
                    disabled={isSpeaking}
                    className="h-8 w-8 p-0"
                    title="Read message aloud"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {isSpeechEnabled && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Volume2 className="inline h-4 w-4 mr-2" />
                  Auto-speech is enabled. Responses will be spoken automatically when you send messages.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
