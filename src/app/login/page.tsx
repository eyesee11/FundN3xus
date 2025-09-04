'use client';

import { AuthForm } from '@/components/auth/auth-form';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted/20 flex flex-col">
      {/* Header Line */}
      <div className="w-full bg-card/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/">
            <Button 
              variant="ghost" 
              size="default" 
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-in-out px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
      
      {/* Main Content - Centered with Scroll */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        {/* Centered Card Container */}
        <div className="w-full max-w-5xl bg-card/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-border/50 my-4">
          <div className="flex min-h-[600px] max-h-[calc(100vh-140px)]">
            {/* Left Side - Image */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="relative w-full max-w-[320px] aspect-square">
                <Image
                  src="/undraw_pay-online_806n.png"
                  alt="FundN3xus Financial Planning"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
            
            {/* Right Side - Auth Form with Scroll */}
            <div className="flex-1 flex items-start justify-center p-6 lg:p-8 overflow-y-auto">
              <div className="w-full max-w-md py-4">
                <AuthForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 rounded-lg"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
