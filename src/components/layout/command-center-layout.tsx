'use client';

import { useState } from 'react';
import { CommandDock } from './command-dock';
import { FloatingActionButtons } from './floating-action-buttons';
import { Header } from './header';

interface CommandCenterLayoutProps {
  children: React.ReactNode;
}

export function CommandCenterLayout({ children }: CommandCenterLayoutProps) {
  const [isDockExpanded, setIsDockExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark text-foreground">
      {/* Header with enhanced styling */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* Main content area with enhanced padding and styling */}
      <main className="relative z-0 px-4 pb-32 pt-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      {/* Floating Action Buttons */}
      <FloatingActionButtons />

      {/* Command Dock at bottom */}
      <CommandDock 
        isExpanded={isDockExpanded}
        onToggleExpanded={setIsDockExpanded}
      />

      {/* Backdrop overlay when dock is expanded */}
      {isDockExpanded && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsDockExpanded(false)}
        />
      )}
    </div>
  );
}
