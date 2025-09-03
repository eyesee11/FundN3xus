'use client'

// App tour using Shepherd.js - show users around like a boss! 🎯
import { useEffect, useRef } from 'react'
import Shepherd from 'shepherd.js'
import { useAuth } from '@/contexts/auth-context'

interface AppTourProps {
  onTourComplete?: () => void
  autoStart?: boolean
}

export function AppTour({ onTourComplete, autoStart = false }: AppTourProps) {
  const tourRef = useRef<any>(null)
  const { user } = useAuth()

  useEffect(() => {
    // Create tour instance
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'shadow-lg bg-background border rounded-lg',
        scrollTo: { behavior: 'smooth', block: 'center' },
        cancelIcon: {
          enabled: true,
        },
      },
    })

    // Define tour steps - comprehensive walkthrough! 🚀
    const steps = [
      {
        title: '👋 Welcome to FiSight!',
        text: `Hey ${user?.displayName || 'there'}! Ready to take control of your finances? Let's show you around this awesome platform!`,
        buttons: [
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
        id: 'dashboard',
        when: {
          show: function() {
            const element = document.querySelector('[data-tour="dashboard"], [href="/dashboard"], a[href="/dashboard"]')
            if (!element) {
              console.warn('Dashboard element not found, skipping step')
              tour.next()
            }
          }
        }
      },
      {
        title: '🏠 Quick Actions Dock',
        text: 'Need to do something fast? These floating action buttons give you quick access to common tasks like adding transactions or asking AI questions!',
        attachTo: {
          element: '[data-tour="command-dock"], .fixed.bottom-6',
          on: 'left' as any
        },
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
        id: 'command-dock',
        when: {
          show: function() {
            const element = document.querySelector('[data-tour="command-dock"], .fixed.bottom-6')
            if (!element) {
              console.warn('Command dock element not found, skipping step')
              tour.next()
            }
          }
        }
      },
      {
        title: '🤖 AI Financial Assistant',
        text: 'Meet your personal AI financial advisor! Ask questions, get insights, and receive personalized recommendations. It\'s like having a financial expert in your pocket!',
        attachTo: {
          element: '[data-tour="ai-chat"], [href="/ai-chat"], a[href="/ai-chat"]',
          on: 'right' as any
        },
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
        id: 'ai-chat',
        when: {
          show: function() {
            const element = document.querySelector('[data-tour="ai-chat"], [href="/ai-chat"], a[href="/ai-chat"]')
            if (!element) {
              console.warn('AI chat element not found, skipping step')
              tour.next()
            }
          }
        }
      },
      {
        title: '📊 Investments Hub',
        text: 'Track your portfolio, rebalance investments, and get AI-powered recommendations. Your path to financial growth starts here!',
        attachTo: {
          element: '[data-tour="investments"], [href="/investments"], a[href="/investments"]',
          on: 'right' as any
        },
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
        id: 'investments',
        when: {
          show: function() {
            const element = document.querySelector('[data-tour="investments"], [href="/investments"], a[href="/investments"]')
            if (!element) {
              console.warn('Investments element not found, skipping step')
              tour.next()
            }
          }
        }
      },
      {
        title: '🏡 Affordability Analyzer',
        text: 'Dreaming of a new home, car, or major purchase? Our AI-powered affordability analyzer helps you understand what you can actually afford!',
        attachTo: {
          element: '[data-tour="affordability"], [href="/affordability"], a[href="/affordability"]',
          on: 'right' as any
        },
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
        id: 'affordability',
        when: {
          show: function() {
            const element = document.querySelector('[data-tour="affordability"], [href="/affordability"], a[href="/affordability"]')
            if (!element) {
              console.warn('Affordability element not found, skipping step')
              tour.next()
            }
          }
        }
      },
      {
        title: '🎮 Financial Scenarios',
        text: 'What if you got a raise? What if you invested more? Play with different financial scenarios and see how they impact your future!',
        attachTo: {
          element: '[data-tour="scenarios"], [href="/scenarios"], a[href="/scenarios"]',
          on: 'right' as any
        },
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
        id: 'scenarios',
        when: {
          show: function() {
            const element = document.querySelector('[data-tour="scenarios"], [href="/scenarios"], a[href="/scenarios"]')
            if (!element) {
              console.warn('Scenarios element not found, skipping step')
              tour.next()
            }
          }
        }
      },
      {
        title: '👤 Profile & Settings',
        text: 'Customize your experience! Set up your financial profile, connect accounts, manage notifications, and fine-tune your preferences.',
        attachTo: {
          element: '[data-tour="profile"], [href="/settings"], a[href="/settings"]',
          on: 'right' as any
        },
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
        id: 'profile',
        when: {
          show: function() {
            const element = document.querySelector('[data-tour="profile"], [href="/settings"], a[href="/settings"]')
            if (!element) {
              console.warn('Profile element not found, skipping step')
              tour.next()
            }
          }
        }
      },
      {
        title: '🌓 Theme Toggle',
        text: 'Prefer dark mode? Light mode? Switch between themes anytime to match your vibe!',
        attachTo: {
          element: '[data-tour="theme-toggle"]',
          on: 'bottom' as any
        },
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
        id: 'theme-toggle'
      },
      {
        title: '🎉 You\'re All Set!',
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

    // Cleanup
    return () => {
      window.removeEventListener('start-app-tour', handleStartTour)
      if (tourRef.current) {
        tourRef.current.complete()
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
