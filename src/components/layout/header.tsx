'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { TourButton } from '@/components/shared/tour-button';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Upload, Link2, FileText, CreditCard, PiggyBank, TrendingUp } from 'lucide-react';
import { ThemeToggle } from '../shared/theme-toggle';

export function Header() {
  const { user, logout } = useAuth();

  // Handle logout - bye bye! 👋
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      
      <div className="flex-1" />
      <TourButton 
        onStartTour={() => {
          // Dispatch custom event to start tour
          window.dispatchEvent(new CustomEvent('start-app-tour'))
        }}
        className="mr-2"
      />
      <div data-tour="theme-toggle">
        <ThemeToggle />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
              <AvatarFallback>
                {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs text-muted-foreground">Financial Profile Setup</DropdownMenuLabel>
          
          <DropdownMenuItem asChild>
            <Link href="/profile/documents">
              <Upload className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Upload Documents</span>
                <span className="text-xs text-muted-foreground">Bank statements, tax returns</span>
              </div>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/profile/accounts">
              <Link2 className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Link Accounts</span>
                <span className="text-xs text-muted-foreground">Banks, investments, loans</span>
              </div>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">Quick Links</DropdownMenuLabel>
          
          <DropdownMenuItem asChild>
            <Link href="/profile/bank-accounts">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Bank Accounts</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/profile/investments">
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>Mutual Funds & Investments</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/profile/pf-loans">
              <PiggyBank className="mr-2 h-4 w-4" />
              <span>PF & Loans</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
