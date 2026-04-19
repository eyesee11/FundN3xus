'use client'

// App tour using Shepherd.js - show users around like a boss! 🎯
import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface AppTourProps {
  onTourComplete?: () => void
  autoStart?: boolean
}

export function AppTour({ onTourComplete, autoStart = false }: AppTourProps) {
  const tourRef = useRef<any>(null)
  const { user } = useAuth()

  useEffect(() => {
    const initTour = async () => {
      // Dynamic import to avoid SSR issues
      const Shepherd = (await import('shepherd.js')).default;
      
      // Create tour instance
      const tour = new Shepherd.Tour({
        useModalOverlay: false,
        defaultStepOptions: {
          scrollTo: { behavior: 'smooth', block: 'center' },
          cancelIcon: {
            enabled: true,
          },
        },
      })

      const checkElement = (selector: string) => {
        return function() {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              const el = document.querySelector(selector) as HTMLElement;
              if (!el || window.getComputedStyle(el).display === 'none') {
                console.warn(`Element not found or hidden: ${selector}, skipping step`);
                tour.next();
              }
              resolve();
            }, 300); // Give React time to mount and animate elements
          });
        };
      };

    // Define tour steps - comprehensive walkthrough! 
    const steps = [
      {
        title: '👋 Welcome to FundN3xus!',
        text: `Hey ${user?.displayName || 'there'}! Ready to take control of your finances? Let's show you around this awesome platform!`,
        buttons: [
          {
            text: 'Skip Tour',
            action: tour.cancel,
            classes: 'btn btn-secondary'
          },
          {
            text: 'Let\'s Go!',
            action: tour.next,
            classes: 'btn btn-primary'
          }
        ],
        id: 'welcome'
      },
      {
        title: '🎛️ Command Center Dashboard',
        text: 'This is your financial command center! Get a quick overview of your net worth, recent transactions, and financial health.',
        attachTo: {
          element: '[data-tour="dashboard"], [href="/dashboard"], a[href="/dashboard"]',
          on: 'right' as any
        },
        showOn: () => {
          const el = document.querySelector('[data-tour="dashboard"], [href="/dashboard"], a[href="/dashboard"]');
          return !!el && window.getComputedStyle(el).display !== 'none';
        },
        beforeShowPromise: checkElement('[data-tour="dashboard"], [href="/dashboard"], a[href="/dashboard"]'),
        buttons: [
          {
            text: 'Back',
            action: tour.back,
            classes: 'btn btn-secondary'
          },
          {
            text: 'Next',
            action: tour.next,
            classes: 'btn btn-primary'
          }
        ],
        id: 'dashboard'
      },
      {
        title: '🏠 Quick Actions Dock',
        text: 'Need to do something fast? These floating action buttons give you quick access to common tasks like adding transactions or asking AI questions!',
        attachTo: {
          element: '[data-tour="command-dock"], .fixed.bottom-6',
          on: 'left' as any
        },
        showOn: () => {
          const el = document.querySelector('[data-tour="command-dock"], .fixed.bottom-6');
          return !!el && window.getComputedStyle(el).display !== 'none';
        },
        beforeShowPromise: checkElement('[data-tour="command-dock"], .fixed.bottom-6'),
        buttons: [
          {
            text: 'Back',
            action: tour.back,
            classes: 'btn btn-secondary'
          },
          {
            text: 'Next',
            action: tour.next,
            classes: 'btn btn-primary'
          }
        ],
        id: 'command-dock'
      },
      {
        title: '🤖 AI Financial Assistant',
        text: 'Meet your personal AI financial advisor! Ask questions, get insights, and receive personalized recommendations. It\'s like having a financial expert in your pocket!',
        attachTo: {
          element: '[data-tour="ai-chat"], [href="/ai-chat"], a[href="/ai-chat"]',
          on: 'right' as any
        },
        showOn: () => {
          const el = document.querySelector('[data-tour="ai-chat"], [href="/ai-chat"], a[href="/ai-chat"]');
          return !!el && window.getComputedStyle(el).display !== 'none';
        },
        beforeShowPromise: checkElement('[data-tour="ai-chat"], [href="/ai-chat"], a[href="/ai-chat"]'),
        buttons: [
          {
            text: 'Back',
            action: tour.back,
            classes: 'btn btn-secondary'
          },
          {
            text: 'Next',
            action: tour.next,
            classes: 'btn btn-primary'
          }
        ],
        id: 'ai-chat'
      },
      {
        title: '📊 Investments Hub',
        text: 'Track your portfolio, rebalance investments, and get AI-powered recommendations. Your path to financial growth starts here!',
        attachTo: {
          element: '[data-tour="investments"], [href="/investments"], a[href="/investments"]',
          on: 'right' as any
        },
        showOn: () => {
          const el = document.querySelector('[data-tour="investments"], [href="/investments"], a[href="/investments"]');
          return !!el && window.getComputedStyle(el).display !== 'none';
        },
        beforeShowPromise: checkElement('[data-tour="investments"], [href="/investments"], a[href="/investments"]'),
        buttons: [
          {
            text: 'Back',
            action: tour.back,
            classes: 'btn btn-secondary'
          },
          {
            text: 'Next',
            action: tour.next,
            classes: 'btn btn-primary'
          }
        ],
        id: 'investments'
      },
      {
        title: '🏡 Affordability Analyzer',
        text: 'Dreaming of a new home, car, or major purchase? Our AI-powered affordability analyzer helps you understand what you can actually afford!',
        attachTo: {
          element: '[data-tour="affordability"], [href="/affordability"], a[href="/affordability"]',
          on: 'right' as any
        },
        showOn: () => {
          const el = document.querySelector('[data-tour="affordability"], [href="/affordability"], a[href="/affordability"]');
          return !!el && window.getComputedStyle(el).display !== 'none';
        },
        beforeShowPromise: checkElement('[data-tour="affordability"], [href="/affordability"], a[href="/affordability"]'),
        buttons: [
          {
            text: 'Back',
            action: tour.back,
            classes: 'btn btn-secondary'
          },
          {
            text: 'Next',
            action: tour.next,
            classes: 'btn btn-primary'
          }
        ],
        id: 'affordability'
      },
      {
        title: '🎮 Financial Scenarios',
        text: 'What if you got a raise? What if you invested more? Play with different financial scenarios and see how they impact your future!',
        attachTo: {
          element: '[data-tour="scenarios"], [href="/scenarios"], a[href="/scenarios"]',
          on: 'right' as any
        },
        showOn: () => {
          const el = document.querySelector('[data-tour="scenarios"], [href="/scenarios"], a[href="/scenarios"]');
          return !!el && window.getComputedStyle(el).display !== 'none';
        },
        beforeShowPromise: checkElement('[data-tour="scenarios"], [href="/scenarios"], a[href="/scenarios"]'),
        buttons: [
          {
            text: 'Back',
            action: tour.back,
            classes: 'btn btn-secondary'
          },
          {
            text: 'Next',
            action: tour.next,
            classes: 'btn btn-primary'
          }
        ],
        id: 'scenarios'
      },
      {
        title: '👤 Profile & Settings',
        text: 'Customize your experience! Set up your financial profile, connect accounts, manage notifications, and fine-tune your preferences.',
        attachTo: {
          element: '[data-tour="profile"], [href="/settings"], a[href="/settings"], nav a[href="/settings"]',
          on: 'right' as any
        },
        showOn: () => {
          const el = document.querySelector('[data-tour="profile"], [href="/settings"], a[href="/settings"], nav a[href="/settings"]');
          return !!el && window.getComputedStyle(el).display !== 'none';
        },
        beforeShowPromise: checkElement('[data-tour="profile"], [href="/settings"], a[href="/settings"], nav a[href="/settings"]'),
        buttons: [
          {
            text: 'Back',
            action: tour.back,
            classes: 'btn btn-secondary'
          },
          {
            text: 'Next',
            action: tour.next,
            classes: 'btn btn-primary'
          }
        ],
        id: 'profile'
      },
      {
        title: ' You\'re All Set!',
        text: 'That\'s the grand tour! You\'re now ready to take control of your financial future. Remember, our AI assistant is always here to help. Happy investing! 💰',
        buttons: [
          {
            text: 'Start Exploring!',
            action: () => {
              tour.complete()
              onTourComplete?.()
            },
            classes: 'btn btn-primary'
          }
        ],
        id: 'complete'
      }
    ]

      // Add steps to tour
      steps.forEach(step => tour.addStep(step))

      // Store tour reference
      tourRef.current = tour

      // Auto start if requested
      if (autoStart) {
        setTimeout(() => tour.start(), 1000) // Small delay to ensure elements are rendered
      }

      // Listen for manual tour start events
      const handleStartTour = () => {
        if (tourRef.current) {
          tourRef.current.start()
        }
      }

      window.addEventListener('start-app-tour', handleStartTour)

      // Cleanup function
      return () => {
        window.removeEventListener('start-app-tour', handleStartTour)
        if (tourRef.current) {
          tourRef.current.cancel()
        }
      }
    }

    let isActive = true;
    let cleanupFn: (() => void) | undefined;
    
    initTour().then((cleanup) => {
      if (!isActive) {
        // If unmounted before init completed, cleanup immediately
        cleanup();
      } else {
        cleanupFn = cleanup;
      }
    });

    return () => {
      isActive = false;
      if (cleanupFn) {
        cleanupFn();
      } else if (tourRef.current) {
        tourRef.current.cancel()
      }
    }
  }, [autoStart, onTourComplete, user?.displayName])

  // Function to manually start tour
  const startTour = () => {
    if (tourRef.current) {
      tourRef.current.start()
    }
  }

  return null // This component doesn't render anything visible
}

// Export start function for external use
export const startAppTour = () => {
  const event = new CustomEvent('start-app-tour')
  window.dispatchEvent(event)
}
