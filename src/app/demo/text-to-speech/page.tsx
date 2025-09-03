import { TextToSpeechDemo } from '@/components/demo/text-to-speech-demo';

export default function TextToSpeechDemoPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Text-to-Speech Demo</h1>
          <p className="text-muted-foreground">
            Experience automatic voice responses and interactive speech features
          </p>
        </div>
        
        <TextToSpeechDemo />
        
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold mb-4">Where to Find Text-to-Speech Features</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Landing Page Contact</h3>
              <p className="text-sm text-muted-foreground">
                Contact form responses are automatically spoken with voice toggle control
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">AI Chat Widget</h3>
              <p className="text-sm text-muted-foreground">
                Financial advice responses with voice controls and individual message speak buttons
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Dashboard Analytics</h3>
              <p className="text-sm text-muted-foreground">
                ML model predictions and insights with voice feedback options
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
