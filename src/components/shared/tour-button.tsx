'use client'

// Enhanced Tour Guide Button with Theme-Specific Design 🎯
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  Play, 
  Sparkles, 
  Compass, 
  ArrowRight,
  CheckCircle2 
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

interface TourButtonProps {
  onStartTour: () => void
  className?: string
  variant?: 'default' | 'interactive' | 'floating' | 'compact'
  showProgress?: boolean
  completedSteps?: number
  totalSteps?: number
}

export function TourButton({ 
  onStartTour, 
  className = '',
  variant = 'default',
  showProgress = false,
  completedSteps = 0,
  totalSteps = 5
}: TourButtonProps) {
  const [isStarting, setIsStarting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = () => {
    setIsStarting(true)
    onStartTour()
    setTimeout(() => setIsStarting(false), 1500)
  }

  const isComplete = completedSteps >= totalSteps
  const progressPercentage = (completedSteps / totalSteps) * 100

  // Theme-specific styling
  const getThemeClasses = () => {
    if (!mounted) return ''
    
    const baseClasses = 'transition-all duration-300 ease-in-out'
    
    if (theme === 'dark') {
      return `${baseClasses} bg-gradient-to-r from-blue-600/20 to-purple-600/20 
              border-blue-500/30 hover:border-blue-400/50 
              text-blue-100 hover:text-white
              shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20`
    }
    
    return `${baseClasses} bg-gradient-to-r from-blue-50 to-indigo-50 
            border-blue-200 hover:border-blue-300 
            text-blue-700 hover:text-blue-800
            shadow-sm hover:shadow-md`
  }

  const renderVariant = () => {
    switch (variant) {
      case 'interactive':
        return (
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="default"
              onClick={handleClick}
              disabled={isStarting}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`
                ${getThemeClasses()}
                relative overflow-hidden group
                px-6 py-3 h-auto
                ${className}
              `}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                initial={{ x: '-100%' }}
                animate={{ x: isHovered ? '0%' : '-100%' }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative flex items-center space-x-3">
                <div className="flex items-center">
                  {isStarting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Compass className="h-5 w-5" />
                    </motion.div>
                  ) : isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex flex-col items-start">
                  <span className="font-medium">
                    {isStarting ? 'Starting Tour...' : 
                     isComplete ? 'Tour Complete!' : 'Take Interactive Tour'}
                  </span>
                  {showProgress && !isStarting && (
                    <span className="text-xs opacity-70">
                      {completedSteps}/{totalSteps} steps completed
                    </span>
                  )}
                </div>
                
                <ArrowRight className={`h-4 w-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
              </div>
            </Button>
            
            {/* Progress indicator */}
            {showProgress && !isComplete && (
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>
        )

      case 'floating':
        return (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, duration: 0.5, type: "spring" }}
          >
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Button
                variant="default"
                size="lg"
                onClick={handleClick}
                disabled={isStarting}
                className={`
                  ${getThemeClasses()}
                  rounded-full w-14 h-14 p-0
                  shadow-2xl hover:shadow-3xl
                  ${className}
                `}
              >
                {isStarting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Play className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <HelpCircle className="h-6 w-6" />
                )}
              </Button>
            </motion.div>
            
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-16 top-1/2 -translate-y-1/2 
                           bg-black/90 text-white px-3 py-1 rounded-lg text-sm
                           whitespace-nowrap pointer-events-none"
                >
                  Take Tour
                  <div className="absolute left-full top-1/2 -translate-y-1/2 
                                w-0 h-0 border-l-4 border-l-black/90 
                                border-t-2 border-t-transparent 
                                border-b-2 border-b-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )

      case 'compact':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
            disabled={isStarting}
            className={`
              ${getThemeClasses()}
              h-8 px-3 text-xs
              ${className}
            `}
          >
            {isStarting ? (
              <Play className="h-3 w-3 mr-1 animate-pulse" />
            ) : (
              <HelpCircle className="h-3 w-3 mr-1" />
            )}
            Tour
          </Button>
        )

      default:
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={isStarting}
            className={`
              ${getThemeClasses()}
              ${className}
            `}
          >
            {isStarting ? (
              <Play className="h-4 w-4 mr-2 animate-pulse" />
            ) : (
              <HelpCircle className="h-4 w-4 mr-2" />
            )}
            {isStarting ? 'Starting Tour...' : 'Take Tour'}
            {showProgress && (
              <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                {completedSteps}/{totalSteps}
              </Badge>
            )}
          </Button>
        )
    }
  }

  return renderVariant()
}
