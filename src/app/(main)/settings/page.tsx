'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/page-header';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Lock,
  Smartphone,
  Mail,
  CreditCard,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  const { user, clearNewUserFlag } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcomeFlow = searchParams.get('welcome') === 'true';
  const { toast } = useToast();

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    weeklyReports: true,
    aiInsights: true,
    securityAlerts: true
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analyticsTracking: true,
    profileVisibility: 'private'
  });

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currency: 'inr'
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  // Prefill data from Google authentication or Firebase user
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        fullName: user.displayName || '',
        email: user.email || '',
        // If user signed in with Google, we might have additional info
        phone: user.phoneNumber || ''
      }));
    }
  }, [user]);

  const handleSaveSettings = () => {
    if (isWelcomeFlow) {
      setSetupComplete(true);
      clearNewUserFlag();
      toast({
        title: "Welcome setup complete! 🎉",
        description: "Your account is all set up. Welcome to FundN3xus!",
      });
      
      // Redirect to dashboard after setup
      setTimeout(() => {
        router.push('/dashboard?tour=true');
      }, 1500);
    } else {
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "Data export started",
      description: "Your financial data export will be ready in a few minutes.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion",
      description: "This action requires additional verification. Check your email.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {isWelcomeFlow && (
        <Alert className="border-blue-200 bg-blue-50">
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <strong>Welcome to FundN3xus! 🎉</strong> Let's set up your profile to get you started. 
            {user?.providerData?.[0]?.providerId === 'google.com' && 
              " We've pre-filled some info from your Google account."}
          </AlertDescription>
        </Alert>
      )}

      {setupComplete && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Setup Complete!</strong> Redirecting you to the dashboard where you can start your financial journey...
          </AlertDescription>
        </Alert>
      )}

      <PageHeader 
        title={isWelcomeFlow ? "Welcome! Set Up Your Profile" : "Settings"} 
        description={isWelcomeFlow ? 
          "Let's get your account configured so you can make the most of FundN3xus" :
          "Manage your account preferences, privacy settings, and financial data"
        }
      />

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                placeholder="John Doe" 
                value={profileData.fullName}
                onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!!user?.email} // Disable if from auth provider
              />
              {user?.email && (
                <p className="text-xs text-muted-foreground">Email from your authentication provider</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="+91 98765 43210" 
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select 
                value={profileData.currency}
                onValueChange={(value) => setProfileData(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="usd">US Dollar ($)</SelectItem>
                  <SelectItem value="eur">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSaveSettings} disabled={setupComplete}>
            {isWelcomeFlow ? (setupComplete ? "Setup Complete! ✓" : "Complete Setup & Continue") : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Authentication
          </CardTitle>
          <CardDescription>
            Manage your account security and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Smartphone className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" placeholder="Enter current password" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>API Access Key</Label>
            <div className="flex items-center gap-2">
              <Input 
                value={showApiKey ? "fis_sk_abc123...xyz789" : "••••••••••••••••••••••••"} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">Regenerate</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this key to access FundN3xus APIs programmatically
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about your financial activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries({
            emailAlerts: { label: "Email Alerts", desc: "Get notified about important account activities via email" },
            pushNotifications: { label: "Push Notifications", desc: "Receive real-time notifications on your device" },
            weeklyReports: { label: "Weekly Financial Reports", desc: "Receive comprehensive weekly financial summaries" },
            aiInsights: { label: "AI Insights", desc: "Get personalized financial recommendations and insights" },
            securityAlerts: { label: "Security Alerts", desc: "Important security-related notifications" }
          }).map(([key, config]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{config.label}</p>
                <p className="text-sm text-muted-foreground">{config.desc}</p>
              </div>
              <Switch 
                checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Privacy & Data
          </CardTitle>
          <CardDescription>
            Control how your data is used and shared
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Anonymous Data Sharing</p>
              <p className="text-sm text-muted-foreground">Help improve our services by sharing anonymized usage data</p>
            </div>
            <Switch 
              checked={privacy.dataSharing}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, dataSharing: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Analytics Tracking</p>
              <p className="text-sm text-muted-foreground">Allow us to track how you use the app to improve user experience</p>
            </div>
            <Switch 
              checked={privacy.analyticsTracking}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, analyticsTracking: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export, backup, or delete your financial data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Export Financial Data</p>
              <p className="text-sm text-muted-foreground">Download all your financial data in CSV format</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Connected Services
          </CardTitle>
          <CardDescription>
            Manage your linked financial accounts and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "HDFC Bank", type: "Primary Bank", status: "Connected", lastSync: "2 mins ago" },
            { name: "Zerodha", type: "Investment Platform", status: "Connected", lastSync: "1 hour ago" },
            { name: "ICICI Credit Card", type: "Credit Card", status: "Connected", lastSync: "5 mins ago" },
            { name: "EPFO", type: "Provident Fund", status: "Pending", lastSync: "Never" }
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-muted-foreground">{service.type} • Last sync: {service.lastSync}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={service.status === 'Connected' ? 'default' : 'secondary'}>
                  {service.status}
                </Badge>
                <Button variant="outline" size="sm">
                  {service.status === 'Connected' ? 'Manage' : 'Connect'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
