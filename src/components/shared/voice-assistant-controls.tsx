'use client';

import React from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Loader2,
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';

interface VoiceAssistantControlsProps {
  onTranscriptChange: (transcript: string) => void;
  onSpeakResponse?: (text: string) => void;
  autoSpeak?: boolean;
  compact?: boolean;
  className?: string;
}

export function VoiceAssistantControls({
  onTranscriptChange,
  onSpeakResponse,
  autoSpeak = false,
  compact = false,
  className = '',
}: VoiceAssistantControlsProps) {
  const [voiceRate, setVoiceRate] = React.useState([1]);
  const [voicePitch, setVoicePitch] = React.useState([1]);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = React.useState(autoSpeak);
  
  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    isSpeaking,
    voices,
    selectedVoice,
    startListening,
    stopListening,
    resetTranscript,
    speak,
    stopSpeaking,
    setVoice,
  } = useVoiceAssistant({
    continuous: false,
    interimResults: true,
    voiceRate: voiceRate[0],
    voicePitch: voicePitch[0],
  });

  // Handle transcript changes
  React.useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscriptChange, resetTranscript]);

  // Auto-speak responses
  React.useEffect(() => {
    if (autoSpeakEnabled && onSpeakResponse) {
      // This will be called from parent component when response is ready
    }
  }, [autoSpeakEnabled, onSpeakResponse]);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const handleVoiceChange = (voiceURI: string) => {
    const voice = voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      setVoice(voice);
    }
  };

  if (!isSupported) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="secondary" className="text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          Voice not supported
        </Badge>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                onClick={handleMicToggle}
                className="h-8 w-8 p-0"
              >
                {isListening ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isListening ? 'Stop listening' : 'Start voice input'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isSpeaking ? "destructive" : "outline"}
                size="sm"
                onClick={handleSpeakToggle}
                disabled={!isSpeaking}
                className="h-8 w-8 p-0"
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isSpeaking ? 'Stop speaking' : 'Text-to-speech'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {(interimTranscript || error) && (
          <Badge variant={error ? "destructive" : "secondary"} className="text-xs max-w-32 truncate">
            {error || interimTranscript}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={handleMicToggle}
          className="flex items-center gap-2"
        >
          {isListening ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Listening...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Voice Input
            </>
          )}
        </Button>

        <Button
          variant={isSpeaking ? "destructive" : "outline"}
          size="sm"
          onClick={handleSpeakToggle}
          disabled={!isSpeaking}
          className="flex items-center gap-2"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              Speak
            </>
          )}
        </Button>

        {/* Voice Settings Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Voice Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voice Selection */}
                <div className="space-y-2">
                  <Label className="text-sm">Voice</Label>
                  <Select
                    value={selectedVoice?.voiceURI || ''}
                    onValueChange={handleVoiceChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.filter(voice => voice.lang.startsWith('en')).map((voice) => (
                        <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice Rate */}
                <div className="space-y-2">
                  <Label className="text-sm">Speaking Rate: {voiceRate[0]}</Label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceRate[0]}
                    onChange={(e) => setVoiceRate([parseFloat(e.target.value)])}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Voice Pitch */}
                <div className="space-y-2">
                  <Label className="text-sm">Pitch: {voicePitch[0]}</Label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={voicePitch[0]}
                    onChange={(e) => setVoicePitch([parseFloat(e.target.value)])}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Auto Speak Toggle */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Auto-speak responses</Label>
                  <Button
                    variant={autoSpeakEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
                  >
                    {autoSpeakEnabled ? 'ON' : 'OFF'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      {/* Status Display */}
      {(isListening || interimTranscript || error) && (
        <div className="space-y-1">
          {isListening && (
            <Badge variant="secondary" className="text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Listening...
              </div>
            </Badge>
          )}
          
          {interimTranscript && (
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              "{interimTranscript}"
            </div>
          )}
          
          {error && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              {error}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

// Export a hook for external speak control
export function useVoiceAssistantSpeaker() {
  const { speak, stopSpeaking, isSpeaking } = useVoiceAssistant();
  
  return {
    speak,
    stopSpeaking,
    isSpeaking,
  };
}
