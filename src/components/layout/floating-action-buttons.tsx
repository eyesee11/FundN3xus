'use client';

import { useState } from 'react';
import { Plus, PlusCircle, TrendingUp, Calculator, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const quickActions = [
  {
    icon: TrendingUp,
    label: 'Add Transaction',
    href: '/dashboard',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    icon: Calculator,
    label: 'Quick Budget',
    href: '/affordability',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    icon: MessageSquare,
    label: 'AI Insights',
    href: '/ai-chat',
    color: 'bg-pink-500 hover:bg-pink-600',
  },
  {
    icon: PlusCircle,
    label: 'Add Widget',
    href: '/dashboard',
    color: 'bg-green-500 hover:bg-green-600',
  },
];

export function FloatingActionButtons() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <div className="flex flex-col-reverse items-end gap-3">
        {/* Quick Action Buttons */}
        {isExpanded && (
          <>
            {quickActions.map((action, index) => (
              <div
                key={action.label}
                className={cn(
                  "transform transition-all duration-300 ease-out",
                  isExpanded 
                    ? "translate-y-0 opacity-100 scale-100" 
                    : "translate-y-4 opacity-0 scale-95"
                )}
                style={{ 
                  transitionDelay: `${index * 50}ms` 
                }}
              >
                <Link href={action.href}>
                  <Button
                    size="lg"
                    className={cn(
                      "h-12 w-12 rounded-full shadow-lg transition-all duration-200",
                      "hover:scale-110 hover:shadow-xl",
                      action.color
                    )}
                    onClick={() => setIsExpanded(false)}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                    <span className="sr-only">{action.label}</span>
                  </Button>
                </Link>
                
                {/* Tooltip */}
                <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-slate-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
                    {action.label}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Main FAB */}
        <Button
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-xl transition-all duration-300",
            "bg-primary hover:bg-primary/90 hover:scale-110",
            isExpanded && "rotate-45"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>

      {/* Backdrop for mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[-1] md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}
