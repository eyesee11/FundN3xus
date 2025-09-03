'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  Calculator, 
  FileText, 
  MessageSquare,
  ChevronUp,
  Search,
  Command
} from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
  { href: '/investments', label: 'Investments', icon: BarChart3, color: 'text-green-500' },
  { href: '/affordability', label: 'Affordability', icon: Calculator, color: 'text-purple-500' },
  { href: '/scenarios', label: 'Scenarios', icon: FileText, color: 'text-orange-500' },
  { href: '/ai-chat', label: 'AI Assistant', icon: MessageSquare, color: 'text-pink-500' },
  { href: '/settings', label: 'Settings', icon: Settings, color: 'text-gray-500' },
];

interface CommandDockProps {
  isExpanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
}

export function CommandDock({ isExpanded, onToggleExpanded }: CommandDockProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Main Dock */}
      <div 
        data-tour="command-dock"
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
          isExpanded ? "w-96" : "w-auto"
        )}
      >
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl">
          
          {/* Collapsed State - Horizontal Dock */}
          {!isExpanded && (
            <div className="flex items-center gap-2 p-3">
              {/* Logo/Brand */}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-xl"
                onClick={() => onToggleExpanded(true)}
              >
                <Logo className="w-5 h-5 text-primary" />
              </Button>

              {/* Quick Navigation Icons */}
              <div className="flex items-center gap-1">
                {menuItems.slice(0, 5).map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-10 w-10 rounded-xl transition-all duration-200",
                        pathname === item.href 
                          ? "bg-primary/10 text-primary shadow-sm" 
                          : "hover:bg-white/50 dark:hover:bg-slate-700/50"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4", item.color)} />
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Expand Button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-xl"
                onClick={() => onToggleExpanded(true)}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Expanded State - Command Palette */}
          {isExpanded && (
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Logo className="w-6 h-6 text-primary" />
                  <h2 className="font-semibold text-lg">FiSight</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => onToggleExpanded(false)}
                >
                  <ChevronUp className="w-4 h-4 rotate-180" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-0 bg-slate-100 dark:bg-slate-700"
                />
              </div>

              {/* Navigation Items */}
              <div className="grid grid-cols-2 gap-2">
                {filteredItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full h-16 flex-col gap-2 rounded-xl transition-all duration-200",
                        pathname === item.href
                          ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700"
                      )}
                      onClick={() => onToggleExpanded(false)}
                    >
                      <item.icon className={cn("w-5 h-5", item.color)} />
                      <span className="text-xs font-medium">{item.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl"
                  >
                    <Command className="w-4 h-4 mr-2" />
                    Quick Add
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
