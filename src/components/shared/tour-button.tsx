'use client'

// Tour button to start the app walkthrough 🎯
import { Button } from '@/components/ui/button'
import { HelpCircle, Play } from 'lucide-react'
import { useState } from 'react'

interface TourButtonProps {
  onStartTour: () => void
  className?: string
}

export function TourButton({ onStartTour, className }: TourButtonProps) {
  const [isStarting, setIsStarting] = useState(false)

  const handleClick = () => {
    setIsStarting(true)
    onStartTour()
    // Reset after a short delay
    setTimeout(() => setIsStarting(false), 1000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isStarting}
      className={className}
    >
      {isStarting ? (
        <Play className="h-4 w-4 mr-2 animate-pulse" />
      ) : (
        <HelpCircle className="h-4 w-4 mr-2" />
      )}
      {isStarting ? 'Starting Tour...' : 'Take Tour'}
    </Button>
  )
}
