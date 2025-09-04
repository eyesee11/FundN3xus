'use client'

// Welcome banner for new users - make them feel at home! 🏠
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Sparkles, ArrowRight, Settings } from 'lucide-react'

export function WelcomeBanner() {
  const { user, isNewUser, clearNewUserFlag } = useAuth()
  const router = useRouter()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Show banner for new users who haven't been to settings yet
    if (isNewUser && user) {
      setShowBanner(true)
    }
  }, [isNewUser, user])

  const handleGoToSettings = () => {
    router.push('/settings?welcome=true')
    setShowBanner(false)
  }

  const handleSkipSetup = () => {
    clearNewUserFlag()
    setShowBanner(false)
  }

  if (!showBanner || !user) return null

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">
                Welcome to FundN3xus, {user.displayName || 'there'}! 🎉
              </h3>
            </div>
            <p className="text-blue-700 mb-4">
              Let's set up your profile to get personalized financial insights and recommendations.
              {user.providerData?.[0]?.providerId === 'google.com' && 
                " We've already grabbed some info from your Google account to get you started!"}
            </p>
            <div className="flex gap-3">
              <Button onClick={handleGoToSettings} className="bg-blue-600 hover:bg-blue-700">
                <Settings className="h-4 w-4 mr-2" />
                Complete Setup
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={handleSkipSetup}>
                Skip for Now
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipSetup}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
